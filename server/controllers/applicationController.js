const Application = require('../models/Application');
const Placement = require('../models/Placement');
const User = require('../models/User');

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private (Students only)
exports.createApplication = async (req, res) => {
  try {
    const { placementId, coverLetter, resumeLink } = req.body;
    const studentId = req.user.id;

    // Verify placement exists and is active
    const placement = await Placement.findById(placementId);
    
    if (!placement) {
      return res.status(404).json({
        success: false,
        message: 'Placement opportunity not found'
      });
    }

    if (!placement.active) {
      return res.status(400).json({
        success: false,
        message: 'This placement opportunity is no longer accepting applications'
      });
    }

    // Check if deadline has passed
    if (new Date(placement.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed'
      });
    }

    // Check if student has already applied
    const existingApplication = await Application.findOne({
      studentId,
      placementId
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this placement opportunity'
      });
    }

    // Create application
    const application = await Application.create({
      studentId,
      placementId,
      coverLetter,
      resumeLink
    });

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get all applications for a student
// @route   GET /api/applications/my-applications
// @access  Private (Students only)
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ studentId: req.user.id })
      .populate({
        path: 'placementId',
        select: 'title company location type deadline active'
      })
      .sort({ applicationDate: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin only)
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Applied', 'Under Review', 'Selected', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    application.status = status;
    application.updatedAt = Date.now();
    await application.save();

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get application details
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({
        path: 'placementId',
        select: 'title company description location type deadline'
      })
      .populate({
        path: 'studentId',
        select: 'name email rollNumber department'
      });
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Only allow student to view their own application or admin to view any application
    if (req.user.role === 'student' && application.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    console.error('Error getting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private (Students can delete their own, Admin can delete any)
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if student is trying to delete someone else's application
    if (req.user.role === 'student' && application.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this application'
      });
    }

    // Check if associated placement's deadline has passed for students
    if (req.user.role === 'student') {
      const placement = await Placement.findById(application.placementId);
      if (placement && new Date(placement.deadline) < new Date()) {
        return res.status(400).json({
          success: false,
          message: 'Cannot withdraw application after deadline has passed'
        });
      }
    }

    await application.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};