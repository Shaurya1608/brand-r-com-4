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

    // Generate PDF on the fly (transactionDoc is optional)
    const pdfBuffer = await generateInvoicePdf(invoice, transactionDoc || {});

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

    const recipientEmail = (transactionDoc.email || invoice.buyerEmail || '').trim().toLowerCase();
    if (!recipientEmail) {
      return res.status(400).json({ success: false, message: 'No valid recipient email address on file' });
    }

    const pdfBuffer = await generateInvoicePdf(invoice, transactionDoc);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';

    const safeBuyerName = (invoice.buyerName || 'Invoice').replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
    const regId = `#${transactionDoc._id.toString().slice(-8).toUpperCase()}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tax Invoice: BRAND R.Comm 2026</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f3; margin: 0; padding: 24px;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #1f391b, #4B7934); padding: 28px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px;">BRAND R.Comm 2026</h1>
              <p style="color: #d1fae5; margin: 6px 0 0; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Official Tax Invoice</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 24px;">
              <p style="font-size: 15px; color: #1e293b; margin: 0 0 16px;">Dear <strong>${transactionDoc.fullName || invoice.buyerName}</strong>,</p>
              <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 20px;">
                As requested, please find attached the official GST-compliant <strong>Tax Invoice</strong> for your <strong>${invoice.invoiceType === 'Award' ? 'Award Nomination' : 'Delegate Registration'}</strong> at BRAND R.Comm 2026.
              </p>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: 600;">Invoice Number:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">${invoice.invoiceNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: 600;">Registration ID:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #4B7934; font-weight: 800; text-align: right; font-family: monospace;">${regId}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: 600;">Buyer / Organization:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-weight: 600; text-align: right;">${invoice.buyerName}</td>
                </tr>
                ${invoice.buyerGSTIN ? `
                <tr>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 12px; color: #64748b; font-weight: 600;">Buyer GSTIN:</td>
                  <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f172a; font-weight: 700; text-align: right; font-family: monospace;">${invoice.buyerGSTIN}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 16px; font-size: 12px; color: #64748b; font-weight: 600;">Total Amount Paid:</td>
                  <td style="padding: 12px 16px; font-size: 14px; color: #15803d; font-weight: 800; text-align: right;">₹${invoice.totalAmount ? invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-'}</td>
                </tr>
              </table>

              <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #065f46;">
                📎 <strong>Attachment:</strong> The complete, signed PDF Tax Invoice (<strong>Tax_Invoice_${safeBuyerName}.pdf</strong>) is attached to this email for your records and tax filing.
              </div>

              <p style="font-size: 13px; color: #64748b; line-height: 1.5; margin: 0;">
                If you have any questions or require further assistance, please contact us at <a href="mailto:info@brandrcomm.com" style="color: #4B7934; text-decoration: underline;">info@brandrcomm.com</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 11px; color: #94a3b8;">
              © 2026 BRAND R.Comm — Snail Integral. All rights reserved.
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: senderEmail,
      to: [recipientEmail],
      subject: `Tax Invoice: BRAND R.Comm 2026 (${invoice.invoiceNumber})`,
      html: htmlContent,
      attachments: [
        {
          filename: `Tax_Invoice_${safeBuyerName}.pdf`,
          content: pdfBuffer,
        }
      ]
    });

    if (emailResponse.error) {
      console.error('Error sending invoice email via Resend:', emailResponse.error);
      let errorMsg = emailResponse.error.message || 'Failed to send invoice email';
      if (emailResponse.error.name === 'validation_error' && errorMsg.includes('testing emails')) {
        errorMsg = 'Resend Test Restriction: Free tier can only send to account owner (shaurya098n@gmail.com). To send to all emails, verify your domain at resend.com/domains';
      }
      return res.status(500).json({ success: false, message: errorMsg });
    }

    console.log(`✉️ Tax Invoice (${invoice.invoiceNumber}) resent successfully to ${recipientEmail}`);
    return res.status(200).json({ success: true, message: `Invoice sent successfully to ${recipientEmail}` });

  } catch (error) {
    console.error('Error resending invoice:', error);
    res.status(500).json({ success: false, message: 'Server error resending invoice', error: error.message });
  }
};


const { processInvoiceGeneration } = require('../services/invoiceService');

const generateManualInvoice = async (req, res) => {
  try {
    const { type, id } = req.params;
    let transactionDoc;
    let invType;
    if (type === 'delegate') {
      transactionDoc = await DelegateRegistration.findById(id);
      invType = 'Delegate';
    } else if (type === 'nomination') {
      transactionDoc = await AwardNomination.findById(id);
      invType = 'Award';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid entity type. Use delegate or nomination.' });
    }

    if (!transactionDoc) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    if (!transactionDoc.gstNumber) {
      return res.status(400).json({ success: false, message: 'No GST number provided for this record.' });
    }

    if (transactionDoc.paymentStatus !== 'Paid') {
      return res.status(400).json({ success: false, message: 'Cannot generate invoice: Payment status is not Paid.' });
    }

    if (!transactionDoc.razorpayPaymentId) {
      transactionDoc.razorpayPaymentId = `MANUAL_${Date.now()}`;
      await transactionDoc.save();
    }

    const result = await processInvoiceGeneration(transactionDoc, invType);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.reason || 'Failed to generate invoice', error: result.error });
    }

    return res.status(200).json({
      success: true,
      message: `Invoice ${result.invoice.invoiceNumber} generated successfully!`,
      invoice: result.invoice
    });
  } catch (error) {
    console.error('Error in generateManualInvoice:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  downloadInvoicePdf,
  resendInvoiceEmail,
  generateManualInvoice
};
