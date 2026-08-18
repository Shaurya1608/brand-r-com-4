const CoffeeTable = require('../models/CoffeeTable');

// @desc    Create a new coffee table enquiry
// @route   POST /api/coffee-table/create
// @access  Public
const createCoffeeTable = async (req, res) => {
  try {
    const { 
      fullName, designation, mobileNumber, email, organization, 
      city, stateCountry, pinCode, address, featureType, pagesRequested
    } = req.body;

    if (!fullName || !designation || !mobileNumber || !organization || !city || !stateCountry || !pinCode || !address || !featureType || !pagesRequested) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const coffeeTableEntry = await CoffeeTable.create({
      fullName,
      designation,
      mobileNumber,
      email: email || '',
      organization,
      city,
      stateCountry,
      pinCode,
      address,
      featureType,
      pagesRequested,
      status: 'pending'
    });

    // No emails are sent for Coffee Table enquiries as per request

    res.status(201).json({
      success: true,
      message: 'Coffee Table enquiry submitted successfully',
      data: coffeeTableEntry
    });
  } catch (error) {
    console.error('Error submitting coffee table enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all coffee table enquiries
// @route   GET /api/coffee-table
// @access  Private (Admin)
const getCoffeeTables = async (req, res) => {
  try {
    const entries = await CoffeeTable.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: entries
    });
  } catch (error) {
    console.error('Error fetching coffee table enquiries:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update coffee table enquiry status
// @route   PUT /api/coffee-table/:id
// @access  Private (Admin)
const updateCoffeeTable = async (req, res) => {
  try {
    const entry = await CoffeeTable.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    );

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Coffee Table enquiry not found' });
    }

    res.status(200).json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error updating coffee table enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete coffee table enquiry
// @route   DELETE /api/coffee-table/:id
// @access  Private (Admin)
const deleteCoffeeTable = async (req, res) => {
  try {
    const entry = await CoffeeTable.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ success: false, message: 'Coffee Table enquiry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Coffee Table enquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting coffee table enquiry:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  createCoffeeTable,
  getCoffeeTables,
  updateCoffeeTable,
  deleteCoffeeTable
};
