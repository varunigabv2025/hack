const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticate } = require('../middleware/auth');

/**
 * TRANSACTION ROUTES
 * Mounted at /api/transactions
 * All routes require authentication
 */

// POST /api/transactions - Create transaction and trigger pipeline
router.post('/', authenticate, transactionController.createTransaction);

// GET /api/transactions/:userId - Get transaction history
// User can only access their own transactions
router.get('/:userId', authenticate, transactionController.getTransactions);

module.exports = router;
