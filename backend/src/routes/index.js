const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const delegateRoutes = require('./delegateRoutes');
const nominationRoutes = require('./nominationRoutes');

router.use('/auth', authRoutes);
router.use('/delegates', delegateRoutes);
router.use('/nominations', nominationRoutes);

module.exports = router;
