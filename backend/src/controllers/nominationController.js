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

    // Securely check if request is from an admin
    let isAdmin = false;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      const jwt = require('jsonwebtoken');
      try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded.role === 'admin') isAdmin = true;
      } catch (err) {}
    }

    const { paymentStatus, paymentMethod, registrationType } = req.body;
    
    const finalPaymentStatus = isAdmin && paymentStatus ? paymentStatus : 'Pending';
    const finalPaymentMethod = isAdmin && paymentMethod ? paymentMethod : 'Online (Razorpay)';
    const isPaid = finalPaymentStatus === 'Paid';
    const finalIsManuallyCreated = isAdmin && registrationType === 'Manual Registration' ? true : false;

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
      paymentStatus: finalPaymentStatus,
      paymentMethod: finalPaymentMethod,
      isManuallyCreated: finalIsManuallyCreated,
      totalAmount: 14160,
      amountPaid: isPaid ? 14160 : 0,
      amountDue: isPaid ? 0 : 14160,
      resumeTokenHash: isPaid ? null : tokenHash,
      paymentTokenExpires: isPaid ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
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
    const nominationIds = nominations.map(n => n._id);

    const DelegateRegistration = require('../models/DelegateRegistration');
    
    // Count delegates linked to each nomination
    const delegateCounts = await DelegateRegistration.aggregate([
      { $match: { awardNominationId: { $in: nominationIds } } },
      { $group: { _id: "$awardNominationId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    delegateCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const dataWithCounts = nominations.map(n => {
      const doc = n.toObject();
      doc.delegatesCount = countMap[n._id.toString()] || 0;
      return doc;
    });

    res.status(200).json({
      success: true,
      data: dataWithCounts,
    });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    res.status(500).json({ success: false, message: 'Server Error.' });
  }
};

// @desc    Get delegates linked to a nomination
// @route   GET /api/nominations/:id/delegates
// @access  Private (Admin)
exports.getNominationDelegates = async (req, res) => {
  try {
    const nomination = await AwardNomination.findById(req.params.id);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Nomination not found' });
    }

    const DelegateRegistration = require('../models/DelegateRegistration');
    const delegates = await DelegateRegistration.find({
      $or: [
        { awardNominationId: nomination._id },
        { awardNominationName: { $regex: new RegExp('^' + nomination.fullName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: delegates.length,
      data: delegates
    });
  } catch (error) {
    console.error('Error fetching nomination delegates:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// ─── Razorpay: Create Order for Nomination ────────────────────────────────────
// @desc    Create a Razorpay order for an award nomination
// @route   POST /api/nominations/create-order
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { nominationId, amountRs } = req.body;

    const targetAmount = amountRs || 14160; // Default ₹12,000 + 18% GST = ₹14,160

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

    // Signature valid — now verify the exact payment amount securely from Razorpay's API
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);
    
    const nominationCheck = await AwardNomination.findOne({ _id: nominationId, razorpayOrderId: razorpay_order_id });
    if (!nominationCheck) {
      return res.status(404).json({ success: false, message: 'Nomination or matching order not found' });
    }

    const expectedAmountPaise = Math.round((nominationCheck.totalAmount || 9440) * 100);
    if (paymentDetails.amount !== expectedAmountPaise) {
      console.error(`Amount mismatch! Expected: ${expectedAmountPaise}, Received: ${paymentDetails.amount}`);
      return res.status(400).json({ success: false, message: 'Payment amount mismatch. Order flagged.' });
    }

    // CRITICAL SECURITY: Match both _id AND razorpayOrderId to prevent cross-registration payment spoofing!
    let nomination = await AwardNomination.findOneAndUpdate(
      { _id: nominationId, razorpayOrderId: razorpay_order_id, paymentStatus: { $ne: 'Paid' } },
      [
        {
          $set: {
            paymentStatus: 'Paid',
            paymentMethod: 'Online (Razorpay)',
            razorpayPaymentId: razorpay_payment_id,
            amountPaid: { $ifNull: ['$totalAmount', 9440] },
            amountDue: 0,
            resumeTokenHash: null,
            paymentTokenExpires: null,
          }
        }
      ],
      { returnDocument: 'after' }
    );

    if (!nomination) {
      nomination = await AwardNomination.findOne({ _id: nominationId, razorpayOrderId: razorpay_order_id });
      if (!nomination) {
        return res.status(404).json({ success: false, message: 'Nomination or matching order not found' });
      }
    }

    // Atomic email lock
    const emailLockedRecord = await AwardNomination.findOneAndUpdate(
      { _id: nominationId, paidEmailSent: { $ne: true } },
      { $set: { paidEmailSent: true } },
      { returnDocument: 'after' }
    );

    if (emailLockedRecord) {
      try {
        await sendNominationConfirmationEmail(emailLockedRecord);
      } catch (err) {
        console.error('Error sending nomination paid email:', err);
        // Release lock on failure
        await AwardNomination.updateOne({ _id: nominationId }, { $set: { paidEmailSent: false } });
      }
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
        totalAmount: nomination.totalAmount || 14160,
        amountPaid: nomination.paymentStatus === 'Paid' ? (nomination.amountPaid || nomination.totalAmount || 14160) : 0,
        amountDue: nomination.paymentStatus === 'Paid' ? 0 : (nomination.amountDue || nomination.totalAmount || 14160),
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

    const nomination = await AwardNomination.findByIdAndUpdate(id, updateData, { returnDocument: 'after' });
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
