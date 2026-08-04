const mongoose = require('mongoose');

const delegateRegistrationSchema = new mongoose.Schema({
  delegateType: {
    type: String,
    enum: ['indian', 'foreign'],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  designation: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    trim: true,
  },
  organization: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  stateCountry: {
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
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending',
  },
  registrationType: {
    type: String,
    enum: ['Online', 'On-Spot', 'Group'],
    default: 'Online'
  },
  paymentMethod: {
    type: String,
    default: 'Online'
  },
  attendeeCategory: {
    type: String,
    enum: ['DELEGATE', 'SPEAKER', 'ORGANIZER', 'SPONSOR', 'MEDIA', 'AWARDEE', 'AWARD_NOMINEE'],
    default: 'DELEGATE'
  },
  // Razorpay payment tracking
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  amountPaid: {
    type: Number, // in INR (rupees)
  },
  couponCode: {
    type: String,
  },
  isManuallyCreated: {
    type: Boolean,
    default: false,
  },
  emailSent: {
    type: Boolean,
    default: false,
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
delegateRegistrationSchema.index({ email: 1 });
delegateRegistrationSchema.index({ razorpayOrderId: 1 });
delegateRegistrationSchema.index({ paymentStatus: 1 });
delegateRegistrationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DelegateRegistration', delegateRegistrationSchema);
