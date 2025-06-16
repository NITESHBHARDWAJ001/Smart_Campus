const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  deleteUser,
  getStats,
  getPlacements,demo
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Apply admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

router.route('/demo')
  .post(demo);

// User management routes
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .get(getUserById)
  .delete(deleteUser);

// Dashboard stats
router.route('/stats')
  .get(getStats);

// Placement management routes
router.route('/placements')
  .get(getPlacements);

module.exports = router;