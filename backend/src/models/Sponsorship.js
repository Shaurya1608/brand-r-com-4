const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    default: "",
  },
  contactPerson: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  stateCountry: {
    type: String,
    required: true,
  },
  pinCode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    default: "",
  },
  registrationType: {
    type: String,
    enum: ['Online Registration', 'Manual Registration'],
    default: 'Online Registration',
  },
  sponsorshipTier: {
    type: String,
    default: "",
  },
  sponsorshipCategory: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
    default: ""
  },
  basePrice: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
