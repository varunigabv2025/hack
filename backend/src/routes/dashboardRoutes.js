const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

/**
 * DASHBOARD ROUTES
 * Mounted at /api/dashboard
 * All routes require authentication
 */

// GET /api/dashboard/:userId - Get complete dashboard data
// User can only access their own dashboard
router.get('/:userId', authenticate, dashboardController.getDashboard);

module.exports = router;
