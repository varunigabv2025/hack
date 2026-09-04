const Transaction = require('../models/Transaction');
const User = require('../models/User');
const pipelineService = require('../services/pipelineService');
const { v4: uuidv4 } = require('crypto').randomUUID ? require('crypto') : { randomUUID: () => Date.now().toString() };

/**
 * TRANSACTION CONTROLLER
 * Handles transaction creation and retrieval
 * 
 * CRITICAL: POST /transactions triggers the complete Resilience Engine pipeline
 */

/**
 * Generate a unique transaction ID
 */
const generateTransactionId = () => {
  return `TXN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Create a new transaction and trigger the complete pipeline
 * POST /api/transactions
 * 
 * This is the CORE endpoint of the Resilience Engine
 */
const createTransaction = async (req, res, next) => {
  try {
    const { user_id, amount, date, source } = req.body;

    // AUTHORIZATION: Use authenticated user_id, don't trust client-provided user_id
    const authenticatedUserId = req.user.user_id;
    
    // If client provides user_id, verify it matches authenticated user
    if (user_id && user_id !== authenticatedUserId) {
      const error = new Error('Unauthorized: Cannot create transaction for another user');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Use authenticated user_id
    const transactionUserId = authenticatedUserId;

    // Validate required fields
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

    if (!source) {
      const error = new Error('Missing required field: source');
      error.statusCode = 400;
      error.code = 'MISSING_SOURCE';
      throw error;
    }

    // Validate amount
    if (amount < 0) {
      const error = new Error('Amount cannot be negative');
      error.statusCode = 400;
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    // Validate date format
    const transactionDate = new Date(date);
    if (isNaN(transactionDate.getTime())) {
      const error = new Error('Invalid date format. Use ISO 8601 (YYYY-MM-DD)');
      error.statusCode = 400;
      error.code = 'INVALID_DATE';
      throw error;
    }

    // Verify user exists
    const user = await User.findOne({ user_id: transactionUserId });
    if (!user) {
      const error = new Error('User not found. Create a profile first using POST /api/profile');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Generate unique transaction ID
    const transaction_id = generateTransactionId();

    // Create and save transaction
    const transaction = await Transaction.create({
      transaction_id,
      user_id: transactionUserId, // Use authenticated user_id
      amount,
      date: transactionDate,
      source
    });

    // TRIGGER THE COMPLETE PIPELINE
    // This calls Member 2's finance engine via the adapter
    const pipelineResult = await pipelineService.processTransaction(user, transaction);

    // Return complete pipeline result
    res.status(201).json({
      success: true,
      ...pipelineResult
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction history for a user
 * GET /api/transactions/:userId
 */
const getTransactions = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    // AUTHORIZATION: Ensure user can only access their own transactions
    if (req.user.user_id !== userId) {
      const error = new Error('Unauthorized: You can only access your own transactions');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      throw error;
    }

    // Verify user exists
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Fetch transactions
    const transactions = await Transaction.find({ user_id: userId })
      .sort({ date: -1, created_at: -1 }) // Most recent first
      .limit(limit)
      .skip(offset)
      .lean();

    const count = await Transaction.countDocuments({ user_id: userId });

    res.json({
      success: true,
      transactions,
      count,
      limit,
      offset
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTransaction,
  getTransactions
};
