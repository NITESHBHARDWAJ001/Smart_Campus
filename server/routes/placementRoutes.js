const express = require('express');
const router = express.Router();
const {
  createPlacement,
  getPlacements,
  getPlacement,
  updatePlacement,
  deletePlacement,
  togglePlacementActive,
  getPlacementApplications
} = require('../controllers/placementController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Placement routes
router.route('/')
  .post(protect, authorize('admin'), createPlacement)
  .get(protect, getPlacements);

router.route('/:id')
  .get(protect, getPlacement)
  .put(protect, authorize('admin'), updatePlacement)
  .delete(protect, authorize('admin'), deletePlacement);

router.route('/:id/toggle-active')
  .put(protect, authorize('admin'), togglePlacementActive);

router.route('/:id/applications')
  .get(protect, authorize('admin'), getPlacementApplications);

module.exports = router;