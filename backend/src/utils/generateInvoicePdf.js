const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { toWords } = require('number-to-words');

const generateInvoicePdf = (invoice, transactionDoc) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 0, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // ---- Colors & Config ----
      const colorDark = '#1a1a1a';
      doc.fillColor(colorDark);
      doc.lineWidth(1);
      
      const x0 = 40;
      const x1 = 80;
      const x2 = 300;
      const x3 = 370;
      const x4 = 440;
      const x5 = 555;
      
      const drawLine = (start_x, start_y, end_x, end_y) => {
        doc.moveTo(start_x, start_y).lineTo(end_x, end_y).stroke();
      };

      let currentY = 40;

      // ---- Outer Top Box: TAX INVOICE ----
      doc.rect(x0, currentY, 515, 25).stroke();
      doc.font('Helvetica-Bold').fontSize(16).text('TAX INVOICE', x0, currentY + 5, { width: 515, align: 'center' });
      currentY += 25;

      // ---- Buyer & Supplier Row ----
      const buyerSupplierTop = currentY;
      
      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Buyer:', x0 + 5, currentY + 5);
      doc.text(invoice.buyerName, x0 + 5, currentY + 18);
      
      let h1 = doc.heightOfString(invoice.buyerAddress || ' ', { width: 240 }) + 5;
      if (invoice.buyerAddress) {
        doc.font('Helvetica').text(invoice.buyerAddress, x0 + 5, currentY + 31, { width: 240 });
      }
      doc.font('Helvetica-Bold').text(`GSTIN:  ${invoice.buyerGSTIN}`, x0 + 5, currentY + 31 + h1);

      doc.font('Helvetica').text(`Invoice No. ${invoice.invoiceNumber}`, x2 + 5, currentY + 5);
      doc.text(`Invoice Date. ${new Date(invoice.invoiceDate).toLocaleDateString('en-IN')}`, x2 + 5, currentY + 18);
      doc.text(`Mode of Dispatch: N/A`, x2 + 5, currentY + 31);

      const buyerSupplierHeight = Math.max(31 + h1 + 15, 70);
      doc.rect(x0, buyerSupplierTop, 515, buyerSupplierHeight).stroke();
      drawLine(x2, buyerSupplierTop, x2, buyerSupplierTop + buyerSupplierHeight);
      
      currentY += buyerSupplierHeight;

      // ---- Table Header ----
      const headerTop = currentY;
      doc.rect(x0, headerTop, 515, 20).stroke();

      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('S. No', x0, headerTop + 5, { width: x1 - x0, align: 'center' });
      doc.text('Description of Services', x1, headerTop + 5, { width: x2 - x1, align: 'center' });
      doc.text('HSN Code', x2, headerTop + 5, { width: x3 - x2, align: 'center' });
      doc.text('RATE', x3, headerTop + 5, { width: x4 - x3, align: 'center' });
      doc.text('Amount (INR)', x4, headerTop + 5, { width: x5 - x4, align: 'center' });

      drawLine(x1, headerTop, x1, headerTop + 20);
      drawLine(x2, headerTop, x2, headerTop + 20);
      drawLine(x3, headerTop, x3, headerTop + 20);
      drawLine(x4, headerTop, x4, headerTop + 20);

      currentY += 20;

      // ---- Table Content ----
      const contentTop = currentY;
      const contentHeight = 150; 
      doc.rect(x0, contentTop, 515, contentHeight).stroke();

      drawLine(x1, contentTop, x1, contentTop + contentHeight);
      drawLine(x2, contentTop, x2, contentTop + contentHeight);
      drawLine(x3, contentTop, x3, contentTop + contentHeight);
      drawLine(x4, contentTop, x4, contentTop + contentHeight);

      doc.font('Helvetica').fontSize(10);
      const textY = contentTop + 40;
      doc.text('1', x0, textY, { width: x1 - x0, align: 'center' });
      
      const invoiceDesc = invoice.description || 'Invoice Towards "Delegate Registration" at BRAND R.Comm 2026';
      doc.text(invoiceDesc, x1 + 10, textY, { width: x2 - x1 - 20, align: 'center' });
      
      doc.text(invoice.hsnCode || '998596', x2, textY, { width: x3 - x2, align: 'center' });
      doc.text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), x3, textY, { width: x4 - x3, align: 'center' });
      doc.text(invoice.taxableAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 }), x4, textY, { width: x5 - x4 - 5, align: 'right' });

      currentY += contentHeight;

      // ---- Totals Area ----
      const formatAmount = (amt) => (amt && amt > 0) ? amt.toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '-';

      // Gross Total Row
      doc.rect(x0, currentY, 515, 20).stroke();
      drawLine(x4, currentY, x4, currentY + 20); 
      drawLine(x3, currentY, x3, currentY + 20); 

      doc.font('Helvetica-Bold').fontSize(10);
      doc.text('Gross Total', x3, currentY + 5, { width: x4 - x3, align: 'center' });
      doc.text(formatAmount(invoice.taxableAmount), x4, currentY + 5, { width: x5 - x4 - 5, align: 'right' });

      currentY += 20;

      // The rest of the totals block (Net, CGST, SGST, IGST, Grand)
      doc.rect(x0, currentY, 515, 100).stroke();

      // Amount in Words
      let words = toWords(Math.round(invoice.totalAmount));
      words = words.charAt(0).toUpperCase() + words.slice(1);
      doc.font('Helvetica-Bold').text('Amount In Words: ', x0 + 5, currentY + 5, { continued: true }).text(`Rupees ${words} Only.`);

      // Horizontal separators for the right side
      for (let i = 1; i < 5; i++) {
        drawLine(x3, currentY + i * 20, x5, currentY + i * 20);
      }

      // Vertical lines for the right side
      drawLine(x3, currentY, x3, currentY + 100);
      drawLine(x4, currentY, x4, currentY + 100);

      // Inner vertical line for 'Add:' split (rows 1, 2, 3 only)
      const xAddSplit = x3 + 30;
      drawLine(xAddSplit, currentY + 20, xAddSplit, currentY + 80);

      // Row 0: Net Total
      doc.font('Helvetica-Bold').text('Net Total', x3, currentY + 5, { width: x4 - x3, align: 'center' });
      doc.text(formatAmount(invoice.taxableAmount), x4, currentY + 5, { width: x5 - x4 - 5, align: 'right' });

      // Row 1: CGST
      doc.font('Helvetica-Bold').text('Add:', x3, currentY + 25, { width: 30, align: 'center' });
      doc.text('CGST @9%', xAddSplit + 2, currentY + 25);
      doc.text(formatAmount(invoice.cgst), x4, currentY + 25, { width: x5 - x4 - 5, align: 'right' });

      // Row 2: SGST
      doc.font('Helvetica-Bold').text('Add:', x3, currentY + 45, { width: 30, align: 'center' });
      doc.text('SGST @9%', xAddSplit + 2, currentY + 45);
      doc.text(formatAmount(invoice.sgst), x4, currentY + 45, { width: x5 - x4 - 5, align: 'right' });

      // Row 3: IGST
      doc.font('Helvetica-Bold').text('Add:', x3, currentY + 65, { width: 30, align: 'center' });
      doc.text('IGST @18%', xAddSplit + 2, currentY + 65);
      doc.text(formatAmount(invoice.igst), x4, currentY + 65, { width: x5 - x4 - 5, align: 'right' });

      // Row 4: Grand Total
      doc.font('Helvetica-Bold').text('Grand Total', x3, currentY + 85, { width: x4 - x3, align: 'center' });
      doc.text(formatAmount(invoice.totalAmount), x4, currentY + 85, { width: x5 - x4 - 5, align: 'right' });

      currentY += 100;

      // ---- Footer Block (E. & O.E, Notes, Sign) ----
      const footerHeight = 120;
      doc.rect(x0, currentY, 515, footerHeight).stroke();

      doc.font('Helvetica-Bold').text('E. & O.E.', x0 + 5, currentY + 5);

      // Notes
      doc.font('Helvetica-Bold').fontSize(9).text('Notes:', x0 + 5, currentY + 45);
      doc.font('Helvetica').text('All Cheque to be drawn in favour of SNAIL INTEGRAL PVT LTD.', x0 + 5, currentY + 57);
      doc.text('Type of Account - Current Account, Account No.- 059361900001430', x0 + 5, currentY + 69);
      doc.text('IFSC CODE- YESB0000593', x0 + 5, currentY + 81);
      doc.font('Helvetica-Bold').text('Bank & Branch - Yes Bank Ltd, Noida, Sector- 132', x0 + 5, currentY + 93);
      doc.font('Helvetica').text('The ordered services shall be dispatched only after receipt of advance payment in full.', x0 + 5, currentY + 105);

      doc.font('Helvetica').text('(AUTHORIZED SIGNATORY)', x3, currentY + 105, { width: x5 - x3, align: 'center' });

      // ---- Bottom Green Footer ----
      doc.rect(0, 800, 595.28, 41.89).fillColor('#a3e635').fill();
      doc.fillColor('#14532d').font('Helvetica-Bold').fontSize(12).text('Snail Integral Private Limited', 0, 814, { width: 595.28, align: 'center' });

      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoicePdf
};
