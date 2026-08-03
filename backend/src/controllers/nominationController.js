const AwardNomination = require('../models/AwardNomination');

// Create a new nomination
exports.createNomination = async (req, res) => {
  try {
    const {
      applicantType,
      awardCategory,
      fullName,
      designation,
      organization,
      email,
      mobileNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
    } = req.body;

    console.log("Req.file is:", req.file);
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Document file is required (SVG or PNG)' });
    }

    const documentUrl = req.file.path;

    const newNomination = new AwardNomination({
      applicantType,
      awardCategory,
      fullName,
      designation,
      organization,
      email,
      mobileNumber,
      website,
      city,
      state,
      country,
      pinCode,
      address,
      documentUrl,
    });

    const savedNomination = await newNomination.save();

    res.status(201).json({
      success: true,
      message: 'Nomination submitted successfully!',
      data: savedNomination,
    });
  } catch (error) {
    console.error('Error creating nomination:', error);
    res.status(500).json({ success: false, message: 'Server Error. Please try again later.' });
  }
};

// Get all nominations (Admin only)
exports.getNominations = async (req, res) => {
  try {
    const nominations = await AwardNomination.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: nominations,
    });
  } catch (error) {
    console.error('Error fetching nominations:', error);
    res.status(500).json({ success: false, message: 'Server Error.' });
  }
};
