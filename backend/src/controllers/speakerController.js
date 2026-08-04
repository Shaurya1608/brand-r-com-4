const SpeakerInterest = require('../models/SpeakerInterest');

// @desc    Create a new speaker interest enquiry
// @route   POST /api/speakers/create
// @access  Public
const createSpeakerInterest = async (req, res) => {
  try {
    const { 
      fullName, designation, mobileNumber, organization, 
      city, stateCountry, pinCode, address 
    } = req.body;

    if (!fullName || !designation || !mobileNumber || !organization || !city || !stateCountry || !pinCode || !address) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const speakerInterest = await SpeakerInterest.create({
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
      message: 'Speaker interest enquiry submitted successfully',
      data: speakerInterest
    });
  } catch (error) {
    console.error('Error submitting speaker interest:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all speaker interest enquiries
// @route   GET /api/speakers
// @access  Private (Admin)
const getSpeakerInterests = async (req, res) => {
  try {
    const speakerInterests = await SpeakerInterest.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: speakerInterests
    });
  } catch (error) {
    console.error('Error fetching speaker interests:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update speaker interest status
// @route   PUT /api/speakers/:id
// @access  Private (Admin)
const updateSpeakerInterest = async (req, res) => {
  try {
    const { status } = req.body;
    let speakerInterest = await SpeakerInterest.findById(req.params.id);
    if (!speakerInterest) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    speakerInterest = await SpeakerInterest.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status || speakerInterest.status } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: speakerInterest });
  } catch (error) {
    console.error('Error updating speaker interest:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete speaker interest enquiry
// @route   DELETE /api/speakers/:id
// @access  Private (Admin)
const deleteSpeakerInterest = async (req, res) => {
  try {
    const speakerInterest = await SpeakerInterest.findById(req.params.id);
    if (!speakerInterest) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    await speakerInterest.deleteOne();
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
