const express = require('express');
const router = express.Router();
const { loginAdmin, logoutAdmin } = require('../controllers/authController');
const { authLimiter } = require('../middlewares/rateLimiter');

router.post('/login', authLimiter, loginAdmin);
router.post('/logout', logoutAdmin);

module.exports = router;
