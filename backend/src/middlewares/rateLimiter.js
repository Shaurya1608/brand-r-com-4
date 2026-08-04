const rateLimit = require('express-rate-limit');

// Bypass function for safe Phase 8 load testing (when header or ENV is present)
const skipIfLoadTesting = (req) => {
  if (process.env.ENABLE_LOAD_TEST_MODE === 'true') return true;
  const secretHeader = req.headers['x-load-test-secret'];
  if (secretHeader && secretHeader === (process.env.LOAD_TEST_SECRET || 'brandrcomm_loadtest_2026')) {
    return true;
  }
  return false;
};

// General API rate limiter (protects overall server load)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per 15 mins per IP
  skip: skipIfLoadTesting,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

// Auth / Login rate limiter (protects against password brute-force attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 login attempts per 15 mins per IP
  skip: skipIfLoadTesting,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  }
});

// Form Submission / Registration limiter (prevents bot spam registrations)
const registrationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Max 20 submissions per 15 mins per IP
  skip: skipIfLoadTesting,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many form submissions from this IP. Please wait a few minutes before submitting again.'
  }
});

// Payment Order Creation limiter (prevents order creation flooding)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // Max 15 order attempts per 15 mins per IP
  skip: skipIfLoadTesting,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment order attempts. Please wait a few minutes before trying again.'
  }
});

module.exports = {
  apiLimiter,
  authLimiter,
  registrationLimiter,
  orderLimiter
};
