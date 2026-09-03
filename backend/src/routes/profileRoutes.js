const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

/**
 * PROFILE ROUTES
 * Mounted at /api/profile
 */

// POST /api/profile - Create new user profile
router.post('/', profileController.createProfile);

// GET /api/profile/:userId - Get user profile
router.get('/:userId', profileController.getProfile);

module.exports = router;
