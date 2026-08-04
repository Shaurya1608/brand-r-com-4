const express = require('express');
const router = express.Router();
const { 
  createSpeakerInterest, 
  getSpeakerInterests, 
  updateSpeakerInterest, 
  deleteSpeakerInterest 
} = require('../controllers/speakerController');
const { protect } = require('../middlewares/authMiddleware');

// Public route to submit speaker interest
router.post('/create', createSpeakerInterest);

// Protected routes (Admin only)
router.get('/', protect, getSpeakerInterests);
router.put('/:id', protect, updateSpeakerInterest);
router.delete('/:id', protect, deleteSpeakerInterest);

module.exports = router;
