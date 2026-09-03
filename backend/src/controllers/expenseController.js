const Expense = require('../models/Expense');
const User = require('../models/User');

/**
 * EXPENSE CONTROLLER
 * Handles expense tracking and analysis
 * 
 * Member 1's responsibility: Expense CRUD and deterministic summaries
 * NOT using AI - purely database operations and simple math
 */

/**
 * Generate a unique expense ID
 */
const generateExpenseId = () => {
  return `EXP${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Create a new expense
 * POST /api/expenses
 */
const createExpense = async (req, res, next) => {
  try {
    const { user_id, amount, date, category, essential, description } = req.body;

    // Validate required fields
    if (!user_id) {
      const error = new Error('Missing required field: user_id');
      error.statusCode = 400;
      error.code = 'MISSING_USER_ID';
      throw error;
    }

    if (amount === undefined || amount === null) {
      const error = new Error('Missing required field: amount');
      error.statusCode = 400;
      error.code = 'MISSING_AMOUNT';
      throw error;
    }

    if (!date) {
      const error = new Error('Missing required field: date');
      error.statusCode = 400;
      error.code = 'MISSING_DATE';
      throw error;
    }

    if (!category) {
      const error = new Error('Missing required field: category');
      error.statusCode = 400;
      error.code = 'MISSING_CATEGORY';
      throw error;
    }

    // Validate amount
    if (amount < 0) {
      const error = new Error('Amount must be positive');
      error.statusCode = 400;
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    // Validate date format
    const expenseDate = new Date(date);
    if (isNaN(expenseDate.getTime())) {
      const error = new Error('Invalid date format. Use ISO 8601 (YYYY-MM-DD)');
      error.statusCode = 400;
      error.code = 'INVALID_DATE';
      throw error;
    }

    // Verify user exists
    const user = await User.findOne({ user_id });
    if (!user) {
      const error = new Error('User not found. Create a profile first using POST /api/profile');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Generate unique expense ID
    const expense_id = generateExpenseId();

    // Create and save expense
    const expense = await Expense.create({
      expense_id,
      user_id,
      amount,
      date: expenseDate,
      category,
      essential: essential !== undefined ? essential : false,
      description: description || ''
    });

    res.status(201).json({
      success: true,
      expense: {
        expense_id: expense.expense_id,
        user_id: expense.user_id,
        amount: expense.amount,
        date: expense.date,
        category: expense.category,
        essential: expense.essential,
        description: expense.description,
        created_at: expense.created_at
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get expenses for a user with optional filtering and summary
 * GET /api/expenses/:userId
 * 
 * Query params:
 * - limit: number of expenses to return (default: 50)
 * - offset: pagination offset (default: 0)
 * - category: filter by category
 * - essential: filter by essential (true/false)
 * - from_date: filter expenses from this date
 * - to_date: filter expenses to this date
 * - summary: if true, include expense summary (default: false)
 */
const getExpenses = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;
    const includeSummary = req.query.summary === 'true';

    // Build query filters
    const query = { user_id: userId };

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.essential !== undefined) {
      query.essential = req.query.essential === 'true';
    }

    if (req.query.from_date || req.query.to_date) {
      query.date = {};
      if (req.query.from_date) {
        query.date.$gte = new Date(req.query.from_date);
      }
      if (req.query.to_date) {
        query.date.$lte = new Date(req.query.to_date);
      }
    }

    // Verify user exists
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Fetch expenses
    const expenses = await Expense.find(query)
      .sort({ date: -1, created_at: -1 }) // Most recent first
      .limit(limit)
      .skip(offset)
      .lean();

    const count = await Expense.countDocuments(query);

    const response = {
      success: true,
      expenses,
      count,
      limit,
      offset
    };

    // Add summary if requested
    if (includeSummary) {
      response.summary = await calculateExpenseSummary(userId, query);
    }

    res.json(response);

  } catch (error) {
    next(error);
  }
};

/**
 * Calculate expense summary for a user
 * Deterministic calculation - NO AI
 * 
 * @param {String} userId - User ID
 * @param {Object} query - Optional query filters
 * @returns {Object} Expense summary with totals and breakdowns
 */
const calculateExpenseSummary = async (userId, query = {}) => {
  // Base query for the user
  const baseQuery = { user_id: userId, ...query };

  // Fetch all expenses matching the query
  const allExpenses = await Expense.find(baseQuery).lean();

  if (allExpenses.length === 0) {
    return {
      total_expenses: 0,
      essential_expenses: 0,
      non_essential_expenses: 0,
      expense_count: 0,
      category_breakdown: {},
      recent_average: 0
    };
  }

  // Calculate totals
  let totalExpenses = 0;
  let essentialExpenses = 0;
  let nonEssentialExpenses = 0;
  const categoryBreakdown = {};

  allExpenses.forEach(expense => {
    totalExpenses += expense.amount;

    if (expense.essential) {
      essentialExpenses += expense.amount;
    } else {
      nonEssentialExpenses += expense.amount;
    }

    // Category breakdown
    if (!categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] = {
        total: 0,
        count: 0,
        essential: 0,
        non_essential: 0
      };
    }
    categoryBreakdown[expense.category].total += expense.amount;
    categoryBreakdown[expense.category].count += 1;
    if (expense.essential) {
      categoryBreakdown[expense.category].essential += expense.amount;
    } else {
      categoryBreakdown[expense.category].non_essential += expense.amount;
    }
  });

  // Calculate recent average (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = allExpenses.filter(exp => new Date(exp.date) >= thirtyDaysAgo);
  const recentAverage = recentExpenses.length > 0
    ? Math.round(recentExpenses.reduce((sum, exp) => sum + exp.amount, 0) / recentExpenses.length)
    : 0;

  return {
    total_expenses: Math.round(totalExpenses),
    essential_expenses: Math.round(essentialExpenses),
    non_essential_expenses: Math.round(nonEssentialExpenses),
    expense_count: allExpenses.length,
    category_breakdown: categoryBreakdown,
    recent_average: recentAverage,
    recent_count: recentExpenses.length
  };
};

/**
 * Get expense summary only
 * GET /api/expenses/:userId/summary
 */
const getExpenseSummary = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Build query filters (same as getExpenses)
    const query = {};

    if (req.query.category) {
      query.category = req.query.category;
    }

    if (req.query.essential !== undefined) {
      query.essential = req.query.essential === 'true';
    }

    if (req.query.from_date || req.query.to_date) {
      query.date = {};
      if (req.query.from_date) {
        query.date.$gte = new Date(req.query.from_date);
      }
      if (req.query.to_date) {
        query.date.$lte = new Date(req.query.to_date);
      }
    }

    // Verify user exists
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    const summary = await calculateExpenseSummary(userId, query);

    res.json({
      success: true,
      user_id: userId,
      summary
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createExpense,
  getExpenses,
  getExpenseSummary
};
