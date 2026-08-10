const AwardNomination = require('../models/AwardNomination');
const { sendNominationConfirmationEmail } = require('../services/emailService');
const crypto = require('crypto');

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
      gstNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
      briefSummary,
      applicationFilledBy,
      fillerName,
      fillerDesignation,
      fillerContactNo,
      fillerEmail,
    } = req.body;

    // Normalize canonical inputs
    const cleanEmail = email ? email.trim().toLowerCase() : '';
    const cleanMobile = mobileNumber ? mobileNumber.replace(/\D/g, '') : '';

    if (!cleanEmail || !cleanMobile) {
      return res.status(400).json({ success: false, message: 'Email address and mobile number are required.' });
    }

    // Check for profile document
    if (!req.files || !req.files['profileDocument'] || req.files['profileDocument'].length === 0) {
      return res.status(400).json({ success: false, message: 'Profile document is required (PDF, PPT, or DOC)' });
    }
    const profileDocumentUrl = req.files['profileDocument'][0].path;

    // Check for supporting document
    if (!req.files || !req.files['supportingDocument'] || req.files['supportingDocument'].length === 0) {
      return res.status(400).json({ success: false, message: 'Supporting document is required (PDF, PPT, or DOC)' });
    }
    const supportingDocumentUrl = req.files['supportingDocument'][0].path;

    // Check for summary document if text summary isn't provided
    let summaryDocumentUrl = null;
    if (!briefSummary || briefSummary.trim() === '') {
      if (!req.files || !req.files['summaryDocument'] || req.files['summaryDocument'].length === 0) {
        return res.status(400).json({ success: false, message: 'Either a brief summary or a summary document is required' });
      }
      summaryDocumentUrl = req.files['summaryDocument'][0].path;
    }

    // ── Check if nomination already exists ──
    const existingNomination = await AwardNomination.findOne({
      $or: [{ email: cleanEmail }, { mobileNumber: cleanMobile }]
    });

    if (existingNomination) {
      // Update existing record with updated information
      existingNomination.applicantType = applicantType || existingNomination.applicantType;
      existingNomination.awardCategory = awardCategory || existingNomination.awardCategory;
      existingNomination.fullName = fullName || existingNomination.fullName;
      existingNomination.designation = designation || existingNomination.designation;
      existingNomination.organization = organization || existingNomination.organization;
      existingNomination.gstNumber = gstNumber || existingNomination.gstNumber;
      existingNomination.website = website || existingNomination.website;
      existingNomination.city = city || existingNomination.city;
      existingNomination.state = state || existingNomination.state;
      existingNomination.country = country || existingNomination.country;
      existingNomination.pinCode = pinCode || existingNomination.pinCode;
      existingNomination.address = address || existingNomination.address;
      existingNomination.briefSummary = briefSummary || existingNomination.briefSummary;
      existingNomination.applicationFilledBy = applicationFilledBy || existingNomination.applicationFilledBy;
      existingNomination.fillerName = fillerName || existingNomination.fillerName;
      existingNomination.fillerDesignation = fillerDesignation || existingNomination.fillerDesignation;
      existingNomination.fillerContactNo = fillerContactNo || existingNomination.fillerContactNo;
      existingNomination.fillerEmail = fillerEmail || existingNomination.fillerEmail;
      existingNomination.profileDocumentUrl = profileDocumentUrl;
      existingNomination.supportingDocumentUrl = supportingDocumentUrl;
      if (summaryDocumentUrl) existingNomination.summaryDocumentUrl = summaryDocumentUrl;

      // Generate SHA-256 hashed payment token for secure email resumption if pending
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

      if (existingNomination.paymentStatus !== 'Paid') {
        existingNomination.resumeTokenHash = tokenHash;
        existingNomination.paymentTokenExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      }

      await existingNomination.save();

      // Send email with rawToken
      sendNominationConfirmationEmail(existingNomination, rawToken).catch(err => console.error('Error sending confirmation email:', err));

      return res.status(200).json({
        success: true,
        isExisting: true,
        alreadyPaid: existingNomination.paymentStatus === 'Paid',
        message: existingNomination.paymentStatus === 'Paid'
          ? 'Your nomination is already submitted and payment is confirmed!'
          : 'Existing nomination found! Please complete your pending entry payment.',
        data: existingNomination
      });
    }

    // ── New Nomination ──
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const newNomination = new AwardNomination({
      applicantType,
      awardCategory,
      fullName,
      designation,
      organization,
      email: cleanEmail,
      mobileNumber: cleanMobile,
      gstNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
      briefSummary,
      applicationFilledBy,
      fillerName,
      fillerDesignation,
      fillerContactNo,
      fillerEmail,
      summaryDocumentUrl,
      profileDocumentUrl,
      supportingDocumentUrl,
      paymentStatus: 'Pending',
      totalAmount: 9440,
      amountPaid: 0,
      amountDue: 9440,
      resumeTokenHash: tokenHash,
      paymentTokenExpires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    const savedNomination = await newNomination.save();

    // Send initial nomination email via Resend
    if (!savedNomination.initialEmailSent) {
      sendNominationConfirmationEmail(savedNomination, rawToken).catch(err => console.error('Error sending initial nomination email:', err));
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
    nomination.totalAmount = targetAmount;
    if (nomination.paymentStatus !== 'Paid') {
      nomination.amountPaid = 0;
      nomination.amountDue = targetAmount;
    }
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

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const receivedBuffer = Buffer.from(razorpay_signature, 'utf-8');

    if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      console.error('Signature mismatch — possible tampered request');
      return res.status(400).json({ success: false, message: 'Payment verification failed: invalid signature' });
    }

    const nomination = await AwardNomination.findById(nominationId);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    const paidAmt = nomination.totalAmount || 9440;
    nomination.paymentStatus = 'Paid';
    nomination.paymentMethod = 'Online (Razorpay)';
    nomination.razorpayPaymentId = razorpay_payment_id;
    nomination.amountPaid = paidAmt;
    nomination.amountDue = 0;
    // Invalidate/Nullify payment resume token
    nomination.resumeTokenHash = null;
    nomination.paymentTokenExpires = null;
    await nomination.save();

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

// ─── Secure Resume Nomination Payment Token Handler ─────────────────────────
// @desc    Resume payment for an existing nomination using secure unguessable token
// @route   GET /api/nominations/resume-payment/:token
// @access  Public
exports.resumePayment = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Payment token is required' });
    }

    // Compute SHA-256 hash of incoming raw token
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const nomination = await AwardNomination.findOne({ resumeTokenHash: hashedToken });

    if (!nomination) {
      return res.status(404).json({
        success: false,
        message: 'Invalid, already used, or expired payment link.'
      });
    }

    if (nomination.paymentStatus === 'Paid') {
      return res.status(200).json({
        success: true,
        alreadyPaid: true,
        data: {
          _id: nomination._id,
          nominationId: nomination._id.toString().slice(-8).toUpperCase(),
          fullName: nomination.fullName,
          email: nomination.email,
          awardCategory: nomination.awardCategory,
          paymentStatus: 'Paid',
          totalAmount: nomination.totalAmount || 9440,
          amountPaid: nomination.amountPaid || 9440,
          amountDue: 0,
        }
      });
    }

    if (nomination.paymentTokenExpires && nomination.paymentTokenExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'This payment link has expired. Please contact support or request a new link.'
      });
    }

    const maskName = (str) => {
      if (!str) return '';
      const parts = str.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    };

    const maskEmail = (str) => {
      if (!str || !str.includes('@')) return '***@***.com';
      const [local, domain] = str.split('@');
      return `${local.slice(0, 2)}***@${domain}`;
    };

    const maskMobile = (str) => {
      if (!str) return '******0000';
      const digits = str.replace(/\D/g, '');
      return `******${digits.slice(-4)}`;
    };

    res.status(200).json({
      success: true,
      data: {
        _id: nomination._id,
        nominationId: nomination._id.toString().slice(-8).toUpperCase(),
        fullName: maskName(nomination.fullName),
        rawFullName: nomination.fullName,
        email: maskEmail(nomination.email),
        mobileNumber: maskMobile(nomination.mobileNumber),
        awardCategory: nomination.awardCategory,
        organization: nomination.organization,
        paymentStatus: nomination.paymentStatus,
        totalAmount: nomination.totalAmount || 9440,
        amountPaid: nomination.amountPaid || 0,
        amountDue: nomination.paymentStatus === 'Paid' ? 0 : (nomination.amountDue || nomination.totalAmount || 9440),
      }
    });
  } catch (error) {
    console.error('Error in resumePayment for nomination:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving payment session.' });
  }
};

// ─── Update Nomination (Admin) ────────────────────────────────────────────────
exports.updateNomination = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const nomination = await AwardNomination.findByIdAndUpdate(id, updateData, { new: true });
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Nomination updated successfully',
      data: nomination,
    });
  } catch (error) {
    console.error('Error updating nomination:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ─── Delete Nomination (Admin) ────────────────────────────────────────────────
exports.deleteNomination = async (req, res) => {
  try {
    const { id } = req.params;
    const nomination = await AwardNomination.findByIdAndDelete(id);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Nomination deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting nomination:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get or generate shareable payment link for a nomination (Admin)
// @route   GET /api/nominations/:id/payment-link
// @access  Private (Admin)
exports.getNominationPaymentLink = async (req, res) => {
  try {
    const nomination = await AwardNomination.findById(req.params.id);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    nomination.resumeTokenHash = tokenHash;
    nomination.paymentTokenExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await nomination.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
    const paymentUrl = `${frontendUrl}/pay?token=${rawToken}`;

    res.status(200).json({
      success: true,
      paymentUrl,
      rawToken
    });
  } catch (error) {
    console.error('Error in getNominationPaymentLink:', error);
    res.status(500).json({ success: false, message: 'Server error generating payment link.' });
  }
};
