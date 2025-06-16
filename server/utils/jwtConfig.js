/**
 * JWT Configuration Utility
 */
const jwt = require('jsonwebtoken');

// Default values
const DEFAULT_SECRET = 'smart_campus_default_secret_key';
const DEFAULT_EXPIRE = '30d';  // 30 days

/**
 * Generate a JWT token with proper error handling
 * @param {Object} payload - Data to include in the token
 * @returns {string} - JWT token string
 */
const generateToken = (payload) => {
  try {
    // Use environment variables if available, otherwise use defaults
    const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    const expireTime = process.env.JWT_EXPIRE || DEFAULT_EXPIRE;
    
    return jwt.sign(payload, secret, {
      expiresIn: expireTime
    });
  } catch (error) {
    console.error('Error generating JWT token:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} - Decoded token payload
 */
const verifyToken = (token) => {
  try {
    const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  verifyToken,
  DEFAULT_SECRET,
  DEFAULT_EXPIRE
};