const fs = require('fs');
const path = require('path');
const { generateInvoicePdf } = require('./src/utils/generateInvoicePdf');

async function runTest() {
  const invoice = {
    invoiceNumber: 'SIPLBRCOMM26-DEL-001',
    invoiceDate: new Date(),
    buyerName: 'TALENTELLA',
    buyerAddress: 'ratu roadd',
    buyerGSTIN: '27AADCB2230M1Z4',
    description: 'Invoice Towards "Delegate Registration" at BRAND R.Comm 2026',
    hsnCode: '998596',
    taxableAmount: 4800.00,
    cgst: 0,
    sgst: 0,
    igst: 864.00,
    totalAmount: 5664.00
  };

  try {
    // Generate the PDF
    const pdfBuffer = await generateInvoicePdf(invoice, {});
    
    // Save to disk
    const outputPath = path.join(__dirname, 'test_invoice_5.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`✅ Success! Invoice saved to: ${outputPath}`);
  } catch (err) {
    console.error('❌ Error generating invoice:', err);
  }
}

runTest();
