/**
 * Member 4 — Rule-based fallback nudge.
 * Uses ONLY supplied backend facts. Never invents numbers.
 */

function pick(facts) {
  const trend = String(facts.trend || facts.incomeTrend || 'STABLE').toUpperCase()
  const streak = Number(facts.streak ?? facts.savingsStreak ?? 0)
  const score = Number(facts.score ?? facts.resilienceScore ?? 0)
  const change = Number(facts.change ?? facts.scoreChange ?? 0)
  const suggested = Number(facts.suggestedAmount ?? facts.suggested_amount ?? 0)
  const today = facts.todayIncome ?? facts.today_income
  const baseline = facts.baseline

  return { trend, streak, score, change, suggested, today, baseline }
}

function buildTitle({ trend, streak, change, score }) {
  if (change > 0 && streak >= 3) return "You're getting stronger financially."
  if (trend === 'UP') return 'Your income is trending up.'
  if (streak >= 4) return 'Your savings streak is working.'
  if (score >= 70) return 'You are building real resilience.'
  if (trend === 'DOWN') return 'A careful day can still help.'
  return 'Ready when you are.'
}

/**
 * @param {object} facts - backend-calculated fields only
 * @returns {{ title: string, message: string, source: 'fallback', triggered: boolean }}
 */
export function generateFallbackNudge(facts = {}) {
  const f = pick(facts)
  const parts = []

  if (f.trend === 'UP') {
    parts.push('Your income is trending upward')
  } else if (f.trend === 'DOWN') {
    parts.push('Your recent income is a bit softer than usual')
  } else {
    parts.push('Your income has been fairly steady')
  }

  if (f.streak > 0) {
    parts.push(
      `you've kept a ${f.streak}-day savings streak${f.streak >= 4 ? ' — that consistency matters' : ''}`,
    )
  }

  if (f.change > 0) {
    parts.push(`your resilience score increased by ${f.change} point${f.change === 1 ? '' : 's'}`)
  } else if (f.change < 0) {
    parts.push(`your resilience score moved by ${f.change} points`)
  } else if (f.score > 0) {
    parts.push(`your resilience score is holding at ${f.score}`)
  }

  if (f.suggested > 0) {
    parts.push(`the engine found ₹${f.suggested} safe to set aside today`)
  }

  let message
  if (parts.length === 0) {
    message =
      "Log today's income so the engine can update your baseline, savings pocket, and score."
  } else if (f.trend === 'DOWN' && f.streak === 0) {
    message = `${parts[0]}. Protect essentials first — even a small save tomorrow can restart your streak.`
  } else {
    const head = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    const rest = parts.slice(1)
    message =
      rest.length === 0
        ? `${head}.`
        : `${head}${rest.length === 1 ? ' and ' : ', '}${rest.join(', ')}.`
  }

  return {
    triggered: true,
    title: buildTitle(f),
    message,
    source: 'fallback',
  }
}

export function extractNudgeFacts(dashboard = {}) {
  const income = dashboard.income || dashboard.income_profile || {}
  const savings = dashboard.savings || dashboard.savings_pocket || {}
  const resilience = dashboard.resilience || dashboard.resilience_score || {}

  return {
    trend: income.trend,
    streak: savings.streak,
    score: resilience.score,
    change: resilience.change ?? resilience.score_change,
    suggestedAmount: savings.suggested ?? savings.suggested_amount,
    todayIncome: income.today ?? income.today_income,
    baseline: income.baseline,
  }
}

