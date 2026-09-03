/**
 * FINANCE ENGINE ADAPTER
 * 
 * This is an INTERFACE/PLACEHOLDER for Member 2's finance engine.
 * 
 * Member 2 will provide the actual implementation in financeEngine.js
 * 
 * This adapter wraps Member 2's functions with:
 * - Error handling
 * - Fallback values
 * - Logging
 * 
 * IMPORTANT: Member 1 does NOT implement the financial formulas.
 * Member 2 owns all calculation logic.
 */

// TODO: Member 2 will provide this file
// For now, we'll try to import it, but provide mock fallbacks
let financeEngine;
try {
  financeEngine = require('./financeEngine');
} catch (error) {
  console.warn('⚠️  financeEngine.js not found. Using mock calculations.');
  console.warn('   Member 2 should provide backend/src/services/financeEngine.js');
  financeEngine = null;
}

/**
 * Calculate income profile from transaction history
 * 
 * @param {Array} transactions - Array of transaction objects
 * @param {Object} user - User object
 * @returns {Object} Income profile with baseline, volatility, trend, prediction
 */
const calculateIncomeProfile = (transactions, user) => {
  try {
    if (financeEngine && financeEngine.calculateIncomeProfile) {
      return financeEngine.calculateIncomeProfile(transactions, user);
    }
    
    // MOCK FALLBACK (Member 2 will replace this)
    console.warn('⚠️  Using mock income profile calculation');
    return {
      baseline: transactions.length > 0 
        ? transactions.reduce((sum, t) => sum + t.amount, 0) / transactions.length 
        : 0,
      volatility: 'medium',
      consistency: 0.5,
      trend: 'stable',
      prediction: {
        next_7_days: 0,
        confidence: 'low'
      }
    };
  } catch (error) {
    console.error('Error in calculateIncomeProfile:', error);
    throw new Error('FINANCE_ENGINE_ERROR: Income profile calculation failed');
  }
};

/**
 * Calculate savings pocket suggestion
 * 
 * @param {Object} params - { todayIncome, incomeProfile, transactions, user }
 * @returns {Object} Savings pocket with surplus, suggested_amount, streak, rainy_day
 */
const calculateSavingsPocket = (params) => {
  try {
    if (financeEngine && financeEngine.calculateSavingsPocket) {
      return financeEngine.calculateSavingsPocket(params);
    }
    
    // MOCK FALLBACK (Member 2 will replace this)
    console.warn('⚠️  Using mock savings pocket calculation');
    const { todayIncome, incomeProfile, user } = params;
    const surplus = Math.max(0, todayIncome - incomeProfile.baseline);
    
    return {
      surplus,
      suggested_amount: Math.round(surplus * 0.4), // 40% of surplus
      streak: 0,
      rainy_day: {
        current: 0,
        target: user.monthly_expense || 15000,
        progress: 0
      }
    };
  } catch (error) {
    console.error('Error in calculateSavingsPocket:', error);
    throw new Error('FINANCE_ENGINE_ERROR: Savings pocket calculation failed');
  }
};

/**
 * Calculate resilience score (0-100)
 * 
 * @param {Object} params - { incomeProfile, savingsPocket, transactions, loans, user }
 * @returns {Object} Resilience score with factors and change
 */
const calculateResilienceScore = (params) => {
  try {
    if (financeEngine && financeEngine.calculateResilienceScore) {
      return financeEngine.calculateResilienceScore(params);
    }
    
    // MOCK FALLBACK (Member 2 will replace this)
    console.warn('⚠️  Using mock resilience score calculation');
    return {
      score: 50,
      previous_score: 50,
      score_change: 0,
      factors: {
        income_stability: 50,
        savings_behavior: 50,
        debt_burden: 50,
        emergency_buffer: 50
      }
    };
  } catch (error) {
    console.error('Error in calculateResilienceScore:', error);
    throw new Error('FINANCE_ENGINE_ERROR: Resilience score calculation failed');
  }
};

/**
 * Calculate loan risk level
 * 
 * @param {Array} loans - Array of active loan objects
 * @returns {Object} Loan risk with level and details
 */
const calculateLoanRisk = (loans) => {
  try {
    if (financeEngine && financeEngine.calculateLoanRisk) {
      return financeEngine.calculateLoanRisk(loans);
    }
    
    // MOCK FALLBACK (Member 2 will replace this)
    console.warn('⚠️  Using mock loan risk calculation');
    const activeLoans = loans.filter(l => l.status === 'active');
    const totalMonthlyPayment = activeLoans.reduce((sum, l) => sum + l.monthly_payment, 0);
    
    return {
      level: activeLoans.length === 0 ? 'low' : activeLoans.length > 2 ? 'high' : 'medium',
      active_loans: activeLoans.length,
      total_monthly_payment: totalMonthlyPayment,
      payment_to_income_ratio: 0
    };
  } catch (error) {
    console.error('Error in calculateLoanRisk:', error);
    throw new Error('FINANCE_ENGINE_ERROR: Loan risk calculation failed');
  }
};

module.exports = {
  calculateIncomeProfile,
  calculateSavingsPocket,
  calculateResilienceScore,
  calculateLoanRisk
};
