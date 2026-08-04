const mongoose = require('mongoose');

const awardNominationSchema = new mongoose.Schema({
  applicantType: {
    type: String,
    enum: ['Individual', 'Organization'],
    required: true,
  },
  awardCategory: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  state: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  pinCode: {
    type: String,
    required: true,
    trim: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  briefSummary: {
    type: String,
    trim: true,
  },
  summaryDocumentUrl: {
    type: String,
  },
  profileDocumentUrl: {
    type: String,
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    enum: ['Online (Razorpay)', 'Invoice', 'Offline'],
    default: 'Online (Razorpay)'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model('AwardNomination', awardNominationSchema);
