const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignmentsByCourse,
  getAssignment,
  updateAssignment,
  deleteAssignment
} = require('../controllers/assignmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Assignment routes
router.route('/')
  .post(protect, authorize('teacher'), createAssignment);

router.route('/course/:courseId')
  .get(protect, getAssignmentsByCourse);

router.route('/:id')
  .get(protect, getAssignment)
  .put(protect, authorize('teacher'), updateAssignment)
  .delete(protect, authorize('teacher'), deleteAssignment);

module.exports = router;