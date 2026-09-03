import { factsFromDashboard, generateFallbackNudge } from './nudgeFallback'
import { analyseSchemes } from './schemeAnalysis'

export function isSchemeQuestion(text) {
  return /scheme|government|govt|eshram|pension|ayushman|pm-jay|mudra|udyam|which scheme|suit me/.test(
    String(text || '').toLowerCase(),
  )
}

export function formatSchemeReply(analysis) {
  const ranked = analysis?.ranked || []
  const top = ranked.filter((s) => s.priority === 'High').slice(0, 3)
  const focus = top.length ? top : ranked.slice(0, 3)
  const list = focus.map((s) => `${s.name} (${s.match}% fit)`).join('; ')
  const narrative = analysis?.insight?.narrative || 'Here are schemes that fit your profile.'
  return `${narrative} Top matches: ${list}. Open Govt Schemes for the full AI action plan. Always verify on official portals.`
}

/** Simple facts-only coach replies for the floating chatbot. */
export function coachReply(userText, dashboard) {
  const q = String(userText || '').toLowerCase().trim()
  const facts = factsFromDashboard(dashboard || {})
  const income = dashboard?.income || {}
  const savings = dashboard?.savings || {}
  const resilience = dashboard?.resilience || {}

  if (!q) {
    return generateFallbackNudge(facts).message
  }

  if (isSchemeQuestion(q)) {
    return formatSchemeReply(analyseSchemes(dashboard))
  }

  if (/score|resilien/.test(q)) {
    const change = resilience.change
    const changeText =
      change > 0
        ? `up ${change} points this week`
        : change < 0
          ? `down ${Math.abs(change)} points this week`
          : 'unchanged this week'
    return `Your resilience score is ${resilience.score ?? '—'}/100 (${changeText}). It comes from income stability, trend, savings behaviour, and your emergency buffer.`
  }

  if (/what should i do|brief|focus|plan for today|do today/.test(q)) {
    const buffer = savings.emergencyProgress ?? 0
    const topHint =
      buffer < 60
        ? 'Prioritise emergency buffer, then open Scheme Studio for insurance/registration.'
        : 'Keep your streak, park surplus, and review AI What-If Lab for allocation ideas.'
    return `Today’s focus: score ${resilience.score ?? '—'}/100, streak ${savings.streak ?? 0} day(s), buffer ${buffer}%. ${topHint}`
  }

  if (/save|saving|pocket|streak/.test(q)) {
    return `Safe to save today is ₹${savings.suggested ?? 0}. Your streak is ${savings.streak ?? 0} day(s) and your pocket balance is ₹${savings.balance ?? 0}.`
  }

  if (/income|earn|baseline|surplus/.test(q)) {
    const today = income.today == null ? 'not logged yet' : `₹${income.today}`
    return `Today's income is ${today}. Your usual baseline is ₹${income.baseline ?? '—'}${
      income.surplus != null ? ` and surplus is ₹${income.surplus}` : ''
    }. Trend: ${income.trend || 'STABLE'}.`
  }

  if (/buffer|emergency|goal/.test(q)) {
    return `Emergency buffer progress is at ${savings.emergencyProgress ?? 0}%. Keep saving on surplus days to grow it.`
  }

  if (/hello|hi|hey|help/.test(q)) {
    return `Hi — I'm your resilience coach. Ask about your score, savings, schemes, or “what should I do today?”`
  }

  const nudge = generateFallbackNudge(facts)
  return `${nudge.message} Try Scheme Studio or the AI What-If Lab for deeper coaching.`
}

export function openingMessages(dashboard) {
  const facts = factsFromDashboard(dashboard || {})
  const nudge = generateFallbackNudge(facts)
  const analysis = analyseSchemes(dashboard)
  const top = analysis.ranked[0]

  return [
    {
      id: 'open-1',
      role: 'bot',
      text: nudge.message || "Hi — I'm your resilience coach. Ask me about your score or savings.",
      title: nudge.title,
    },
    {
      id: 'open-schemes',
      role: 'bot',
      title: 'Scheme tip',
      text: top
        ? `Based on your profile, ${top.name} looks like a ${top.match}% fit. Ask “which schemes suit me?” for AI recommendations.`
        : 'Ask “which schemes suit me?” for AI government scheme recommendations.',
    },
  ]
}
