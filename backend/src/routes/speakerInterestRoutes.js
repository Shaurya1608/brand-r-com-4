const express = require('express');
const router = express.Router();
const { 
  createSpeakerInterest, 
  getSpeakerInterests, 
  updateSpeakerInterest, 
  deleteSpeakerInterest 
} = require('../controllers/speakerInterestController');
const { protect } = require('../middlewares/authMiddleware');

// Public route to submit speaker interest
router.post('/create', createSpeakerInterest);

// Protected route to get all speaker interests (Admin only)
router.get('/', protect, getSpeakerInterests);

// Protected routes to update/delete speaker interest (Admin only)
router.put('/:id', protect, updateSpeakerInterest);
router.delete('/:id', protect, deleteSpeakerInterest);

module.exports = router;
