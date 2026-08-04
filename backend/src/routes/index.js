const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const delegateRoutes = require('./delegateRoutes');
const nominationRoutes = require('./nominationRoutes');
const webhookRoutes = require('./webhookRoutes');

router.use('/auth', authRoutes);
router.use('/delegates', delegateRoutes);
router.use('/nominations', nominationRoutes);
router.use('/webhooks', webhookRoutes);

module.exports = router;
