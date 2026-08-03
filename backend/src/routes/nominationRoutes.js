const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const nominationController = require('../controllers/nominationController');
const { protect } = require('../middlewares/authMiddleware');

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
    allowedFormats: ['svg', 'png', 'jpg', 'jpeg', 'webp'],
    format: async (req, file) => 'webp',
    transformation: [{ width: 800, crop: 'limit', quality: 'auto' }]
  },
});

const upload = multer({ storage: storage });

// Public route for creating nomination with single file upload 'document'
router.post('/', upload.single('document'), nominationController.createNomination);

// Protected route for fetching all nominations (Admin)
router.get('/', protect, nominationController.getNominations);

module.exports = router;
