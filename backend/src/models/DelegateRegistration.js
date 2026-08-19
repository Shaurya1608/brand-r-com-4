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
  gstNumber: {
    type: String,
    trim: true,
    default: '',
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
    enum: ['Pending', 'Paid', 'Failed', 'Invitee'],
    default: 'Pending',
  },
  registrationType: {
    type: String,
    enum: ['Online', 'On-Spot', 'Group', 'Manual'],
    default: 'Online'
  },
  paymentMethod: {
    type: String,
    default: 'Online'
  },
  registeredBy: {
    type: String,
    default: '',
  },
  attendeeCategory: {
    type: String,
    enum: ['DELEGATE', 'SPEAKER', 'ORGANIZER', 'SPONSOR', 'MEDIA', 'AWARDEE', 'AWARD_NOMINEE', 'AWARD NOMINEE'],
    default: 'DELEGATE'
  },
  // Financial & Accounting tracking
  totalAmount: {
    type: Number,
    default: 0,
  },
  amountPaid: {
    type: Number, // in INR or USD
    default: 0,
  },
  amountDue: {
    type: Number,
    default: 0,
  },

  // Secure SHA-256 hashed payment token for resume payment links in email
  resumeTokenHash: {
    type: String,
    sparse: true,
  },
  paymentTokenExpires: {
    type: Date,
  },

  // Razorpay payment tracking
  razorpayOrderId: {
    type: String,
  },
  razorpayPaymentId: {
    type: String,
  },
  couponCode: {
    type: String,
  },
  sponsorshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsorship',
    default: null,
  },
  sponsorshipCompany: {
    type: String,
    default: '',
  },
  awardNominationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AwardNomination',
    default: null,
  },
  awardNominationName: {
    type: String,
    default: '',
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
