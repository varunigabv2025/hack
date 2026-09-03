import express from 'express';
const router = express.Router();
import * as transactionController from '../controllers/transactionController.js';

/**
 * TRANSACTION ROUTES
 * Mounted at /api/transactions
 */

// POST /api/transactions - Create transaction and trigger pipeline
router.post('/', transactionController.createTransaction);

// GET /api/transactions/:userId - Get transaction history
router.get('/:userId', transactionController.getTransactions);

export default router;

