/**
 * MongoDB ObjectId Helper Functions
 * 
 * This file provides utility functions to work with MongoDB ObjectIds
 */

const mongoose = require('mongoose');

/**
 * Check if a string is a valid MongoDB ObjectId
 * @param {String} id - The ID to check
 * @returns {Boolean} - Whether the ID is valid
 */
const isValidObjectId = (id) => {
  if (!id) return false;
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Convert a string to a MongoDB ObjectId if it's valid
 * @param {String} id - The ID to convert
 * @returns {ObjectId|null} - MongoDB ObjectId or null if invalid
 */
const toObjectId = (id) => {
  if (!isValidObjectId(id)) return null;
  return new mongoose.Types.ObjectId(id);
};

/**
 * Safely extract user ID from a request object
 * @param {Object} req - Express request object
 * @returns {ObjectId|null} - MongoDB ObjectId or null if invalid
 */
const getUserId = (req) => {
  if (!req.user) return null;
  
  // For development mode, check if we should use a hardcoded ID
  if (process.env.NODE_ENV === 'development' && !req.user._id && !req.user.id) {
    console.log('Development mode: Using hardcoded ObjectId');
    // Generate a valid ObjectId for development use
    return new mongoose.Types.ObjectId();
  }
  
  // Try to get user ID from various possible sources
  const possibleIds = [
    req.user._id,
    req.user.id,
    req.user.userId
  ];
  
  // Find first valid ObjectId
  for (const id of possibleIds) {
    if (id) {
      const objId = toObjectId(id);
      if (objId) return objId;
    }
  }
  
  // Last resort - create a new ObjectId if in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode: Creating new ObjectId as fallback');
    return new mongoose.Types.ObjectId();
  }
  
  return null;
};

module.exports = {
  isValidObjectId,
  toObjectId,
  getUserId
};