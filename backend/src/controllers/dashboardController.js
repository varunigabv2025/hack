import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Loan from '../models/Loan.js';
import FinancialProfile from '../models/FinancialProfile.js';

/**
 * DASHBOARD CONTROLLER
 * Aggregates user financial data for dashboard display
 */

/**
 * Get complete dashboard data for a user
 * GET /api/dashboard/:userId
 * 
 * Returns: user profile, financial profile, recent transactions, active loans
 */
const getDashboard = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Fetch user profile
    const user = await User.findOne({ user_id: userId }).lean();
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      error.code = 'USER_NOT_FOUND';
      throw error;
    }

    // Fetch latest financial profile (calculated by pipeline)
    const financialProfile = await FinancialProfile.findOne({ user_id: userId }).lean();

    // Fetch recent transactions (last 10)
    const recentTransactions = await Transaction.find({ user_id: userId })
      .sort({ date: -1, created_at: -1 })
      .limit(10)
      .lean();

    // Fetch active loans
    const activeLoans = await Loan.find({ 
      user_id: userId,
      status: 'active'
    }).lean();

    // Get latest transaction
    const latestTransaction = recentTransactions.length > 0 ? recentTransactions[0] : null;

    // Build dashboard response
    const dashboard = {
      success: true,
      user: {
        user_id: user.user_id,
        name: user.name,
        age: user.age,
        occupation: user.occupation,
        state: user.state,
        language: user.language,
        monthly_expense: user.monthly_expense
      },
      financial_profile: financialProfile ? {
        income_profile: {
          baseline: financialProfile.baseline,
          volatility: financialProfile.volatility,
          consistency: financialProfile.consistency,
          trend: financialProfile.trend,
          prediction: financialProfile.prediction
        },
        savings_pocket: {
          surplus: financialProfile.surplus,
          suggested_amount: financialProfile.suggested_amount,
          streak: financialProfile.savings_streak,
          rainy_day: financialProfile.rainy_day
        },
        resilience_score: {
          score: financialProfile.resilience_score,
          previous_score: financialProfile.previous_score,
          score_change: financialProfile.score_change,
          factors: financialProfile.score_factors
        },
        loan_risk: {
          level: financialProfile.loan_risk
        },
        updated_at: financialProfile.updated_at
      } : {
        // Return empty structure if no financial profile yet
        income_profile: {
          baseline: 0,
          volatility: 'medium',
          consistency: 0,
          trend: 'stable',
          prediction: {}
        },
        savings_pocket: {
          surplus: 0,
          suggested_amount: 0,
          streak: 0,
          rainy_day: {}
        },
        resilience_score: {
          score: 0,
          previous_score: 0,
          score_change: 0,
          factors: {}
        },
        loan_risk: {
          level: 'low'
        }
      },
      latest_transaction: latestTransaction,
      recent_transactions: recentTransactions,
      active_loans: activeLoans,
      nudge_context: financialProfile ? {
        today_income: latestTransaction?.amount || 0,
        baseline: financialProfile.baseline,
        trend: financialProfile.trend,
        surplus: financialProfile.surplus,
        suggested_saving: financialProfile.suggested_amount,
        savings_streak: financialProfile.savings_streak,
        current_score: financialProfile.resilience_score,
        previous_score: financialProfile.previous_score,
        score_change: financialProfile.score_change,
        loan_risk: financialProfile.loan_risk,
        rainy_day_progress: financialProfile.rainy_day?.progress || 0
      } : {}
    };

    res.json(dashboard);

  } catch (error) {
    next(error);
  }
};

export { 
  getDashboard
 };

