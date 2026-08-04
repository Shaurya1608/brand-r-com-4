const crypto = require('crypto');
const DelegateRegistration = require('../models/DelegateRegistration');
const AwardNomination = require('../models/AwardNomination');
const { sendDelegateConfirmationEmail, sendNominationConfirmationEmail } = require('../services/emailService');

// Idempotency cache for processed webhook event IDs
const processedEventIds = new Set();

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

  if (expectedSignature !== razorpaySignature) {
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

  // Idempotency Check — Ignore duplicate webhooks if event ID was already processed
  if (eventId && processedEventIds.has(eventId)) {
    console.log(`ℹ️ Duplicate webhook event ${eventId} received. Already processed — returning 200 OK.`);
    return res.status(200).json({ success: true, message: 'Event already processed' });
  }

  if (eventId) {
    processedEventIds.add(eventId);
    // Keep in-memory cache bounded to 5,000 recent events
    if (processedEventIds.size > 5000) {
      const oldestId = processedEventIds.values().next().value;
      processedEventIds.delete(oldestId);
    }
  }

  // ── 3. Respond 200 immediately — Razorpay retries on slow/non-2xx ──
  res.status(200).json({ success: true, received: true });

  // ── 4. Handle events asynchronously after responding ──
  try {
    if (eventType === 'payment.captured') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;
      const paymentId = payment.id;

      // Try updating a delegate registration first
      const delegate = await DelegateRegistration.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          paymentStatus: 'Paid',
          paymentMethod: 'Online (Razorpay)',
          razorpayPaymentId: paymentId,
        },
        { new: true }
      );

      if (delegate) {
        console.log(`✅ Delegate payment captured: ${delegate.fullName} (${paymentId})`);
        if (!delegate.paidEmailSent) {
          sendDelegateConfirmationEmail(delegate).catch(err => console.error('Webhook paid email error:', err));
          delegate.paidEmailSent = true;
          await delegate.save();
        }
        return;
      }

      // If not a delegate, try nomination
      const nomination = await AwardNomination.findOneAndUpdate(
        { razorpayOrderId: orderId },
        {
          paymentStatus: 'Paid',
          paymentMethod: 'Online (Razorpay)',
          razorpayPaymentId: paymentId,
        },
        { new: true }
      );

      if (nomination) {
        console.log(`✅ Nomination payment captured: ${nomination.fullName} (${paymentId})`);
        if (!nomination.paidEmailSent) {
          sendNominationConfirmationEmail(nomination).catch(err => console.error('Webhook nomination paid email error:', err));
          nomination.paidEmailSent = true;
          await nomination.save();
        }
        return;
      }

      console.warn(`payment.captured: no matching record found for orderId ${orderId}`);
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      // State Regression Protection: Only mark Failed if status is NOT already Paid
      const failedDelegate = await DelegateRegistration.findOneAndUpdate(
        { razorpayOrderId: orderId, paymentStatus: { $ne: 'Paid' } },
        { paymentStatus: 'Failed' },
        { new: true }
      );

      if (failedDelegate && !failedDelegate.failedEmailSent) {
        sendDelegateConfirmationEmail(failedDelegate).catch(err => console.error('Webhook failed email error:', err));
        failedDelegate.failedEmailSent = true;
        await failedDelegate.save();
      }

      const failedNomination = await AwardNomination.findOneAndUpdate(
        { razorpayOrderId: orderId, paymentStatus: { $ne: 'Paid' } },
        { paymentStatus: 'Failed' },
        { new: true }
      );

      if (failedNomination && !failedNomination.failedEmailSent) {
        sendNominationConfirmationEmail(failedNomination).catch(err => console.error('Webhook failed nomination email error:', err));
        failedNomination.failedEmailSent = true;
        await failedNomination.save();
      }

      console.log(`❌ Payment failed for orderId: ${orderId}`);
    }
  } catch (err) {
    // Log but don't crash — we already sent 200
    console.error('Error processing webhook event:', err.message);
  }
};
