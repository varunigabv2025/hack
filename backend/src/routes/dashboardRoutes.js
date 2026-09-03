import express from 'express';
const router = express.Router();
import * as dashboardController from '../controllers/dashboardController.js';

/**
 * DASHBOARD ROUTES
 * Mounted at /api/dashboard
 */

// GET /api/dashboard/:userId - Get complete dashboard data
router.get('/:userId', dashboardController.getDashboard);

export default router;

