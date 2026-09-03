/**
 * Income-shock scenarios for the What-If Lab.
 * Snapshots are demo facts for the current profile — not live engine recalculation.
 */
const SCENARIOS = {
  '-50': {
    description: 'Income decreases by 50%',
    simulated: {
      income: 550,
      baseline: 400,
      surplus: 150,
      safeToSave: 60,
      score: 54,
      loanRisk: 'low',
      volatility: 'medium',
      trend: 'DOWN',
    },
    insights: [
      'A 50% income drop would cut your safe-to-save amount sharply.',
      'Protect essentials and pause extra commitments until pay recovers.',
    ],
  },
  '-20': {
    description: 'Income decreases by 20%',
    simulated: {
      income: 880,
      baseline: 640,
      surplus: 240,
      safeToSave: 96,
      score: 68,
      loanRisk: 'low',
      volatility: 'medium',
      trend: 'STABLE',
    },
    insights: [
      'Your resilience score would stay relatively stable.',
      'Saving capacity would fall, so keep the emergency buffer first.',
    ],
  },
  '20': {
    description: 'Income increases by 20%',
    simulated: {
      income: 1320,
      baseline: 960,
      surplus: 360,
      safeToSave: 144,
      score: 76,
      loanRisk: 'low',
      volatility: 'medium',
      trend: 'UP',
    },
    insights: [
      'Higher pay would lift surplus and the amount safe to set aside.',
      'Use the extra to grow the rainy-day fund before adding loans.',
    ],
  },
  '50': {
    description: 'Income increases by 50%',
    simulated: {
      income: 1650,
      baseline: 1200,
      surplus: 450,
      safeToSave: 180,
      score: 80,
      loanRisk: 'low',
      volatility: 'medium',
      trend: 'UP',
    },
    insights: [
      'A strong pay bump would widen your surplus window.',
      'Lock a higher save habit before lifestyle spend catches up.',
    ],
  },
}

export const INCOME_PRESETS = [-50, -20, 20, 50]

export function runIncomeScenario(dashboard, pct) {
  const key = String(pct)
  const scene = SCENARIOS[key]
  const income = dashboard?.income || {}
  const savings = dashboard?.savings || {}
  const current = {
    income: income.today ?? income.baseline ?? 0,
    baseline: income.baseline ?? 0,
    surplus: income.surplus ?? 0,
    safeToSave: savings.suggested ?? 0,
    score: dashboard?.resilience?.score ?? 0,
    loanRisk: dashboard?.loanRisk?.level || 'low',
    volatility: income.volatilityLabel || 'medium',
    trend: income.trend || 'STABLE',
  }
  if (!scene) {
    return { current, simulated: current, change: {}, insights: [], description: 'No scenario selected' }
  }
  const simulated = scene.simulated
  return {
    current,
    simulated,
    description: scene.description,
    insights: scene.insights,
    change: {
      incomeChangePercent: Number(pct),
      baselineChange: simulated.baseline - current.baseline,
      safeToSaveChange: simulated.safeToSave - current.safeToSave,
      scoreChange: simulated.score - current.score,
      surplusChange: simulated.surplus - current.surplus,
    },
  }
}
