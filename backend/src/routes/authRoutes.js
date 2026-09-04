const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

/**
 * AUTH ROUTES
 * Mounted at /api/auth
 */

// POST /api/auth/register - Create new user account
router.post('/register', authController.register);

// POST /api/auth/login - Authenticate user
router.post('/login', authController.login);

// POST /api/auth/logout - Clear authentication session
router.post('/logout', authController.logout);

// GET /api/auth/me - Get current authenticated user
router.get('/me', authenticate, authController.getMe);

module.exports = router;
