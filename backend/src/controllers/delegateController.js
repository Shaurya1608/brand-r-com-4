const DelegateRegistration = require('../models/DelegateRegistration');
const Coupon = require('../models/Coupon');
const { sendDelegateConfirmationEmail } = require('../services/emailService');
const crypto = require('crypto');

// Returns the current date/time in IST (UTC+5:30)
function getISTDate() {
  // Safe development/test date override (Strictly disabled in production)
  let now = new Date();
  const testDate = process.env.PRICING_TEST_DATE || process.env.NEXT_PUBLIC_PRICING_TEST_DATE;
  if (process.env.NODE_ENV !== 'production' && testDate) {
    now = new Date(testDate);
  }

  const parts = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const get = (type) => parseInt(parts.find(p => p.type === type).value, 10);
  return { year: get('year'), month: get('month'), day: get('day') };
}

// Dynamically calculates applicable fee based on CURRENT IST server date at payment time
const calculateDelegatePricing = (type, coupon) => {
  if (type === 'foreign') {
    const baseUsd = coupon ? 200 : 250;
    return {
      baseAmount: baseUsd,
      taxableAmount: baseUsd,
      gstAmount: 0,
      totalAmount: baseUsd,
      amountDue: baseUsd,
      tierName: 'International Delegate'
    };
  }

  const { year, month } = getISTDate();
  
  let baseRs = 10000;
  let tierName = 'After 31 October 2026';

  if (year < 2026 || (year === 2026 && month <= 8)) {
    baseRs = 6000;
    tierName = 'Till 31 August 2026';
  } else if (year === 2026 && month === 9) {
    baseRs = 7000;
    tierName = 'Till 30 September 2026';
  } else if (year === 2026 && month === 10) {
    baseRs = 8000;
    tierName = 'Till 31 October 2026';
  } else {
    baseRs = 10000;
    tierName = 'After 31 October 2026';
  }

  const taxableRs = coupon ? baseRs * 0.8 : baseRs;
  const gstRs = Math.round(taxableRs * 0.18);
  const totalRs = taxableRs + gstRs;

  return {
    baseAmount: baseRs,
    taxableAmount: taxableRs,
    gstAmount: gstRs,
    totalAmount: totalRs,
    amountDue: totalRs,
    tierName
  };
};

// @desc    Get active delegate pricing tier based on server IST date (Public)
// @route   GET /api/delegates/pricing-tier
// @access  Public
exports.getPricingTier = async (req, res) => {
  try {
    const pricing = calculateDelegatePricing('indian', false);
    res.status(200).json({
      success: true,
      pricingTier: {
        label: pricing.tierName,
        amountRs: pricing.baseAmount,
        amount: `₹ ${new Intl.NumberFormat('en-IN').format(pricing.baseAmount)} + GST`,
        gstRs: pricing.gstAmount,
        totalRs: pricing.totalAmount
      }
    });
  } catch (error) {
    console.error('Error in getPricingTier:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving pricing tier.' });
  }
};

// @desc    Register a new delegate
// @route   POST /api/delegates
// @access  Public
exports.registerDelegate = async (req, res) => {
  try {
    let {
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
      paymentStatus,
      paymentMethod,
      attendeeCategory,
      registeredBy,
      sponsorshipId,
      sponsorshipCompany,
      awardNominationId,
      awardNominationName
    } = req.body;

    const cleanEmail = (email && typeof email === 'string') ? email.trim().toLowerCase() : '';
    const cleanMobile = (mobileNumber && typeof mobileNumber === 'string') ? mobileNumber.trim() : '';
    const normAttendeeCategory = attendeeCategory ? attendeeCategory.replace(/\s+/g, '_') : 'DELEGATE';

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. name@company.com).'
      });
    }

    const emailTypos = [
      { bad: '@gmail.co', correct: '@gmail.com' },
      { bad: '@gmail.con', correct: '@gmail.com' },
      { bad: '@gamil.com', correct: '@gmail.com' },
      { bad: '@gmai.com', correct: '@gmail.com' },
      { bad: '@yahoo.co', correct: '@yahoo.com' },
      { bad: '@yahoo.con', correct: '@yahoo.com' },
      { bad: '@hotmail.co', correct: '@hotmail.com' },
      { bad: '@outlook.co', correct: '@outlook.com' }
    ];

    for (const typo of emailTypos) {
      if (cleanEmail.endsWith(typo.bad)) {
        return res.status(400).json({
          success: false,
          message: `Did you mean ${cleanEmail.replace(typo.bad, typo.correct)}? Please check your email address.`
        });
      }
    }

    const mobileDigits = cleanMobile.replace(/\D/g, '');
    if (!cleanMobile || mobileDigits.length < 7 || mobileDigits.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile number (7-15 digits).'
      });
    }

    // Securely check if request is from an admin
    let isAdmin = false;
    let token = null;

    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const jwt = require('jsonwebtoken');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        if (decoded && decoded.id) isAdmin = true;
      } catch (err) {}
    }

    const pricing = calculateDelegatePricing(delegateType, couponCode);
    let finalPaymentStatus = isAdmin && paymentStatus ? paymentStatus : 'Pending';
    let finalPaymentMethod = isAdmin && paymentMethod ? paymentMethod : 'Online';
    const finalIsManuallyCreated = isAdmin && isManuallyCreated ? true : false;
    let isPaid = finalPaymentStatus === 'Paid';
    let isFreeCoupon = false;
    let validCoupon = null;

    const isStatusPaidOrFree = (status) => {
      if (!status) return false;
      const s = status.toLowerCase();
      return s === 'paid' || s.includes('free') || s.includes('invitee');
    };

    const mongoose = require('mongoose');
    const session = await mongoose.startSession();
    session.startTransaction();

    let newDelegate;
    let rawToken = crypto.randomBytes(32).toString('hex');

    try {
      if (couponCode && !isAdmin) {
        let code = couponCode.toUpperCase().trim();
        
        // If it's a combined string (e.g. "SPO-123, #IAP2026"), extract just the sponsor code for validation
        if (code.includes(',') && code.includes('#IAP2026')) {
          code = code.replace(', #IAP2026', '').replace('#IAP2026', '').replace(',', '').trim();
        }
        
        if (code === '#IAP2026') {
          // It's the Industry Partner 20% discount code, no DB lookup needed, it's just a 20% price reduction
        } else {
          validCoupon = await Coupon.findOne({ code, deletedAt: null }).session(session);
          
          if (!validCoupon) throw new Error('Invalid coupon code.');
          if (!validCoupon.isActive) throw new Error('This coupon is currently inactive.');
          
          const now = new Date();
          if (now < validCoupon.startsAt) throw new Error('This coupon is not yet valid.');
          if (now > validCoupon.expiresAt) throw new Error('This coupon has expired.');
          if (validCoupon.usedCount >= validCoupon.maxUses) throw new Error('This coupon has reached its maximum usage limit.');
  
          validCoupon.usedCount += 1;
          await validCoupon.save({ session });
  
          isFreeCoupon = true;
          finalPaymentStatus = 'Free';
          finalPaymentMethod = 'Coupon';
          isPaid = true;
          
          // Automatically link the delegate to the sponsor or nomination that generated this coupon
          if (validCoupon.sponsorshipId) {
            sponsorshipId = validCoupon.sponsorshipId;
            sponsorshipCompany = validCoupon.sponsorName;
          } else if (validCoupon.nominationId) {
            awardNominationId = validCoupon.nominationId;
            awardNominationName = validCoupon.sponsorName;
          }
        }
      }

      const last10Digits = mobileDigits.slice(-10);
      const queryOr = [{ email: cleanEmail }];

      if (last10Digits.length === 10) {
        queryOr.push({ mobileNumber: { $regex: last10Digits + '$' } });
      }

      let existingDelegate = await DelegateRegistration.findOne({ $or: queryOr }).session(session);

      if (existingDelegate) {
        if (isStatusPaidOrFree(existingDelegate.paymentStatus) || existingDelegate.delegateType !== delegateType) {
          await session.abortTransaction();
          session.endSession();
          return res.status(200).json({
            success: false,
            message: `You have already registered this email as an ${existingDelegate.delegateType === 'indian' ? 'Indian' : 'International'} delegate! Please use another email or contact our team if you need assistance.`
          });
        }
        
        existingDelegate.delegateType = delegateType || existingDelegate.delegateType;
        existingDelegate.fullName = fullName || existingDelegate.fullName;
        existingDelegate.email = cleanEmail || existingDelegate.email;
        existingDelegate.designation = designation || existingDelegate.designation;
        existingDelegate.organization = organization || existingDelegate.organization;
        existingDelegate.mobileNumber = cleanMobile || existingDelegate.mobileNumber;
        existingDelegate.city = city || existingDelegate.city;
        existingDelegate.stateCountry = stateCountry || existingDelegate.stateCountry;
        existingDelegate.pinCode = pinCode || existingDelegate.pinCode;
        existingDelegate.address = address || existingDelegate.address;
        if (gstNumber) existingDelegate.gstNumber = gstNumber.trim().toUpperCase();
        if (couponCode) existingDelegate.couponCode = couponCode;
        if (validCoupon) existingDelegate.couponId = validCoupon._id;
        if (sponsorshipId) existingDelegate.sponsorshipId = sponsorshipId;
        if (sponsorshipCompany) existingDelegate.sponsorshipCompany = sponsorshipCompany;
        if (awardNominationId) existingDelegate.awardNominationId = awardNominationId;
        if (awardNominationName) existingDelegate.awardNominationName = awardNominationName;
        if (attendeeCategory) existingDelegate.attendeeCategory = attendeeCategory;
        if (paymentStatus) existingDelegate.paymentStatus = finalPaymentStatus;
        if (paymentMethod) existingDelegate.paymentMethod = finalPaymentMethod;
        if (isFreeCoupon) {
          existingDelegate.paymentStatus = 'Free';
          existingDelegate.paymentMethod = 'Coupon';
        }
        if (registeredBy) existingDelegate.registeredBy = registeredBy;
        if (finalIsManuallyCreated) {
          existingDelegate.isManuallyCreated = true;
          existingDelegate.registrationType = 'Manual';
        }

        existingDelegate.totalAmount = isFreeCoupon ? 0 : pricing.totalAmount;
        if (isStatusPaidOrFree(existingDelegate.paymentStatus)) {
          existingDelegate.amountPaid = isFreeCoupon ? 0 : pricing.totalAmount;
          existingDelegate.amountDue = 0;
        } else {
          existingDelegate.amountPaid = 0;
          existingDelegate.amountDue = pricing.totalAmount;
        }

        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        existingDelegate.resumeTokenHash = tokenHash;
        existingDelegate.paymentTokenExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

        await existingDelegate.save({ session });
        await session.commitTransaction();
        session.endSession();

        const frontendUrl = process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
        const paymentUrl = `${frontendUrl}/pay?token=${rawToken}`;

        return res.status(200).json({
          success: true,
          isExisting: true,
          isFree: isFreeCoupon,
          alreadyPaid: isStatusPaidOrFree(existingDelegate.paymentStatus),
          message: isStatusPaidOrFree(existingDelegate.paymentStatus)
            ? 'You are already registered and your registration is confirmed!'
            : 'Existing registration found! Please complete your pending payment.',
          data: existingDelegate,
          rawToken,
          paymentUrl
        });
      }

      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      let newDelegateArray = await DelegateRegistration.create([{
        delegateType: delegateType || 'indian',
        fullName,
        email: cleanEmail,
        designation,
        mobileNumber: cleanMobile,
        organization,
        city,
        stateCountry,
        pinCode,
        gstNumber: gstNumber ? gstNumber.trim().toUpperCase() : '',
        address,
        couponCode: couponCode || null,
        couponId: validCoupon ? validCoupon._id : null,
        isManuallyCreated: finalIsManuallyCreated,
        registrationType: finalIsManuallyCreated ? 'Manual' : 'Online',
        paymentStatus: finalPaymentStatus,
        paymentMethod: finalPaymentMethod,
        attendeeCategory: normAttendeeCategory,
        registeredBy: registeredBy || '',
        sponsorshipId: sponsorshipId || null,
        sponsorshipCompany: sponsorshipCompany || '',
        awardNominationId: awardNominationId || null,
        awardNominationName: awardNominationName || '',
        totalAmount: isFreeCoupon ? 0 : pricing.totalAmount,
        amountPaid: isFreeCoupon ? 0 : (isPaid ? pricing.totalAmount : 0),
        amountDue: isFreeCoupon ? 0 : (isPaid ? 0 : pricing.totalAmount),
        resumeTokenHash: isFreeCoupon || isPaid ? null : tokenHash,
        paymentTokenExpires: isFreeCoupon || isPaid ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }], { session });

      newDelegate = newDelegateArray[0];
      
      await session.commitTransaction();
      session.endSession();
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      
      if (err.code === 11000 || (err.message && err.message.includes('E11000'))) {
        const existingDelegate = await DelegateRegistration.findOne({
          $or: [{ email: cleanEmail }, { mobileNumber: cleanMobile }]
        });
        if (existingDelegate) {
          const frontendUrl = process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
          const rawToken = crypto.randomBytes(32).toString('hex');
          return res.status(200).json({
            success: true,
            isExisting: true,
            alreadyPaid: isStatusPaidOrFree(existingDelegate.paymentStatus),
            message: isStatusPaidOrFree(existingDelegate.paymentStatus)
              ? 'You are already registered and your registration is confirmed!'
              : 'Existing registration found! Please complete your pending payment.',
            data: existingDelegate,
            rawToken,
            paymentUrl: `${frontendUrl}/pay?token=${rawToken}`
          });
        }
      }
      
      return res.status(400).json({ success: false, message: err.message || 'Registration failed' });
    }

    const isActuallyPaidOrFree = 
      newDelegate.paymentStatus === 'Paid' || 
      newDelegate.paymentStatus === 'Free' || 
      newDelegate.paymentStatus === 'Invitee' || 
      (newDelegate.paymentMethod && ['free', 'coupon', 'complimentary'].includes(newDelegate.paymentMethod.toLowerCase()));

    if (!newDelegate.initialEmailSent && isActuallyPaidOrFree && !finalIsManuallyCreated) {
      sendDelegateConfirmationEmail(newDelegate, rawToken).catch(err => console.error('Error sending initial registration email:', err));
      newDelegate.initialEmailSent = true;
      newDelegate.emailSent = true;
      await newDelegate.save();
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
    const paymentUrl = `${frontendUrl}/pay?token=${rawToken}`;

    res.status(201).json({
      success: true,
      isFree: newDelegate.paymentStatus === 'Free',
      data: newDelegate,
      rawToken,
      paymentUrl
    });
  } catch (error) {
    console.error('Error in registerDelegate:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error. Please try again.'
    });
  }
};

// @desc    Lookup an existing delegate by email, mobile number, or registration ID (Public - Privacy Protected)
// @route   GET /api/delegates/lookup?query=...
// @access  Public
exports.lookupDelegate = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ success: false, message: 'Please provide email, mobile number, or registration ID' });
    }

    const cleanQuery = query.trim();
    const searchRegex = new RegExp(cleanQuery, 'i');

    let delegate = null;

    if (cleanQuery.length === 24) {
      delegate = await DelegateRegistration.findById(cleanQuery);
    }

    if (!delegate) {
      const allDelegates = await DelegateRegistration.find({
        $or: [
          { email: cleanQuery.toLowerCase() },
          { mobileNumber: cleanQuery },
          { fullName: searchRegex }
        ]
      }).sort({ createdAt: -1 });

      if (allDelegates.length > 0) {
        delegate = allDelegates[0];
      } else {
        const matchedById = await DelegateRegistration.find().sort({ createdAt: -1 });
        delegate = matchedById.find(d => d._id.toString().slice(-8).toUpperCase() === cleanQuery.toUpperCase());
      }
    }

    if (!delegate) {
      return res.status(404).json({
        success: false,
        message: 'No existing registration found matching your details.'
      });
    }

    // Mask personal information for public lookup API to protect user privacy
    const maskName = (nameStr) => {
      if (!nameStr) return '';
      const parts = nameStr.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    };

    const maskEmail = (emailStr) => {
      if (!emailStr || !emailStr.includes('@')) return '***@***.com';
      const [local, domain] = emailStr.split('@');
      const visible = local.slice(0, 2);
      return `${visible}***@${domain}`;
    };

    const maskMobile = (phoneStr) => {
      if (!phoneStr) return '******0000';
      const digits = phoneStr.replace(/\D/g, '');
      if (digits.length < 4) return '******';
      return `******${digits.slice(-4)}`;
    };

    const maskedData = {
      _id: delegate._id,
      registrationId: delegate._id.toString().slice(-8).toUpperCase(),
      fullName: maskName(delegate.fullName),
      rawFullName: delegate.fullName,
      email: maskEmail(delegate.email),
      mobileNumber: maskMobile(delegate.mobileNumber),
      delegateType: delegate.delegateType,
      paymentStatus: delegate.paymentStatus,
      amountPaid: delegate.amountPaid,
      couponCode: delegate.couponCode,
      createdAt: delegate.createdAt
    };

    res.status(200).json({
      success: true,
      exists: true,
      data: maskedData
    });
  } catch (error) {
    console.error('Error in lookupDelegate:', error);
    res.status(500).json({ success: false, message: 'Server error looking up registration.' });
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
    const paymentStatus = req.query.paymentStatus;
    const paymentMethod = req.query.paymentMethod;
    const registrationSource = req.query.registrationSource;
    const hasCoupon = req.query.hasCoupon;
    const fetchAll = req.query.all === 'true'; // For CSV export

    // Build Mongo search query
    let query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      // Strip leading '#' if user searched like "#871AC399"
      const cleanSearch = search.startsWith('#') ? search.slice(1) : search;
      const cleanRegex = new RegExp(cleanSearch, 'i');

      // Fetch all IDs that end with the search term (for Reg. ID search like #871AC399)
      let idCondition = [];
      if (/^[0-9a-fA-F]{5,24}$/.test(cleanSearch)) {
        // It looks like a partial MongoDB ObjectId hex — find delegates whose _id ends with this suffix
        const allIds = await DelegateRegistration.find({}, { _id: 1 }).lean();
        const matchingIds = allIds
          .filter(d => d._id.toString().slice(-cleanSearch.length).toUpperCase() === cleanSearch.toUpperCase())
          .map(d => d._id);
        if (matchingIds.length > 0) {
          idCondition = [{ _id: { $in: matchingIds } }];
        }
      }

      query.$or = [
        ...idCondition,
        { fullName: searchRegex },
        { email: searchRegex },
        { organization: cleanRegex },
        { mobileNumber: searchRegex },
        { designation: searchRegex },
        { gstNumber: searchRegex },
        { couponCode: searchRegex },
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

    if (paymentStatus && paymentStatus !== 'all') {
      query.paymentStatus = paymentStatus;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    if (registrationSource && registrationSource !== 'all') {
      if (registrationSource === 'manual') {
        query.isManuallyCreated = true;
      } else if (registrationSource === 'online') {
        query.isManuallyCreated = false;
      }
    }

    if (hasCoupon === 'yes') {
      query.couponCode = { $exists: true, $ne: null, $ne: '' };
    } else if (hasCoupon === 'no') {
      query.$or = [
        { couponCode: { $exists: false } },
        { couponCode: null },
        { couponCode: '' }
      ];
    }

    // Compute Overall Stats concurrently for high performance
    const [totalCount, indianCount, intlCount, pendingCount] = await Promise.all([
      DelegateRegistration.countDocuments(),
      DelegateRegistration.countDocuments({ delegateType: 'indian' }),
      DelegateRegistration.countDocuments({ delegateType: 'foreign' }),
      DelegateRegistration.countDocuments({ paymentStatus: 'Pending' }),
    ]);

    const filteredTotal = await DelegateRegistration.countDocuments(query);

    let delegatesQuery = DelegateRegistration.find(query).populate('invoiceId').sort({ createdAt: -1 });

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
    const { 
      status, paymentStatus, registrationType, paymentMethod, attendeeCategory, email,
      fullName, designation, organization, mobileNumber, city, stateCountry, pinCode, address,
      gstNumber, registeredBy, couponCode, delegateType, sponsorshipId, sponsorshipCompany
    } = req.body;
    
    let delegate = await DelegateRegistration.findById(req.params.id).populate('invoiceId');
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    if (status !== undefined) delegate.status = status;
    if (paymentStatus !== undefined) delegate.paymentStatus = paymentStatus;
    if (registrationType !== undefined) delegate.registrationType = registrationType;
    if (paymentMethod !== undefined) delegate.paymentMethod = paymentMethod;
    if (attendeeCategory !== undefined) delegate.attendeeCategory = attendeeCategory;
    if (email !== undefined && email) delegate.email = email.trim().toLowerCase();
    if (fullName !== undefined) delegate.fullName = fullName;
    if (designation !== undefined) delegate.designation = designation;
    if (organization !== undefined) delegate.organization = organization;
    if (mobileNumber !== undefined && mobileNumber) delegate.mobileNumber = mobileNumber.replace(/\D/g, '');
    if (city !== undefined) delegate.city = city;
    if (stateCountry !== undefined) delegate.stateCountry = stateCountry;
    if (pinCode !== undefined) delegate.pinCode = pinCode;
    if (address !== undefined) delegate.address = address;
    if (gstNumber !== undefined) delegate.gstNumber = gstNumber ? gstNumber.trim().toUpperCase() : '';
    if (registeredBy !== undefined) delegate.registeredBy = registeredBy;
    if (couponCode !== undefined) delegate.couponCode = couponCode;
    if (delegateType !== undefined) delegate.delegateType = delegateType;
    if (sponsorshipId !== undefined) delegate.sponsorshipId = sponsorshipId;
    if (sponsorshipCompany !== undefined) delegate.sponsorshipCompany = sponsorshipCompany;

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
    const { delegateId } = req.body;

    if (!delegateId) {
      return res.status(400).json({ success: false, message: 'delegateId is required' });
    }

    const delegate = await DelegateRegistration.findById(delegateId);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate registration not found' });
    }

    // Dynamic fee calculation based on CURRENT IST server date at order creation time
    const currentPricing = calculateDelegatePricing(delegate.delegateType, delegate.couponCode);
    const previousAmount = delegate.totalAmount;
    const priceChanged = previousAmount && previousAmount !== currentPricing.totalAmount;

    // Initialise Razorpay with credentials from env
    const Razorpay = require('razorpay');
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // Amount must be in paise (1 INR = 100 paise)
    const amountPaise = Math.round(currentPricing.totalAmount * 100);
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: delegate.delegateType === 'foreign' ? 'USD' : 'INR',
      receipt: `delegate_${delegateId.toString().slice(-8)}`,
      payment_capture: 1, // Explicitly enforce auto-capture
      notes: {
        delegateId: delegateId.toString(),
        fullName: delegate.fullName,
        organization: delegate.organization,
        tierName: currentPricing.tierName,
      },
    });

    // Store the order ID and updated pricing in DB
    delegate.razorpayOrderId = order.id;
    delegate.totalAmount = currentPricing.totalAmount;
    if (delegate.paymentStatus !== 'Paid') {
      delegate.paymentStatus = 'Pending';
      delegate.amountPaid = 0;
      delegate.amountDue = currentPricing.totalAmount;
    }
    await delegate.save();

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,       // in paise
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      totalAmountRs: currentPricing.totalAmount,
      tierName: currentPricing.tierName,
      priceChanged,
      previousAmount,
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

    // ── Industry-standard HMAC-SHA256 timing-safe signature verification ──
    const crypto = require('crypto');
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
    
    const delegateCheck = await DelegateRegistration.findOne({ _id: delegateId, razorpayOrderId: razorpay_order_id });
    if (!delegateCheck) {
      return res.status(404).json({ success: false, message: 'Delegate or matching order not found' });
    }

    const expectedAmountPaise = Math.round((delegateCheck.totalAmount || 5664) * 100);
    if (paymentDetails.amount !== expectedAmountPaise) {
      console.error(`Amount mismatch! Expected: ${expectedAmountPaise}, Received: ${paymentDetails.amount}`);
      return res.status(400).json({ success: false, message: 'Payment amount mismatch. Order flagged.' });
    }

    // Signature and amount valid — update the delegate record & financial accounting fields atomically
    // Only update if not already paid to prevent accidental overwrites
    // CRITICAL SECURITY: Match both _id AND razorpayOrderId to prevent cross-registration payment spoofing!
    let delegate = await DelegateRegistration.findOneAndUpdate(
      { _id: delegateId, razorpayOrderId: razorpay_order_id, paymentStatus: { $ne: 'Paid' } },
      {
        $set: {
          paymentStatus: 'Paid',
          paymentMethod: 'Online (Razorpay)',
          razorpayPaymentId: razorpay_payment_id,
          amountPaid: delegateCheck.totalAmount || 5664,
          amountDue: 0,
          resumeTokenHash: null,
          paymentTokenExpires: null,
        }
      },
      { new: true }
    );

    // If it was already paid, we just fetch it to return
    if (!delegate) {
      delegate = await DelegateRegistration.findOne({ _id: delegateId, razorpayOrderId: razorpay_order_id });
      if (!delegate) {
        return res.status(404).json({ success: false, message: 'Delegate or matching order not found' });
      }
    }

    // Atomic email lock
    const emailLockedRecord = await DelegateRegistration.findOneAndUpdate(
      { _id: delegateId, paidEmailSent: { $ne: true } },
      { $set: { paidEmailSent: true } },
      { new: true }
    );

    if (emailLockedRecord) {
      try {
        await sendDelegateConfirmationEmail(emailLockedRecord);
      } catch (err) {
        console.error('Error sending delegate paid confirmation email:', err);
        // Release lock on failure
        await DelegateRegistration.updateOne({ _id: delegateId }, { $set: { paidEmailSent: false } });
      }
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

// ─── Secure Resume Payment Token Handler ──────────────────────────────────────
// @desc    Resume payment for an existing registration using a secure unguessable token
// @route   GET /api/delegates/resume-payment/:token
// @access  Public
exports.resumePayment = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Payment token is required' });
    }

    // Compute SHA-256 hash of incoming raw token to query DB
    const hashedToken = crypto.createHash('sha256').update(token.trim()).digest('hex');
    const delegate = await DelegateRegistration.findOne({ resumeTokenHash: hashedToken });

    if (!delegate) {
      return res.status(404).json({
        success: false,
        message: 'Invalid, already used, or expired payment link.'
      });
    }

    if (delegate.paymentStatus === 'Paid') {
      return res.status(200).json({
        success: true,
        alreadyPaid: true,
        data: {
          _id: delegate._id,
          registrationId: delegate._id.toString().slice(-8).toUpperCase(),
          fullName: delegate.fullName,
          email: delegate.email,
          paymentStatus: 'Paid',
          totalAmount: delegate.totalAmount || 5664,
          amountPaid: delegate.amountPaid || 5664,
          amountDue: 0,
        }
      });
    }

    // Payment links never expire as requested.
    // if (delegate.paymentTokenExpires && delegate.paymentTokenExpires < new Date()) { ... }

    // Mask name and email for privacy
    const maskName = (nameStr) => {
      if (!nameStr) return '';
      const parts = nameStr.trim().split(/\s+/);
      if (parts.length === 1) return parts[0];
      return `${parts[0]} ${parts[parts.length - 1][0]}.`;
    };

    const maskEmail = (emailStr) => {
      if (!emailStr || !emailStr.includes('@')) return '***@***.com';
      const [local, domain] = emailStr.split('@');
      const visible = local.slice(0, 2);
      return `${visible}***@${domain}`;
    };

    const maskMobile = (phoneStr) => {
      if (!phoneStr) return '******0000';
      const digits = phoneStr.replace(/\D/g, '');
      if (digits.length < 4) return '******';
      return `******${digits.slice(-4)}`;
    };

    // Recalculate current pricing dynamically for IST server date
    const currentPricing = calculateDelegatePricing(delegate.delegateType, delegate.couponCode);
    const previousPrice = delegate.totalAmount;
    const priceChanged = previousPrice && previousPrice !== currentPricing.totalAmount;

    res.status(200).json({
      success: true,
      data: {
        _id: delegate._id,
        registrationId: delegate._id.toString().slice(-8).toUpperCase(),
        fullName: maskName(delegate.fullName),
        rawFullName: delegate.fullName,
        email: maskEmail(delegate.email),
        mobileNumber: maskMobile(delegate.mobileNumber),
        delegateType: delegate.delegateType,
        paymentStatus: delegate.paymentStatus,
        tierName: currentPricing.tierName,
        totalAmount: currentPricing.totalAmount,
        previousAmount: previousPrice,
        priceChanged,
        amountPaid: delegate.amountPaid || 0,
        amountDue: delegate.paymentStatus === 'Paid' ? 0 : currentPricing.totalAmount,
      }
    });
  } catch (error) {
    console.error('Error in resumePayment:', error);
    res.status(500).json({ success: false, message: 'Server error retrieving payment session.' });
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

// @desc    Get or generate shareable payment link for a delegate (Admin)
// @route   GET /api/delegates/:id/payment-link
// @access  Private (Admin)
exports.getDelegatePaymentLink = async (req, res) => {
  try {
    const delegate = await DelegateRegistration.findById(req.params.id);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    delegate.resumeTokenHash = tokenHash;
    delegate.paymentTokenExpires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    await delegate.save();

    const frontendUrl = process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app';
    const paymentUrl = `${frontendUrl}/pay?token=${rawToken}`;

    res.status(200).json({
      success: true,
      paymentUrl,
      rawToken
    });
  } catch (error) {
    console.error('Error in getDelegatePaymentLink:', error);
    res.status(500).json({ success: false, message: 'Server error generating payment link.' });
  }
};

// @desc    Delete a delegate registration (Admin)
// @route   DELETE /api/delegates/:id
// @access  Private (Admin)
exports.deleteDelegate = async (req, res) => {
  try {
    const { id } = req.params;
    const delegate = await DelegateRegistration.findByIdAndDelete(id);
    if (!delegate) {
      return res.status(404).json({ success: false, message: 'Delegate not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Delegate deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting delegate:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
