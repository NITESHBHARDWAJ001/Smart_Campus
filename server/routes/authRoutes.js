const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  getMe, 
  checkExistingUser 
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/check', checkExistingUser); // Route to check if user exists

module.exports = router;