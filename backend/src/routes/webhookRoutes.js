const express = require('express');
const router = express.Router();
const { handleRazorpayWebhook } = require('../controllers/webhookController');

// POST /api/webhooks/razorpay
// Note: raw body parsing is handled in app.js for this specific path
router.post('/razorpay', handleRazorpayWebhook);

module.exports = router;
