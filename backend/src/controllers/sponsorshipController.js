const Sponsorship = require('../models/Sponsorship');

// @desc    Create a new sponsorship booking
// @route   POST /api/sponsorships/create
// @access  Public
const createSponsorship = async (req, res) => {
  try {
    const { 
      companyName, gstNumber, contactPerson, email, 
      mobileNumber, city, stateCountry, pinCode, 
      address, sponsorshipCategory, basePrice, totalAmount 
    } = req.body;

    // Create sponsorship record
    const sponsorship = await Sponsorship.create({
      companyName,
      gstNumber,
      contactPerson,
      email,
      mobileNumber,
      city,
      stateCountry,
      pinCode,
      address,
      sponsorshipCategory,
      basePrice,
      totalAmount,
      status: 'pending' // For now, we just save it as pending
    });

    res.status(201).json({
      success: true,
      message: 'Sponsorship booking submitted successfully',
      data: sponsorship
    });
  } catch (error) {
    console.error('Error creating sponsorship:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all sponsorships
// @route   GET /api/sponsorships
// @access  Private (Admin)
const getSponsorships = async (req, res) => {
  try {
    const sponsorships = await Sponsorship.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sponsorships
    });
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createSponsorship,
  getSponsorships
};
