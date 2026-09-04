const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { authenticate } = require('../middleware/auth');

/**
 * PROFILE ROUTES
 * Mounted at /api/profile
 * All routes require authentication
 */

// POST /api/profile - Create new user profile
// Note: This may not be needed with real auth (profile created during registration)
router.post('/', authenticate, profileController.createProfile);

// GET /api/profile/:userId - Get user profile
router.get('/:userId', authenticate, profileController.getProfile);

module.exports = router;
