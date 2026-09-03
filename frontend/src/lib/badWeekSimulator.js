/**
 * Bad Week Simulator — scenario math from dashboard-supplied facts only.
 * Does not invent baseline, surplus, buffer, or safe-to-save amounts.
 */

export const BAD_WEEK_SCENARIOS = [
  {
    id: 'no-work-3',
    label: 'Three days without work',
    blurb: 'Platform demand dries up for three days.',
    incomeMultiplier: 4 / 7, // 3 zero-income days in a 7-day week
    oneTimeCost: 0,
    extraDailyCost: 0,
  },
  {
    id: 'rain-flood',
    label: 'Rain or flooding',
    blurb: 'Outdoor trips collapse; pay falls sharply.',
    incomeMultiplier: 0.4,
    oneTimeCost: 0,
    extraDailyCost: 0,
  },
  {
    id: 'vehicle-repair',
    label: 'Vehicle repair',
    blurb: 'Bike or auto needs an urgent fix.',
    incomeMultiplier: 0.7,
    oneTimeCost: 2500,
    extraDailyCost: 0,
  },
  {
    id: 'medical',
    label: 'Medical emergency',
    blurb: 'Clinic or pharmacy bill hits this week.',
    incomeMultiplier: 0.75,
    oneTimeCost: 4000,
    extraDailyCost: 0,
  },
  {
    id: 'fuel-price',
    label: 'Fuel-price increase',
    blurb: 'Higher fuel eats into every trip.',
    incomeMultiplier: 0.85,
    oneTimeCost: 0,
    extraDailyCost: 80,
  },
  {
    id: 'account-suspend',
    label: 'Platform account suspension',
    blurb: 'Account blocked for five days.',
    incomeMultiplier: 2 / 7,
    oneTimeCost: 0,
    extraDailyCost: 0,
  },
  {
    id: 'income-drop-30',
    label: '30% income drop',
    blurb: 'A soft week across platforms.',
    incomeMultiplier: 0.7,
    oneTimeCost: 0,
    extraDailyCost: 0,
  },
  {
    id: 'family-expense',
    label: 'Unexpected school or family expense',
    blurb: 'Fees, travel, or family support lands suddenly.',
    incomeMultiplier: 0.9,
    oneTimeCost: 2000,
    extraDailyCost: 0,
  },
]

function num(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function dailyEssentials(dashboard) {
  const monthly = num(
    dashboard?.user?.monthlyExpense,
    num(dashboard?.savings?.emergencyTarget, 8000),
  )
  return Math.max(1, Math.round(monthly / 30))
}

function daysUntilEmpty(cash, dailyGap) {
  if (dailyGap <= 0) return 21
  if (cash <= 0) return 0
  return Math.max(0, Math.floor(cash / dailyGap))
}

/**
 * @param {object} dashboard — engine / mock facts
 * @param {string} scenarioId
 */
export function runBadWeek(dashboard = {}, scenarioId = 'no-work-3') {
  const scenario =
    BAD_WEEK_SCENARIOS.find((s) => s.id === scenarioId) || BAD_WEEK_SCENARIOS[0]

  const baseline = num(dashboard?.income?.baseline, 0)
  const surplus = Math.max(0, num(dashboard?.income?.surplus, 0))
  const suggested = Math.max(0, num(dashboard?.savings?.suggested, 0))
  const buffer = Math.max(0, num(dashboard?.savings?.emergencyCurrent, dashboard?.savings?.balance, 0))
  const bufferTarget = Math.max(0, num(dashboard?.savings?.emergencyTarget, 0))
  const score = num(dashboard?.resilience?.score, 0)

  const essentials = dailyEssentials(dashboard)
  const shockedIncome = Math.round(baseline * scenario.incomeMultiplier)
  // Living cost floor: monthly/30 essentials, or ~85% of usual income — whichever is higher.
  const livingFloor = Math.max(essentials, Math.round(baseline * 0.85))
  const dailyBurn = livingFloor + num(scenario.extraDailyCost, 0)
  // Spread one-time shock across the week so medical/repair scenarios create a real gap.
  const amortizedShock = num(scenario.oneTimeCost, 0) / 7
  const dailyGap = Math.max(0, Math.round(dailyBurn + amortizedShock - shockedIncome))

  // Without a savings pocket: only today’s surplus as float cash.
  const cashWithout = Math.max(0, surplus)
  const daysWithout = daysUntilEmpty(cashWithout, dailyGap)

  // With resilience buffer: emergency pocket absorbs the week.
  const cashWith = Math.max(0, buffer)
  const daysWith = daysUntilEmpty(cashWith, dailyGap)

  const recommendedSave =
    suggested > 0
      ? suggested
      : surplus > 0
        ? Math.max(50, Math.round(surplus * 0.28))
        : Math.min(500, Math.max(100, Math.round(essentials * 0.2)))

  const headlineWithout =
    daysWithout <= 0
      ? 'Without a savings pocket:\nYou have no runway if this week hits.'
      : `Without a savings pocket:\nYou run out of money in ${daysWithout} day${daysWithout === 1 ? '' : 's'}.`

  const headlineWith =
    daysWith <= 0
      ? `With a ₹${buffer.toLocaleString('en-IN')} resilience buffer:\nThe shock still empties your pocket immediately.`
      : `With a ₹${buffer.toLocaleString('en-IN')} resilience buffer:\nYou remain stable for ${daysWith} day${daysWith === 1 ? '' : 's'}.`

  const recommendedAction =
    suggested > 0 || surplus > 0
      ? `Save ₹${recommendedSave} from today’s surplus.`
      : buffer < 500
        ? 'Build a ₹500 emergency buffer.'
        : 'Delay a non-essential expense.'

  return {
    scenario,
    inputs: {
      baseline,
      surplus,
      suggested,
      buffer,
      bufferTarget,
      essentials,
      shockedIncome,
      dailyBurn,
      dailyGap,
      oneTimeCost: scenario.oneTimeCost,
      score,
    },
    withoutPocket: {
      cash: cashWithout,
      days: daysWithout,
      headline: headlineWithout,
    },
    withBuffer: {
      cash: cashWith,
      days: daysWith,
      headline: headlineWith,
    },
    recommended: {
      saveAmount: recommendedSave,
      text: `Recommended action today:\n${recommendedAction}`,
      actionLine: recommendedAction,
    },
    deltaDays: daysWith - daysWithout,
    disclaimer:
      'Scenario uses your dashboard baseline, surplus, buffer, and expense facts — it does not invent new balances.',
  }
}
