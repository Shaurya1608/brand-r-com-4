const Invoice = require('../models/Invoice');
const InvoiceCounter = require('../models/InvoiceCounter');

/**
 * Validates the GSTIN format
 * @param {string} gstin 
 * @returns {boolean}
 */
const isValidGSTIN = (gstin) => {
  if (!gstin) return false;
  // Standard Indian GSTIN Regex
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
  return gstinRegex.test(gstin.trim());
};

/**
 * Calculates CGST, SGST, IGST based on supplier and buyer state
 */
const calculateTax = (buyerGSTIN, taxableAmount) => {
  const supplierStateCode = process.env.SUPPLIER_GST_STATE_CODE || '36'; // Default to Telangana
  const buyerStateCode = buyerGSTIN.substring(0, 2);
  
  let cgst = 0, sgst = 0, igst = 0;
  
  if (supplierStateCode === buyerStateCode) {
    // Same state: 9% CGST, 9% SGST
    cgst = Math.round(taxableAmount * 0.09 * 100) / 100;
    sgst = Math.round(taxableAmount * 0.09 * 100) / 100;
  } else {
    // Inter-state: 18% IGST
    igst = Math.round(taxableAmount * 0.18 * 100) / 100;
  }
  
  return { cgst, sgst, igst };
};

/**
 * Generates an invoice if conditions are met. Returns { invoice, pdfBuffer } or { error/skip reason }
 */
const processInvoiceGeneration = async (transactionDoc, type) => {
  try {
    // 1. Check if invoice is required
    const isPaid = transactionDoc.paymentStatus === 'Paid';
    const hasGSTIN = isValidGSTIN(transactionDoc.gstNumber);
    const isFree = (transactionDoc.amountPaid || transactionDoc.totalAmount) <= 0;
    
    if (!isPaid) return { skipped: true, reason: 'Payment not successful' };
    if (isFree) return { skipped: true, reason: 'Free registration, no invoice required' };
    if (!hasGSTIN) return { skipped: true, reason: 'No valid GSTIN provided' };

    // 2. Idempotency Check: Check if an invoice was already generated for this payment
    if (!transactionDoc.razorpayPaymentId) {
      return { skipped: true, reason: 'No payment ID found' };
    }
    const existingInvoice = await Invoice.findOne({ paymentId: transactionDoc.razorpayPaymentId });
    if (existingInvoice) {
      console.log(`Invoice already exists for payment ${transactionDoc.razorpayPaymentId}`);
      return { skipped: true, reason: 'Invoice already generated (idempotent)' };
    }

    if (transactionDoc.invoiceId) {
       return { skipped: true, reason: 'Transaction already has invoiceId' };
    }

    // 3. Atomically get and increment the sequence number
    const prefix = type === 'Delegate' ? 'SIPLBRCOMM26-DEL' : 'SIPLBRCOMM26-AWD';
    const counter = await InvoiceCounter.findOneAndUpdate(
      { prefix },
      { $inc: { sequence: 1 } },
      { new: true, upsert: true }
    );
    
    const seqStr = counter.sequence.toString().padStart(3, '0');
    const invoiceNumber = `${prefix}-${seqStr}`;

    // 4. Calculate Taxes
    const totalAmount = transactionDoc.amountPaid || transactionDoc.totalAmount;
    // Assuming the total amount INCLUDES 18% GST (backward calculation)
    const taxableAmount = Math.round((totalAmount / 1.18) * 100) / 100;
    const { cgst, sgst, igst } = calculateTax(transactionDoc.gstNumber, taxableAmount);

    let description = type === 'Delegate' 
      ? `Invoice Towards "Delegate Registration" at BRAND R.Comm 2026` 
      : `Invoice Towards "Award Nomination" at BRAND R.Comm 2026`;

    // 5. Create Invoice Record
    const invoice = new Invoice({
      invoiceNumber,
      invoiceType: type,
      registrationId: type === 'Delegate' ? transactionDoc._id : null,
      awardNominationId: type === 'Award' ? transactionDoc._id : null,
      paymentId: transactionDoc.razorpayPaymentId,
      buyerName: transactionDoc.organization || transactionDoc.fullName, // B2B invoice usually to Org
      buyerEmail: transactionDoc.email,
      buyerAddress: transactionDoc.address || `${transactionDoc.city}, ${transactionDoc.stateCountry || transactionDoc.state}`,
      buyerGSTIN: transactionDoc.gstNumber.trim().toUpperCase(),
      description,
      taxableAmount,
      cgst,
      sgst,
      igst,
      totalAmount,
    });

    await invoice.save();

    // 6. Update the transaction document
    transactionDoc.invoiceId = invoice._id;
    await transactionDoc.save();

    // 7. Generate PDF Buffer
    const { generateInvoicePdf } = require('../utils/generateInvoicePdf');
    const pdfBuffer = await generateInvoicePdf(invoice, transactionDoc);

    return { success: true, invoice, pdfBuffer };

  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error
      console.warn('Duplicate invoice creation attempted and caught by unique index.');
      return { skipped: true, reason: 'Duplicate invoice prevented by DB constraint' };
    }
    console.error('Error generating invoice:', error);
    return { skipped: true, reason: 'Error generating invoice', error: error.message };
  }
};

module.exports = {
  processInvoiceGeneration,
  isValidGSTIN
};
