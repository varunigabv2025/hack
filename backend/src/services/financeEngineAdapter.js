/**
 * FINANCE ENGINE ADAPTER
 * 
 * This adapter imports Member 2's finance engine and wraps its functions with error handling
 */

import * as financeEngine from './financeEngine.js';

/**
 * Calculate income profile from transaction history
 */
export const calculateIncomeProfile = (transactions, user) => {
  try {
    if (financeEngine && financeEngine.calculateIncomeProfile) {
      return financeEngine.calculateIncomeProfile(transactions, user);
    }
    
    // Fallback if finance engine not available
    console.warn('⚠️  Using fallback income profile calculation');
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
 */
export const calculateSavingsPocket = (params) => {
  try {
    if (financeEngine && financeEngine.calculateSavingsPocket) {
      return financeEngine.calculateSavingsPocket(params);
    }
    
    console.warn('⚠️  Using fallback savings pocket calculation');
    const { todayIncome, incomeProfile, user } = params;
    const surplus = Math.max(0, todayIncome - incomeProfile.baseline);
    
    return {
      surplus,
      suggested_amount: Math.round(surplus * 0.4),
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
 */
export const calculateResilienceScore = (params) => {
  try {
    if (financeEngine && financeEngine.calculateResilienceScore) {
      return financeEngine.calculateResilienceScore(params);
    }
    
    console.warn('⚠️  Using fallback resilience score calculation');
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
 */
export const calculateLoanRisk = (loans) => {
  try {
    if (financeEngine && financeEngine.calculateLoanRisk) {
      return financeEngine.calculateLoanRisk(loans);
    }
    
    console.warn('⚠️  Using fallback loan risk calculation');
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

