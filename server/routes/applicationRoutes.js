const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
  getApplication,
  deleteApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Application routes
router.route('/')
  .post(protect, authorize('student'), createApplication);

router.route('/my-applications')
  .get(protect, authorize('student'), getMyApplications);

router.route('/:id')
  .get(protect, getApplication)
  .delete(protect, deleteApplication);

router.route('/:id/status')
  .put(protect, authorize('admin'), updateApplicationStatus);

module.exports = router;