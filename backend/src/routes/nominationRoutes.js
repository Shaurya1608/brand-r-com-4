const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const nominationController = require('../controllers/nominationController');
const { protect } = require('../middlewares/authMiddleware');
const { registrationLimiter, orderLimiter } = require('../middlewares/rateLimiter');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'brand_r_comm_nominations',
    allowedFormats: ['svg', 'png', 'jpg', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'ppt', 'pptx'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

// Public route for creating nomination with multiple file uploads
router.post('/', registrationLimiter, upload.fields([
  { name: 'summaryDocument', maxCount: 1 },
  { name: 'profileDocument', maxCount: 1 }
]), nominationController.createNomination);

// Razorpay Payment Routes
router.post('/create-order', orderLimiter, nominationController.createOrder);
router.post('/verify-payment', nominationController.verifyPayment);

// Protected route for fetching all nominations (Admin)
router.get('/', protect, nominationController.getNominations);

module.exports = router;
