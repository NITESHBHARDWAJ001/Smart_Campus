const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for admin token (hardcoded)
  if (req.headers.authorization === 'Bearer admin-token') {
    req.user = { id: 'admin', role: 'admin' };
    return next();
  }

  // Check for regular token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user.role) {
      return res.status(403).json({ success: false, message: 'User role not defined' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `User role (${req.user.role}) is not authorized to access this route` });
    }
    next();
  };
};