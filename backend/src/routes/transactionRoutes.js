const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

/**
 * TRANSACTION ROUTES
 * Mounted at /api/transactions
 */

// POST /api/transactions - Create transaction and trigger pipeline
router.post('/', transactionController.createTransaction);

// GET /api/transactions/:userId - Get transaction history
router.get('/:userId', transactionController.getTransactions);

module.exports = router;
