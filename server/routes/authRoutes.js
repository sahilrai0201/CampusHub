const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getDepartmentsPublic,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/departments', getDepartmentsPublic);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profilePhoto'), updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;

