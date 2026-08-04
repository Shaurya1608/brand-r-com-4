const express = require('express');
const router = express.Router();
const { registerDelegate, getDelegates, updateDelegate, createOrder, verifyPayment, verifyDelegate, bulkUpdateDelegates } = require('../controllers/delegateController');
const { protect } = require('../middlewares/authMiddleware');

// Public: register
// Protected: get all
router.route('/')
  .post(registerDelegate)
  .get(protect, getDelegates);

// ── Payment routes (must be BEFORE /:id to avoid Express matching them as IDs)
router.post('/create-order', createOrder);
router.post('/verify-payment', verifyPayment);

// Public: verify a delegate via QR scan
router.get('/verify/:id', verifyDelegate);

// Protected: bulk update delegates
router.put('/bulk-update', protect, bulkUpdateDelegates);

// Protected: update a delegate (status, payment, etc.)
router.route('/:id')
  .put(protect, updateDelegate);

module.exports = router;

