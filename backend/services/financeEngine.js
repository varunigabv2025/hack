/**
 * financeEngine.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Member 2 deliverable — pure, deterministic financial calculation module.
 * No ML, no database, no network calls, no side effects.
 *
 * USAGE (by teammates):
 *   const { runFinanceEngine } = require('./services/financeEngine');
 *   const result = runFinanceEngine({ transactions, currentBuffer,
 *                                     dailyExpenses, activeLoanCount,
 *                                     previousStreak });
 *
 * All exported functions are pure: same input → same output, always.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extract the last N numeric income amounts from a history array.
 * Each element may be a raw number OR an object with an `amount` field.
 *
 * @param {Array<number|{amount:number}>} history
 * @param {number} n
 * @returns {number[]}
 */
function lastN(history, n) {
  const arr = (history || []).slice(-n);
  return arr.map((x) => (typeof x === 'object' && x !== null ? Number(x.amount) : Number(x)));
}

/**
 * Arithmetic mean of a numeric array.  Returns 0 for empty arrays.
 * @param {number[]} values
 * @returns {number}
 */
function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Population standard deviation.  Returns 0 for arrays with fewer than 2 elements.
 * Formula: sqrt( Σ(x - μ)² / N )
 * @param {number[]} values
 * @returns {number}
 */
function stdDev(values) {
  if (values.length < 2) return 0;
  const μ = mean(values);
  const variance = values.reduce((sum, v) => sum + Math.pow(v - μ, 2), 0) / values.length;
  return Math.sqrt(variance);
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. calculateBaseline
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rolling 7-day average income — the "normal day" reference point.
 *
 * Formula: baseline = mean(last 7 entries in incomeHistory)
 *
 * @param {Array<number|{amount:number}>} incomeHistory  — chronological daily income
 * @returns {{ baseline: number }}
 */
function calculateBaseline(incomeHistory) {
  const window = lastN(incomeHistory, 7);
  const baseline = Math.round(mean(window) * 100) / 100;
  return { baseline };
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. detectTrend
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compare the mean of the most recent 7 days vs the 7 days before that.
 *
 * Formula:
 *   recentMean   = mean(last 7 entries)
 *   previousMean = mean(entries [-14..-8])
 *   delta        = (recentMean - previousMean) / previousMean
 *   trend        = "increasing" if delta > +5%
 *                  "decreasing" if delta < -5%
 *                  "stable"     otherwise
 *
 * If there is not enough history (< 8 entries), returns "stable".
 *
 * @param {Array<number|{amount:number}>} incomeHistory
 * @returns {{ trend: "increasing"|"stable"|"decreasing" }}
 */
function detectTrend(incomeHistory) {
  const all = (incomeHistory || []).map((x) =>
    typeof x === 'object' && x !== null ? Number(x.amount) : Number(x)
  );

  if (all.length < 8) return { trend: 'stable' };

  const recent   = all.slice(-7);
  const previous = all.slice(-14, -7);

  const recentMean   = mean(recent);
  const previousMean = mean(previous);

  if (previousMean === 0) return { trend: 'stable' };

  const delta = (recentMean - previousMean) / previousMean;

  let trend;
  if (delta > 0.05)       trend = 'increasing';
  else if (delta < -0.05) trend = 'decreasing';
  else                    trend = 'stable';

  return { trend };
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. calculateVolatility
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Coefficient of Variation (CV) over the last 14 days.
 * CV = stdDev / mean  (dimensionless, expressed as a ratio)
 *
 * Thresholds (chosen for gig-economy income typical to ₹300–₹1500/day):
 *   CV < 0.20  → "low"
 *   CV < 0.50  → "medium"
 *   CV ≥ 0.50  → "high"
 *
 * @param {Array<number|{amount:number}>} incomeHistory
 * @returns {{ volatility: "low"|"medium"|"high", raw_value: number }}
 */
function calculateVolatility(incomeHistory) {
  const window = lastN(incomeHistory, 14);
  const μ      = mean(window);

  if (μ === 0) return { volatility: 'high', raw_value: 1 };

  const cv = stdDev(window) / μ;
  const raw_value = Math.round(cv * 10000) / 10000; // 4 decimal places

  let volatility;
  if (cv < 0.20)      volatility = 'low';
  else if (cv < 0.50) volatility = 'medium';
  else                volatility = 'high';

  return { volatility, raw_value };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. predictNextWeekIncome
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Trend-adjusted income range for the coming 7 days.
 * Intentionally returns a RANGE, not fake point precision.
 *
 * Formula:
 *   base        = 7-day rolling mean
 *   σ           = stdDev(last 14 days)
 *   trend_adj   = +5% if increasing, -5% if decreasing, 0% if stable
 *   center      = base * (1 + trend_adj)
 *   low         = max(0, center - σ)
 *   high        = center + σ
 *
 * @param {Array<number|{amount:number}>} incomeHistory
 * @returns {{ predicted_range: { low: number, high: number } }}
 */
function predictNextWeekIncome(incomeHistory) {
  const { baseline } = calculateBaseline(incomeHistory);
  const { trend }    = detectTrend(incomeHistory);
  const window14     = lastN(incomeHistory, 14);
  const σ            = stdDev(window14);

  const trendAdj = trend === 'increasing' ? 0.05
                 : trend === 'decreasing' ? -0.05
                 : 0;

  const center = baseline * (1 + trendAdj);
  const low    = Math.round(Math.max(0, center - σ) * 100) / 100;
  const high   = Math.round((center + σ) * 100) / 100;

  return { predicted_range: { low, high } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. calculateSurplus
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How much today's income exceeds the baseline.
 * Surplus is floored at 0 — we never save a negative amount.
 *
 * Formula: surplus = max(0, todayIncome - baseline)
 *
 * @param {number} todayIncome
 * @param {number} baseline
 * @returns {{ surplus: number }}
 */
function calculateSurplus(todayIncome, baseline) {
  const surplus = Math.max(0, todayIncome - baseline);
  return { surplus: Math.round(surplus * 100) / 100 };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. calculateSafeToSave
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How much of the surplus is actually safe to set aside today.
 * The percentage is adaptive — lower when income is volatile or the buffer
 * is already near its target (diminishing marginal urgency).
 *
 * Formula:
 *   basePct       = 50%
 *   volatility    reduces pct:  low → 0%,  medium → -10%,  high → -20%
 *   bufferProgress reduces pct: ≥80% full  → -10%,  ≥50%  → -5%,  else 0%
 *   finalPct      = max(10%, basePct + volatilityAdj + bufferAdj)
 *   suggested_amount = surplus × finalPct
 *
 * @param {number} surplus          — from calculateSurplus()
 * @param {"low"|"medium"|"high"} volatility — from calculateVolatility()
 * @param {number} bufferProgress   — 0-100, from calculateRainyDayFund()
 * @returns {{ suggested_amount: number, reason: string }}
 */
function calculateSafeToSave(surplus, volatility, bufferProgress) {
  let pct = 50;
  const reasons = [];

  // Volatility adjustment
  if (volatility === 'high') {
    pct -= 20;
    reasons.push('high income volatility — keep more as cash buffer');
  } else if (volatility === 'medium') {
    pct -= 10;
    reasons.push('moderate income volatility — saving 40% of surplus');
  } else {
    reasons.push('steady income — saving 50% of surplus');
  }

  // Buffer saturation adjustment
  if (bufferProgress >= 80) {
    pct -= 10;
    reasons.push('rainy-day fund is nearly full (≥80%)');
  } else if (bufferProgress >= 50) {
    pct -= 5;
    reasons.push('rainy-day fund is halfway there (≥50%)');
  }

  // Floor at 10% — always save something when there is surplus
  pct = Math.max(10, pct);

  const suggested_amount = Math.round(surplus * (pct / 100) * 100) / 100;
  const reason = `Save ${pct}% of surplus (₹${surplus}): ${reasons.join('; ')}`;

  return { suggested_amount, reason };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. updateSavingsStreak
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Increment the streak if the user saved today, otherwise reset to 0.
 *
 * Formula:
 *   streak = savedToday ? previousStreak + 1 : 0
 *
 * @param {number} previousStreak  — integer ≥ 0
 * @param {boolean} savedToday
 * @returns {{ streak: number }}
 */
function updateSavingsStreak(previousStreak, savedToday) {
  const streak = savedToday ? (previousStreak || 0) + 1 : 0;
  return { streak };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. calculateRainyDayFund
// ─────────────────────────────────────────────────────────────────────────────

/**
 * How far the user is towards their rainy-day cash buffer target.
 *
 * Formula:
 *   target           = dailyExpenses × targetDays
 *   progress_percent = min(100, (currentBuffer / target) × 100)
 *
 * @param {number} currentBuffer    — current saved amount (₹)
 * @param {number} dailyExpenses    — average daily spend (₹)
 * @param {number} [targetDays=30] — days of expenses to cover
 * @returns {{ target: number, current: number, progress_percent: number }}
 */
function calculateRainyDayFund(currentBuffer, dailyExpenses, targetDays = 30) {
  const target           = dailyExpenses * targetDays;
  const progress_percent = target > 0
    ? Math.min(100, Math.round((currentBuffer / target) * 10000) / 100)
    : 0;

  return {
    target:           Math.round(target * 100) / 100,
    current:          Math.round(currentBuffer * 100) / 100,
    progress_percent,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. calculateResilienceScore
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Weighted 0-100 resilience score.
 *
 * Component weights:
 *   Volatility     25%  — low=100, medium=60, high=20
 *   Trend          20%  — increasing=100, stable=70, decreasing=30
 *   Savings streak 20%  — min(streak × 10, 100)
 *   Buffer progress 20% — progress_percent (0-100)
 *   Debt burden    15%  — loanCount: 0→100, 1→80, 2→50, 3+→20
 *
 * score_change is estimated by comparing the current score to a neutral
 * baseline of 50. The caller should persist previous scores for real delta.
 * Here we use a simple heuristic: score - 50 as the "change from neutral".
 *
 * @param {{
 *   volatility:     "low"|"medium"|"high",
 *   trend:          "increasing"|"stable"|"decreasing",
 *   savingsStreak:  number,
 *   bufferProgress: number,
 *   loanCount:      number
 * }} params
 * @returns {{ score: number, score_change: number, factors: { positive: string[], negative: string[] } }}
 */
function calculateResilienceScore({ volatility, trend, savingsStreak, bufferProgress, loanCount }) {
  // ── Component scores (each 0-100) ───────────────────────────────────────
  const volatilityScore = volatility === 'low' ? 100
                        : volatility === 'medium' ? 60
                        : 20;   // high

  const trendScore = trend === 'increasing' ? 100
                   : trend === 'stable'     ? 70
                   : 30;  // decreasing

  const streakScore  = Math.min((savingsStreak || 0) * 10, 100);
  const bufferScore  = Math.min(bufferProgress || 0, 100);
  const loanScore    = loanCount <= 0 ? 100
                     : loanCount === 1 ? 80
                     : loanCount === 2 ? 50
                     : 20; // 3+

  // ── Weighted sum ────────────────────────────────────────────────────────
  const score = Math.round(
    volatilityScore * 0.25 +
    trendScore      * 0.20 +
    streakScore     * 0.20 +
    bufferScore     * 0.20 +
    loanScore       * 0.15
  );

  // ── Heuristic score_change vs neutral baseline of 50 ───────────────────
  const score_change = score - 50;

  // ── Human-readable factor breakdown ─────────────────────────────────────
  const positive = [];
  const negative = [];

  if (volatility === 'low')          positive.push('Steady income with low volatility');
  else if (volatility === 'medium')  negative.push('Moderate income swings detected');
  else                               negative.push('High income volatility — builds risk');

  if (trend === 'increasing')        positive.push('Income is trending upward');
  else if (trend === 'decreasing')   negative.push('Income is trending downward');

  if (savingsStreak >= 7)            positive.push(`Strong savings streak: ${savingsStreak} days`);
  else if (savingsStreak >= 3)       positive.push(`Building savings habit: ${savingsStreak}-day streak`);
  else if (savingsStreak === 0)      negative.push('No savings streak — start saving today');

  if (bufferProgress >= 80)         positive.push('Rainy-day fund is nearly complete');
  else if (bufferProgress >= 50)    positive.push('Rainy-day fund is halfway funded');
  else                              negative.push(`Rainy-day fund only ${bufferProgress}% funded`);

  if (loanCount === 0)              positive.push('No active loans — zero debt burden');
  else if (loanCount <= 2)          negative.push(`${loanCount} active loan(s) reducing buffer`);
  else                              negative.push(`${loanCount} active loans — high debt burden`);

  return { score, score_change, factors: { positive, negative } };
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. calculateLoanRisk
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Simple categorical loan risk based on active loan count.
 *
 * Formula:
 *   0-1 loans → "low"
 *   2 loans   → "medium"
 *   3+ loans  → "high"
 *
 * @param {number} activeLoanCount
 * @returns {{ level: "low"|"medium"|"high" }}
 */
function calculateLoanRisk(activeLoanCount) {
  const count = activeLoanCount || 0;
  const level = count <= 1 ? 'low'
              : count === 2 ? 'medium'
              : 'high';
  return { level };
}

// ─────────────────────────────────────────────────────────────────────────────
// ORCHESTRATOR — runFinanceEngine
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Master function — calls all engines in order and assembles the locked
 * API contract shape that the backend route handler will consume.
 *
 * @param {{
 *   transactions:    Array<number|{amount:number}>,  // chronological daily income
 *   currentBuffer:   number,   // current rainy-day savings (₹)
 *   dailyExpenses:   number,   // average daily expenditure (₹)
 *   activeLoanCount: number,   // number of active loans
 *   previousStreak:  number,   // yesterday's savings streak
 *   todayIncome?:    number,   // today's income (defaults to last transaction)
 *   savedToday?:     boolean   // did user save today? (defaults to surplus > 0)
 * }} params
 *
 * @returns {{
 *   income_profile: { baseline, volatility, consistency, trend, prediction },
 *   savings_pocket: { surplus, suggested_amount, streak, rainy_day },
 *   resilience_score: { score, score_change, factors },
 *   loan_risk: { level },
 *   nudge_context: object
 * }}
 */
function runFinanceEngine({
  transactions    = [],
  currentBuffer   = 0,
  dailyExpenses   = 0,
  activeLoanCount = 0,
  previousStreak  = 0,
  todayIncome,
  savedToday,
}) {
  // ── 1. Derive today's income from last transaction if not provided ───────
  const lastTx = lastN(transactions, 1)[0] || 0;
  const income  = todayIncome !== undefined ? todayIncome : lastTx;

  // ── 2. Income profile ────────────────────────────────────────────────────
  const { baseline }                   = calculateBaseline(transactions);
  const { volatility, raw_value }      = calculateVolatility(transactions);
  const { trend }                      = detectTrend(transactions);
  const { predicted_range }            = predictNextWeekIncome(transactions);

  // "consistency" = inverse of raw CV, capped 0-100
  const consistency = Math.round(Math.max(0, Math.min(100, (1 - raw_value) * 100)));

  // ── 3. Rainy-day fund ────────────────────────────────────────────────────
  const rainy_day = calculateRainyDayFund(currentBuffer, dailyExpenses);

  // ── 4. Savings pocket ────────────────────────────────────────────────────
  const { surplus }                        = calculateSurplus(income, baseline);
  const { suggested_amount, reason }       = calculateSafeToSave(surplus, volatility, rainy_day.progress_percent);
  const didSave = savedToday !== undefined ? savedToday : surplus > 0;
  const { streak }                         = updateSavingsStreak(previousStreak, didSave);

  // ── 5. Resilience score ──────────────────────────────────────────────────
  const resilienceResult = calculateResilienceScore({
    volatility,
    trend,
    savingsStreak:  streak,
    bufferProgress: rainy_day.progress_percent,
    loanCount:      activeLoanCount,
  });

  // ── 6. Loan risk ─────────────────────────────────────────────────────────
  const loan_risk = calculateLoanRisk(activeLoanCount);

  // ── 7. Assemble locked API contract ─────────────────────────────────────
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
      rainy_day,
    },
    resilience_score: resilienceResult,
    loan_risk,
    // nudge_context: flattened key facts ready for AI prompt injection
    nudge_context: {
      today_income:        income,
      baseline,
      surplus,
      trend,
      volatility,
      consistency_pct:     consistency,
      streak,
      buffer_current:      currentBuffer,
      buffer_target:       rainy_day.target,
      buffer_progress_pct: rainy_day.progress_percent,
      suggested_save:      suggested_amount,
      save_reason:         reason,
      resilience_score:    resilienceResult.score,
      loan_count:          activeLoanCount,
      loan_risk:           loan_risk.level,
      predicted_low:       predicted_range.low,
      predicted_high:      predicted_range.high,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  // Individual functions (for teammates who need just one)
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
  // Orchestrator (primary integration point)
  runFinanceEngine,
};
