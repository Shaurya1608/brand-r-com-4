const SpeakerInterest = require('../models/SpeakerInterest');

// @desc    Submit a new speaker interest
// @route   POST /api/speaker-interests/create
// @access  Public
const createSpeakerInterest = async (req, res) => {
  try {
    const { 
      fullName, designation, mobileNumber, 
      organization, city, stateCountry, 
      pinCode, address 
    } = req.body;

    const interest = await SpeakerInterest.create({
      fullName,
      designation,
      mobileNumber,
      organization,
      city,
      stateCountry,
      pinCode,
      address,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Speaker interest submitted successfully',
      data: interest
    });
  } catch (error) {
    console.error('Error creating speaker interest:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all speaker interests
// @route   GET /api/speaker-interests
// @access  Private (Admin)
const getSpeakerInterests = async (req, res) => {
  try {
    const interests = await SpeakerInterest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: interests
    });
  } catch (error) {
    console.error('Error fetching speaker interests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update speaker interest status
// @route   PUT /api/speaker-interests/:id
// @access  Private (Admin)
const updateSpeakerInterest = async (req, res) => {
  try {
    const { status } = req.body;
    let interest = await SpeakerInterest.findById(req.params.id);
    if (!interest) {
      return res.status(404).json({ success: false, message: 'Speaker interest not found' });
    }
    
    interest = await SpeakerInterest.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status || interest.status } },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: interest });
  } catch (error) {
    console.error('Error updating speaker interest:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete speaker interest
// @route   DELETE /api/speaker-interests/:id
// @access  Private (Admin)
const deleteSpeakerInterest = async (req, res) => {
  try {
    const interest = await SpeakerInterest.findById(req.params.id);
    if (!interest) {
      return res.status(404).json({ success: false, message: 'Speaker interest not found' });
    }
    
    await interest.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting speaker interest:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createSpeakerInterest,
  getSpeakerInterests,
  updateSpeakerInterest,
  deleteSpeakerInterest
};
