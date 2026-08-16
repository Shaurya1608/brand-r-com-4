const crypto = require('crypto');
const DelegateRegistration = require('../models/DelegateRegistration');
const AwardNomination = require('../models/AwardNomination');
const ProcessedWebhookEvent = require('../models/ProcessedWebhookEvent');
const { sendDelegateConfirmationEmail, sendNominationConfirmationEmail } = require('../services/emailService');

// @desc    Handle Razorpay webhook events
// @route   POST /api/webhooks/razorpay
// @access  Public (verified via HMAC signature)
exports.handleRazorpayWebhook = async (req, res) => {
  // ── 1. Verify signature FIRST — reject anything that doesn't match ──
  const razorpaySignature = req.headers['x-razorpay-signature'];

  if (!razorpaySignature) {
    return res.status(400).json({ success: false, message: 'Missing signature header' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('RAZORPAY_WEBHOOK_SECRET is not set');
    return res.status(500).json({ success: false, message: 'Webhook secret not configured' });
  }

  // req.body here is the raw Buffer (set in app.js for this route)
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(req.body)
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
  const receivedBuffer = Buffer.from(razorpaySignature, 'utf-8');

  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    console.warn('Razorpay webhook: invalid signature — possible spoofed request');
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  // ── 2. Parse the raw body now that signature is verified ──
  let event;
  try {
    event = JSON.parse(req.body.toString());
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }

  const eventType = event.event;
  const eventId = event.id;
  console.log(`Razorpay webhook received: ${eventType} (Event ID: ${eventId})`);

  // Idempotency Check via MongoDB — Ignore duplicate webhooks across server restarts or multi-instance pods
  if (eventId) {
    const existingEvent = await ProcessedWebhookEvent.findOne({ eventId });
    if (existingEvent) {
      console.log(`ℹ️ Duplicate webhook event ${eventId} received. Already processed — returning 200 OK.`);
      return res.status(200).json({ success: true, message: 'Event already processed' });
    }
    // Save to DB (TTL index will automatically purge it after 7 days)
    await ProcessedWebhookEvent.create({ eventId, eventType }).catch(err => console.error('Error saving webhook event ID:', err.message));
  }

  // ── 3. Respond 200 immediately — Razorpay retries on slow/non-2xx ──
  res.status(200).json({ success: true, received: true });

  // ── 4. Handle events asynchronously after responding ──
  try {
    if (eventType === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      const webhookAmount = payment.amount;

      // Find registration first to verify amount
      const delegateCheck = await DelegateRegistration.findOne({ razorpayOrderId: orderId });
      let targetRegistrationId = null;
      let isDelegate = false;

      if (delegateCheck) {
        const expectedPaise = Math.round((delegateCheck.totalAmount || 5664) * 100);
        if (webhookAmount !== expectedPaise) {
          console.error(`Webhook amount mismatch for Delegate ${orderId}. Expected: ${expectedPaise}, Received: ${webhookAmount}`);
          return res.status(400).json({ success: false, message: 'Amount mismatch' });
        }
        targetRegistrationId = delegateCheck._id;
        isDelegate = true;
      } else {
        const nominationCheck = await AwardNomination.findOne({ razorpayOrderId: orderId });
        if (nominationCheck) {
          const expectedPaise = Math.round((nominationCheck.totalAmount || 9440) * 100);
          if (webhookAmount !== expectedPaise) {
            console.error(`Webhook amount mismatch for Nomination ${orderId}. Expected: ${expectedPaise}, Received: ${webhookAmount}`);
            return res.status(400).json({ success: false, message: 'Amount mismatch' });
          }
          targetRegistrationId = nominationCheck._id;
        }
      }

      if (!targetRegistrationId) {
        console.warn(`payment.captured: no matching record found for orderId ${orderId}`);
        return;
      }

      if (isDelegate) {
        // Try updating a delegate registration first
        const delegate = await DelegateRegistration.findOneAndUpdate(
          { _id: targetRegistrationId, paymentStatus: { $ne: 'Paid' } },
          {
            $set: {
              paymentStatus: 'Paid',
              paymentMethod: 'Online (Razorpay)',
              razorpayPaymentId: paymentId,
              resumeTokenHash: null,
              paymentTokenExpires: null,
            }
          },
          { returnDocument: 'after' }
        );

        if (delegate) {
          console.log(`✅ Delegate payment captured (order: ${orderId})`);
          
          // Atomic email lock
          const emailLockedRecord = await DelegateRegistration.findOneAndUpdate(
            { _id: targetRegistrationId, paidEmailSent: { $ne: true } },
            { $set: { paidEmailSent: true } },
            { returnDocument: 'after' }
          );

          if (emailLockedRecord) {
            try {
              await sendDelegateConfirmationEmail(emailLockedRecord);
            } catch (err) {
              console.error('Webhook delegate paid email error:', err);
              await DelegateRegistration.updateOne({ _id: targetRegistrationId }, { $set: { paidEmailSent: false } });
            }
          }
        }
        return;
      } else {
        // If not a delegate, try nomination
        const nomination = await AwardNomination.findOneAndUpdate(
          { _id: targetRegistrationId, paymentStatus: { $ne: 'Paid' } },
          {
            $set: {
              paymentStatus: 'Paid',
              paymentMethod: 'Online (Razorpay)',
              razorpayPaymentId: paymentId,
              resumeTokenHash: null,
              paymentTokenExpires: null,
            }
          },
          { returnDocument: 'after' }
        );

        if (nomination) {
          console.log(`✅ Nomination payment captured (order: ${orderId})`);
          
          // Atomic email lock
          const emailLockedRecord = await AwardNomination.findOneAndUpdate(
            { _id: targetRegistrationId, paidEmailSent: { $ne: true } },
            { $set: { paidEmailSent: true } },
            { returnDocument: 'after' }
          );

          if (emailLockedRecord) {
            try {
              await sendNominationConfirmationEmail(emailLockedRecord);
            } catch (err) {
              console.error('Webhook nomination paid email error:', err);
              await AwardNomination.updateOne({ _id: targetRegistrationId }, { $set: { paidEmailSent: false } });
            }
          }
        }
        return;
      }
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // State Regression Protection: Only mark Failed if status is NOT already Paid
      const failedDelegate = await DelegateRegistration.findOneAndUpdate(
        { razorpayOrderId: orderId, paymentStatus: { $ne: 'Paid' } },
        { $set: { paymentStatus: 'Failed' } },
        { returnDocument: 'after' }
      );

      if (failedDelegate) {
        const emailLockedRecord = await DelegateRegistration.findOneAndUpdate(
          { _id: failedDelegate._id, failedEmailSent: { $ne: true } },
          { $set: { failedEmailSent: true } },
          { returnDocument: 'after' }
        );

        if (emailLockedRecord) {
          try {
            await sendDelegateConfirmationEmail(emailLockedRecord);
          } catch (err) {
            console.error('Webhook delegate failed email error:', err);
            await DelegateRegistration.updateOne({ _id: failedDelegate._id }, { $set: { failedEmailSent: false } });
          }
        }
      }

      const failedNomination = await AwardNomination.findOneAndUpdate(
        { razorpayOrderId: orderId, paymentStatus: { $ne: 'Paid' } },
        { $set: { paymentStatus: 'Failed' } },
        { returnDocument: 'after' }
      );

      if (failedNomination) {
        const emailLockedRecord = await AwardNomination.findOneAndUpdate(
          { _id: failedNomination._id, failedEmailSent: { $ne: true } },
          { $set: { failedEmailSent: true } },
          { returnDocument: 'after' }
        );

        if (emailLockedRecord) {
          try {
            await sendNominationConfirmationEmail(emailLockedRecord);
          } catch (err) {
            console.error('Webhook nomination failed email error:', err);
            await AwardNomination.updateOne({ _id: failedNomination._id }, { $set: { failedEmailSent: false } });
          }
        }
      }

      console.log(`❌ Payment failed for orderId: ${orderId}`);
    }
  } catch (err) {
    // Log but don't crash — we already sent 200
    console.error('Error processing webhook event:', err.message);
  }
};
