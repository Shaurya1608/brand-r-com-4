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
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    process.env.ADMIN_URL    || 'http://localhost:3001',
  ],
  credentials: true, // Allow cookies to be sent cross-origin
}));
app.use(cookieParser()); // Parse cookies — required for JWT cookie auth
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
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
