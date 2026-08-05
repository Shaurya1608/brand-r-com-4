const DelegateRegistration = require('../models/DelegateRegistration');
const { sendDelegateConfirmationEmail } = require('../services/emailService');

// @desc    Register a new delegate
// @route   POST /api/delegates
// @access  Public
exports.registerDelegate = async (req, res) => {
  try {
    const {
      delegateType,
      fullName,
      email,
      designation,
      mobileNumber,
      organization,
      city,
      stateCountry,
      pinCode,
      gstNumber,
      address,
      couponCode,
      isManuallyCreated,
    } = req.body;

    const newDelegate = await DelegateRegistration.create({
      delegateType,
      fullName,
      email,
      designation,
      mobileNumber,
      organization,
      city,
      stateCountry,
      pinCode,
      gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : '',
      address,
      couponCode: couponCode || null,
      isManuallyCreated: isManuallyCreated || false,
    });

    // Send initial registration email via Resend immediately upon form submission
    if (!newDelegate.initialEmailSent) {
      sendDelegateConfirmationEmail(newDelegate).catch(err => console.error('Error sending initial registration email:', err));
      newDelegate.initialEmailSent = true;
      newDelegate.emailSent = true;
      await newDelegate.save();
    }

    res.status(201).json({
      success: true,
      data: newDelegate
    });
  } catch (error) {
    console.error('Error in registerDelegate:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again.'
    });
  }
};

// @desc    Verify a delegate by ID (Public)
// @route   GET /api/delegates/verify/:id
// @access  Public
exports.verifyDelegate = async (req, res) => {
  try {
    const delegate = await DelegateRegistration.findById(req.params.id)
      .select('fullName designation organization attendeeCategory paymentStatus status registrationType');
    
    if (!delegate) {
      return res.status(404).json({
        success: false,
        message: 'Delegate not found or invalid ID'
      });
    }

    res.status(200).json({
      success: true,
      data: delegate
    });
  } catch (error) {
    console.error('Error in verifyDelegate:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again.'
    });
  }
};

// @desc    Get all delegates (with Pagination, Search & Stats)
// @route   GET /api/delegates
// @access  Private/Admin
exports.getDelegates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const search = req.query.search ? req.query.search.trim() : '';
    const delegateType = req.query.delegateType;
    const registrationType = req.query.registrationType;
    const attendeeCategory = req.query.attendeeCategory;
    const fetchAll = req.query.all === 'true'; // For CSV export

    // Build Mongo search query
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { organization: searchRegex },
        { mobileNumber: searchRegex },
        { designation: searchRegex },
        { gstNumber: searchRegex },
      ];
    }

    if (delegateType && delegateType !== 'all') {
      query.delegateType = delegateType;
    }

    if (registrationType && registrationType !== 'all') {
      query.registrationType = registrationType;
    }

    if (attendeeCategory && attendeeCategory !== 'all') {
      query.attendeeCategory = attendeeCategory;
    }

    // Compute Overall Stats concurrently for high performance
    const [totalCount, indianCount, intlCount, pendingCount] = await Promise.all([
      DelegateRegistration.countDocuments(),
      DelegateRegistration.countDocuments({ delegateType: 'indian' }),
      DelegateRegistration.countDocuments({ delegateType: 'foreign' }),
      DelegateRegistration.countDocuments({ paymentStatus: 'Pending' }),
    ]);

    const filteredTotal = await DelegateRegistration.countDocuments(query);

    let delegatesQuery = DelegateRegistration.find(query).sort({ createdAt: -1 });

    if (!fetchAll) {
      delegatesQuery = delegatesQuery.skip((page - 1) * limit).limit(limit);
    }

    const delegates = await delegatesQuery;

    res.status(200).json({
      success: true,
      count: delegates.length,
      total: filteredTotal,
      stats: {
        total: totalCount,
        indian: indianCount,
        intl: intlCount,
        pending: pendingCount,
      },
      pagination: fetchAll ? null : {
        page,
        limit,
        totalPages: Math.ceil(filteredTotal / limit),
      },
      data: delegates,
    });
  } catch (error) {
    console.error('Error in getDelegates:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update delegate
// @route   PUT /api/delegates/:id
// @access  Private/Admin
exports.updateDelegate = async (req, res) => {
  try {
    const { status, paymentStatus, registrationType, paymentMethod, attendeeCategory, email } = req.body;
    
    let delegate = await DelegateRegistration.findById(req.params.id);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    delegate.status = status || delegate.status;
    delegate.paymentStatus = paymentStatus || delegate.paymentStatus;
    delegate.registrationType = registrationType || delegate.registrationType;
    delegate.paymentMethod = paymentMethod || delegate.paymentMethod;
    if (attendeeCategory) delegate.attendeeCategory = attendeeCategory;
    if (email) delegate.email = email;

    const updatedDelegate = await delegate.save();

    if (updatedDelegate.paymentStatus === 'Paid' && !updatedDelegate.paidEmailSent) {
      sendDelegateConfirmationEmail(updatedDelegate).catch(err => console.error('Error sending paid email:', err));
      updatedDelegate.paidEmailSent = true;
      await updatedDelegate.save();
    } else if (updatedDelegate.paymentStatus === 'Failed' && !updatedDelegate.failedEmailSent) {
      sendDelegateConfirmationEmail(updatedDelegate).catch(err => console.error('Error sending failed email:', err));
      updatedDelegate.failedEmailSent = true;
      await updatedDelegate.save();
    }

    res.status(200).json({
      success: true,
      data: updatedDelegate
    });
  } catch (error) {
    console.error('Error in updateDelegate:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// ─── Razorpay: Create Order ───────────────────────────────────────────────────
// @desc    Create a Razorpay order for a delegate registration
// @route   POST /api/delegates/create-order
// @access  Public
exports.createOrder = async (req, res) => {
  try {
    const { delegateId, amountRs } = req.body;

    if (!delegateId || !amountRs) {
      return res.status(400).json({ success: false, message: 'delegateId and amountRs are required' });
    }

    const delegate = await DelegateRegistration.findById(delegateId);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate registration not found' });
    }

    // Initialise Razorpay with credentials from env
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Amount must be in paise (1 INR = 100 paise)
    const amountPaise = Math.round(amountRs * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `delegate_${delegateId.toString().slice(-8)}`,
      notes: {
        delegateId: delegateId.toString(),
        fullName: delegate.fullName,
        organization: delegate.organization,
      },
    });

    // Store the order ID so we can verify it later
    delegate.razorpayOrderId = order.id;
    delegate.amountPaid = amountRs;
    await delegate.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,       // in paise
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID, // safe to expose (public key)
    });
  } catch (error) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ success: false, message: 'Failed to create payment order' });
  }
};

// ─── Razorpay: Verify Payment ─────────────────────────────────────────────────
// @desc    Verify Razorpay signature and mark delegate payment as Paid
// @route   POST /api/delegates/verify-payment
// @access  Public (signature is the security mechanism)
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, delegateId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !delegateId) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields' });
    }

    // ── Industry-standard HMAC-SHA256 signature verification ──
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

    // Signature valid — update the delegate record
    const delegate = await DelegateRegistration.findByIdAndUpdate(
      delegateId,
      {
        paymentStatus: 'Paid',
        paymentMethod: 'Online (Razorpay)',
        razorpayPaymentId: razorpay_payment_id,
      },
      { new: true }
    );

    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    // Send paid confirmation email via Resend if not already sent
    if (!delegate.paidEmailSent) {
      sendDelegateConfirmationEmail(delegate).catch(err => console.error('Error sending paid confirmation email:', err));
      delegate.paidEmailSent = true;
      await delegate.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: delegate,
    });
  } catch (error) {
    console.error('Error in verifyPayment:', error);
    res.status(500).json({ success: false, message: 'Payment verification server error' });
  }
};

// @desc    Bulk update delegates
// @route   PUT /api/delegates/bulk-update
// @access  Private (Admin)
exports.bulkUpdateDelegates = async (req, res) => {
  try {
    const { delegateIds, updates } = req.body;
    if (!delegateIds || !Array.isArray(delegateIds) || delegateIds.length === 0) {
      return res.status(400).json({ success: false, message: 'No delegates selected' });
    }
    
    await DelegateRegistration.updateMany(
      { _id: { $in: delegateIds } },
      { $set: updates }
    );
    
    res.status(200).json({ success: true, message: 'Delegates updated successfully' });
  } catch (error) {
    console.error('Error in bulkUpdateDelegates:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
