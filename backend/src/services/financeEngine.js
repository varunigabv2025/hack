/**
 * RESILIENCE ENGINE - FINANCIAL INTELLIGENCE & SCORING
 * 
 * Member 2 Implementation
 * 
 * IMPORTANT: All calculations are deterministic, explainable, and reproducible.
 * NO machine learning, NO random predictions, NO fake precision.
 * 
 * This module provides pure calculation functions that Member 1's pipeline calls directly.
 */

/**
 * Calculate rolling income baseline using 7-day window
 * 
 * @param {Array} transactions - Array of transaction objects sorted by date (newest first)
 * @param {Object} user - User object with profile information
 * @returns {Object} Income profile with baseline, volatility, consistency, trend, prediction
 */
const calculateIncomeProfile = (transactions, user) => {
  // Handle edge case: no transactions
  if (!transactions || transactions.length === 0) {
    return {
      baseline: 0,
      volatility: 'low',
      consistency: 0,
      trend: 'stable',
      prediction: {
        min: 0,
        max: 0,
        confidence: 'low'
      }
    };
  }

  // Handle edge case: single transaction
  if (transactions.length === 1) {
    const amount = transactions[0].amount;
    return {
      baseline: amount,
      volatility: 'low',
      consistency: 1.0,
      trend: 'stable',
      prediction: {
        min: Math.round(amount * 0.9),
        max: Math.round(amount * 1.1),
        confidence: 'low'
      }
    };
  }

  // Calculate 7-day rolling baseline (median of last 7 days' income)
  const last7Days = transactions.slice(0, Math.min(7, transactions.length));
  const amounts = last7Days.map(t => t.amount).sort((a, b) => a - b);
  const baseline = amounts.length % 2 === 0
    ? (amounts[amounts.length / 2 - 1] + amounts[amounts.length / 2]) / 2
    : amounts[Math.floor(amounts.length / 2)];

  // Calculate volatility using coefficient of variation
  const mean = amounts.reduce((sum, amt) => sum + amt, 0) / amounts.length;
  const variance = amounts.reduce((sum, amt) => sum + Math.pow(amt - mean, 2), 0) / amounts.length;
  const stdDev = Math.sqrt(variance);
  const coefficientOfVariation = mean > 0 ? stdDev / mean : 0;

  let volatility;
  if (coefficientOfVariation < 0.15) {
    volatility = 'low';
  } else if (coefficientOfVariation < 0.35) {
    volatility = 'medium';
  } else {
    volatility = 'high';
  }

  // Calculate consistency (inverse of volatility)
  const consistency = Math.max(0, Math.min(1, 1 - coefficientOfVariation));

  // Calculate trend: compare recent vs earlier income
  const trend = calculateTrend(transactions);

  // Calculate prediction range based on baseline and trend
  const prediction = calculatePrediction(baseline, trend, volatility, mean);

  return {
    baseline: Math.round(baseline),
    volatility,
    consistency: Math.round(consistency * 100) / 100,
    trend,
    prediction
  };
};

/**
 * Helper: Calculate income trend
 */
const calculateTrend = (transactions) => {
  if (transactions.length < 3) {
    return 'stable';
  }

  // Split into recent (first half) and earlier (second half)
  const midPoint = Math.floor(transactions.length / 2);
  const recent = transactions.slice(0, midPoint);
  const earlier = transactions.slice(midPoint);

  const recentAvg = recent.reduce((sum, t) => sum + t.amount, 0) / recent.length;
  const earlierAvg = earlier.reduce((sum, t) => sum + t.amount, 0) / earlier.length;

  const percentChange = earlierAvg > 0 ? (recentAvg - earlierAvg) / earlierAvg : 0;

  if (percentChange > 0.1) {
    return 'increasing';
  } else if (percentChange < -0.1) {
    return 'declining';
  } else {
    return 'stable';
  }
};

/**
 * Helper: Calculate next-week income prediction
 */
const calculatePrediction = (baseline, trend, volatility, mean) => {
  let trendAdjustment = 1.0;
  
  if (trend === 'increasing') {
    trendAdjustment = 1.05;
  } else if (trend === 'declining') {
    trendAdjustment = 0.95;
  }

  const predictedMean = baseline * trendAdjustment;

  // Create range based on volatility
  let rangePercent;
  if (volatility === 'low') {
    rangePercent = 0.10; // ±10%
  } else if (volatility === 'medium') {
    rangePercent = 0.20; // ±20%
  } else {
    rangePercent = 0.30; // ±30%
  }

  return {
    min: Math.round(predictedMean * (1 - rangePercent)),
    max: Math.round(predictedMean * (1 + rangePercent)),
    confidence: volatility === 'low' ? 'high' : volatility === 'medium' ? 'medium' : 'low'
  };
};

/**
 * Calculate savings pocket and suggestions
 * 
 * @param {Object} params - { todayIncome, incomeProfile, transactions, user }
 * @returns {Object} Savings pocket with surplus, suggested_amount, streak, rainy_day
 */
const calculateSavingsPocket = (params) => {
  const { todayIncome, incomeProfile, transactions, user } = params;

  // Calculate surplus
  const surplus = Math.max(0, todayIncome - incomeProfile.baseline);

  // Calculate conservative safe-to-save amount (40% of surplus)
  // This leaves buffer for unexpected expenses
  const suggested_amount = Math.round(surplus * 0.4);

  // Calculate savings streak
  const streak = calculateSavingsStreak(transactions, incomeProfile.baseline);

  // Calculate rainy-day fund
  const rainy_day = calculateRainyDayFund(transactions, user, incomeProfile.baseline);

  return {
    surplus: Math.round(surplus),
    suggested_amount,
    streak,
    rainy_day
  };
};

/**
 * Helper: Calculate consecutive savings days
 */
const calculateSavingsStreak = (transactions, baseline) => {
  if (!transactions || transactions.length === 0) {
    return 0;
  }

  let streak = 0;
  let lastDate = null;

  // Group transactions by date
  const transactionsByDate = {};
  transactions.forEach(t => {
    const dateStr = new Date(t.date).toISOString().split('T')[0];
    if (!transactionsByDate[dateStr]) {
      transactionsByDate[dateStr] = [];
    }
    transactionsByDate[dateStr].push(t);
  });

  // Get sorted dates (newest first)
  const dates = Object.keys(transactionsByDate).sort().reverse();

  for (const dateStr of dates) {
    const dayTransactions = transactionsByDate[dateStr];
    const dayTotal = dayTransactions.reduce((sum, t) => sum + t.amount, 0);

    // Check if day had surplus (income > baseline)
    if (dayTotal > baseline) {
      // Assume saved if surplus exists
      streak++;
      lastDate = new Date(dateStr);
    } else {
      // Streak broken
      break;
    }

    // Only count up to reasonable streak limit
    if (streak >= 365) break;
  }

  return streak;
};

/**
 * Helper: Calculate rainy-day fund progress
 */
const calculateRainyDayFund = (transactions, user, baseline) => {
  // Target: 30 days of monthly expenses
  const target = user.monthly_expense || baseline * 30;

  // Calculate accumulated savings (simplified: 40% of all historical surplus)
  let accumulated = 0;
  if (transactions && transactions.length > 0) {
    transactions.forEach(t => {
      const surplus = Math.max(0, t.amount - baseline);
      accumulated += surplus * 0.4; // 40% of surplus saved
    });
  }

  accumulated = Math.round(accumulated);
  const progress = target > 0 ? Math.min(1, accumulated / target) : 0;

  return {
    current: accumulated,
    target: Math.round(target),
    progress: Math.round(progress * 100) / 100
  };
};

/**
 * Calculate resilience score (0-100) based on multiple factors
 * 
 * @param {Object} params - { incomeProfile, savingsPocket, transactions, loans, user }
 * @returns {Object} Resilience score with factors and change
 */
const calculateResilienceScore = (params) => {
  const { incomeProfile, savingsPocket, transactions, loans, user } = params;

  // Get previous score from last calculation (if available)
  // For now, we'll calculate from scratch each time
  const previous_score = 50; // Default starting score

  // Calculate component scores (each 0-100)
  const incomeStabilityScore = calculateIncomeStabilityScore(incomeProfile);
  const savingsBehaviorScore = calculateSavingsBehaviorScore(savingsPocket, transactions);
  const debtBurdenScore = calculateDebtBurdenScore(loans, incomeProfile.baseline);
  const emergencyBufferScore = calculateEmergencyBufferScore(savingsPocket.rainy_day);

  // Weighted average
  const weights = {
    incomeStability: 0.30,
    savingsBehavior: 0.30,
    debtBurden: 0.25,
    emergencyBuffer: 0.15
  };

  const score = Math.round(
    incomeStabilityScore * weights.incomeStability +
    savingsBehaviorScore * weights.savingsBehavior +
    debtBurdenScore * weights.debtBurden +
    emergencyBufferScore * weights.emergencyBuffer
  );

  const score_change = score - previous_score;

  // Build factor breakdown
  const factors = {
    income_stability: Math.round(incomeStabilityScore),
    savings_behavior: Math.round(savingsBehaviorScore),
    debt_burden: Math.round(debtBurdenScore),
    emergency_buffer: Math.round(emergencyBufferScore)
  };

  return {
    score: Math.max(0, Math.min(100, score)),
    previous_score,
    score_change,
    factors
  };
};

/**
 * Helper: Calculate income stability score
 */
const calculateIncomeStabilityScore = (incomeProfile) => {
  let score = 50; // Base score

  // Consistency contributes 0-40 points
  score += incomeProfile.consistency * 40;

  // Trend contributes -10 to +10 points
  if (incomeProfile.trend === 'increasing') {
    score += 10;
  } else if (incomeProfile.trend === 'declining') {
    score -= 10;
  }

  // Volatility affects score
  if (incomeProfile.volatility === 'low') {
    score += 0; // Already captured in consistency
  } else if (incomeProfile.volatility === 'high') {
    score -= 5;
  }

  return Math.max(0, Math.min(100, score));
};

/**
 * Helper: Calculate savings behavior score
 */
const calculateSavingsBehaviorScore = (savingsPocket, transactions) => {
  let score = 30; // Base score

  // Savings streak contributes up to 40 points
  const streakScore = Math.min(40, savingsPocket.streak * 2);
  score += streakScore;

  // Rainy-day progress contributes up to 30 points
  const progressScore = savingsPocket.rainy_day.progress * 30;
  score += progressScore;

  return Math.max(0, Math.min(100, score));
};

/**
 * Helper: Calculate debt burden score (inverse - lower debt = higher score)
 */
const calculateDebtBurdenScore = (loans, baseline) => {
  if (!loans || loans.length === 0) {
    return 100; // No debt = perfect score
  }

  const totalMonthlyPayment = loans.reduce((sum, loan) => sum + (loan.monthly_payment || 0), 0);
  const monthlyIncome = baseline * 30; // Approximate monthly income

  if (monthlyIncome === 0) {
    return loans.length > 0 ? 30 : 100;
  }

  const debtToIncomeRatio = totalMonthlyPayment / monthlyIncome;

  // Score decreases as debt-to-income ratio increases
  if (debtToIncomeRatio < 0.2) {
    return 90; // Very manageable
  } else if (debtToIncomeRatio < 0.4) {
    return 70; // Manageable
  } else if (debtToIncomeRatio < 0.6) {
    return 50; // Concerning
  } else {
    return 30; // High burden
  }
};

/**
 * Helper: Calculate emergency buffer score
 */
const calculateEmergencyBufferScore = (rainyDay) => {
  // Score based on rainy-day fund progress
  return Math.round(rainyDay.progress * 100);
};

/**
 * Calculate loan stacking risk
 * 
 * @param {Array} loans - Array of active loan objects
 * @returns {Object} Loan risk with level and details
 */
const calculateLoanRisk = (loans) => {
  if (!loans || loans.length === 0) {
    return {
      level: 'low',
      active_loans: 0,
      total_monthly_payment: 0,
      payment_to_income_ratio: 0
    };
  }

  const activeLoans = loans.filter(l => l.status === 'active');
  const totalMonthlyPayment = activeLoans.reduce((sum, l) => sum + (l.monthly_payment || 0), 0);

  // Determine risk level based on loan count
  let level;
  if (activeLoans.length === 0) {
    level = 'low';
  } else if (activeLoans.length === 1) {
    level = 'low';
  } else if (activeLoans.length === 2) {
    level = 'medium';
  } else {
    level = 'high';
  }

  return {
    level,
    active_loans: activeLoans.length,
    total_monthly_payment: Math.round(totalMonthlyPayment),
    payment_to_income_ratio: 0 // Will be calculated with baseline if needed
  };
};

module.exports = {
  calculateIncomeProfile,
  calculateSavingsPocket,
  calculateResilienceScore,
  calculateLoanRisk
};
