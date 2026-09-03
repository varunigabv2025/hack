import { factsFromDashboard } from './nudgeFallback'
import { analyseSchemes } from './schemeAnalysis'

/** AI Daily Brief — facts-only coaching summary for the dashboard. */
export function generateAiBrief(dashboard = {}) {
  const facts = factsFromDashboard(dashboard)
  const schemes = analyseSchemes(dashboard)
  const top = schemes.ranked[0]
  const name = dashboard?.user?.name || 'User'
  const score = facts.score ?? dashboard?.resilience?.score ?? 0
  const streak = facts.streak ?? 0
  const suggested = facts.suggestedAmount ?? dashboard?.savings?.suggested ?? 0
  const buffer = dashboard?.savings?.emergencyProgress ?? 0
  const trend = facts.trend || 'STABLE'

  const focus =
    buffer < 60
      ? 'Grow your emergency buffer before adding new commitments.'
      : streak >= 3
        ? 'Your savings streak is strong — lock in today’s surplus habit.'
        : 'Log today’s income so the engine can refresh your safe-to-save amount.'

  const bullets = [
    `Resilience score is ${score}/100 (${trend} income trend).`,
    suggested > 0
      ? `Safe to save today is ₹${suggested} based on supplied surplus facts.`
      : 'No surplus logged yet — add today’s pay to unlock a save amount.',
    top
      ? `Top scheme match: ${top.name} (${top.match}% fit).`
      : 'Open Govt Schemes for personalised matches.',
  ]

  return {
    title: 'AI Daily Brief',
    greeting: `${name} — resilience pulse`,
    focus,
    bullets,
    nextAction:
      suggested > 0
        ? `Next: park ₹${suggested}, then review ${top?.name || 'top scheme'}.`
        : 'Next: log today’s income, then check Scheme Studio.',
    schemeId: top?.id,
    source: 'fallback',
  }
}
