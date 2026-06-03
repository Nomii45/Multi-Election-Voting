const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to protect routes and verify token
const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header (Format: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token
      token = req.headers.authorization.split(' ')[1];

      // Decode the token using the secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB without returning their password hash
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found, unauthorized' });
      }

      next();
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

// Middleware to restrict access to Admins only
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required' });
  }
};

module.exports = {
  protect,
  admin
};
