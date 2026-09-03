/** Central mock payloads. Frontend only displays these — no scoring math. */

export const mockUser = {
  name: 'Karthik',
  occupation: 'Uber',
}

/** Demo start: score 67, today's pay not logged yet. */
export const dashboardBefore = {
  user: mockUser,
  income_profile: {
    baseline: 800,
    today_income: null,
    trend: 'STABLE',
    volatility: 0.18,
  },
  savings_pocket: {
    suggested_amount: 0,
    streak: 3,
    current_balance: 4080,
  },
  resilience_score: {
    score: 67,
    previous_score: 67,
    change: 0,
    factors: {
      income_stability: 80,
      income_trend: 70,
      savings_behavior: 65,
      emergency_buffer: 55,
    },
    explanation: 'Log today’s pay to see how this earning moves your resilience score.',
  },
  nudge: {
    triggered: true,
    message:
      'Your safety net is holding. Log today’s income so the engine can update your baseline, savings pocket, and score.',
  },
  transactions: [
    { date: '2026-09-02', source: 'Swiggy', amount: 850, vs_baseline: 50, saved: 20 },
    { date: '2026-09-01', source: 'Uber', amount: 650, vs_baseline: -150, saved: 0 },
    { date: '2026-08-31', source: 'Uber', amount: 880, vs_baseline: 80, saved: 30 },
  ],
  savings_activity: [
    { date: '2026-09-02', amount: 20, note: 'Safe sweep' },
    { date: '2026-08-31', amount: 30, note: 'Safe sweep' },
    { date: '2026-08-29', amount: 40, note: 'Safe sweep' },
  ],
  weekly: [
    { label: '28 Aug', income: 720, saved: 0, baseline: 800 },
    { label: '29 Aug', income: 950, saved: 40, baseline: 800 },
    { label: '30 Aug', income: 610, saved: 0, baseline: 800 },
    { label: '31 Aug', income: 880, saved: 30, baseline: 800 },
    { label: '1 Sep', income: 650, saved: 0, baseline: 800 },
    { label: '2 Sep', income: 850, saved: 20, baseline: 800 },
  ],
  month_total_saved: 1740,
  emergency_buffer: {
    current: 4080,
    target: 8000,
  },
}

/** Demo after POST /transactions { amount: 1100 }. Matches the shared API contract. */
export const dashboardAfter = {
  user: mockUser,
  income_profile: {
    baseline: 800,
    today_income: 1100,
    trend: 'UP',
    volatility: 0.18,
  },
  savings_pocket: {
    suggested_amount: 120,
    streak: 4,
    current_balance: 4200,
  },
  resilience_score: {
    score: 72,
    previous_score: 67,
    change: 5,
    factors: {
      income_stability: 82,
      income_trend: 76,
      savings_behavior: 71,
      emergency_buffer: 60,
    },
    explanation:
      'Your resilience improved because your income trend is positive and your savings streak increased.',
  },
  nudge: {
    triggered: true,
    message:
      "You're building a stronger safety net. Your income is trending upward and you've maintained a 4-day savings streak. Your resilience score increased by 5 points this week.",
  },
  transactions: [
    { date: '2026-09-03', source: 'Uber', amount: 1100, vs_baseline: 300, saved: 120 },
    { date: '2026-09-02', source: 'Swiggy', amount: 850, vs_baseline: 50, saved: 20 },
    { date: '2026-09-01', source: 'Uber', amount: 650, vs_baseline: -150, saved: 0 },
    { date: '2026-08-31', source: 'Uber', amount: 880, vs_baseline: 80, saved: 30 },
  ],
  savings_activity: [
    { date: '2026-09-03', amount: 120, note: 'Safe sweep' },
    { date: '2026-09-02', amount: 20, note: 'Safe sweep' },
    { date: '2026-08-31', amount: 30, note: 'Safe sweep' },
    { date: '2026-08-29', amount: 40, note: 'Safe sweep' },
  ],
  weekly: [
    { label: '28 Aug', income: 720, saved: 0, baseline: 800 },
    { label: '29 Aug', income: 950, saved: 40, baseline: 800 },
    { label: '30 Aug', income: 610, saved: 0, baseline: 800 },
    { label: '31 Aug', income: 880, saved: 30, baseline: 800 },
    { label: '1 Sep', income: 650, saved: 0, baseline: 800 },
    { label: '2 Sep', income: 850, saved: 20, baseline: 800 },
    { label: '3 Sep', income: 1100, saved: 120, baseline: 800 },
  ],
  month_total_saved: 1860,
  emergency_buffer: {
    current: 4200,
    target: 8000,
  },
}

const DEMO_KEY = 're_demo_applied'

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function getMockDashboard() {
  return localStorage.getItem(DEMO_KEY) === '1' ? clone(dashboardAfter) : clone(dashboardBefore)
}

export function applyMockTransaction() {
  localStorage.setItem(DEMO_KEY, '1')
  return clone(dashboardAfter)
}

export function resetMockDashboard() {
  localStorage.removeItem(DEMO_KEY)
  return clone(dashboardBefore)
}
