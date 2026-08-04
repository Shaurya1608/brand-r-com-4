const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const delegateRoutes = require('./delegateRoutes');
const nominationRoutes = require('./nominationRoutes');
const webhookRoutes = require('./webhookRoutes');
const sponsorshipRoutes = require('./sponsorshipRoutes');

router.use('/auth', authRoutes);
router.use('/delegates', delegateRoutes);
router.use('/nominations', nominationRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/sponsorships', sponsorshipRoutes);

module.exports = router;
