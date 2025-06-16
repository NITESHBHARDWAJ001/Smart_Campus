/**
 * Development-only Placement Controller
 * 
 * This controller skips all authentication and validation checks
 * and is meant to be used only in development mode.
 */

const Placement = require('../models/Placement');

// @desc    Create a new placement opportunity (DEV MODE)
// @route   POST /api/placements
// @access  Public (DEV ONLY)
exports.createPlacement = async (req, res) => {
  try {
    const {
      title,
      company,
      description,
      location,
      salary,
      type,
      requirements,
      deadline,
      active = true
    } = req.body;

    console.log('DEV MODE: Creating placement with data:', req.body);

    // Create a new placement without validation checks
    const placement = new Placement({
      title,
      company,
      description,
      location,
      salary: salary || 'Not disclosed',
      type: type || 'Full-time',
      requirements,
      deadline,
      active: active !== undefined ? active : true,
      // Don't include createdBy at all
    });

    // Save the placement manually
    await placement.save();

    console.log('DEV MODE: Placement created successfully');

    res.status(201).json({
      success: true,
      data: placement
    });
  } catch (error) {
    console.error('DEV MODE: Error creating placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};