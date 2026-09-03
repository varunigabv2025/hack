const Loan = require('../models/Loan');
const User = require('../models/User');

/**
 * LOAN CONTROLLER
 * Handles loan record creation and retrieval
 * 
 * NOTE: These are MOCK loan records for demo purposes
 * No real lending, approval, or payment processing
 */

/**
 * Generate a unique loan ID
 */
const generateLoanId = () => {
  return `LOAN${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

/**
 * Create a new loan record
 * POST /api/loans
 */
const createLoan = async (req, res, next) => {
  try {
    const { user_id, loan_name, amount, monthly_payment, status } = req.body;

    // Validate required fields
    if (!user_id) {
      const error = new Error('Missing required field: user_id');
      error.statusCode = 400;
      error.code = 'MISSING_USER_ID';
      throw error;
    }

    if (!loan_name) {
      const error = new Error('Missing required field: loan_name');
      error.statusCode = 400;
      error.code = 'MISSING_LOAN_NAME';
      throw error;
    }

    if (amount === undefined || amount === null) {
      const error = new Error('Missing required field: amount');
      error.statusCode = 400;
      error.code = 'MISSING_AMOUNT';
      throw error;
    }

    if (monthly_payment === undefined || monthly_payment === null) {
      const error = new Error('Missing required field: monthly_payment');
      error.statusCode = 400;
      error.code = 'MISSING_MONTHLY_PAYMENT';
      throw error;
    }

    // Validate amounts
    if (amount < 0) {
      const error = new Error('Loan amount cannot be negative');
      error.statusCode = 400;
      error.code = 'INVALID_AMOUNT';
      throw error;
    }

    if (monthly_payment < 0) {
      const error = new Error('Monthly payment cannot be negative');
      error.statusCode = 400;
      error.code = 'INVALID_MONTHLY_PAYMENT';
      throw error;
    }

    // Validate status if provided
    if (status && !['active', 'closed'].includes(status)) {
      const error = new Error('Invalid status. Must be "active" or "closed"');
      error.statusCode = 400;
      error.code = 'INVALID_STATUS';
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

    // Generate unique loan ID
    const loan_id = generateLoanId();

    // Create and save loan
    const loan = await Loan.create({
      loan_id,
      user_id,
      loan_name,
      amount,
      monthly_payment,
      status: status || 'active'
    });

    res.status(201).json({
      success: true,
      loan: {
        loan_id: loan.loan_id,
        user_id: loan.user_id,
        loan_name: loan.loan_name,
        amount: loan.amount,
        monthly_payment: loan.monthly_payment,
        status: loan.status,
        created_at: loan.created_at
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get all loans for a user
 * GET /api/loans/:userId
 */
const getLoans = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Verify user exists
    const user = await User.findOne({ user_id: userId });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Fetch loans
    const loans = await Loan.find({ user_id: userId })
      .sort({ created_at: -1 }) // Most recent first
      .lean();

    const count = loans.length;
    const activeCount = loans.filter(l => l.status === 'active').length;
    const totalMonthlyPayment = loans
      .filter(l => l.status === 'active')
      .reduce((sum, l) => sum + l.monthly_payment, 0);

    res.json({
      success: true,
      loans,
      count,
      active_count: activeCount,
      total_monthly_payment: totalMonthlyPayment
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLoan,
  getLoans
};
