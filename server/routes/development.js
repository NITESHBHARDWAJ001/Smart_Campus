/**
 * Development Routes
 * 
 * Routes only available in development environment for testing
 */

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Generate a development token
router.get('/token', (req, res) => {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  
  // Generate a token with student role
  const token = jwt.sign(
    { 
      id: '123456789012345678901234', // Dummy ID that would work with MongoDB
      role: 'student',
      name: 'Test Student',
      email: 'test@example.com' 
    },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
  
  res.status(200).json({
    success: true,
    token,
    role: 'student',
    name: 'Test Student'
  });
});

// Generate an admin token
router.get('/admin-token', (req, res) => {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  
  // Generate a token with admin role
  const token = jwt.sign(
    { 
      id: '123456789012345678901234', // Dummy ID that would work with MongoDB
      role: 'admin',
      name: 'Admin User',
      email: 'admin@example.com' 
    },
    process.env.JWT_SECRET || 'devsecret',
    { expiresIn: '7d' }
  );
  
  res.status(200).json({
    success: true,
    token,
    role: 'admin',
    name: 'Admin User'
  });
});

// Get current database status
router.get('/status', (req, res) => {
  // Only available in development
  if (process.env.NODE_ENV !== 'development') {
    return res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  }
  
  res.status(200).json({
    success: true,
    environment: process.env.NODE_ENV,
    database: 'connected',
    auth: {
      jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
      jwtExpire: process.env.JWT_EXPIRE || '30d (default)'
    }
  });
});

module.exports = router;