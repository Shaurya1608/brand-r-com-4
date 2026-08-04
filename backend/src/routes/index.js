const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const delegateRoutes = require('./delegateRoutes');
const nominationRoutes = require('./nominationRoutes');
const webhookRoutes = require('./webhookRoutes');
const sponsorshipRoutes = require('./sponsorshipRoutes');
const speakerInterestRoutes = require('./speakerInterestRoutes');

router.use('/auth', authRoutes);
router.use('/delegates', delegateRoutes);
router.use('/nominations', nominationRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/sponsorships', sponsorshipRoutes);
router.use('/speaker-interests', speakerInterestRoutes);

module.exports = router;
