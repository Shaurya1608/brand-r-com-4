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
    res.setHeader('Content-Disposition', `attachment; filename=Tax_Invoice_${invoice.buyerName ? invoice.buyerName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') : 'Invoice'}.pdf`);
    res.send(pdfBuffer);

  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ success: false, message: 'Server error generating PDF' });
  }
};

const { Resend } = require('resend');

const resendInvoiceEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice not found' });

    let transactionDoc;
    if (invoice.invoiceType === 'Delegate' && invoice.registrationId) {
      transactionDoc = await DelegateRegistration.findById(invoice.registrationId);
    } else if (invoice.invoiceType === 'Award' && invoice.awardNominationId) {
      transactionDoc = await AwardNomination.findById(invoice.awardNominationId);
    }

    if (!transactionDoc) return res.status(404).json({ success: false, message: 'Associated registration not found' });

    const pdfBuffer = await generateInvoicePdf(invoice, transactionDoc);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'registration@events.brandrcomm.com';

    const htmlContent = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #15803d;">Your Invoice for BRAND R.Comm 2026</h2>
        <p>Dear ${transactionDoc.fullName || 'Valued Participant'},</p>
        <p>As requested, please find attached the tax invoice for your registration.</p>
        <p>Registration ID: <strong>#${transactionDoc._id.toString().slice(-8).toUpperCase()}</strong></p>
        <br/>
        <p>Thank you,</p>
        <p>Snail Integral Team</p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: [transactionDoc.email],
      subject: `Tax Invoice: BRAND R.Comm 2026 (${invoice.invoiceNumber})`,
      html: htmlContent,
      attachments: [
        {
          filename: `Tax_Invoice_${invoice.buyerName ? invoice.buyerName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_') : 'Invoice'}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    if (emailResponse.error) {
      console.error('Error sending invoice email:', emailResponse.error);
      return res.status(500).json({ success: false, message: 'Failed to send invoice email' });
    }

    return res.status(200).json({ success: true, message: 'Invoice sent successfully' });

  } catch (error) {
    console.error('Error resending invoice:', error);
    res.status(500).json({ success: false, message: 'Server error resending invoice' });
  }
};

module.exports = {
  downloadInvoicePdf,
  resendInvoiceEmail
};
