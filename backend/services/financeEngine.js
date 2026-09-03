/**
 * financeEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Resilience Engine — Financial Calculation Module
 * Member 2 deliverable: pure, deterministic, no-ML, fully explainable functions.
 *
 * ALL functions are side-effect free. No Express, no MongoDB, no network calls.
 * Import and call from any route or service layer.
 *
 * Shared API contract (runFinanceEngine output shape) is LOCKED — do not rename
 * top-level keys without coordinating with the team.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Extract numeric `amount` values from a transactions array and return them
 * as a plain number array, oldest-first.
 * Accepts either:
 *   - an array of objects  [{ date, amount }, ...]
 *   - a plain number array [500, 800, 600, ...]
 */
function _toAmounts(incomeHistory) {
  if (!Array.isArray(incomeHistory) || incomeHistory.length === 0) return [];
  if (typeof incomeHistory[0] === 'number') return incomeHistory;
  return incomeHistory.map((t) => Number(t.amount) || 0);
}

/**
 * Arithmetic mean of a number array. Returns 0 for empty arrays.
 */
function _mean(arr) {
  if (!arr.length) return 0;
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

/**
 * Population standard deviation of a number array. Returns 0 for < 2 items.
 */
function _stdDev(arr) {
  if (arr.length < 2) return 0;
  const mu = _mean(arr);
  const variance = arr.reduce((s, v) => s + (v - mu) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

// ─── 1. calculateBaseline ─────────────────────────────────────────────────────

/**
 * Rolling 7-day average of income.
 *
 * Formula: mean of the last min(7, n) daily income values.
 *
 * @param {Array} incomeHistory  – array of {date, amount} objects or numbers
 * @returns {{ baseline: number }}
 */
function calculateBaseline(incomeHistory) {
  const amounts = _toAmounts(incomeHistory);
  const window = amounts.slice(-7); // last 7 days (or fewer)
  const baseline = _mean(window);
  return { baseline: Math.round(baseline * 100) / 100 };
}

// ─── 2. detectTrend ───────────────────────────────────────────────────────────

/**
 * Compare average income of the last 7 days vs the previous 7 days.
 *
 * Formula:
 *   recentAvg  = mean(last 7 values)
 *   previousAvg = mean(values before last 7, up to 7 more)
 *   delta % = (recentAvg - previousAvg) / previousAvg * 100
 *
 * Thresholds (chosen to be stable yet sensitive):
 *   delta > +5%  → "increasing"
 *   delta < −5%  → "decreasing"
 *   otherwise    → "stable"
 *
 * If we have fewer than 8 values the trend defaults to "stable".
 *
 * @param {Array} incomeHistory
 * @returns {{ trend: "increasing"|"stable"|"decreasing" }}
 */
function detectTrend(incomeHistory) {
  const amounts = _toAmounts(incomeHistory);

  if (amounts.length < 8) return { trend: 'stable' };

  const recent = amounts.slice(-7);
  const previous = amounts.slice(-14, -7);

  const recentAvg = _mean(recent);
  const previousAvg = _mean(previous);

  if (previousAvg === 0) return { trend: recentAvg > 0 ? 'increasing' : 'stable' };

  const deltaPercent = ((recentAvg - previousAvg) / previousAvg) * 100;

  let trend;
  if (deltaPercent > 5) {
    trend = 'increasing';
  } else if (deltaPercent < -5) {
    trend = 'decreasing';
  } else {
    trend = 'stable';
  }

  return { trend };
}

// ─── 3. calculateVolatility ───────────────────────────────────────────────────

/**
 * Coefficient of Variation (CV) = stdDev / mean.
 * Measures how "bumpy" the income stream is, normalised for scale.
 *
 * Thresholds (empirically chosen for daily gig income):
 *   CV < 0.20  → "low"
 *   CV < 0.50  → "medium"
 *   CV >= 0.50 → "high"
 *
 * @param {Array} incomeHistory
 * @returns {{ volatility: "low"|"medium"|"high", raw_value: number }}
 */
function calculateVolatility(incomeHistory) {
  const amounts = _toAmounts(incomeHistory);
  const mu = _mean(amounts);

  if (mu === 0) return { volatility: 'high', raw_value: 1 };

  const cv = _stdDev(amounts) / mu;
  const raw_value = Math.round(cv * 10000) / 10000; // 4 d.p.

  let volatility;
  if (cv < 0.2) {
    volatility = 'low';
  } else if (cv < 0.5) {
    volatility = 'medium';
  } else {
    volatility = 'high';
  }

  return { volatility, raw_value };
}

// ─── 4. predictNextWeekIncome ─────────────────────────────────────────────────

/**
 * Trend-adjusted weekly income range — deliberately wide to avoid false precision.
 *
 * Formula:
 *   base       = rolling 7-day average (from calculateBaseline)
 *   stdDev     = population std dev of last 14 values (or all if < 14)
 *   trendFactor: increasing → +10%, decreasing → -10%, stable → 0%
 *   low        = max(0, (base + trendAdjust) - 1×stdDev) × 7
 *   high       = ((base + trendAdjust) + 1×stdDev) × 7
 *
 * The ±1 std dev band captures ~68% of outcomes without overstating certainty.
 *
 * @param {Array} incomeHistory
 * @returns {{ predicted_range: { low: number, high: number } }}
 */
function predictNextWeekIncome(incomeHistory) {
  const amounts = _toAmounts(incomeHistory);
  const { baseline: base } = calculateBaseline(amounts);
  const { trend } = detectTrend(amounts);

  const window14 = amounts.slice(-14);
  const sd = _stdDev(window14.length >= 2 ? window14 : amounts);

  const trendAdjust = trend === 'increasing' ? base * 0.1 : trend === 'decreasing' ? -base * 0.1 : 0;
  const adjustedDaily = base + trendAdjust;

  const low = Math.max(0, (adjustedDaily - sd) * 7);
  const high = Math.max(0, (adjustedDaily + sd) * 7);

  return {
    predicted_range: {
      low: Math.round(low),
      high: Math.round(high),
    },
  };
}

// ─── 5. calculateSurplus ──────────────────────────────────────────────────────

/**
 * Daily surplus = today's income minus the baseline.
 * Floored at 0 — we never record a negative surplus for saving purposes.
 *
 * Formula: surplus = max(0, todayIncome - baseline)
 *
 * @param {number} todayIncome
 * @param {number} baseline
 * @returns {{ surplus: number }}
 */
function calculateSurplus(todayIncome, baseline) {
  const surplus = Math.max(0, (todayIncome || 0) - (baseline || 0));
  return { surplus: Math.round(surplus * 100) / 100 };
}

// ─── 6. calculateSafeToSave ───────────────────────────────────────────────────

/**
 * Adaptive savings suggestion — how much of the surplus is safe to set aside today.
 *
 * Logic (each rule lowers the suggested % to keep reserves):
 *   Base rate: 50% of surplus
 *   − If volatility is "high"   → drop to 25% (income is unpredictable, hold cash)
 *   − If volatility is "medium" → drop to 35%
 *   − If bufferProgress >= 1.0  → drop to 10% (buffer is full, slow down saving)
 *   − If bufferProgress >= 0.8  → drop to 30% (buffer nearly full)
 *
 * Reason string explains the maths in plain language so the UI can surface it.
 *
 * @param {number} surplus          – from calculateSurplus
 * @param {"low"|"medium"|"high"} volatility
 * @param {number} bufferProgress   – 0.0–1.0 (current / target rainy-day fund)
 * @returns {{ suggested_amount: number, reason: string }}
 */
function calculateSafeToSave(surplus, volatility, bufferProgress) {
  surplus = surplus || 0;
  bufferProgress = bufferProgress || 0;

  let rate = 0.5; // base: save 50% of surplus
  let reasons = [];

  // Volatility adjustment
  if (volatility === 'high') {
    rate = Math.min(rate, 0.25);
    reasons.push('income is highly variable so we keep 75% as a cash cushion');
  } else if (volatility === 'medium') {
    rate = Math.min(rate, 0.35);
    reasons.push('income is moderately variable so we keep 65% as a cash cushion');
  }

  // Buffer progress adjustment
  if (bufferProgress >= 1.0) {
    rate = Math.min(rate, 0.1);
    reasons.push('rainy-day fund is complete so only 10% tops it up');
  } else if (bufferProgress >= 0.8) {
    rate = Math.min(rate, 0.3);
    reasons.push('rainy-day fund is 80%+ full so a lower rate suffices');
  }

  if (!reasons.length) reasons.push('income is stable and buffer has room to grow');

  const suggested_amount = Math.round(surplus * rate * 100) / 100;
  const reason = `Save ${Math.round(rate * 100)}% of ₹${surplus} surplus — ${reasons.join('; ')}`;

  return { suggested_amount, reason };
}

// ─── 7. updateSavingsStreak ───────────────────────────────────────────────────

/**
 * Savings streak: how many consecutive days the user saved anything.
 *
 * Formula:
 *   savedToday === true  → streak = previousStreak + 1
 *   savedToday === false → streak = 0  (reset on any missed day)
 *
 * @param {number}  previousStreak
 * @param {boolean} savedToday
 * @returns {{ streak: number }}
 */
function updateSavingsStreak(previousStreak, savedToday) {
  const streak = savedToday ? (previousStreak || 0) + 1 : 0;
  return { streak };
}

// ─── 8. calculateRainyDayFund ─────────────────────────────────────────────────

/**
 * Rainy-day (emergency) fund tracker.
 *
 * Formula:
 *   target          = dailyExpenses × targetDays
 *   progress_percent = min(100, (currentBuffer / target) × 100)
 *
 * @param {number} currentBuffer   – amount saved so far
 * @param {number} dailyExpenses   – average daily spend
 * @param {number} [targetDays=30] – how many days the fund should cover
 * @returns {{ target: number, current: number, progress_percent: number }}
 */
function calculateRainyDayFund(currentBuffer, dailyExpenses, targetDays = 30) {
  const target = (dailyExpenses || 0) * targetDays;
  const current = Math.max(0, currentBuffer || 0);
  const progress_percent = target > 0 ? Math.min(100, Math.round((current / target) * 10000) / 100) : 0;
  return { target, current, progress_percent };
}

// ─── 9. calculateResilienceScore ─────────────────────────────────────────────

/**
 * Composite 0–100 resilience score — higher is better.
 *
 * Weights (must sum to 100):
 *   Volatility (penalise high, reward low)  : 25 pts
 *   Trend (reward increasing)               : 20 pts
 *   Savings streak (reward consistency)     : 20 pts
 *   Buffer progress (reward full buffer)    : 20 pts
 *   Debt burden / loan count (penalise debt): 15 pts
 *
 * Each sub-score is 0–1 before weighting.
 *
 * Volatility sub-score:
 *   low → 1.0, medium → 0.5, high → 0.0
 *
 * Trend sub-score:
 *   increasing → 1.0, stable → 0.6, decreasing → 0.2
 *
 * Streak sub-score:
 *   min(streak / 30, 1.0)  — 30 consecutive days = perfect
 *
 * Buffer sub-score:
 *   min(bufferProgress, 1.0)
 *
 * Loan sub-score:
 *   0 loans → 1.0, 1 loan → 0.75, 2 loans → 0.4, 3+ → 0.0
 *
 * score_change placeholder is 0 (requires previous score stored externally).
 *
 * @param {{ volatility: "low"|"medium"|"high", trend: string, savingsStreak: number,
 *            bufferProgress: number, loanCount: number }} params
 * @returns {{ score: number, score_change: number,
 *             factors: { positive: string[], negative: string[] } }}
 */
function calculateResilienceScore({ volatility, trend, savingsStreak, bufferProgress, loanCount }) {
  // Sub-scores (0–1)
  const volScore = volatility === 'low' ? 1.0 : volatility === 'medium' ? 0.5 : 0.0;
  const trendScore = trend === 'increasing' ? 1.0 : trend === 'stable' ? 0.6 : 0.2;
  const streakScore = Math.min((savingsStreak || 0) / 30, 1.0);
  const bufferScore = Math.min(bufferProgress || 0, 1.0);
  const loanScore =
    loanCount === 0 ? 1.0 : loanCount === 1 ? 0.75 : loanCount === 2 ? 0.4 : 0.0;

  // Weighted total (weights sum to 100)
  const score = Math.round(
    volScore * 25 +
    trendScore * 20 +
    streakScore * 20 +
    bufferScore * 20 +
    loanScore * 15
  );

  // Collect plain-language factor labels
  const positive = [];
  const negative = [];

  if (volScore >= 0.5) positive.push('Stable income stream');
  else negative.push('High income volatility');

  if (trendScore >= 0.6) positive.push('Income trend is favourable');
  else negative.push('Declining income trend');

  if (streakScore >= 0.5) positive.push('Consistent savings habit');
  else negative.push('Savings streak needs building');

  if (bufferScore >= 0.5) positive.push('Healthy emergency fund');
  else negative.push('Emergency fund is low');

  if (loanScore >= 0.75) positive.push('Low debt burden');
  else negative.push('Multiple active loans reduce resilience');

  return { score, score_change: 0, factors: { positive, negative } };
}

// ─── 10. calculateLoanRisk ───────────────────────────────────────────────────

/**
 * Simple loan-count risk bucket.
 *
 * Formula:
 *   0–1 loans → "low"
 *   2 loans   → "medium"
 *   3+ loans  → "high"
 *
 * @param {number} activeLoanCount
 * @returns {{ level: "low"|"medium"|"high" }}
 */
function calculateLoanRisk(activeLoanCount) {
  const n = activeLoanCount || 0;
  const level = n <= 1 ? 'low' : n === 2 ? 'medium' : 'high';
  return { level };
}

// ─── orchestrator ────────────────────────────────────────────────────────────

/**
 * runFinanceEngine — main entry point called by the backend route layer.
 *
 * Runs every calculation in order and assembles the locked API contract shape.
 * Do NOT rename top-level keys — teammates depend on these exact names.
 *
 * @param {{
 *   transactions:    Array<{date: string, amount: number}|number>,
 *   currentBuffer:   number,
 *   dailyExpenses:   number,
 *   activeLoanCount: number,
 *   previousStreak:  number,
 *   savedToday?:     boolean,
 * }} params
 *
 * @returns {{
 *   income_profile:   { baseline, volatility, consistency, trend, prediction },
 *   savings_pocket:   { surplus, suggested_amount, streak, rainy_day },
 *   resilience_score: { score, score_change, factors },
 *   loan_risk:        { level },
 *   nudge_context:    Object,
 * }}
 */
function runFinanceEngine({
  transactions = [],
  currentBuffer = 0,
  dailyExpenses = 0,
  activeLoanCount = 0,
  previousStreak = 0,
  savedToday = false,
}) {
  // ── Step 1: income profile ──────────────────────────────────────────────
  const { baseline } = calculateBaseline(transactions);
  const { volatility, raw_value: rawVolatility } = calculateVolatility(transactions);
  const { trend } = detectTrend(transactions);
  const { predicted_range } = predictNextWeekIncome(transactions);

  // Consistency = inverse of raw CV, capped 0–1, expressed as percentage
  const consistency = Math.round(Math.max(0, (1 - rawVolatility)) * 100);

  // ── Step 2: today's income (last entry in transactions) ──────────────────
  const amounts = _toAmounts(transactions);
  const todayIncome = amounts.length ? amounts[amounts.length - 1] : 0;

  // ── Step 3: savings pocket ───────────────────────────────────────────────
  const { surplus } = calculateSurplus(todayIncome, baseline);
  const rainyDay = calculateRainyDayFund(currentBuffer, dailyExpenses);
  const bufferProgress = rainyDay.progress_percent / 100;

  const { suggested_amount, reason } = calculateSafeToSave(surplus, volatility, bufferProgress);
  const { streak } = updateSavingsStreak(previousStreak, savedToday);

  // ── Step 4: resilience score ─────────────────────────────────────────────
  const resilienceResult = calculateResilienceScore({
    volatility,
    trend,
    savingsStreak: streak,
    bufferProgress,
    loanCount: activeLoanCount,
  });

  // ── Step 5: loan risk ────────────────────────────────────────────────────
  const loanRiskResult = calculateLoanRisk(activeLoanCount);

  // ── Step 6: nudge context (flat key-value for AI prompt consumption) ─────
  const nudge_context = {
    baseline_daily_income: baseline,
    trend,
    volatility,
    consistency_percent: consistency,
    today_income: todayIncome,
    surplus,
    suggested_save: suggested_amount,
    save_reason: reason,
    savings_streak_days: streak,
    rainy_day_target: rainyDay.target,
    rainy_day_current: rainyDay.current,
    rainy_day_progress_percent: rainyDay.progress_percent,
    resilience_score: resilienceResult.score,
    loan_risk_level: loanRiskResult.level,
    predicted_week_low: predicted_range.low,
    predicted_week_high: predicted_range.high,
  };

  // ── Assemble locked API shape ────────────────────────────────────────────
  return {
    income_profile: {
      baseline,
      volatility,
      consistency,
      trend,
      prediction: predicted_range,
    },
    savings_pocket: {
      surplus,
      suggested_amount,
      streak,
      rainy_day: rainyDay,
    },
    resilience_score: resilienceResult,
    loan_risk: loanRiskResult,
    nudge_context,
  };
}

// ─── exports ─────────────────────────────────────────────────────────────────

module.exports = {
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
};
