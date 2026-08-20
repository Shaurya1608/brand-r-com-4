const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect } = require('../middlewares/authMiddleware');

// Frontend: Validate Coupon
router.post('/validate', couponController.validateCoupon);

// Admin: Manage Coupons
router.get('/', protect, couponController.getAllCoupons);
router.get('/:id', protect, couponController.getCouponById);
router.patch('/:id/limit', protect, couponController.updateLimit);
router.patch('/:id/expiry', protect, couponController.updateExpiry);
router.patch('/:id/status', protect, couponController.toggleStatus);
router.delete('/:id', protect, couponController.softDeleteCoupon);

module.exports = router;
