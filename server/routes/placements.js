const express = require('express');
const {
  getPlacements,
  getPlacement,
  createPlacement,
  updatePlacement,
  deletePlacement,
  togglePlacementActive,
  getPlacementApplications
} = require('../controllers/placementController');

// Import development controller
const devController = require('../controllers/devPlacementController');

const router = express.Router();

// Middleware
const { protect, authorize } = require('../middleware/auth');

// Log middleware for debugging
const logRequest = (req, res, next) => {
  console.log(`Placement API request: ${req.method} ${req.originalUrl}`);
  console.log('User in request:', req.user ? { 
    _id: req.user._id, 
    id: req.user.id,
    role: req.user.role 
  } : 'No user');
  next();
};

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';
console.log(`Running in ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'} mode`);

// Routes with conditional controllers based on environment
router.route('/')
  .get(protect, logRequest, getPlacements)
  .post(
    logRequest,
    isDevelopment 
      ? devController.createPlacement  // Use development controller in dev mode
      : [protect, authorize('admin'), createPlacement] // Use normal flow in production
  );

// Conditionally apply middleware based on environment
const conditionalMiddleware = (middleware) => {
  return (req, res, next) => {
    if (isDevelopment) {
      return next(); // Skip middleware in development
    }
    return middleware(req, res, next);
  };
};

router
  .route('/:id')
  .get(conditionalMiddleware(protect), logRequest, getPlacement)
  .put(conditionalMiddleware(protect), conditionalMiddleware(authorize('admin')), logRequest, updatePlacement)
  .delete(conditionalMiddleware(protect), conditionalMiddleware(authorize('admin')), logRequest, deletePlacement);

router
  .route('/:id/toggle-active')
  .put(conditionalMiddleware(protect), conditionalMiddleware(authorize('admin')), logRequest, togglePlacementActive);

router
  .route('/:id/applications')
  .get(conditionalMiddleware(protect), conditionalMiddleware(authorize('admin')), logRequest, getPlacementApplications);

module.exports = router;