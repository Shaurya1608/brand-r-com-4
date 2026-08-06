const express = require('express');
const router = express.Router();
const { createSponsorship, getSponsorships, getSponsorshipDelegates, updateSponsorship, deleteSponsorship } = require('../controllers/sponsorshipController');
const { protect } = require('../middlewares/authMiddleware');

// Public route to create a sponsorship booking
router.post('/create', createSponsorship);

// Protected route to get all sponsorships (Admin only)
router.get('/', protect, getSponsorships);
router.get('/:id/delegates', protect, getSponsorshipDelegates);

// Protected routes to update/delete sponsorship (Admin only)
router.put('/:id', protect, updateSponsorship);
router.delete('/:id', protect, deleteSponsorship);

module.exports = router;
