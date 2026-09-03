import express from 'express';
const router = express.Router();
import {  simulateScenario  } from '../controllers/simulatorController.js';

/**
 * SIMULATOR ROUTES
 * What-if scenarios for financial resilience
 */

// POST /api/simulator - Simulate income change scenario
router.post('/', simulateScenario);

export default router;

