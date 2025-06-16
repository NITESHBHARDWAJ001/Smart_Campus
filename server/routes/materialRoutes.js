const express = require('express');
const router = express.Router();
const {
  createMaterial,
  getMaterialsByCourse,
  getMaterial,
  updateMaterial,
  deleteMaterial
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Material routes
router.route('/')
  .post(protect, authorize('teacher'), createMaterial);

router.route('/course/:courseId')
  .get(protect, getMaterialsByCourse);

router.route('/:id')
  .get(protect, getMaterial)
  .put(protect, authorize('teacher'), updateMaterial)
  .delete(protect, authorize('teacher'), deleteMaterial);

module.exports = router;