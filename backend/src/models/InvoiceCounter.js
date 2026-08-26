const mongoose = require('mongoose');

const invoiceCounterSchema = new mongoose.Schema({
  prefix: {
    type: String,
    required: true,
    unique: true, // e.g., 'SIPLBRCOMM26-DEL', 'SIPLBRCOMM26-AWD'
  },
  sequence: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('InvoiceCounter', invoiceCounterSchema);
