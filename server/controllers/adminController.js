const User = require('../models/User');
const Placement = require('../models/Placement');
const Application = require('../models/Application');
const admin = require('../demo/admin')

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin only)

exports.demo = async (req, res) => {
  const { token, title, body } = req.body;
  console.log('Received demo request:', { token, title, body });
  const message = {
    notification: { title, body },
    token: token
  };

  try {
    await admin.messaging().send(message);
    res.status(200).send('Notification sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to send notification');
  }
}
exports.getUsers = async (req, res) => {
  try {
    // Support for filtering and pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    // Filter by role if provided
    if (req.query.role && ['student', 'teacher', 'admin'].includes(req.query.role)) {
      filter.role = req.query.role;
    }

    // Filter by name or email if search term provided
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: users
    });
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private (Admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

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
    console.error('Error getting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }

    // Delete all applications if user is a student
    if (user.role === 'student') {
      await Application.deleteMany({ studentId: user._id });
    }

    // Delete user
    await user.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private (Admin only)
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: 'student' });
    const teachers = await User.countDocuments({ role: 'teacher' });
    const admins = await User.countDocuments({ role: 'admin' });

    const totalPlacements = await Placement.countDocuments();
    const activePlacements = await Placement.countDocuments({ active: true });

    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'Applied' });
    const selectedApplications = await Application.countDocuments({ status: 'Selected' });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          students,
          teachers,
          admins
        },
        placements: {
          total: totalPlacements,
          active: activePlacements,
          inactive: totalPlacements - activePlacements
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          selected: selectedApplications
        }
      }
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all placements with application counts
// @route   GET /api/admin/placements
// @access  Private (Admin only)
exports.getPlacements = async (req, res) => {
  try {
    // Support for filtering and pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};

    // Filter by active status if provided
    if (req.query.active !== undefined) {
      filter.active = req.query.active === 'true';
    }

    // Filter by company or title if search term provided
    if (req.query.search) {
      filter.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const placements = await Placement.find(filter)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Placement.countDocuments(filter);

    // Get application counts for each placement
    const placementsWithCounts = await Promise.all(
      placements.map(async (placement) => {
        const applications = await Application.countDocuments({ placementId: placement._id });
        const selectedApplications = await Application.countDocuments({
          placementId: placement._id,
          status: 'Selected'
        });

        // Convert Mongoose document to plain object
        const placementObj = placement.toObject();

        return {
          ...placementObj,
          applications,
          selected: selectedApplications
        };
      })
    );

    res.status(200).json({
      success: true,
      count: placements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: placementsWithCounts
    });
  } catch (error) {
    console.error('Error getting placements:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};