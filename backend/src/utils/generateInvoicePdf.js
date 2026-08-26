const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { toWords } = require('number-to-words');

const generateInvoicePdf = (invoice, transactionDoc) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ---- Colors & Fonts ----
      const colorDark = '#1a1a1a';
      const colorGray = '#555555';
      const colorLightGray = '#e5e7eb';
      const colorBrand = '#4ade80'; // a nice green

      // ---- Add Logo ----
      // We will try a few paths to find a logo
      const logoPaths = [
        path.join(__dirname, '../../../frontend/public/logo/Snail-New-logo-01-scaled.png'),
        path.join(__dirname, '../../../frontend/public/logo/Snail Integral New Logo-09.png'),
      ];
      let logoPathToUse = null;
      for (const lp of logoPaths) {
        if (fs.existsSync(lp)) {
          logoPathToUse = lp;
          break;
        }
      }

      if (logoPathToUse) {
        doc.image(logoPathToUse, 50, 45, { width: 120 });
      }

      // ---- Header "TAX INVOICE" ----
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor(colorDark)
         .text('TAX INVOICE', 50, 50, { align: 'right' });
      
      doc.moveDown();

      const drawLine = (y) => {
        doc.rect(50, y, 500, 1).fillColor(colorLightGray).fill();
        doc.fillColor(colorDark);
      };

      // ---- Supplier Details (Right side, under TAX INVOICE) ----
      const startY = 140;
      doc.fontSize(10).font('Helvetica-Bold').fillColor(colorDark).text('SNAIL INTEGRAL PVT LTD.', 50, startY, { align: 'right' });
      doc.font('Helvetica').text('25, P and T COLONY, LANE OPP LINE TO SBI BANK', { align: 'right' });
      doc.text('TRIMULGHERY, Hyderabad', { align: 'right' });
      doc.text('Telangana, 500015', { align: 'right' });
      doc.font('Helvetica-Bold').text('GSTIN: 36AAACG7442D1ZV', { align: 'right' });

      // ---- Buyer Details (Left side) ----
      doc.font('Helvetica-Bold').text('Buyer:', 50, startY);
      doc.font('Helvetica-Bold').text(invoice.buyerName, 50, startY + 15);
      
      let currentY = startY + 30;
      if (invoice.buyerAddress) {
        doc.font('Helvetica').text(invoice.buyerAddress, 50, currentY, { width: 200 });
        currentY = doc.y;
      }
      doc.font('Helvetica-Bold').text(`GSTIN: ${invoice.buyerGSTIN}`, 50, currentY);

      currentY += 30;

      // ---- Invoice Info Grid ----
      drawLine(currentY);
      currentY += 15;

      doc.fillColor(colorDark).fontSize(10);
      doc.font('Helvetica-Bold').text('Invoice No.: ', 50, currentY, { continued: true }).font('Helvetica').text(invoice.invoiceNumber);
      doc.font('Helvetica-Bold').text('Invoice Date: ', 300, currentY, { continued: true }).font('Helvetica').text(new Date(invoice.invoiceDate).toLocaleDateString('en-IN'));
      
      currentY += 30;
      drawLine(currentY);
      currentY += 20;

      // ---- Table Header ----
      doc.fillColor(colorDark).font('Helvetica-Bold').fontSize(10);
      doc.text('S. No', 50, currentY);
      doc.text('Description of Services', 100, currentY);
      doc.text('HSN Code', 300, currentY);
      doc.text('RATE', 380, currentY);
      doc.text('Amount (INR)', 450, currentY, { width: 100, align: 'right' });
      
      currentY += 15;
      drawLine(currentY);
      currentY += 15;

      // ---- Table Row ----
      doc.fillColor(colorDark).font('Helvetica').fontSize(10);
      doc.text('1', 50, currentY);
      doc.text(invoice.description, 100, currentY, { width: 180 });
      doc.text(invoice.hsnCode, 300, currentY);
      doc.text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 380, currentY);
      doc.text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), 450, currentY, { width: 100, align: 'right' });

      // Move down below description
      currentY = Math.max(doc.y, currentY + 30) + 20;
      drawLine(currentY);
      currentY += 15;

      // ---- Totals Area ----
      const totalX = 350;
      const amountX = 450;
      const rightWidth = 100;

      doc.fillColor(colorDark).font('Helvetica-Bold').text('Gross Total', totalX, currentY);
      doc.font('Helvetica').text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });

      currentY += 20;
      doc.font('Helvetica-Bold').text('Net Total', totalX, currentY);
      doc.font('Helvetica').text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });

      if (invoice.cgst > 0) {
        currentY += 15;
        doc.font('Helvetica').text('Add: CGST @9%', totalX, currentY);
        doc.text(invoice.cgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });
      }
      if (invoice.sgst > 0) {
        currentY += 15;
        doc.font('Helvetica').text('Add: SGST @9%', totalX, currentY);
        doc.text(invoice.sgst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });
      }
      if (invoice.igst > 0) {
        currentY += 15;
        doc.font('Helvetica').text('Add: IGST @18%', totalX, currentY);
        doc.text(invoice.igst.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });
      }

      currentY += 20;
      doc.rect(totalX, currentY - 5, 200, 1).fillColor(colorLightGray).fill();
      doc.fillColor(colorDark).font('Helvetica-Bold').fontSize(12).text('Grand Total', totalX, currentY);
      doc.text(invoice.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), amountX, currentY, { width: rightWidth, align: 'right' });

      // ---- Amount in words ----
      currentY += 40;
      // uppercase first letter and add 'Only.'
      let words = toWords(Math.round(invoice.totalAmount));
      words = words.charAt(0).toUpperCase() + words.slice(1);
      doc.fontSize(10).font('Helvetica-Bold').text('Amount In Words: ', 50, currentY, { continued: true }).font('Helvetica').text(`Rupees ${words} Only.`);

      // ---- Footer & Signatory ----
      currentY += 40;
      doc.font('Helvetica-Bold').text('FOR SNAIL INTEGRAL PVT LTD.', 350, currentY, { width: 200, align: 'right' });
      doc.moveDown(4);
      doc.font('Helvetica').text('(AUTHORIZED SIGNATORY)', 350, doc.y, { width: 200, align: 'right' });
      doc.text('E. & O.E.', 50, doc.y - 15);

      // ---- Notes ----
      currentY = doc.y + 30;
      drawLine(currentY);
      currentY += 15;
      
      doc.font('Helvetica-Bold').text('Notes:', 50, currentY);
      doc.font('Helvetica').fontSize(9);
      doc.text('All Cheque to be drawn in favour of SNAIL INTEGRAL PVT LTD.', 50, currentY + 15);
      doc.text('Type of Account - Current Account, Account No.- 059361900001430', 50, currentY + 30);
      doc.text('IFSC CODE- YESB0000593', 50, currentY + 45);
      doc.text('Bank & Branch - Yes Bank Ltd, Noida, Sector- 132', 50, currentY + 60);
      doc.text('The ordered services shall be dispatched only after receipt of advance payment in full.', 50, currentY + 75);

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePdf
};
