import express from 'express';
const router = express.Router();
import * as loanController from '../controllers/loanController.js';

/**
 * LOAN ROUTES
 * Mounted at /api/loans
 */

// POST /api/loans - Create new loan record
router.post('/', loanController.createLoan);

// GET /api/loans/:userId - Get user's loans
router.get('/:userId', loanController.getLoans);

export default router;

