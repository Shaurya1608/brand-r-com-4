const Sponsorship = require('../models/Sponsorship');
const DelegateRegistration = require('../models/DelegateRegistration');

// @desc    Create a new sponsorship booking
// @route   POST /api/sponsorships/create
// @access  Public
const createSponsorship = async (req, res) => {
  try {
    const { 
      companyName, gstNumber, contactPerson, designation, email, 
      mobileNumber, city, stateCountry, pinCode, 
      address, sponsorshipCategory, sponsorshipTier, registrationType, registeredBy, basePrice, totalAmount, logoUrl
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
      registeredBy: registeredBy || '',
      basePrice: basePrice || 0,
      totalAmount: totalAmount || 0,
      logoUrl,
      status: 'completed'
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
    const sponsorshipIds = sponsorships.map(s => s._id);

    // Count delegates linked to each sponsorship
    const delegateCounts = await DelegateRegistration.aggregate([
      { $match: { sponsorshipId: { $in: sponsorshipIds } } },
      { $group: { _id: "$sponsorshipId", count: { $sum: 1 } } }
    ]);

    const countMap = {};
    delegateCounts.forEach(c => {
      countMap[c._id.toString()] = c.count;
    });

    const dataWithCounts = sponsorships.map(s => {
      const doc = s.toObject();
      doc.delegatesCount = countMap[s._id.toString()] || 0;
      return doc;
    });

    res.status(200).json({
      success: true,
      data: dataWithCounts
    });
  } catch (error) {
    console.error('Error fetching sponsorships:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get delegates linked to a sponsorship
// @route   GET /api/sponsorships/:id/delegates
// @access  Private (Admin)
const getSponsorshipDelegates = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findById(req.params.id);
    if (!sponsorship) {
      return res.status(404).json({ success: false, message: 'Sponsorship not found' });
    }

    const delegates = await DelegateRegistration.find({
      $or: [
        { sponsorshipId: sponsorship._id },
        { sponsorshipCompany: { $regex: new RegExp('^' + sponsorship.companyName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') } },
        { organization: { $regex: new RegExp('^' + sponsorship.companyName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i') }, attendeeCategory: 'SPONSOR' }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: delegates.length,
      data: delegates
    });
  } catch (error) {
    console.error('Error fetching sponsorship delegates:', error);
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
  getSponsorshipDelegates,
  updateSponsorship,
  deleteSponsorship
};
