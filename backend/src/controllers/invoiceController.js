const Invoice = require('../models/Invoice');
const DelegateRegistration = require('../models/DelegateRegistration');
const AwardNomination = require('../models/AwardNomination');
const { generateInvoicePdf } = require('../utils/generateInvoicePdf');

const downloadInvoicePdf = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the invoice
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Find the related transaction document
    let transactionDoc;
    if (invoice.invoiceType === 'Delegate' && invoice.registrationId) {
      transactionDoc = await DelegateRegistration.findById(invoice.registrationId);
    } else if (invoice.invoiceType === 'Award' && invoice.awardNominationId) {
      transactionDoc = await AwardNomination.findById(invoice.awardNominationId);
    }

    if (!transactionDoc) {
      return res.status(404).json({ success: false, message: 'Associated registration not found' });
    }

    // Generate PDF on the fly
    const pdfBuffer = await generateInvoicePdf(invoice, transactionDoc);

    // Send PDF response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', \`attachment; filename=\${invoice.invoiceNumber}.pdf\`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: 'Server error generating PDF' });
  }
};

module.exports = {
  downloadInvoicePdf
};
