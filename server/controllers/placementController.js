const Placement = require('../models/Placement');
const Application = require('../models/Application');
const { getUserId } = require('../utils/objectIdHelper');

// @desc    Create a new placement opportunity
// @route   POST /api/placements
// @access  Private (Admin only)
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
      deadline
    } = req.body;

    // Create placement data object - completely omitting createdBy field
    const placementData = {
      title,
      company,
      description,
      location,
      salary,
      type,
      requirements,
      deadline,
      active: true
    };
    
    console.log('Creating placement with data:', placementData);
    
    // Create placement with available data
    const placement = await Placement.create(placementData);

    res.status(201).json({
      success: true,
      data: placement
    });
  } catch (error) {
    console.error('Error creating placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all placement opportunities
// @route   GET /api/placements
// @access  Private
exports.getPlacements = async (req, res) => {
  try {
    // For students, only show active placements
    const filter = req.user.role === 'student' ? { active: true } : {};
    
    const placements = await Placement.find(filter)
      .sort({ deadline: 1 })
      .populate('createdBy', 'name');

    res.status(200).json({
      success: true,
      count: placements.length,
      data: placements
    });
  } catch (error) {
    console.error('Error getting placements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single placement
// @route   GET /api/placements/:id
// @access  Private
exports.getPlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id)
      .populate('createdBy', 'name');
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    // Check if this is a student and the placement is not active
    if (req.user.role === 'student' && !placement.active) {
      return res.status(403).json({
        success: false,
        message: 'This placement is no longer active'
      });
    }

    // If user is a student, check if they have already applied
    let hasApplied = false;
    if (req.user.role === 'student') {
      const existingApplication = await Application.findOne({
        studentId: req.user.id,
        placementId: placement._id
      });
      hasApplied = !!existingApplication;
    }

    res.status(200).json({
      success: true,
      data: placement,
      hasApplied
    });
  } catch (error) {
    console.error('Error getting placement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update placement
// @route   PUT /api/placements/:id
// @access  Private (Admin only)
exports.updatePlacement = async (req, res) => {
  try {
    let placement = await Placement.findById(req.params.id);
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    // Update placement
    placement = await Placement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (error) {
    console.error('Error updating placement:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete placement
// @route   DELETE /api/placements/:id
// @access  Private (Admin only)
exports.deletePlacement = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    // Delete all related applications first
    await Application.deleteMany({ placementId: req.params.id });
    
    // Then delete the placement
    await placement.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting placement:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Toggle placement active status
// @route   PUT /api/placements/:id/toggle-active
// @access  Private (Admin only)
exports.togglePlacementActive = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    placement.active = !placement.active;
    await placement.save();

    res.status(200).json({
      success: true,
      data: placement
    });
  } catch (error) {
    console.error('Error toggling placement status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all applications for a placement
// @route   GET /api/placements/:id/applications
// @access  Private (Admin only)
exports.getPlacementApplications = async (req, res) => {
  try {
    const placement = await Placement.findById(req.params.id);
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement not found'
      });
    }

    const applications = await Application.find({ placementId: req.params.id })
      .populate('studentId', 'name email rollNumber department');

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error getting placement applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};