/** Frontend copy of Member 4 fallback — keeps mock mode consistent when backend is offline. */

export function generateFallbackNudge(facts = {}) {
  const trend = String(facts.trend || 'STABLE').toUpperCase()
  const streak = Number(facts.streak || 0)
  const score = Number(facts.score || 0)
  const change = Number(facts.change || 0)
  const suggested = Number(facts.suggestedAmount || 0)

  const parts = []
  if (trend === 'UP') parts.push('Your income is trending upward')
  else if (trend === 'DOWN') parts.push('Your recent income is a bit softer than usual')
  else parts.push('Your income has been fairly steady')

  if (streak > 0) {
    parts.push(`you've kept a ${streak}-day savings streak${streak >= 4 ? ' — that consistency matters' : ''}`)
  }
  if (change > 0) parts.push(`your resilience score increased by ${change} point${change === 1 ? '' : 's'}`)
  else if (change < 0) parts.push(`your resilience score moved by ${change} points`)
  else if (score > 0) parts.push(`your resilience score is holding at ${score}`)
  if (suggested > 0) parts.push(`the engine found ₹${suggested} safe to set aside today`)

  let message
  if (!parts.length) {
    message = "Log today's income so the engine can update your baseline, savings pocket, and score."
  } else if (trend === 'DOWN' && streak === 0) {
    message = `${parts[0]}. Protect essentials first — even a small save tomorrow can restart your streak.`
  } else {
    const head = parts[0].charAt(0).toUpperCase() + parts[0].slice(1)
    const rest = parts.slice(1)
    message = rest.length === 0 ? `${head}.` : `${head}${rest.length === 1 ? ' and ' : ', '}${rest.join(', ')}.`
  }

  let title = 'Ready when you are.'
  if (change > 0 && streak >= 3) title = "You're getting stronger financially."
  else if (trend === 'UP') title = 'Your income is trending up.'
  else if (streak >= 4) title = 'Your savings streak is working.'
  else if (score >= 70) title = 'You are building real resilience.'
  else if (trend === 'DOWN') title = 'A careful day can still help.'

  return { triggered: true, title, message, source: 'fallback' }
}

export function factsFromDashboard(data) {
  return {
    trend: data?.income?.trend,
    streak: data?.savings?.streak,
    score: data?.resilience?.score,
    change: data?.resilience?.change,
    suggestedAmount: data?.savings?.suggested,
    todayIncome: data?.income?.today,
    baseline: data?.income?.baseline,
  }
}
