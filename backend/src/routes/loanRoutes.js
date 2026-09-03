const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');

/**
 * LOAN ROUTES
 * Mounted at /api/loans
 */

// POST /api/loans - Create new loan record
router.post('/', loanController.createLoan);

// GET /api/loans/:userId - Get user's loans
router.get('/:userId', loanController.getLoans);

module.exports = router;
