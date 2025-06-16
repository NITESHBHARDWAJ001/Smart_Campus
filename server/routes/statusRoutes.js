/**
 * Status Routes
 * 
 * Public routes for checking API and database status
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

// @desc    Check API and database status
// @route   GET /api/status
// @access  Public
router.get('/', (req, res) => {
  try {
    // Check if mongoose is connected
    const isConnected = mongoose.connection.readyState === 1;
    
    res.status(200).json({
      success: true,
      message: 'API is running',
      database: {
        connected: isConnected,
        state: mongoose.connection.readyState,
        name: mongoose.connection.name || 'Not connected'
      },
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in status check:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking status',
      error: error.message
    });
  }
});

module.exports = router;