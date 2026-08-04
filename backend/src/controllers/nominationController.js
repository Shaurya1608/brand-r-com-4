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
      briefSummary,
    } = req.body;

    console.log("Req.files is:", req.files);
    
    // Check for profile document
    if (!req.files || !req.files['profileDocument'] || req.files['profileDocument'].length === 0) {
      return res.status(400).json({ success: false, message: 'Profile document is required (PDF, PPT, or DOC)' });
    }
    const profileDocumentUrl = req.files['profileDocument'][0].path;

    // Check for summary document if text summary isn't provided
    let summaryDocumentUrl = null;
    if (!briefSummary || briefSummary.trim() === '') {
      if (!req.files || !req.files['summaryDocument'] || req.files['summaryDocument'].length === 0) {
        return res.status(400).json({ success: false, message: 'Either a brief summary or a summary document is required' });
      }
      summaryDocumentUrl = req.files['summaryDocument'][0].path;
    }

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
      briefSummary,
      summaryDocumentUrl,
      profileDocumentUrl,
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
