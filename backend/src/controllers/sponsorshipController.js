const Sponsorship = require('../models/Sponsorship');

// @desc    Create a new sponsorship booking
// @route   POST /api/sponsorships/create
// @access  Public
const createSponsorship = async (req, res) => {
  try {
    const { 
      companyName, gstNumber, contactPerson, designation, email, 
      mobileNumber, city, stateCountry, pinCode, 
      address, sponsorshipCategory, sponsorshipTier, registrationType, basePrice, totalAmount, logoUrl
    } = req.body;

    // Create sponsorship record
    const sponsorship = await Sponsorship.create({
      companyName,
      gstNumber,
      contactPerson,
      designation,
      email,
      mobileNumber,
      city,
      stateCountry,
      pinCode,
      address,
      sponsorshipCategory,
      sponsorshipTier,
      registrationType: registrationType || 'Online Registration',
      basePrice,
      totalAmount,
      logoUrl,
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

// @desc    Update sponsorship status/details
// @route   PUT /api/sponsorships/:id
// @access  Private (Admin)
const updateSponsorship = async (req, res) => {
  try {
    const { status } = req.body;
    let sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship not found' });
    }
    
    sponsorship = await Sponsorship.findByIdAndUpdate(
      req.params.id,
      { $set: { status: status || sponsorship.status } },
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ success: true, data: sponsorship });
  } catch (error) {
    console.error('Error updating sponsorship:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete sponsorship
// @route   DELETE /api/sponsorships/:id
// @access  Private (Admin)
const deleteSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship not found' });
    }
    
    await sponsorship.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting sponsorship:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createSponsorship,
  getSponsorships,
  updateSponsorship,
  deleteSponsorship
};
