const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  sponsorshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sponsorship',
    required: true,
  },
  sponsorName: {
    type: String,
    required: true,
  },
  maxUses: {
    type: Number,
    required: true,
    min: 1,
  },
  usedCount: {
    type: Number,
    default: 0,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, {
  timestamps: true 
});

couponSchema.index({ sponsorshipId: 1 });

module.exports = mongoose.model('Coupon', couponSchema);
