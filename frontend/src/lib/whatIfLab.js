import { factsFromDashboard } from './nudgeFallback'
import { analyseSchemes } from './schemeAnalysis'

/**
 * What-If Lab — user enters a hypothetical save amount.
 * AI never invents new financial numbers; it only explains supplied facts + the user’s input as a scenario.
 */
export function runWhatIf(dashboard = {}, saveAmount = 0) {
  const amount = Math.max(0, Math.round(Number(saveAmount) || 0))
  const facts = factsFromDashboard(dashboard)
  const schemes = analyseSchemes(dashboard)
  const top = schemes.ranked.filter((s) => s.priority === 'High').slice(0, 3)
  const buffer = dashboard?.savings?.emergencyProgress ?? 0
  const streak = facts.streak ?? 0
  const score = facts.score ?? 0
  const suggested = facts.suggestedAmount ?? dashboard?.savings?.suggested ?? 0

  const split =
    buffer < 60
      ? [
          { label: 'Emergency buffer', pct: 70, why: 'Buffer is still under 60% — protect first.' },
          { label: 'Scheme readiness', pct: 20, why: 'Keep docs/registration friction low.' },
          { label: 'Flex / goals', pct: 10, why: 'Small reward keeps the streak alive.' },
        ]
      : [
          { label: 'Emergency buffer', pct: 40, why: 'Maintain the safety net.' },
          { label: 'Pension / APY path', pct: 35, why: 'Streak supports small recurring contributions.' },
          { label: 'Goals / flex', pct: 25, why: 'Fund near-term targets without loans.' },
        ]

  const allocations = split.map((s) => ({
    ...s,
    amount: Math.round((amount * s.pct) / 100),
  }))

  const narrative = [
    amount <= 0
      ? 'Enter a save amount to simulate how today’s surplus could be allocated.'
      : `If you set aside ₹${amount} today (your scenario input), AI suggests splitting it using your current facts — score ${score}/100, streak ${streak} day(s), buffer ${buffer}%.`,
    suggested > 0
      ? `Engine-supplied safe-to-save is ₹${suggested}; your scenario can be higher or lower — treat anything above that as optional.`
      : 'No engine-suggested amount yet — this scenario is exploratory only.',
    top.length
      ? `Scheme focus while you save: ${top.map((s) => s.name).join(', ')}.`
      : '',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    title: 'AI What-If Lab',
    amount,
    narrative,
    allocations,
    comparison: {
      suggested,
      delta: suggested > 0 ? amount - suggested : null,
    },
    schemes: top.map((s) => ({ id: s.id, name: s.name, match: s.match })),
    disclaimer: 'Scenario only. AI does not recalculate official eligibility or invent new balances.',
    source: 'fallback',
  }
}
