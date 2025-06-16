const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtConfig');

// Protect routes - middleware to verify token and attach user to request
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // DEBUG: Log request path to help with debugging
    console.log(`AUTH CHECK: ${req.method} ${req.path}`);
    
    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token found in request headers');
    } else {
      console.log('No token in request headers');
    }

    // For development environment checks
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log(`Environment: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
    
    // Special handling for development environment
    if (isDevelopment) {
      console.log('Development mode: Bypassing strict auth checks');
      
      // Try to use token if provided
      if (token) {
        try {
          const decoded = verifyToken(token);
          console.log('Development mode: Token verified successfully', decoded);
          
          // Try to find the user but don't fail if not found
          const user = await User.findById(decoded.id).catch(err => null);
          
          if (user) {
            req.user = {
              _id: user._id,
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role || decoded.role || 'student' // Default to role in token or student
            };
            console.log('Development mode: User found from token', req.user.name, req.user.role);
          } else {
            // Use info from decoded token
            req.user = {
              id: decoded.id,
              _id: decoded.id,
              role: decoded.role || 'student',
              name: decoded.name || 'Test User',
              email: decoded.email || 'test@example.com'
            };
            console.log('Development mode: Created user from token payload', req.user.role);
          }
        } catch (tokenError) {
          console.log('Development mode: Invalid token, using default user');
          // Use a default user for development
          req.user = {
            id: '123456789012345678901234',
            _id: '123456789012345678901234',
            role: 'student', // Default to student for most routes
            name: 'Test Student',
            email: 'test@example.com'
          };
        }
      } else {
        // No token provided, use default dev user
        console.log('Development mode: No token, using default user');
        req.user = {
          id: '123456789012345678901234',
          _id: '123456789012345678901234',
          role: 'student',
          name: 'Test Student',
          email: 'test@example.com'
        };
      }
      
      return next();
    }
    
    // PRODUCTION ENVIRONMENT
    
    // No token in production is an error
    if (!token) {
      console.log('Production mode: No token provided');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route - token required'
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    console.log('Production mode: Token verified', decoded);

    // Find user by ID
    const user = await User.findById(decoded.id);
    
    if (!user) {
      console.log('Production mode: User not found with token');
      return res.status(401).json({
        success: false,
        message: 'User not found with this token'
      });
    }
    
    // Set user in request
    req.user = {
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('User authenticated:', {
      _id: req.user._id,
      name: req.user.name, 
      role: req.user.role
    });

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // Special handling for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Auth error - providing default user');
      req.user = {
        id: '123456789012345678901234',
        _id: '123456789012345678901234',
        role: 'student',
        name: 'Test Student',
        email: 'test@example.com'
      };
      return next();
    }
    
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // For development mode
    if (process.env.NODE_ENV === 'development') {
      // If a specific endpoint needs admin access
      if (roles.includes('admin') || req.originalUrl.includes('/api/admin')) {
        console.log('Development mode: Authorizing as admin for admin endpoint');
        req.user = req.user || {};
        req.user.role = 'admin';
        return next();
      }
      
      // For other endpoints, use the role from request if available, otherwise default to student
      console.log(`Development mode: Using ${req.user?.role || 'student'} role for authorization`);
      req.user = req.user || {};
      req.user.role = req.user.role || 'student'; // Default to student if no role
      
      // In development, allow access even if role doesn't match
      return next();
    }
    
    // Production mode - strict role checking
    if (!req.user || !roles.includes(req.user.role)) {
      console.warn(`Authorization failed: User role '${req.user?.role || 'unknown'}' not in allowed roles:`, roles);
      return res.status(403).json({
        success: false,
        message: `User role '${req.user?.role || 'unknown'}' is not authorized to access this route`
      });
    }
    next();
  };
};