const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

/**
 * Protect middleware — supports two auth strategies:
 *  1. HttpOnly cookie named 'jwt'  (set by the backend on login)
 *  2. Authorization: Bearer <token> header (used by the admin SPA)
 *
 * Cookie is checked first; the header is the fallback.
 */
const protect = async (req, res, next) => {
  let token;

  // 1. Try HttpOnly cookie (set by backend login endpoint)
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2. Fall back to Authorization Bearer header (admin SPA)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');

    if (!req.admin) {
      return res.status(401).json({ message: 'Not authorized, admin not found' });
    }

    next();
  } catch (error) {
    console.error('Auth token error:', error.message);
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
