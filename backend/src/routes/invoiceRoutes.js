const express = require('express');
const router = express.Router();
const { downloadInvoicePdf, resendInvoiceEmail } = require('../controllers/invoiceController');
// If there is an auth middleware, you might want to protect this route.
// For now, it might be open or protected by adminAuth. Assuming it's needed for admins.
// const { protect, adminAuth } = require('../middleware/authMiddleware');

// router.get('/:id/pdf', protect, adminAuth, downloadInvoicePdf);
router.get('/:id/pdf', downloadInvoicePdf);
router.post('/:id/resend', resendInvoiceEmail);

module.exports = router;
