const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  addStudent,
  removeStudent
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Base routes
router.route('/')
  .get(protect, getCourses) // Both teachers and students can get their courses
  .post(protect, authorize('teacher'), createCourse); // Only teachers can create courses

// Individual course routes
router.route('/:id')
  .get(protect, getCourse) // Both can get course details
  .put(protect, authorize('teacher'), updateCourse) // Only teachers can update courses
  .delete(protect, authorize('teacher'), deleteCourse); // Only teachers can delete courses

// Student enrollment routes
router.route('/:id/students')
  .post(protect, authorize('teacher'), addStudent); // Only teachers can add students

router.route('/:id/students/:studentId')
  .delete(protect, authorize('teacher'), removeStudent); // Only teachers can remove students

module.exports = router;