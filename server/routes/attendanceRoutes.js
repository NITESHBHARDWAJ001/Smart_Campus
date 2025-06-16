const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getAttendanceByDate,
  getAttendanceByCourse,
  getStudentAttendanceStatistics,
  getCourseAttendanceSummary
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Attendance routes
router.route('/')
  .post(protect, authorize('teacher'), markAttendance);

router.route('/course/:courseId')
  .get(protect, getAttendanceByCourse);

router.route('/course/:courseId/date/:date')
  .get(protect, getAttendanceByDate);

router.route('/statistics/course/:courseId/student/:studentId')
  .get(protect, getStudentAttendanceStatistics);

router.route('/summary/course/:courseId')
  .get(protect, authorize('teacher'), getCourseAttendanceSummary);

module.exports = router;