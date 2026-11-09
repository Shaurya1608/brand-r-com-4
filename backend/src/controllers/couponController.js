const Coupon = require('../models/Coupon');
const Sponsorship = require('../models/Sponsorship');
const AwardNomination = require('../models/AwardNomination');
const DelegateRegistration = require('../models/DelegateRegistration');
const mongoose = require('mongoose');
const crypto = require('crypto');

// Helper to generate a random uppercase alphanumeric string
const generateCouponCode = (prefix = 'BRAND') => {
  const randomPart = crypto.randomBytes(3).toString('hex').toUpperCase(); // 6 chars
  return `${prefix}-${randomPart}`;
};

// Helper to parse date inputs (handles YYYY-MM-DD from <input type="date">)
const parseStartDate = (dateVal) => {
  if (!dateVal) return new Date();
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateVal.trim())) {
    return new Date(`${dateVal.trim()}T00:00:00.000`);
  }
  return new Date(dateVal);
};

const parseExpiryDate = (dateVal) => {
  if (!dateVal) return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  if (typeof dateVal === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateVal.trim())) {
    // End of selected day (23:59:59.999) so it remains valid all day
    return new Date(`${dateVal.trim()}T23:59:59.999`);
  }
  return new Date(dateVal);
};

// Helper to parse discount percentage (1-100%, defaults to 100 for 100% Free Pass)
const parseDiscountPercentage = (val) => {
  if (val === undefined || val === null || val === '') return 100;
  const parsed = parseInt(val, 10);
  if (isNaN(parsed)) return 100;
  return Math.max(1, Math.min(100, parsed));
};

// 1. Generate Coupon from Sponsorship
exports.generateCoupon = async (req, res) => {
  try {
    const { sponsorshipId } = req.params;
    let { code, maxUses, startsAt, expiresAt, discountPercentage } = req.body;

    const sponsorship = await Sponsorship.findById(sponsorshipId);
    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship not found' });
    }

    // STRICT RULE: Only ONE active coupon allowed per sponsorship at a time
    const existingActiveCoupon = await Coupon.findOne({ 
      sponsorshipId, 
      isActive: true, 
      deletedAt: null 
    });

    if (existingActiveCoupon) {
      return res.status(400).json({ 
        success: false, 
        message: 'An active coupon already exists for this sponsor. Deactivate it first before creating a new one.',
        existingCoupon: existingActiveCoupon
      });
    }

    if (!code) {
      code = generateCouponCode('SPO');
    } else {
      code = code.toUpperCase().trim();
      const existing = await Coupon.findOne({ code });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists. Please try another.' });
      }
    }

    const coupon = new Coupon({
      code,
      sponsorshipId,
      sponsorName: sponsorship.companyName,
      discountPercentage: parseDiscountPercentage(discountPercentage),
      maxUses: maxUses || 50,
      startsAt: parseStartDate(startsAt),
      expiresAt: parseExpiryDate(expiresAt),
      isActive: true
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error('Error generating coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to generate coupon' });
  }
};

// 1B. Generate Coupon from Nomination
exports.generateNominationCoupon = async (req, res) => {
  try {
    const { nominationId } = req.params;
    let { code, maxUses, startsAt, expiresAt, discountPercentage } = req.body;

    const nomination = await AwardNomination.findById(nominationId);
    if (!nomination) {
      return res.status(404).json({ success: false, message: 'Award Nomination not found' });
    }

    // STRICT RULE: Only ONE active coupon allowed per nomination at a time
    const existingActiveCoupon = await Coupon.findOne({ 
      nominationId, 
      isActive: true, 
      deletedAt: null 
    });

    if (existingActiveCoupon) {
      return res.status(400).json({ 
        success: false, 
        message: 'An active coupon already exists for this nomination. Deactivate it first before creating a new one.',
        existingCoupon: existingActiveCoupon
      });
    }

    if (!code) {
      code = generateCouponCode('NOM');
    } else {
      code = code.toUpperCase().trim();
      const existing = await Coupon.findOne({ code });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists. Please try another.' });
      }
    }

    const coupon = new Coupon({
      code,
      nominationId,
      sponsorName: nomination.organizationName || nomination.fullName,
      discountPercentage: parseDiscountPercentage(discountPercentage),
      maxUses: maxUses || 50,
      startsAt: parseStartDate(startsAt),
      expiresAt: parseExpiryDate(expiresAt),
      isActive: true
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error('Error generating nomination coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to generate coupon' });
  }
};

// 1C. Standalone / Direct Coupon Creation (Admin)
exports.createCoupon = async (req, res) => {
  try {
    let { code, sponsorName, maxUses, startsAt, expiresAt, sponsorshipId, nominationId, discountPercentage } = req.body;

    if (!sponsorName || !sponsorName.trim()) {
      return res.status(400).json({ success: false, message: 'Organization / Sponsor Name is required' });
    }

    if (!code) {
      code = generateCouponCode('CPN');
    } else {
      code = code.toUpperCase().trim();
      const existing = await Coupon.findOne({ code, deletedAt: null });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Coupon code already exists. Please choose another code.' });
      }
    }

    const coupon = new Coupon({
      code,
      sponsorName: sponsorName.trim(),
      sponsorshipId: sponsorshipId || null,
      nominationId: nominationId || null,
      discountPercentage: parseDiscountPercentage(discountPercentage),
      maxUses: maxUses ? parseInt(maxUses) : 50,
      startsAt: parseStartDate(startsAt),
      expiresAt: parseExpiryDate(expiresAt),
      isActive: true
    });

    await coupon.save();
    res.status(201).json({ success: true, coupon });
  } catch (error) {
    console.error('Error creating standalone coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to create coupon' });
  }
};

// 2. Validate Coupon (Frontend use)
exports.validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

    const cleanCode = code.toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: cleanCode, deletedAt: null });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is currently inactive.' });
    }

    const now = new Date();
    if (now < coupon.startsAt) {
      return res.status(400).json({ success: false, message: 'This coupon is not yet valid.' });
    }

    if (now > coupon.expiresAt) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    if (coupon.usedCount >= coupon.maxUses) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its maximum usage limit.' });
    }

    const discountPercentage = typeof coupon.discountPercentage === 'number' ? coupon.discountPercentage : 100;
    const isFree = discountPercentage === 100;

    res.status(200).json({
      success: true,
      message: isFree ? 'Coupon is valid (100% Free Pass)' : `Coupon is valid (${discountPercentage}% Discount applied)`,
      data: {
        code: coupon.code,
        sponsorName: coupon.sponsorName,
        discountPercentage,
        isFree
      }
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ success: false, message: 'Server error while validating coupon.' });
  }
};

// 3. Get all coupons (Admin)
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({ deletedAt: null }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error('Error getting coupons:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// 4. Get coupons by Sponsorship (Admin)
exports.getCouponsBySponsorship = async (req, res) => {
  try {
    const { sponsorshipId } = req.params;
    const coupons = await Coupon.find({ sponsorshipId, deletedAt: null }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error('Error getting coupons by sponsorship:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// 4B. Get coupons by Nomination (Admin)
exports.getCouponsByNomination = async (req, res) => {
  try {
    const { nominationId } = req.params;
    const coupons = await Coupon.find({ nominationId, deletedAt: null }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error('Error getting coupons by nomination:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupons' });
  }
};

// 5. Get coupon by ID with Delegates (Admin)
exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({ _id: id, deletedAt: null });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const delegates = await DelegateRegistration.find({ couponId: id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, coupon, delegates });
  } catch (error) {
    console.error('Error getting coupon by ID:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch coupon details' });
  }
};

// 6. Update Limit (Admin)
exports.updateLimit = async (req, res) => {
  try {
    const { id } = req.params;
    const { maxUses } = req.body;
    
    if (!maxUses || isNaN(maxUses)) {
      return res.status(400).json({ success: false, message: 'Valid maxUses is required' });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { maxUses: parseInt(maxUses) } },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon limit:', error);
    res.status(500).json({ success: false, message: 'Failed to update limit' });
  }
};

// 7. Update Expiry (Admin)
exports.updateExpiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { expiresAt } = req.body;
    
    if (!expiresAt) {
      return res.status(400).json({ success: false, message: 'expiresAt date is required' });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { expiresAt: parseExpiryDate(expiresAt) } },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon expiry:', error);
    res.status(500).json({ success: false, message: 'Failed to update expiry' });
  }
};

// 7B. Update Discount Percentage (Admin)
exports.updateDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discountPercentage } = req.body;
    
    const parsed = parseInt(discountPercentage, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 100) {
      return res.status(400).json({ success: false, message: 'Valid discount percentage between 1 and 100 is required' });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { discountPercentage: parsed } },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error('Error updating coupon discount:', error);
    res.status(500).json({ success: false, message: 'Failed to update discount' });
  }
};

// 8. Toggle Status (Admin)
exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOne({ _id: id, deletedAt: null });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    console.error('Error toggling coupon status:', error);
    res.status(500).json({ success: false, message: 'Failed to toggle status' });
  }
};

// 9. Soft Delete (Admin)
exports.softDeleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { $set: { isActive: false, deletedAt: new Date() } },
      { new: true }
    );

    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ success: false, message: 'Failed to delete coupon' });
  }
};
