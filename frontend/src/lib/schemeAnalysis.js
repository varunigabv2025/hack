import { schemes } from '../data/schemes'
import { generateFallbackSchemeInsight } from './schemeInsight'

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

/**
 * Analyse dashboard + profile → ranked scheme recommendations + AI insight.
 * Frontend display only — not an official eligibility check.
 */
export function analyseSchemes(data) {
  const user = data?.user || {}
  const income = data?.income || {}
  const savings = data?.savings || {}
  const resilience = data?.resilience || {}

  const ctx = {
    occupation: user.occupation || 'Uber',
    state: user.state || 'Tamil Nadu',
    name: user.name || 'User',
    baseline: income.baseline,
    today: income.today,
    surplus: income.surplus,
    trend: income.trend || 'STABLE',
    streak: savings.streak || 0,
    suggested: savings.suggested || 0,
    buffer: savings.emergencyProgress || 0,
    score: resilience.score || 0,
  }

  const ranked = schemes
    .map((scheme) => {
      const match = clamp(Math.round(scheme.fit(ctx)), 0, 100)
      return {
        ...scheme,
        match,
        priority: match >= 85 ? 'High' : match >= 70 ? 'Medium' : 'Low',
        reason: scheme.why(ctx),
      }
    })
    .sort((a, b) => b.match - a.match)

  const high = ranked.filter((s) => s.priority === 'High').length
  const medium = ranked.filter((s) => s.priority === 'Medium').length
  const insight = generateFallbackSchemeInsight(ctx, ranked)

  return {
    ctx,
    ranked,
    insight,
    summary: {
      total: ranked.length,
      high,
      medium,
      topId: ranked[0]?.id,
      headline:
        high >= 3
          ? `${high} schemes look like a strong fit for your gig profile right now.`
          : `We found ${ranked.length} schemes; focus on the top ${Math.min(3, ranked.length)} first.`,
    },
  }
}
