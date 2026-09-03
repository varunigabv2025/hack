/**
 * Responsible AI / fairness controls for Resilience Engine.
 * Rules are product policy — not model weights.
 */

export const RESPONSIBLE_AI_RULES = [
  {
    id: 'no-loan-default',
    title: 'Never recommend a loan by default',
    detail: 'Next actions prioritize saving, delaying spend, schemes, and support — never “take a loan” as the first answer.',
  },
  {
    id: 'no-promises',
    title: 'Never promise approval or savings returns',
    detail: 'We never guarantee loan approval, scheme eligibility, or investment/savings returns. Amounts shown are engine facts or user scenarios only.',
  },
  {
    id: 'no-blame',
    title: 'Never label a person as financially irresponsible',
    detail: 'Copy focuses on conditions and choices (“buffer is thin”), never character judgments.',
  },
  {
    id: 'uncertainty',
    title: 'Explain uncertainty',
    detail: 'Data-quality badges (High / Medium / Low) sit next to recommendations so confidence is visible.',
  },
  {
    id: 'crisis-support',
    title: 'Recommend human or government support in crisis',
    detail: 'When buffer and score signal distress, we route to verified support and schemes — not informal credit.',
  },
  {
    id: 'no-sensitive-scoring',
    title: 'Avoid sensitive attributes in scoring',
    detail: 'Resilience score uses income, savings, buffer, and debt burden facts. It does not use caste, religion, gender, or biometrics.',
  },
  {
    id: 'correct-data',
    title: 'Permit users to correct incorrect data',
    detail: 'Workers can edit profile, expenses, and loans in Settings / ledgers so recommendations stay grounded in their truth.',
  },
]

export const CRISIS_SUPPORT_LINKS = [
  { label: 'e-Shram portal', href: 'https://eshram.gov.in/', kind: 'government' },
  { label: 'National Career Service', href: 'https://www.ncs.gov.in/', kind: 'government' },
  { label: 'Tele-MANAS mental health (14416)', href: 'tel:14416', kind: 'human' },
]

/**
 * Crisis = thin buffer + weak score or high loan stacking.
 * Uses only dashboard financial facts.
 */
export function detectCrisis(dashboard = {}) {
  const buffer = Number(dashboard.savings?.emergencyCurrent ?? dashboard.savings?.balance ?? 0)
  const bufferPct = Number(dashboard.savings?.emergencyProgress ?? 0)
  const score = Number(dashboard.resilience?.score ?? 0)
  const risk = String(dashboard.loanRisk?.level || 'low').toLowerCase()
  const activeLoans = Number(dashboard.loanRisk?.activeLoans ?? 0)
  const flags = dashboard.settings?.hardshipFlags || []
  const medicalHardship = flags.includes('medical')

  const reasons = []
  if (buffer < 300 || bufferPct < 15) reasons.push('Emergency buffer is critically low')
  if (score > 0 && score < 45) reasons.push('Resilience score is in the danger band')
  if (risk === 'high' || activeLoans >= 3) reasons.push('Loan stacking risk is elevated')
  if (medicalHardship && (bufferPct < 40 || score < 60)) {
    reasons.push('Medical hardship with a thin buffer')
  }

  return {
    active: reasons.length >= 2 || (buffer < 200 && score < 55) || (medicalHardship && buffer < 500 && score < 55),
    reasons,
    message:
      reasons.length >= 2 || (buffer < 200 && score < 55) || (medicalHardship && buffer < 500 && score < 55)
        ? medicalHardship
          ? 'Medical stress is active. Prefer verified health schemes and human support before any new borrowing.'
          : 'This looks like a stress case. Prefer verified human or government support before any new borrowing.'
        : null,
  }
}

export function assertSafeAction(action = {}) {
  const text = `${action.title || ''} ${action.detail || ''}`.toLowerCase()
  const forbidden = [
    /take (a |another )?loan/,
    /guaranteed return/,
    /approved for/,
    /you are (irresponsible|bad with money|careless)/,
  ]
  const hit = forbidden.find((re) => re.test(text))
  return {
    ok: !hit,
    blockedReason: hit ? 'Action text violates Responsible AI policy' : null,
  }
}
