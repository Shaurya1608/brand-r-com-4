const mongoose = require('mongoose');

const speakerInterestSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  organization: { type: String, required: true },
  city: { type: String, required: true },
  stateCountry: { type: String, required: true },
  pinCode: { type: String, required: true },
  address: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'contacted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('SpeakerInterest', speakerInterestSchema);
