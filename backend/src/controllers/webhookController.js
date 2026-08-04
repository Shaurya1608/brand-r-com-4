const crypto = require('crypto');
const DelegateRegistration = require('../models/DelegateRegistration');
const AwardNomination = require('../models/AwardNomination');
const { sendDelegateConfirmationEmail } = require('../services/emailService');

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
  console.log(`Razorpay webhook received: ${eventType}`);

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
        return;
      }

      console.warn(`payment.captured: no matching record found for orderId ${orderId}`);
    }

    if (eventType === 'payment.failed') {
      const payment = event.payload.payment.entity;
      const orderId = payment.order_id;

      const failedDelegate = await DelegateRegistration.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { paymentStatus: 'Failed' },
        { new: true }
      );

      if (failedDelegate && !failedDelegate.failedEmailSent) {
        sendDelegateConfirmationEmail(failedDelegate).catch(err => console.error('Webhook failed email error:', err));
        failedDelegate.failedEmailSent = true;
        await failedDelegate.save();
      }

      await AwardNomination.findOneAndUpdate(
        { razorpayOrderId: orderId },
        { paymentStatus: 'Failed' }
      );

      console.log(`❌ Payment failed for orderId: ${orderId}`);
    }
  } catch (err) {
    // Log but don't crash — we already sent 200
    console.error('Error processing webhook event:', err.message);
  }
};
