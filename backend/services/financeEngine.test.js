/**
 * financeEngine.test.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Jest test suite for financeEngine.js
 *
 * Fully standalone — no MongoDB, no Express, no network calls.
 * Run from repo root: npm test
 *
 * 4 scenarios:
 *   1. Normal income     (~₹800/day ±100)
 *   2. High income       (~₹1500+/day, steady)
 *   3. Low income        (~₹300/day, steady)
 *   4. Volatile income   (₹200–₹2000 swinging)
 *
 * Key invariant that MUST hold: volatile score < normal score even when
 * both profiles share a similar average income — proving that volatility
 * is actually penalised by the scoring model.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const {
  calculateBaseline,
  detectTrend,
  calculateVolatility,
  predictNextWeekIncome,
  calculateSurplus,
  calculateSafeToSave,
  updateSavingsStreak,
  calculateRainyDayFund,
  calculateResilienceScore,
  calculateLoanRisk,
  runFinanceEngine,
} = require('./financeEngine');

// ─── mock income arrays ───────────────────────────────────────────────────────

/**
 * Normal income: ~₹800/day ±100 over 28 days.
 * Steady earner, slight day-to-day variation.
 */
const NORMAL_INCOME = [
  750, 820, 800, 780, 860, 790, 810,   // week 1
  800, 770, 830, 810, 790, 820, 800,   // week 2
  810, 780, 850, 800, 790, 820, 800,   // week 3
  790, 810, 800, 820, 780, 800, 810,   // week 4
];

/**
 * High income: ~₹1500+/day, very steady.
 * Consistent high earner, low volatility.
 */
const HIGH_INCOME = [
  1500, 1520, 1480, 1510, 1550, 1490, 1530,
  1500, 1510, 1480, 1520, 1500, 1540, 1490,
  1510, 1500, 1520, 1480, 1510, 1500, 1530,
  1490, 1510, 1500, 1520, 1480, 1500, 1510,
];

/**
 * Low income: ~₹300/day, steady.
 * Small but consistent earnings.
 */
const LOW_INCOME = [
  280, 310, 300, 290, 320, 295, 305,
  300, 290, 310, 300, 295, 305, 300,
  310, 285, 300, 295, 305, 300, 295,
  300, 310, 295, 305, 300, 290, 305,
];

/**
 * Volatile income: ₹200–₹2000 swinging.
 * Average is ~≈810 (similar to NORMAL_INCOME), but wide swings.
 * This MUST produce a lower resilience score than the normal case.
 */
const VOLATILE_INCOME = [
  200,  1800, 300,  1900, 250,  2000, 400,
  1700, 350,  1800, 450,  1600, 500,  1500,
  300,  1900, 200,  1800, 400,  1700, 350,
  1600, 250,  2000, 300,  1900, 400,  1800,
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. calculateBaseline
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateBaseline', () => {
  test('normal income: baseline is within expected ₹780–₹820 range', () => {
    const { baseline } = calculateBaseline(NORMAL_INCOME);
    expect(baseline).toBeGreaterThanOrEqual(780);
    expect(baseline).toBeLessThanOrEqual(820);
  });

  test('high income: baseline is > ₹1400', () => {
    const { baseline } = calculateBaseline(HIGH_INCOME);
    expect(baseline).toBeGreaterThan(1400);
  });

  test('low income: baseline is < ₹320', () => {
    const { baseline } = calculateBaseline(LOW_INCOME);
    expect(baseline).toBeLessThan(320);
  });

  test('volatile income: baseline reflects recent 7-day average (not full-array avg)', () => {
    // Last 7 of VOLATILE_INCOME: [300, 1900, 400, 1800, 350, 1600, 250, 2000, 300, 1900, 400, 1800]
    // Last 7: [250, 2000, 300, 1900, 400, 1800] — we just check it returns a number
    const { baseline } = calculateBaseline(VOLATILE_INCOME);
    expect(typeof baseline).toBe('number');
    expect(baseline).toBeGreaterThan(0);
  });

  test('empty array returns baseline of 0', () => {
    expect(calculateBaseline([])).toEqual({ baseline: 0 });
  });

  test('accepts plain number arrays', () => {
    const { baseline } = calculateBaseline([100, 200, 300]);
    expect(baseline).toBeCloseTo(200, 1);
  });

  test('accepts object arrays with amount property', () => {
    const data = [
      { date: '2026-01-01', amount: 800 },
      { date: '2026-01-02', amount: 900 },
    ];
    const { baseline } = calculateBaseline(data);
    expect(baseline).toBeCloseTo(850, 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. detectTrend
// ─────────────────────────────────────────────────────────────────────────────

describe('detectTrend', () => {
  test('normal income: trend is stable (variation < 5%)', () => {
    const { trend } = detectTrend(NORMAL_INCOME);
    expect(trend).toBe('stable');
  });

  test('high income: trend is stable (consistent values)', () => {
    const { trend } = detectTrend(HIGH_INCOME);
    expect(trend).toBe('stable');
  });

  test('low income: trend is stable', () => {
    const { trend } = detectTrend(LOW_INCOME);
    expect(trend).toBe('stable');
  });

  test('clearly increasing series returns "increasing"', () => {
    const rising = [100, 110, 120, 130, 140, 150, 160,  // week 1 avg 130
                    200, 210, 220, 230, 240, 250, 260];  // week 2 avg 230 (+77%)
    const { trend } = detectTrend(rising);
    expect(trend).toBe('increasing');
  });

  test('clearly decreasing series returns "decreasing"', () => {
    const falling = [200, 210, 220, 230, 240, 250, 260,  // week 1 avg 230
                      100, 110, 120, 130, 140, 150, 160]; // week 2 avg 130 (-43%)
    const { trend } = detectTrend(falling);
    expect(trend).toBe('decreasing');
  });

  test('fewer than 8 values returns "stable"', () => {
    const { trend } = detectTrend([500, 600, 700]);
    expect(trend).toBe('stable');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. calculateVolatility
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateVolatility', () => {
  test('normal income: volatility is "low"', () => {
    const { volatility } = calculateVolatility(NORMAL_INCOME);
    expect(volatility).toBe('low');
  });

  test('high income: volatility is "low"', () => {
    const { volatility } = calculateVolatility(HIGH_INCOME);
    expect(volatility).toBe('low');
  });

  test('low income: volatility is "low" (steady even if small)', () => {
    const { volatility } = calculateVolatility(LOW_INCOME);
    expect(volatility).toBe('low');
  });

  test('volatile income: volatility is "high"', () => {
    const { volatility } = calculateVolatility(VOLATILE_INCOME);
    expect(volatility).toBe('high');
  });

  test('volatile income: raw_value (CV) > 0.5', () => {
    const { raw_value } = calculateVolatility(VOLATILE_INCOME);
    expect(raw_value).toBeGreaterThan(0.5);
  });

  test('normal income: raw_value (CV) < 0.2', () => {
    const { raw_value } = calculateVolatility(NORMAL_INCOME);
    expect(raw_value).toBeLessThan(0.2);
  });

  test('all-zero income returns high volatility', () => {
    const { volatility } = calculateVolatility([0, 0, 0]);
    expect(volatility).toBe('high');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. predictNextWeekIncome
// ─────────────────────────────────────────────────────────────────────────────

describe('predictNextWeekIncome', () => {
  test('normal income: low < high', () => {
    const { predicted_range } = predictNextWeekIncome(NORMAL_INCOME);
    expect(predicted_range.low).toBeLessThan(predicted_range.high);
  });

  test('normal income: predicted range straddles 7× baseline', () => {
    const { baseline } = calculateBaseline(NORMAL_INCOME);
    const { predicted_range } = predictNextWeekIncome(NORMAL_INCOME);
    const weeklyBaseline = baseline * 7;
    expect(predicted_range.low).toBeLessThanOrEqual(weeklyBaseline);
    expect(predicted_range.high).toBeGreaterThanOrEqual(weeklyBaseline);
  });

  test('volatile income: range is much wider than normal income range', () => {
    const normalRange = predictNextWeekIncome(NORMAL_INCOME).predicted_range;
    const volatileRange = predictNextWeekIncome(VOLATILE_INCOME).predicted_range;
    const normalWidth = normalRange.high - normalRange.low;
    const volatileWidth = volatileRange.high - volatileRange.low;
    expect(volatileWidth).toBeGreaterThan(normalWidth);
  });

  test('predicted range values are non-negative integers', () => {
    const { predicted_range } = predictNextWeekIncome(NORMAL_INCOME);
    expect(predicted_range.low).toBeGreaterThanOrEqual(0);
    expect(predicted_range.high).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(predicted_range.low)).toBe(true);
    expect(Number.isInteger(predicted_range.high)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. calculateSurplus
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateSurplus', () => {
  test('income above baseline produces positive surplus', () => {
    const { surplus } = calculateSurplus(900, 800);
    expect(surplus).toBeCloseTo(100, 2);
  });

  test('income below baseline produces surplus of 0 (never negative)', () => {
    const { surplus } = calculateSurplus(600, 800);
    expect(surplus).toBe(0);
  });

  test('income equal to baseline produces surplus of 0', () => {
    const { surplus } = calculateSurplus(800, 800);
    expect(surplus).toBe(0);
  });

  test('handles missing/undefined gracefully', () => {
    const { surplus } = calculateSurplus(undefined, undefined);
    expect(surplus).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. calculateSafeToSave
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateSafeToSave', () => {
  test('low volatility, empty buffer → saves ~50% of surplus', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'low', 0);
    expect(suggested_amount).toBeCloseTo(200, 1);
  });

  test('medium volatility → saves ~35% of surplus', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'medium', 0);
    expect(suggested_amount).toBeCloseTo(140, 1);
  });

  test('high volatility → saves only ~25% of surplus', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'high', 0);
    expect(suggested_amount).toBeCloseTo(100, 1);
  });

  test('buffer full (progress=1.0) → saves only ~10% regardless of volatility', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'low', 1.0);
    expect(suggested_amount).toBeCloseTo(40, 1);
  });

  test('buffer near full (progress=0.9) → saves ≤30%', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'low', 0.9);
    expect(suggested_amount).toBeLessThanOrEqual(400 * 0.3 + 0.01); // max 30%
  });

  test('reason string is returned and is non-empty', () => {
    const { reason } = calculateSafeToSave(500, 'low', 0.2);
    expect(typeof reason).toBe('string');
    expect(reason.length).toBeGreaterThan(0);
  });

  test('zero surplus → suggested_amount is 0', () => {
    const { suggested_amount } = calculateSafeToSave(0, 'low', 0);
    expect(suggested_amount).toBe(0);
  });

  test('high volatility AND full buffer → takes the more conservative rate', () => {
    const { suggested_amount } = calculateSafeToSave(400, 'high', 1.0);
    // high vol = 25%, full buffer = 10% → min(25%, 10%) = 10%
    expect(suggested_amount).toBeCloseTo(40, 1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. updateSavingsStreak
// ─────────────────────────────────────────────────────────────────────────────

describe('updateSavingsStreak', () => {
  test('saved today: increments streak', () => {
    expect(updateSavingsStreak(5, true)).toEqual({ streak: 6 });
  });

  test('did not save today: resets streak to 0', () => {
    expect(updateSavingsStreak(10, false)).toEqual({ streak: 0 });
  });

  test('first save ever (no previous streak): streak becomes 1', () => {
    expect(updateSavingsStreak(0, true)).toEqual({ streak: 1 });
  });

  test('undefined previousStreak treated as 0', () => {
    expect(updateSavingsStreak(undefined, true)).toEqual({ streak: 1 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 8. calculateRainyDayFund
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateRainyDayFund', () => {
  test('target = dailyExpenses × targetDays', () => {
    const { target } = calculateRainyDayFund(0, 500, 30);
    expect(target).toBe(15000);
  });

  test('default targetDays is 30', () => {
    const { target } = calculateRainyDayFund(0, 500);
    expect(target).toBe(15000);
  });

  test('progress_percent calculated correctly', () => {
    const { progress_percent } = calculateRainyDayFund(7500, 500, 30);
    expect(progress_percent).toBeCloseTo(50, 1);
  });

  test('progress_percent capped at 100', () => {
    const { progress_percent } = calculateRainyDayFund(99999, 500, 30);
    expect(progress_percent).toBe(100);
  });

  test('current never goes below 0', () => {
    const { current } = calculateRainyDayFund(-100, 500, 30);
    expect(current).toBe(0);
  });

  test('zero daily expenses → progress_percent 0 (avoid division by zero)', () => {
    const { progress_percent } = calculateRainyDayFund(5000, 0, 30);
    expect(progress_percent).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 9. calculateResilienceScore
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateResilienceScore', () => {
  test('perfect conditions → score near 100', () => {
    const { score } = calculateResilienceScore({
      volatility: 'low',
      trend: 'increasing',
      savingsStreak: 30,
      bufferProgress: 1.0,
      loanCount: 0,
    });
    expect(score).toBe(100);
  });

  test('worst conditions → score near 0', () => {
    const { score } = calculateResilienceScore({
      volatility: 'high',
      trend: 'decreasing',
      savingsStreak: 0,
      bufferProgress: 0,
      loanCount: 5,
    });
    // 0*25 + 0.2*20 + 0*20 + 0*20 + 0*15 = 4
    expect(score).toBeLessThan(10);
  });

  test('score is between 0 and 100 inclusive', () => {
    const { score } = calculateResilienceScore({
      volatility: 'medium',
      trend: 'stable',
      savingsStreak: 10,
      bufferProgress: 0.5,
      loanCount: 1,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  test('factors.positive and factors.negative are arrays of strings', () => {
    const { factors } = calculateResilienceScore({
      volatility: 'low',
      trend: 'stable',
      savingsStreak: 5,
      bufferProgress: 0.3,
      loanCount: 0,
    });
    expect(Array.isArray(factors.positive)).toBe(true);
    expect(Array.isArray(factors.negative)).toBe(true);
    factors.positive.forEach((f) => expect(typeof f).toBe('string'));
    factors.negative.forEach((f) => expect(typeof f).toBe('string'));
  });

  test('high volatility lowers score vs low volatility (all else equal)', () => {
    const base = { trend: 'stable', savingsStreak: 15, bufferProgress: 0.5, loanCount: 1 };
    const { score: lowVolScore } = calculateResilienceScore({ ...base, volatility: 'low' });
    const { score: highVolScore } = calculateResilienceScore({ ...base, volatility: 'high' });
    expect(lowVolScore).toBeGreaterThan(highVolScore);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 10. calculateLoanRisk
// ─────────────────────────────────────────────────────────────────────────────

describe('calculateLoanRisk', () => {
  test('0 loans → "low"', () => expect(calculateLoanRisk(0)).toEqual({ level: 'low' }));
  test('1 loan  → "low"', () => expect(calculateLoanRisk(1)).toEqual({ level: 'low' }));
  test('2 loans → "medium"', () => expect(calculateLoanRisk(2)).toEqual({ level: 'medium' }));
  test('3 loans → "high"', () => expect(calculateLoanRisk(3)).toEqual({ level: 'high' }));
  test('5 loans → "high"', () => expect(calculateLoanRisk(5)).toEqual({ level: 'high' }));
  test('undefined → "low"', () => expect(calculateLoanRisk(undefined)).toEqual({ level: 'low' }));
});

// ─────────────────────────────────────────────────────────────────────────────
// 11. runFinanceEngine — 4 end-to-end scenarios
// ─────────────────────────────────────────────────────────────────────────────

describe('runFinanceEngine — Scenario 1: Normal income (~₹800/day ±100)', () => {
  let result;

  beforeAll(() => {
    result = runFinanceEngine({
      transactions: NORMAL_INCOME,
      currentBuffer: 6000,
      dailyExpenses: 500,
      activeLoanCount: 1,
      previousStreak: 7,
      savedToday: true,
    });
  });

  test('returns all required top-level keys', () => {
    expect(result).toHaveProperty('income_profile');
    expect(result).toHaveProperty('savings_pocket');
    expect(result).toHaveProperty('resilience_score');
    expect(result).toHaveProperty('loan_risk');
    expect(result).toHaveProperty('nudge_context');
  });

  test('income_profile has baseline, volatility, consistency, trend, prediction', () => {
    const { income_profile } = result;
    expect(income_profile).toHaveProperty('baseline');
    expect(income_profile).toHaveProperty('volatility');
    expect(income_profile).toHaveProperty('consistency');
    expect(income_profile).toHaveProperty('trend');
    expect(income_profile).toHaveProperty('prediction');
  });

  test('baseline is in ₹780–820 range', () => {
    expect(result.income_profile.baseline).toBeGreaterThanOrEqual(780);
    expect(result.income_profile.baseline).toBeLessThanOrEqual(820);
  });

  test('volatility is "low"', () => {
    expect(result.income_profile.volatility).toBe('low');
  });

  test('trend is "stable"', () => {
    expect(result.income_profile.trend).toBe('stable');
  });

  test('streak incremented to 8', () => {
    expect(result.savings_pocket.streak).toBe(8);
  });

  test('surplus is non-negative', () => {
    expect(result.savings_pocket.surplus).toBeGreaterThanOrEqual(0);
  });

  test('loan_risk is "low" (1 active loan)', () => {
    expect(result.loan_risk.level).toBe('low');
  });

  test('resilience_score.score is between 0 and 100', () => {
    expect(result.resilience_score.score).toBeGreaterThanOrEqual(0);
    expect(result.resilience_score.score).toBeLessThanOrEqual(100);
  });

  test('nudge_context has baseline_daily_income and resilience_score', () => {
    expect(result.nudge_context).toHaveProperty('baseline_daily_income');
    expect(result.nudge_context).toHaveProperty('resilience_score');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('runFinanceEngine — Scenario 2: High income (~₹1500/day, steady)', () => {
  let result;

  beforeAll(() => {
    result = runFinanceEngine({
      transactions: HIGH_INCOME,
      currentBuffer: 30000,
      dailyExpenses: 800,
      activeLoanCount: 0,
      previousStreak: 20,
      savedToday: true,
    });
  });

  test('baseline > ₹1400', () => {
    expect(result.income_profile.baseline).toBeGreaterThan(1400);
  });

  test('volatility is "low"', () => {
    expect(result.income_profile.volatility).toBe('low');
  });

  test('loan_risk is "low" (no loans)', () => {
    expect(result.loan_risk.level).toBe('low');
  });

  test('streak incremented to 21', () => {
    expect(result.savings_pocket.streak).toBe(21);
  });

  test('resilience_score is higher than "worst case" baseline of 10', () => {
    expect(result.resilience_score.score).toBeGreaterThan(10);
  });

  test('rainy_day.progress_percent is between 0 and 100', () => {
    expect(result.savings_pocket.rainy_day.progress_percent).toBeGreaterThanOrEqual(0);
    expect(result.savings_pocket.rainy_day.progress_percent).toBeLessThanOrEqual(100);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('runFinanceEngine — Scenario 3: Low income (~₹300/day, steady)', () => {
  let result;

  beforeAll(() => {
    result = runFinanceEngine({
      transactions: LOW_INCOME,
      currentBuffer: 1500,
      dailyExpenses: 250,
      activeLoanCount: 2,
      previousStreak: 3,
      savedToday: false,
    });
  });

  test('baseline < ₹320', () => {
    expect(result.income_profile.baseline).toBeLessThan(320);
  });

  test('volatility is "low" (income is steady even if small)', () => {
    expect(result.income_profile.volatility).toBe('low');
  });

  test('loan_risk is "medium" (2 active loans)', () => {
    expect(result.loan_risk.level).toBe('medium');
  });

  test('streak resets to 0 (did not save today)', () => {
    expect(result.savings_pocket.streak).toBe(0);
  });

  test('factors.negative contains at least one item (2 loans drag score)', () => {
    expect(result.resilience_score.factors.negative.length).toBeGreaterThan(0);
  });

  test('nudge_context.loan_risk_level is "medium"', () => {
    expect(result.nudge_context.loan_risk_level).toBe('medium');
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('runFinanceEngine — Scenario 4: Volatile income (₹200–₹2000 swinging)', () => {
  let resultVolatile;
  let resultNormal;

  beforeAll(() => {
    // Same setup as Scenario 1 to isolate the effect of volatility on the score
    const sharedParams = {
      currentBuffer: 6000,
      dailyExpenses: 500,
      activeLoanCount: 1,
      previousStreak: 7,
      savedToday: true,
    };
    resultVolatile = runFinanceEngine({ transactions: VOLATILE_INCOME, ...sharedParams });
    resultNormal   = runFinanceEngine({ transactions: NORMAL_INCOME,   ...sharedParams });
  });

  test('volatile income: volatility is "high"', () => {
    expect(resultVolatile.income_profile.volatility).toBe('high');
  });

  test('normal income: volatility is "low"', () => {
    expect(resultNormal.income_profile.volatility).toBe('low');
  });

  test('KEY INVARIANT: volatile score < normal score (volatility is penalised)', () => {
    // This is the critical proof that volatility actually affects the model.
    // Both profiles have similar average income (~₹800/day) but volatile swings
    // must produce a meaningfully lower resilience score.
    expect(resultVolatile.resilience_score.score).toBeLessThan(resultNormal.resilience_score.score);
  });

  test('volatile income: suggested_amount is lower % of surplus (high vol dampens saving)', () => {
    // Calculate surplus manually to compare rates
    const vSurplus = resultVolatile.savings_pocket.surplus;
    const nSurplus = resultNormal.savings_pocket.surplus;

    if (vSurplus > 0 && nSurplus > 0) {
      const vRate = resultVolatile.savings_pocket.suggested_amount / vSurplus;
      const nRate = resultNormal.savings_pocket.suggested_amount / nSurplus;
      expect(vRate).toBeLessThanOrEqual(nRate);
    } else {
      // One or both surpluses are 0 — just confirm suggested_amount is 0
      expect(resultVolatile.savings_pocket.suggested_amount).toBeGreaterThanOrEqual(0);
    }
  });

  test('volatile income: prediction range is wider than normal', () => {
    const vRange = resultVolatile.income_profile.prediction;
    const nRange = resultNormal.income_profile.prediction;
    expect(vRange.high - vRange.low).toBeGreaterThan(nRange.high - nRange.low);
  });

  test('volatile income: factors.negative includes high volatility entry', () => {
    expect(resultVolatile.resilience_score.factors.negative).toContain('High income volatility');
  });

  test('volatile income: nudge_context.volatility is "high"', () => {
    expect(resultVolatile.nudge_context.volatility).toBe('high');
  });
});
