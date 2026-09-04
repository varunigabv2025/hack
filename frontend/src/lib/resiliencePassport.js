/**
 * Resilience Passport — portable worker-owned profile.
 * Built only from dashboard / engine facts. Not a credit score.
 */

import { analyseSchemes } from './schemeAnalysis'

const PERMISSIONS_KEY = 're_passport_permissions'

export const PARTNER_TYPES = [
  {
    id: 'ngo',
    label: 'NGOs & worker support orgs',
    blurb: 'Helplines, counseling, and emergency aid matching.',
  },
  {
    id: 'mfi',
    label: 'Microfinance institutions',
    blurb: 'Fairer underwriting using resilience — not only credit bureau scores.',
  },
  {
    id: 'union',
    label: 'Worker unions',
    blurb: 'Collective bargaining and peer support programs.',
  },
  {
    id: 'insurance',
    label: 'Insurance providers',
    blurb: 'Accident / health cover sized to gig income patterns.',
  },
  {
    id: 'government',
    label: 'Government programs',
    blurb: 'Scheme enrollment and welfare eligibility checks.',
  },
  {
    id: 'platforms',
    label: 'Delivery / ride-hailing platforms',
    blurb: 'In-app savings rails and hardship support partnerships.',
  },
]

const DEFAULT_PERMISSIONS = {
  ngo: true,
  mfi: false,
  union: true,
  insurance: false,
  government: true,
  platforms: false,
}

export function loadPassportPermissions() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PERMISSIONS_KEY) || 'null')
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_PERMISSIONS }
    return { ...DEFAULT_PERMISSIONS, ...parsed }
  } catch {
    return { ...DEFAULT_PERMISSIONS }
  }
}

export function savePassportPermissions(next) {
  localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(next))
  return next
}

function levelFromRatio(ratio, goodHigh = true) {
  if (goodHigh) {
    if (ratio >= 0.8) return { label: 'Strong', tone: 'gold' }
    if (ratio >= 0.55) return { label: 'Steady', tone: 'burgundy' }
    return { label: 'Building', tone: 'muted' }
  }
  if (ratio <= 0.15) return { label: 'Healthy', tone: 'gold' }
  if (ratio <= 0.35) return { label: 'Watch', tone: 'burgundy' }
  return { label: 'Stressed', tone: 'rose' }
}

function workSources(dashboard) {
  const txs = dashboard?.transactions || []
  const map = {}
  txs.forEach((t) => {
    const src = t.source || 'Other'
    map[src] = (map[src] || 0) + 1
  })
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .map(([source, count]) => ({ source, count }))
}

/**
 * @param {object} dashboard
 * @param {object} [permissions]
 */
export function buildResiliencePassport(dashboard = {}, permissions = loadPassportPermissions()) {
  const user = dashboard.user || {}
  const income = dashboard.income || {}
  const savings = dashboard.savings || {}
  const resilience = dashboard.resilience || {}
  const loanRisk = dashboard.loanRisk || {}
  const schemes = analyseSchemes(dashboard)
  const highSchemes = (schemes.ranked || []).filter((s) => s.priority === 'High').slice(0, 4)
  const sources = workSources(dashboard)
  const consistency = Number(income.consistency)
  const bufferPct = Number(savings.emergencyProgress) || 0
  const streak = Number(savings.streak) || 0
  const pti = Number(loanRisk.paymentToIncomeRatio) || 0
  const score = Number(resilience.score) || 0

  const pillars = [
    {
      id: 'income',
      title: 'Income consistency',
      value:
        Number.isFinite(consistency)
          ? `${Math.round(consistency * 100)}%`
          : income.volatilityLabel || '—',
      detail: [
        income.trend ? `Trend ${String(income.trend).toUpperCase()}` : null,
        income.volatilityLabel ? `Volatility ${income.volatilityLabel}` : null,
        income.baseline != null ? `Baseline ₹${Number(income.baseline).toLocaleString('en-IN')}/day` : null,
      ]
        .filter(Boolean)
        .join(' · '),
      level: levelFromRatio(Number.isFinite(consistency) ? consistency : 0.5),
    },
    {
      id: 'savings',
      title: 'Savings behavior',
      value: streak > 0 ? `${streak}-day streak` : 'Getting started',
      detail: [
        savings.suggested != null ? `Safe to save ₹${Number(savings.suggested).toLocaleString('en-IN')}` : null,
        savings.monthlySaved != null
          ? `₹${Number(savings.monthlySaved).toLocaleString('en-IN')} saved this month`
          : null,
      ]
        .filter(Boolean)
        .join(' · '),
      level: levelFromRatio(Math.min(1, streak / 7)),
    },
    {
      id: 'buffer',
      title: 'Emergency buffer',
      value: `${bufferPct}%`,
      detail:
        savings.emergencyCurrent != null && savings.emergencyTarget != null
          ? `₹${Number(savings.emergencyCurrent).toLocaleString('en-IN')} of ₹${Number(savings.emergencyTarget).toLocaleString('en-IN')} target`
          : 'Buffer progress from your savings pocket',
      level: levelFromRatio(bufferPct / 100),
    },
    {
      id: 'work',
      title: 'Verified work history',
      value: sources.length ? `${sources.length} platform${sources.length === 1 ? '' : 's'}` : user.occupation || '—',
      detail: sources.length
        ? sources.map((s) => `${s.source} (${s.count})`).join(' · ')
        : `${user.occupation || 'Gig work'} · ${user.state || 'India'}`,
      level: sources.length >= 2 ? { label: 'Verified', tone: 'gold' } : { label: 'Partial', tone: 'burgundy' },
    },
    {
      id: 'repayment',
      title: 'Repayment behavior',
      value: String(loanRisk.level || 'low').toUpperCase() + ' burden',
      detail: [
        `${loanRisk.activeLoans ?? 0} active loan${(loanRisk.activeLoans ?? 0) === 1 ? '' : 's'}`,
        pti > 0 ? `Payment-to-income ${Math.round(pti * 100)}%` : 'No stacking pressure logged',
      ].join(' · '),
      level: levelFromRatio(pti, false),
    },
    {
      id: 'schemes',
      title: 'Scheme eligibility',
      value: `${highSchemes.length} high-fit`,
      detail: highSchemes.length
        ? highSchemes.map((s) => s.name).join(' · ')
        : `${schemes.summary?.total || 0} schemes reviewed for your profile`,
      level:
        highSchemes.length >= 2
          ? { label: 'Ready', tone: 'gold' }
          : highSchemes.length === 1
            ? { label: 'Focus', tone: 'burgundy' }
            : { label: 'Explore', tone: 'muted' },
    },
  ]

  const sharing = PARTNER_TYPES.map((p) => ({
    ...p,
    enabled: Boolean(permissions[p.id]),
  }))

  const enabledPartners = sharing.filter((s) => s.enabled).map((s) => s.label)

  return {
    id: `RP-${(user.name || 'USER').slice(0, 3).toUpperCase()}-${score || '00'}`,
    issuedAt: new Date().toISOString().slice(0, 10),
    positioning:
      'Not a credit score that judges the worker — a resilience profile that helps access fairer support.',
    holder: {
      name: user.name || 'Worker',
      occupation: user.occupation || 'Gig worker',
      state: user.state || 'India',
      city: user.city || '',
      age: user.age || null,
    },
    resilienceScore: score,
    scoreChange: resilience.change ?? 0,
    pillars,
    schemes: highSchemes.map((s) => ({
      id: s.id,
      name: s.name,
      match: s.match,
      priority: s.priority,
    })),
    sharing,
    enabledPartners,
    portableSummary: {
      passport_id: `RP-${(user.name || 'USER').slice(0, 3).toUpperCase()}-${score || '00'}`,
      holder: user.name || 'Worker',
      occupation: user.occupation,
      state: user.state,
      resilience_score: score,
      income_consistency: Number.isFinite(consistency) ? Math.round(consistency * 100) : null,
      savings_streak_days: streak,
      emergency_buffer_pct: bufferPct,
      work_platforms: sources.map((s) => s.source),
      loan_burden: loanRisk.level || 'low',
      high_fit_schemes: highSchemes.map((s) => s.name),
      shared_with: enabledPartners,
      note: 'Worker-owned. Share only with consented partners.',
    },
    disclaimer:
      'Passport fields are derived from Resilience Engine facts already on your dashboard. Partners never receive data you have not permitted.',
  }
}
