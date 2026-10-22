const express = require('express');
const router = express.Router();
const { downloadInvoicePdf, resendInvoiceEmail, generateManualInvoice } = require('../controllers/invoiceController');

router.get('/:id/pdf', downloadInvoicePdf);
router.post('/:id/resend', resendInvoiceEmail);
router.post('/generate/:type/:id', generateManualInvoice);

module.exports = router;
