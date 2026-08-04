const DelegateRegistration = require('../models/DelegateRegistration');

// @desc    Register a new delegate
// @route   POST /api/delegates
// @access  Public
exports.registerDelegate = async (req, res) => {
  try {
    const {
      delegateType,
      fullName,
      designation,
      mobileNumber,
      organization,
      city,
      stateCountry,
      pinCode,
      address,
      couponCode,
      isManuallyCreated,
    } = req.body;

    const newDelegate = await DelegateRegistration.create({
      delegateType,
      fullName,
      designation,
      mobileNumber,
      organization,
      city,
      stateCountry,
      pinCode,
      address,
      couponCode: couponCode || null,
      isManuallyCreated: isManuallyCreated || false,
    });

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

// @desc    Get all delegates
// @route   GET /api/delegates
// @access  Private/Admin
exports.getDelegates = async (req, res) => {
  try {
    const delegates = await DelegateRegistration.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: delegates.length,
      data: delegates
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
    const { status, paymentStatus, registrationType, paymentMethod } = req.body;
    
    let delegate = await DelegateRegistration.findById(req.params.id);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    delegate.status = status || delegate.status;
    delegate.paymentStatus = paymentStatus || delegate.paymentStatus;
    delegate.registrationType = registrationType || delegate.registrationType;
    delegate.paymentMethod = paymentMethod || delegate.paymentMethod;

    const updatedDelegate = await delegate.save();

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

