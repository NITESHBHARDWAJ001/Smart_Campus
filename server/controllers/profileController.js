const User = require('../models/User');

// @desc    Get current user profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      department,
      resumeLink,
      github,
      linkedin,
      leetcode,
      hackerrank
    } = req.body;

    // Build update object with only fields that should be updated
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (department) updateFields.department = department;
    if (resumeLink !== undefined) updateFields.resumeLink = resumeLink;
    if (github !== undefined) updateFields.github = github;
    if (linkedin !== undefined) updateFields.linkedin = linkedin;
    if (leetcode !== undefined) updateFields.leetcode = leetcode;
    if (hackerrank !== undefined) updateFields.hackerrank = hackerrank;

    // Update user profile
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    // Check for duplicate email error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};