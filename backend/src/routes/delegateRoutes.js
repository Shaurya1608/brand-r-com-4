const express = require('express');
const router = express.Router();
const { registerDelegate, getDelegates, updateDelegate, createOrder, verifyPayment, verifyDelegate, bulkUpdateDelegates, lookupDelegate } = require('../controllers/delegateController');
const { protect } = require('../middlewares/authMiddleware');
const { registrationLimiter, orderLimiter } = require('../middlewares/rateLimiter');
const { validateDelegateInput } = require('../middlewares/inputValidator');

// Public: register
// Protected: get all
router.route('/')
  .post(registrationLimiter, validateDelegateInput, registerDelegate)
  .get(protect, getDelegates);

// Public: Lookup existing registration by email/mobile/regID
router.get('/lookup', lookupDelegate);

// ── Payment routes (must be BEFORE /:id to avoid Express matching them as IDs)
router.post('/create-order', orderLimiter, createOrder);
router.post('/verify-payment', verifyPayment);

// Public: verify a delegate via QR scan
router.get('/verify/:id', verifyDelegate);

// Protected: bulk update delegates
router.put('/bulk-update', protect, bulkUpdateDelegates);

// Protected: update a delegate (status, payment, etc.)
router.route('/:id')
  .put(protect, updateDelegate);

module.exports = router;

