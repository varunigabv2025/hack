const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate } = require('../middleware/auth');

/**
 * LOAN ROUTES
 * Mounted at /api/loans
 * All routes require authentication
 */

// POST /api/loans - Create new loan record
router.post('/', authenticate, loanController.createLoan);

// GET /api/loans/:userId - Get user's loans
router.get('/:userId', authenticate, loanController.getLoans);

module.exports = router;
