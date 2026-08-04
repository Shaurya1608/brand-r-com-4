const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Middleware
app.use(helmet()); // Security headers
// Build allowed origins: always include localhost for dev + production URLs from .env
const allowedOrigins = [
  'http://localhost:3000',           // frontend dev
  'http://localhost:3001',           // admin dev
  process.env.FRONTEND_URL,          // frontend production
  process.env.ADMIN_URL,             // admin production
].filter(Boolean);                   // remove undefined/empty values

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // Allow cookies to be sent cross-origin
}));
app.use(cookieParser()); // Parse cookies — required for JWT cookie auth

// ── Raw body for Razorpay webhook (MUST be before express.json()) ──
// Razorpay signature verification requires the exact raw request body as a Buffer.
// We apply express.raw() only to the webhook path; all other routes use express.json().
app.use('/api/webhooks/razorpay', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '50mb' })); // Parse JSON bodies (all other routes)
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Parse URL-encoded bodies
app.use(morgan('dev')); // Request logging

const path = require('path');
// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
// API Routes
app.use('/api', routes);

// Base route for health check
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the API' });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware (should be the last middleware)
app.use(errorHandler);

module.exports = app;
