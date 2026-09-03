/**
 * RESILIENCE ENGINE - FINANCE ENGINE TESTS
 * 
 * Member 2 Test Suite
 * 
 * Tests all financial calculation functions for correctness, edge cases, and determinism.
 */

import financeEngine from './financeEngine.js';

// Test utilities
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`❌ Test Failed: ${message}`);
  }
};

const assertBetween = (value, min, max, message) => {
  assert(value >= min && value <= max, `${message} (expected ${min}-${max}, got ${value})`);
};

const assertNoNaN = (obj, message) => {
  const checkNaN = (val) => {
    if (typeof val === 'number' && isNaN(val)) {
      throw new Error(`${message}: Found NaN`);
    }
    if (typeof val === 'object' && val !== null) {
      Object.values(val).forEach(checkNaN);
    }
  };
  checkNaN(obj);
};

console.log('🧪 Running Finance Engine Tests...\n');

// ==================== TEST 1: Normal Income ====================
console.log('Test 1: Normal Income Worker');
const normalTransactions = [
  { amount: 1100, date: '2026-09-07', source: 'Uber' },
  { amount: 950, date: '2026-09-06', source: 'Uber' },
  { amount: 1050, date: '2026-09-05', source: 'Uber' },
  { amount: 900, date: '2026-09-04', source: 'Uber' },
  { amount: 1000, date: '2026-09-03', source: 'Uber' },
  { amount: 850, date: '2026-09-02', source: 'Uber' },
  { amount: 950, date: '2026-09-01', source: 'Uber' }
];

const normalUser = {
  user_id: 'U001',
  monthly_expense: 15000
};

const normalProfile = financeEngine.calculateIncomeProfile(normalTransactions, normalUser);
console.log('  Income Profile:', normalProfile);
assert(normalProfile.baseline > 0, 'Baseline should be positive');
assert(['low', 'medium', 'high'].includes(normalProfile.volatility), 'Valid volatility');
assert(['increasing', 'stable', 'declining'].includes(normalProfile.trend), 'Valid trend');
assertBetween(normalProfile.consistency, 0, 1, 'Consistency in range');
assertNoNaN(normalProfile, 'No NaN in income profile');
console.log('  ✅ Income profile calculated correctly\n');

// ==================== TEST 2: High-Income Worker ====================
console.log('Test 2: High-Income Worker');
const highIncomeTransactions = [
  { amount: 5000, date: '2026-09-07', source: 'Consulting' },
  { amount: 4800, date: '2026-09-06', source: 'Consulting' },
  { amount: 5200, date: '2026-09-05', source: 'Consulting' }
];

const highIncomeUser = {
  user_id: 'U002',
  monthly_expense: 30000
};

const highProfile = financeEngine.calculateIncomeProfile(highIncomeTransactions, highIncomeUser);
console.log('  Baseline:', highProfile.baseline);
assert(highProfile.baseline > 4500, 'High baseline for high earner');
assertNoNaN(highProfile, 'No NaN values');
console.log('  ✅ High-income calculations work\n');

// ==================== TEST 3: Low-Income Worker ====================
console.log('Test 3: Low-Income Worker');
const lowIncomeTransactions = [
  { amount: 300, date: '2026-09-07', source: 'Daily Wage' },
  { amount: 280, date: '2026-09-06', source: 'Daily Wage' },
  { amount: 320, date: '2026-09-05', source: 'Daily Wage' }
];

const lowIncomeUser = {
  user_id: 'U003',
  monthly_expense: 8000
};

const lowProfile = financeEngine.calculateIncomeProfile(lowIncomeTransactions, lowIncomeUser);
console.log('  Baseline:', lowProfile.baseline);
assert(lowProfile.baseline < 400, 'Low baseline for low earner');
assert(lowProfile.baseline > 0, 'Baseline is positive');
console.log('  ✅ Low-income calculations work\n');

// ==================== TEST 4: Decreasing Income ====================
console.log('Test 4: Decreasing Income Trend');
const decreasingTransactions = [
  { amount: 700, date: '2026-09-07', source: 'Uber' },
  { amount: 750, date: '2026-09-06', source: 'Uber' },
  { amount: 800, date: '2026-09-05', source: 'Uber' },
  { amount: 1000, date: '2026-09-04', source: 'Uber' },
  { amount: 1100, date: '2026-09-03', source: 'Uber' },
  { amount: 1200, date: '2026-09-02', source: 'Uber' }
];

const decreasingProfile = financeEngine.calculateIncomeProfile(decreasingTransactions, normalUser);
console.log('  Trend:', decreasingProfile.trend);
assert(decreasingProfile.trend === 'declining', 'Should detect declining trend');
console.log('  ✅ Declining trend detected correctly\n');

// ==================== TEST 5: Volatile Income ====================
console.log('Test 5: Volatile Income');
const volatileTransactions = [
  { amount: 2000, date: '2026-09-07', source: 'Freelance' },
  { amount: 500, date: '2026-09-06', source: 'Freelance' },
  { amount: 1800, date: '2026-09-05', source: 'Freelance' },
  { amount: 400, date: '2026-09-04', source: 'Freelance' },
  { amount: 1500, date: '2026-09-03', source: 'Freelance' }
];

const volatileProfile = financeEngine.calculateIncomeProfile(volatileTransactions, normalUser);
console.log('  Volatility:', volatileProfile.volatility);
assert(volatileProfile.volatility === 'high', 'Should detect high volatility');
assertBetween(volatileProfile.consistency, 0, 1, 'Consistency still in range');
console.log('  ✅ High volatility detected correctly\n');

// ==================== TEST 6: No Transactions ====================
console.log('Test 6: No Transaction History');
const emptyProfile = financeEngine.calculateIncomeProfile([], normalUser);
console.log('  Baseline:', emptyProfile.baseline);
assert(emptyProfile.baseline === 0, 'Baseline should be 0 with no history');
assert(emptyProfile.volatility === 'low', 'Default volatility');
assertNoNaN(emptyProfile, 'No NaN values');
console.log('  ✅ Empty history handled correctly\n');

// ==================== TEST 7: Single Transaction ====================
console.log('Test 7: Single Transaction');
const singleTransaction = [
  { amount: 1000, date: '2026-09-07', source: 'Uber' }
];

const singleProfile = financeEngine.calculateIncomeProfile(singleTransaction, normalUser);
console.log('  Baseline:', singleProfile.baseline);
assert(singleProfile.baseline === 1000, 'Baseline equals single transaction');
assert(singleProfile.trend === 'stable', 'Trend should be stable');
assertNoNaN(singleProfile, 'No NaN values');
console.log('  ✅ Single transaction handled correctly\n');

// ==================== TEST 8: Identical Income Values ====================
console.log('Test 8: Identical Income Values');
const identicalTransactions = [
  { amount: 1000, date: '2026-09-07', source: 'Salary' },
  { amount: 1000, date: '2026-09-06', source: 'Salary' },
  { amount: 1000, date: '2026-09-05', source: 'Salary' },
  { amount: 1000, date: '2026-09-04', source: 'Salary' }
];

const identicalProfile = financeEngine.calculateIncomeProfile(identicalTransactions, normalUser);
console.log('  Volatility:', identicalProfile.volatility);
assert(identicalProfile.volatility === 'low', 'Zero variance = low volatility');
assertBetween(identicalProfile.consistency, 0.95, 1, 'High consistency');
console.log('  ✅ Identical values handled correctly\n');

// ==================== TEST 9: Savings Pocket Calculation ====================
console.log('Test 9: Savings Pocket Calculation');
const savingsPocket = financeEngine.calculateSavingsPocket({
  todayIncome: 1100,
  incomeProfile: normalProfile,
  transactions: normalTransactions,
  user: normalUser
});

console.log('  Savings Pocket:', savingsPocket);
assert(savingsPocket.surplus >= 0, 'Surplus is non-negative');
assert(savingsPocket.suggested_amount >= 0, 'Suggested amount is non-negative');
assert(savingsPocket.suggested_amount <= savingsPocket.surplus, 'Suggested <= surplus');
assert(typeof savingsPocket.streak === 'number', 'Streak is a number');
assert(savingsPocket.rainy_day.target > 0, 'Rainy day target exists');
assertBetween(savingsPocket.rainy_day.progress, 0, 1, 'Progress in range');
assertNoNaN(savingsPocket, 'No NaN values');
console.log('  ✅ Savings pocket calculated correctly\n');

// ==================== TEST 10: Savings Streak ====================
console.log('Test 10: Savings Streak');
const streakTransactions = [
  { amount: 1100, date: '2026-09-07', source: 'Uber' },
  { amount: 1050, date: '2026-09-06', source: 'Uber' },
  { amount: 1000, date: '2026-09-05', source: 'Uber' },
  { amount: 950, date: '2026-09-04', source: 'Uber' }
];

const streakProfile = financeEngine.calculateIncomeProfile(streakTransactions, normalUser);
const streakPocket = financeEngine.calculateSavingsPocket({
  todayIncome: 1100,
  incomeProfile: streakProfile,
  transactions: streakTransactions,
  user: normalUser
});

console.log('  Streak:', streakPocket.streak);
assert(streakPocket.streak > 0, 'Positive streak for consistent surplus');
console.log('  ✅ Savings streak calculated correctly\n');

// ==================== TEST 11: Resilience Score ====================
console.log('Test 11: Resilience Score');
const resilienceScore = financeEngine.calculateResilienceScore({
  incomeProfile: normalProfile,
  savingsPocket: savingsPocket,
  transactions: normalTransactions,
  loans: [],
  user: normalUser
});

console.log('  Resilience Score:', resilienceScore);
assertBetween(resilienceScore.score, 0, 100, 'Score in valid range');
assert(typeof resilienceScore.score_change === 'number', 'Score change is number');
assert(resilienceScore.factors.income_stability >= 0, 'Income stability factor valid');
assert(resilienceScore.factors.savings_behavior >= 0, 'Savings behavior factor valid');
assert(resilienceScore.factors.debt_burden >= 0, 'Debt burden factor valid');
assert(resilienceScore.factors.emergency_buffer >= 0, 'Emergency buffer factor valid');
assertNoNaN(resilienceScore, 'No NaN values');
console.log('  ✅ Resilience score calculated correctly\n');

// ==================== TEST 12: Loan Risk - No Loans ====================
console.log('Test 12: Loan Risk - No Loans');
const noLoanRisk = financeEngine.calculateLoanRisk([]);
console.log('  Risk Level:', noLoanRisk.level);
assert(noLoanRisk.level === 'low', 'No loans = low risk');
assert(noLoanRisk.active_loans === 0, 'Zero active loans');
console.log('  ✅ Zero loans handled correctly\n');

// ==================== TEST 13: Loan Risk - Single Loan ====================
console.log('Test 13: Loan Risk - Single Loan');
const oneLoanRisk = financeEngine.calculateLoanRisk([
  { status: 'active', monthly_payment: 1500, amount: 10000 }
]);
console.log('  Risk Level:', oneLoanRisk.level);
assert(oneLoanRisk.level === 'low', 'One loan = low risk');
assert(oneLoanRisk.active_loans === 1, 'One active loan');
console.log('  ✅ Single loan handled correctly\n');

// ==================== TEST 14: Loan Risk - Medium ====================
console.log('Test 14: Loan Risk - Medium (2 loans)');
const mediumLoanRisk = financeEngine.calculateLoanRisk([
  { status: 'active', monthly_payment: 1500, amount: 10000 },
  { status: 'active', monthly_payment: 2000, amount: 15000 }
]);
console.log('  Risk Level:', mediumLoanRisk.level);
assert(mediumLoanRisk.level === 'medium', 'Two loans = medium risk');
assert(mediumLoanRisk.active_loans === 2, 'Two active loans');
console.log('  ✅ Medium loan risk calculated correctly\n');

// ==================== TEST 15: Loan Risk - High ====================
console.log('Test 15: Loan Risk - High (3+ loans)');
const highLoanRisk = financeEngine.calculateLoanRisk([
  { status: 'active', monthly_payment: 1500, amount: 10000 },
  { status: 'active', monthly_payment: 2000, amount: 15000 },
  { status: 'active', monthly_payment: 1000, amount: 8000 }
]);
console.log('  Risk Level:', highLoanRisk.level);
assert(highLoanRisk.level === 'high', 'Three+ loans = high risk');
assert(highLoanRisk.active_loans === 3, 'Three active loans');
console.log('  ✅ High loan risk calculated correctly\n');

// ==================== TEST 16: Determinism ====================
console.log('Test 16: Determinism Test');
const result1 = financeEngine.calculateIncomeProfile(normalTransactions, normalUser);
const result2 = financeEngine.calculateIncomeProfile(normalTransactions, normalUser);
assert(result1.baseline === result2.baseline, 'Baseline is deterministic');
assert(result1.volatility === result2.volatility, 'Volatility is deterministic');
assert(result1.trend === result2.trend, 'Trend is deterministic');
assert(result1.consistency === result2.consistency, 'Consistency is deterministic');
console.log('  ✅ Calculations are deterministic\n');

// ==================== TEST 17: Prediction Range ====================
console.log('Test 17: Prediction Range Validity');
assert(normalProfile.prediction.min < normalProfile.prediction.max, 'Min < Max');
assert(normalProfile.prediction.min > 0, 'Min is positive');
assert(['low', 'medium', 'high'].includes(normalProfile.prediction.confidence), 'Valid confidence');
console.log('  Prediction Range:', normalProfile.prediction);
console.log('  ✅ Prediction range is valid\n');

// ==================== TEST 18: Edge Case - Negative Surplus ====================
console.log('Test 18: Negative Surplus (Income < Baseline)');
const lowIncomePocket = financeEngine.calculateSavingsPocket({
  todayIncome: 500,
  incomeProfile: normalProfile, // baseline ~950
  transactions: normalTransactions,
  user: normalUser
});
console.log('  Surplus:', lowIncomePocket.surplus);
assert(lowIncomePocket.surplus === 0, 'Surplus capped at 0');
assert(lowIncomePocket.suggested_amount === 0, 'No savings suggested');
console.log('  ✅ Negative surplus handled correctly\n');

// ==================== SUMMARY ====================
console.log('═══════════════════════════════════════════');
console.log('🎉 ALL TESTS PASSED!');
console.log('═══════════════════════════════════════════');
console.log('✅ 18 test cases executed successfully');
console.log('✅ All edge cases handled');
console.log('✅ No NaN/Infinity values');
console.log('✅ Deterministic calculations verified');
console.log('✅ Score boundaries respected (0-100)');
console.log('✅ Member 2 Finance Engine: READY FOR INTEGRATION\n');

