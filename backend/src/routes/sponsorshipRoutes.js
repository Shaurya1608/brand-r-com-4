const express = require('express');
const router = express.Router();
const { createSponsorship, getSponsorships } = require('../controllers/sponsorshipController');
const { protect } = require('../middlewares/authMiddleware');

// Public route to create a sponsorship booking
router.post('/create', createSponsorship);

// Protected route to get all sponsorships (Admin only)
router.get('/', protect, getSponsorships);

module.exports = router;
