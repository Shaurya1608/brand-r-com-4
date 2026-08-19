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
  gstNumber: {
    type: String,
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
  supportingDocumentUrl: {
    type: String,
  },
  registeredBy: {
    type: String,
    trim: true,
    default: ''
  },
  applicationFilledBy: {
    type: String,
    enum: ['Self', 'Office Barrier'],
    default: 'Self',
  },
  fillerName: {
    type: String,
    trim: true,
  },
  fillerDesignation: {
    type: String,
    trim: true,
  },
  fillerContactNo: {
    type: String,
    trim: true,
  },
  fillerEmail: {
    type: String,
    trim: true,
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
  registrationType: {
    type: String,
    default: 'Online Registration'
  },
  status: {
    type: String,
    enum: ['STATUS', 'UNDER REVIEW', 'WINNER', 'REJECTED', 'pending', 'approved', 'rejected'],
    default: 'UNDER REVIEW',
  },
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  amountPaid: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 9440,
  },
  amountDue: {
    type: Number,
    default: 9440,
  },
  resumeTokenHash: {
    type: String,
    default: null,
    index: true,
  },
  paymentTokenExpires: {
    type: Date,
    default: null,
  },
  initialEmailSent: {
    type: Boolean,
    default: false,
  },
  paidEmailSent: {
    type: Boolean,
    default: false,
  },
  failedEmailSent: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true 
});

// Database performance indexes for scaling to 50k+ records
awardNominationSchema.index({ email: 1 });
awardNominationSchema.index({ razorpayOrderId: 1 });
awardNominationSchema.index({ paymentStatus: 1 });
awardNominationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AwardNomination', awardNominationSchema);
