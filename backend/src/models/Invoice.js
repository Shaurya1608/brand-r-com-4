const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true, // e.g., 'SIPLBRCOMM26-DEL-001'
  },
  invoiceType: {
    type: String,
    enum: ['Delegate', 'Award'],
    required: true,
  },
  registrationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DelegateRegistration',
    default: null,
  },
  awardNominationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AwardNomination',
    default: null,
  },
  paymentId: {
    type: String, // Razorpay Payment ID
    required: true,
  },
  buyerName: {
    type: String,
    required: true,
  },
  buyerEmail: {
    type: String,
    required: true,
  },
  buyerAddress: {
    type: String,
  },
  buyerGSTIN: {
    type: String,
  },
  description: {
    type: String,
    required: true,
  },
  hsnCode: {
    type: String,
    default: '998596',
  },
  taxableAmount: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    default: 0,
  },
  sgst: {
    type: Number,
    default: 0,
  },
  igst: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  invoiceDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Generated', 'Sent', 'Cancelled'],
    default: 'Generated',
  }
}, { timestamps: true });

// Ensure idempotency for webhooks: a specific payment should only ever generate ONE invoice.
invoiceSchema.index({ paymentId: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
