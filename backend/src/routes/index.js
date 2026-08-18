const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const delegateRoutes = require('./delegateRoutes');
const nominationRoutes = require('./nominationRoutes');
const webhookRoutes = require('./webhookRoutes');
const sponsorshipRoutes = require('./sponsorshipRoutes');
const speakerRoutes = require('./speakerRoutes');
const coffeeTableRoutes = require('./coffeeTableRoutes');

router.use('/auth', authRoutes);
router.use('/delegates', delegateRoutes);
router.use('/nominations', nominationRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/sponsorships', sponsorshipRoutes);
router.use('/speakers', speakerRoutes);
router.use('/coffee-table', coffeeTableRoutes);
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

module.exports = router;
