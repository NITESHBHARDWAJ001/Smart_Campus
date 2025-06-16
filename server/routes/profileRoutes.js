const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile
} = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

// Profile routes
router.route('/')
  .get(protect, getProfile)
  .put(protect, updateProfile);

module.exports = router;