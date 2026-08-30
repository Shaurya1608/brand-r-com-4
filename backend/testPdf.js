const fs = require('fs');
const path = require('path');
const { generateInvoicePdf } = require('./src/utils/generateInvoicePdf');

const testInvoice = {
  buyerName: 'John Doe',
  buyerAddress: '123 Test Street, Test City, 123456',
  buyerGSTIN: '27ABCDE1234F1Z5',
  invoiceNumber: 'INV-2026-001',
  invoiceDate: new Date().toISOString(),
  description: 'Test Delegate Registration for BRAND R.Comm 2026',
  hsnCode: '998596',
  taxableAmount: 10000,
  cgst: 900,
  sgst: 900,
  igst: 0,
  totalAmount: 11800,
};

const testTransactionDoc = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  _id: '5f9b3b3b3b3b3b3b3b3b3b3b' // 24 char hex
};

async function createTestPdf() {
  try {
    console.log('Generating test PDF...');
    const pdfBuffer = await generateInvoicePdf(testInvoice, testTransactionDoc);
    
    const outputPath = path.join(__dirname, 'test-invoice.pdf');
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`Successfully generated PDF at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
}

createTestPdf();
