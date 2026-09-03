const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const FinancialProfile = require('../models/FinancialProfile');
const financeEngine = require('./financeEngineAdapter');

/**
 * PIPELINE SERVICE
 * 
 * Orchestrates the complete Resilience Engine pipeline:
 * Transaction → Income Profile → Savings Pocket → Resilience Score → Loan Risk → Persist
 * 
 * Member 1's responsibility: Pipeline orchestration
 * Member 2's responsibility: Financial calculations (via financeEngineAdapter)
 */

/**
 * Process a new transaction through the complete financial intelligence pipeline
 * 
 * @param {Object} user - User document from MongoDB
 * @param {Object} transaction - Transaction document from MongoDB
 * @returns {Object} Complete pipeline result with all calculated metrics
 */
const processTransaction = async (user, transaction) => {
  try {
    // Step 1: Fetch user's transaction history (for pattern analysis)
    const transactions = await Transaction.find({ user_id: user.user_id })
      .sort({ date: -1 })
      .limit(100) // Last 100 transactions for analysis
      .lean();

    // Step 2: Fetch user's active loans (for risk calculation)
    const loans = await Loan.find({ 
      user_id: user.user_id,
      status: 'active'
    }).lean();

    // Step 3: Calculate Income Profile (Member 2's logic via adapter)
    const incomeProfile = financeEngine.calculateIncomeProfile(transactions, user);

    // Step 4: Calculate Savings Pocket (Member 2's logic via adapter)
    const savingsPocket = financeEngine.calculateSavingsPocket({
      todayIncome: transaction.amount,
      incomeProfile,
      transactions,
      user
    });

    // Step 5: Calculate Resilience Score (Member 2's logic via adapter)
    const resilienceScore = financeEngine.calculateResilienceScore({
      incomeProfile,
      savingsPocket,
      transactions,
      loans,
      user
    });

    // Step 6: Calculate Loan Risk (Member 2's logic via adapter)
    const loanRisk = financeEngine.calculateLoanRisk(loans);

    // Step 7: Persist FinancialProfile to MongoDB (upsert pattern)
    await FinancialProfile.findOneAndUpdate(
      { user_id: user.user_id },
      {
        user_id: user.user_id,
        
        // Income Profile
        baseline: incomeProfile.baseline,
        volatility: incomeProfile.volatility,
        consistency: incomeProfile.consistency,
        trend: incomeProfile.trend,
        prediction: incomeProfile.prediction,
        
        // Savings Pocket
        surplus: savingsPocket.surplus,
        suggested_amount: savingsPocket.suggested_amount,
        savings_streak: savingsPocket.streak,
        rainy_day: savingsPocket.rainy_day,
        
        // Resilience Score
        resilience_score: resilienceScore.score,
        previous_score: resilienceScore.previous_score,
        score_change: resilienceScore.score_change,
        score_factors: resilienceScore.factors,
        
        // Loan Risk
        loan_risk: loanRisk.level,
        
        updated_at: new Date()
      },
      { 
        upsert: true, 
        new: true,
        runValidators: true 
      }
    );

    // Step 8: Build nudge context for Member 4's AI integration
    // Contains ONLY backend facts, no AI generation here
    const nudgeContext = {
      today_income: transaction.amount,
      baseline: incomeProfile.baseline,
      trend: incomeProfile.trend,
      surplus: savingsPocket.surplus,
      suggested_saving: savingsPocket.suggested_amount,
      savings_streak: savingsPocket.streak,
      current_score: resilienceScore.score,
      previous_score: resilienceScore.previous_score,
      score_change: resilienceScore.score_change,
      loan_risk: loanRisk.level,
      rainy_day_progress: savingsPocket.rainy_day?.progress || 0
    };

    // Step 9: Return complete pipeline result
    return {
      transaction: {
        transaction_id: transaction.transaction_id,
        user_id: transaction.user_id,
        amount: transaction.amount,
        date: transaction.date,
        source: transaction.source,
        created_at: transaction.created_at
      },
      income_profile: incomeProfile,
      savings_pocket: savingsPocket,
      resilience_score: resilienceScore,
      loan_risk: loanRisk,
      nudge_context: nudgeContext
    };

  } catch (error) {
    console.error('Pipeline processing error:', error);
    throw error;
  }
};

module.exports = {
  processTransaction
};
