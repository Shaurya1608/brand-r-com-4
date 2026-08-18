const mongoose = require('mongoose');

const coffeeTableSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: '',
  },
  organization: {
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
  featureType: {
    type: String,
    enum: ['Individual', 'Company'],
    required: true,
  },
  pagesRequested: {
    type: String,
    enum: ['2', '4', '6', '8'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CoffeeTable', coffeeTableSchema);
