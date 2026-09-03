const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const FinancialProfile = require('../models/FinancialProfile');
const User = require('../models/User');
const financeEngine = require('../services/financeEngineAdapter');

/**
 * WHAT-IF RESILIENCE SIMULATOR CONTROLLER
 * 
 * Allows frontend to simulate hypothetical income changes
 * WITHOUT modifying actual user data.
 * 
 * Key principles:
 * - NEVER save simulated data to MongoDB
 * - Reuse Member 2's existing finance engine logic
 * - Return both CURRENT and SIMULATED states for comparison
 * - Purely deterministic calculations - NO AI
 */

/**
 * Simulate a what-if scenario with income change
 * POST /api/simulator
 * 
 * Request body:
 * {
 *   "user_id": "U001",
 *   "income_change_percent": -20  // e.g., -20 means 20% decrease
 * }
 */
const simulateScenario = async (req, res, next) => {
  try {
    const { user_id, income_change_percent } = req.body;

    // Validate required fields
    if (!user_id) {
      const error = new Error('Missing required field: user_id');
      error.statusCode = 400;
      error.code = 'MISSING_USER_ID';
      throw error;
    }

    if (income_change_percent === undefined || income_change_percent === null) {
      const error = new Error('Missing required field: income_change_percent');
      error.statusCode = 400;
      error.code = 'MISSING_INCOME_CHANGE';
      throw error;
    }

    // Validate income_change_percent range
    if (income_change_percent < -100 || income_change_percent > 200) {
      const error = new Error('income_change_percent must be between -100 and 200');
      error.statusCode = 400;
      error.code = 'INVALID_INCOME_CHANGE_RANGE';
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

    // Fetch user's real transaction history
    const realTransactions = await Transaction.find({ user_id })
      .sort({ date: -1 })
      .limit(100)
      .lean();

    if (realTransactions.length === 0) {
      const error = new Error('No transaction history found. Cannot run simulation without data.');
      error.statusCode = 400;
      error.code = 'NO_TRANSACTION_HISTORY';
      throw error;
    }

    // Fetch user's active loans
    const loans = await Loan.find({ 
      user_id,
      status: 'active'
    }).lean();

    // === CURRENT STATE ===
    // Calculate current financial state using real data
    
    const currentIncomeProfile = financeEngine.calculateIncomeProfile(realTransactions, user);
    
    const currentSavingsPocket = financeEngine.calculateSavingsPocket({
      todayIncome: realTransactions[0].amount, // Most recent transaction
      incomeProfile: currentIncomeProfile,
      transactions: realTransactions,
      user
    });
    
    const currentResilienceScore = financeEngine.calculateResilienceScore({
      incomeProfile: currentIncomeProfile,
      savingsPocket: currentSavingsPocket,
      transactions: realTransactions,
      loans,
      user
    });
    
    const currentLoanRisk = financeEngine.calculateLoanRisk(loans);

    // === SIMULATED STATE ===
    // Create hypothetical transactions with modified income
    
    const incomeMultiplier = 1 + (income_change_percent / 100);
    
    // Clone and modify transactions (IN MEMORY ONLY - never saved to DB)
    const simulatedTransactions = realTransactions.map(txn => ({
      ...txn,
      amount: Math.round(txn.amount * incomeMultiplier)
    }));

    const simulatedIncomeProfile = financeEngine.calculateIncomeProfile(simulatedTransactions, user);
    
    const simulatedSavingsPocket = financeEngine.calculateSavingsPocket({
      todayIncome: simulatedTransactions[0].amount,
      incomeProfile: simulatedIncomeProfile,
      transactions: simulatedTransactions,
      user
    });
    
    const simulatedResilienceScore = financeEngine.calculateResilienceScore({
      incomeProfile: simulatedIncomeProfile,
      savingsPocket: simulatedSavingsPocket,
      transactions: simulatedTransactions,
      loans, // Loans remain unchanged in simulation
      user
    });
    
    const simulatedLoanRisk = financeEngine.calculateLoanRisk(loans);

    // === COMPARISON ===
    // Calculate changes between current and simulated states
    
    const changes = {
      income_change_percent: income_change_percent,
      baseline_change: simulatedIncomeProfile.baseline - currentIncomeProfile.baseline,
      baseline_change_percent: currentIncomeProfile.baseline > 0
        ? Math.round(((simulatedIncomeProfile.baseline - currentIncomeProfile.baseline) / currentIncomeProfile.baseline) * 100)
        : 0,
      
      safe_to_save_change: simulatedSavingsPocket.suggested_amount - currentSavingsPocket.suggested_amount,
      safe_to_save_change_percent: currentSavingsPocket.suggested_amount > 0
        ? Math.round(((simulatedSavingsPocket.suggested_amount - currentSavingsPocket.suggested_amount) / currentSavingsPocket.suggested_amount) * 100)
        : 0,
      
      resilience_score_change: simulatedResilienceScore.score - currentResilienceScore.score,
      resilience_score_change_percent: currentResilienceScore.score > 0
        ? Math.round(((simulatedResilienceScore.score - currentResilienceScore.score) / currentResilienceScore.score) * 100)
        : 0,
      
      surplus_change: simulatedSavingsPocket.surplus - currentSavingsPocket.surplus,
      
      volatility_change: {
        from: currentIncomeProfile.volatility,
        to: simulatedIncomeProfile.volatility
      },
      
      trend_change: {
        from: currentIncomeProfile.trend,
        to: simulatedIncomeProfile.trend
      }
    };

    // === RESPONSE ===
    // Return comprehensive comparison for frontend display
    
    res.json({
      success: true,
      user_id,
      scenario: {
        income_change_percent,
        description: income_change_percent > 0 
          ? `Income increases by ${income_change_percent}%`
          : income_change_percent < 0
          ? `Income decreases by ${Math.abs(income_change_percent)}%`
          : 'No income change'
      },
      
      current: {
        income: realTransactions[0].amount,
        baseline: currentIncomeProfile.baseline,
        volatility: currentIncomeProfile.volatility,
        trend: currentIncomeProfile.trend,
        prediction: currentIncomeProfile.prediction,
        surplus: currentSavingsPocket.surplus,
        safe_to_save: currentSavingsPocket.suggested_amount,
        savings_streak: currentSavingsPocket.streak,
        rainy_day_progress: currentSavingsPocket.rainy_day?.progress || 0,
        resilience_score: currentResilienceScore.score,
        score_factors: currentResilienceScore.factors,
        loan_risk: currentLoanRisk.level
      },
      
      simulated: {
        income: simulatedTransactions[0].amount,
        baseline: simulatedIncomeProfile.baseline,
        volatility: simulatedIncomeProfile.volatility,
        trend: simulatedIncomeProfile.trend,
        prediction: simulatedIncomeProfile.prediction,
        surplus: simulatedSavingsPocket.surplus,
        safe_to_save: simulatedSavingsPocket.suggested_amount,
        savings_streak: simulatedSavingsPocket.streak,
        rainy_day_progress: simulatedSavingsPocket.rainy_day?.progress || 0,
        resilience_score: simulatedResilienceScore.score,
        score_factors: simulatedResilienceScore.factors,
        loan_risk: simulatedLoanRisk.level
      },
      
      change: changes,
      
      insights: generateInsights(changes, currentResilienceScore.score, simulatedResilienceScore.score)
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Generate deterministic insights from simulation results
 * Simple rule-based insights - NO AI
 * 
 * @param {Object} changes - Calculated changes object
 * @param {Number} currentScore - Current resilience score
 * @param {Number} simulatedScore - Simulated resilience score
 * @returns {Array} Array of insight strings
 */
const generateInsights = (changes, currentScore, simulatedScore) => {
  const insights = [];

  // Resilience score insights
  if (changes.resilience_score_change > 10) {
    insights.push(`Your resilience score would improve significantly by ${changes.resilience_score_change} points.`);
  } else if (changes.resilience_score_change > 0) {
    insights.push(`Your resilience score would improve slightly by ${changes.resilience_score_change} points.`);
  } else if (changes.resilience_score_change < -10) {
    insights.push(`Your resilience score would drop significantly by ${Math.abs(changes.resilience_score_change)} points.`);
  } else if (changes.resilience_score_change < 0) {
    insights.push(`Your resilience score would decrease slightly by ${Math.abs(changes.resilience_score_change)} points.`);
  } else {
    insights.push('Your resilience score would remain relatively stable.');
  }

  // Savings capacity insights
  if (changes.safe_to_save_change > 0) {
    insights.push(`You could save ₹${changes.safe_to_save_change} more per transaction.`);
  } else if (changes.safe_to_save_change < 0) {
    insights.push(`Your saving capacity would reduce by ₹${Math.abs(changes.safe_to_save_change)} per transaction.`);
  }

  // Volatility insights
  if (changes.volatility_change.from !== changes.volatility_change.to) {
    insights.push(`Income volatility would change from ${changes.volatility_change.from} to ${changes.volatility_change.to}.`);
  }

  // Trend insights
  if (changes.trend_change.from !== changes.trend_change.to) {
    insights.push(`Income trend would shift from ${changes.trend_change.from} to ${changes.trend_change.to}.`);
  }

  // Critical threshold warnings
  if (simulatedScore < 40 && currentScore >= 40) {
    insights.push('⚠️ Warning: Your resilience score would fall below healthy levels.');
  }

  if (simulatedScore >= 70 && currentScore < 70) {
    insights.push('✅ Great news: Your resilience score would reach healthy levels!');
  }

  return insights;
};

module.exports = {
  simulateScenario
};
