const express = require('express');
const router = express.Router();
const {
  createExpense,
  getExpenses,
  getExpenseSummary
} = require('../controllers/expenseController');

/**
 * EXPENSE ROUTES
 * Handles expense tracking and analysis
 */

// POST /api/expenses - Create a new expense
router.post('/', createExpense);

// GET /api/expenses/:userId - Get expenses for a user
router.get('/:userId', getExpenses);

// GET /api/expenses/:userId/summary - Get expense summary only
router.get('/:userId/summary', getExpenseSummary);

module.exports = router;
