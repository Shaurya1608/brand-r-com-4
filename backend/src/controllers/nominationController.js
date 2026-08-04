const AwardNomination = require('../models/AwardNomination');
const { sendNominationConfirmationEmail } = require('../services/emailService');

// Create a new nomination
exports.createNomination = async (req, res) => {
  try {
    const {
      applicantType,
      awardCategory,
      fullName,
      designation,
      organization,
      email,
      mobileNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
      briefSummary,
    } = req.body;

    console.log("Req.files is:", req.files);
    
    // Check for profile document
    if (!req.files || !req.files['profileDocument'] || req.files['profileDocument'].length === 0) {
      return res.status(400).json({ success: false, message: 'Profile document is required (PDF, PPT, or DOC)' });
    }
    const profileDocumentUrl = req.files['profileDocument'][0].path;

    // Check for summary document if text summary isn't provided
    let summaryDocumentUrl = null;
    if (!briefSummary || briefSummary.trim() === '') {
      if (!req.files || !req.files['summaryDocument'] || req.files['summaryDocument'].length === 0) {
        return res.status(400).json({ success: false, message: 'Either a brief summary or a summary document is required' });
      }
      summaryDocumentUrl = req.files['summaryDocument'][0].path;
    }

    const newNomination = new AwardNomination({
      applicantType,
      awardCategory,
      fullName,
      designation,
      organization,
      email,
      mobileNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
      briefSummary,
      summaryDocumentUrl,
      profileDocumentUrl,
    });

    const savedNomination = await newNomination.save();

    // Send initial nomination email via Resend
    if (!savedNomination.initialEmailSent) {
      sendNominationConfirmationEmail(savedNomination).catch(err => console.error('Error sending initial nomination email:', err));
      savedNomination.initialEmailSent = true;
      await savedNomination.save();
    }

    res.status(201).json({
      success: true,
      message: 'Nomination submitted successfully!',
      data: savedNomination,
    });
  } catch (error) {
    console.error('Error creating nomination:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
  }
};

// Get all nominations (Admin only)
exports.getNominations = async (req, res) => {
  try {
    const nominations = await AwardNomination.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: nominations,
    });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    res.status(500).json({ success: false, message: 'Server Error.' });
  }
};

// ─── Razorpay: Create Order for Nomination ────────────────────────────────────
// @desc    Create a Razorpay order for an award nomination
// @route   POST /api/nominations/create-order
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { nominationId, amountRs } = req.body;

    const targetAmount = amountRs || 9440; // Default ₹8,000 + 18% GST = ₹9,440

    if (!nominationId) {
      return res.status(400).json({ success: false, message: 'nominationId is required' });
    }

    const nomination = await AwardNomination.findById(nominationId);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Award nomination not found' });
    }

    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const amountPaise = Math.round(targetAmount * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `nomination_${nominationId.toString().slice(-8)}`,
      notes: {
        nominationId: nominationId.toString(),
        fullName: nomination.fullName,
        organization: nomination.organization,
        awardCategory: nomination.awardCategory
      },
    });

    nomination.razorpayOrderId = order.id;
    nomination.amountPaid = targetAmount;
    await nomination.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,       // in paise
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error in createOrder for nomination:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// ─── Razorpay: Verify Nomination Payment ──────────────────────────────────────
// @desc    Verify Razorpay signature and mark nomination payment as Paid
// @route   POST /api/nominations/verify-payment
// @access  Public
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, nominationId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !nominationId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    const crypto = require('crypto');
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('Signature mismatch — possible tampered request');
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
    }

    const nomination = await AwardNomination.findByIdAndUpdate(
      nominationId,
      {
        paymentStatus: 'Paid',
        paymentMethod: 'Online (Razorpay)',
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    if (!nomination.paidEmailSent) {
      sendNominationConfirmationEmail(nomination).catch(err => console.error('Error sending nomination paid email:', err));
      nomination.paidEmailSent = true;
      await nomination.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: nomination,
    });
  } catch (error) {
    console.error('Error in verifyPayment for nomination:', error);
    res.status(500).json({ success: false, message: 'Payment verification server error' });
  }
};
