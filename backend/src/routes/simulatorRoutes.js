const express = require('express');
const router = express.Router();
const { simulateScenario } = require('../controllers/simulatorController');

/**
 * SIMULATOR ROUTES
 * What-if scenarios for financial resilience
 */

// POST /api/simulator - Simulate income change scenario
router.post('/', simulateScenario);

module.exports = router;
