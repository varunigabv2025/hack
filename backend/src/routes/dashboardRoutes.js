const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

/**
 * DASHBOARD ROUTES
 * Mounted at /api/dashboard
 */

// GET /api/dashboard/:userId - Get complete dashboard data
router.get('/:userId', dashboardController.getDashboard);

module.exports = router;
