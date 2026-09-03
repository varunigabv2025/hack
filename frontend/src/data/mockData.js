/** Central mock payloads. Frontend only displays these — no scoring math. */

export const mockUser = {
  name: 'User',
  occupation: 'Uber',
  state: 'Tamil Nadu',
  city: 'Chennai',
  phone: '',
  language: 'en',
  avatar_label: 'U',
  age: 28,
  monthlyExpense: 15000,
}

export const mockSettings = {
  notifications: true,
  darkMode: false,
  lowLiteracy: false,
}

const weeklyBefore = [
  { label: 'Thu', income: 720, saved: 0, baseline: 800 },
  { label: 'Fri', income: 950, saved: 60, baseline: 800 },
  { label: 'Sat', income: 610, saved: 0, baseline: 800 },
  { label: 'Sun', income: 880, saved: 32, baseline: 800 },
  { label: 'Mon', income: 650, saved: 0, baseline: 800 },
  { label: 'Tue', income: 850, saved: 20, baseline: 800 },
]

const weeklyAfter = [
  ...weeklyBefore,
  { label: 'Wed', income: 1100, saved: 120, baseline: 800 },
]

const txBefore = [
  { id: 'tx-0902', date: '2026-09-02', source: 'Swiggy', amount: 850, vsBaseline: 50, saved: 20 },
  { id: 'tx-0901', date: '2026-09-01', source: 'Uber', amount: 650, vsBaseline: -150, saved: 0 },
  { id: 'tx-0831', date: '2026-08-31', source: 'Zomato', amount: 950, vsBaseline: 150, saved: 60 },
]

const txAfter = [
  { id: 'tx-0903', date: '2026-09-03', source: 'Uber', amount: 1100, vsBaseline: 300, saved: 120 },
  ...txBefore,
]

function goalsFromBalance(balance) {
  return [
    { id: 'emergency', name: 'Emergency Buffer', target: 10000, current: balance, icon: '🛡️' },
    { id: 'bike', name: 'Bike Fund', target: 25000, current: 0, icon: '🏍️' },
  ]
}

/** Demo start: score 67, today's pay not logged yet. */
export const dashboardBefore = {
  currency: 'INR',
  user: mockUser,
  settings: mockSettings,
  income: {
    today: null,
    baseline: 800,
    surplus: null,
    trend: 'STABLE',
    volatility: 0.18,
    volatilityLabel: 'medium',
    consistency: 0.72,
    prediction: { next7Days: 780, min: 650, max: 920, confidence: 'medium' },
    sparkline: weeklyBefore.map((w) => w.income),
  },
  savings: {
    suggested: 0,
    streak: 3,
    balance: 4080,
    monthlySaved: 1205,
    emergencyProgress: 51,
    emergencyCurrent: 4080,
    emergencyTarget: 8000,
    activity: [
      { date: '2026-09-02', amount: 20, note: 'Surplus sweep' },
      { date: '2026-08-31', amount: 60, note: 'Surplus sweep' },
    ],
  },
  resilience: {
    score: 67,
    previousScore: 67,
    change: 0,
    factors: {
      incomeStability: 80,
      incomeTrend: 70,
      savingsBehaviour: 65,
      emergencyBuffer: 55,
      debtBurden: 90,
    },
    explanation: "Log today's pay to see how this earning moves your resilience score.",
  },
  nudge: {
    triggered: true,
    title: 'Ready when you are',
    message:
      "Your safety net is holding. Log today's income so the engine can update your baseline, savings pocket, and score.",
  },
  weekly: weeklyBefore,
  goals: goalsFromBalance(4080),
  transactions: txBefore,
}

/** Demo after POST /transactions { amount: 1100 }. */
export const dashboardAfter = {
  currency: 'INR',
  user: mockUser,
  settings: mockSettings,
  income: {
    today: 1100,
    baseline: 800,
    surplus: 300,
    trend: 'UP',
    volatility: 0.18,
    volatilityLabel: 'medium',
    consistency: 0.72,
    prediction: { next7Days: 850, min: 720, max: 980, confidence: 'medium' },
    sparkline: weeklyAfter.map((w) => w.income),
  },
  savings: {
    suggested: 120,
    streak: 4,
    balance: 4200,
    monthlySaved: 1325,
    emergencyProgress: 72,
    emergencyCurrent: 4200,
    emergencyTarget: 8000,
    activity: [
      { date: '2026-09-03', amount: 120, note: 'Surplus sweep' },
      { date: '2026-09-02', amount: 20, note: 'Surplus sweep' },
      { date: '2026-08-31', amount: 60, note: 'Surplus sweep' },
    ],
  },
  resilience: {
    score: 72,
    previousScore: 67,
    change: 5,
    factors: {
      incomeStability: 82,
      incomeTrend: 76,
      savingsBehaviour: 71,
      emergencyBuffer: 60,
      debtBurden: 90,
    },
    explanation:
      'Your resilience improved because your income trend is positive and your savings streak increased.',
  },
  nudge: {
    triggered: true,
    title: "You're getting stronger financially.",
    message:
      "Your income is trending upward and you've maintained a 4-day savings streak. Your resilience score increased by 5 points this week.",
  },
  weekly: weeklyAfter,
  goals: goalsFromBalance(4200),
  transactions: txAfter,
}

const DEMO_KEY = 're_demo_applied'
const PROFILE_KEY = 're_profile'
const EXPENSE_KEY = 're_expenses'
const LOAN_KEY = 're_loans'
const GOAL_KEY = 're_goals'

const seedExpenses = [
  { id: 'exp-1', date: '2026-09-03', amount: 500, category: 'Food', essential: true, description: 'Groceries for the week' },
  { id: 'exp-2', date: '2026-09-02', amount: 1500, category: 'Housing', essential: true, description: 'Room rent share' },
  { id: 'exp-3', date: '2026-09-02', amount: 200, category: 'Transport', essential: true, description: 'Fuel' },
  { id: 'exp-4', date: '2026-09-01', amount: 450, category: 'Entertainment', essential: false, description: 'Weekend outing' },
  { id: 'exp-5', date: '2026-08-31', amount: 300, category: 'Utilities', essential: true, description: 'Mobile recharge' },
  { id: 'exp-6', date: '2026-08-30', amount: 500, category: 'Healthcare', essential: true, description: 'Clinic visit' },
]

function summariseExpenses(expenses = []) {
  const category_breakdown = {}
  let essential = 0
  let nonEssential = 0
  expenses.forEach((e) => {
    const amount = Number(e.amount) || 0
    if (e.essential) essential += amount
    else nonEssential += amount
    const cat = e.category || 'Other'
    if (!category_breakdown[cat]) category_breakdown[cat] = { total: 0, count: 0, essential: 0, non_essential: 0 }
    category_breakdown[cat].total += amount
    category_breakdown[cat].count += 1
    if (e.essential) category_breakdown[cat].essential += amount
    else category_breakdown[cat].non_essential += amount
  })
  const total = essential + nonEssential
  return {
    total_expenses: total,
    essential_expenses: essential,
    non_essential_expenses: nonEssential,
    expense_count: expenses.length,
    category_breakdown,
    recent_average: expenses.length ? Math.round(total / expenses.length) : 0,
    recent_count: expenses.length,
  }
}

/** Member 2 published loan-stacking rules for the offline demo. */
export function assessLoanRisk(loans = [], baseline = 800) {
  const active = loans.filter((l) => (l.status || 'active') === 'active')
  const totalMonthly = active.reduce((s, l) => s + (Number(l.monthlyPayment) || 0), 0)
  const level = active.length >= 3 ? 'high' : active.length === 2 ? 'medium' : 'low'
  const monthlyIncome = Number(baseline) * 30
  return {
    level,
    activeLoans: active.length,
    totalMonthlyPayment: totalMonthly,
    paymentToIncomeRatio: monthlyIncome ? Number((totalMonthly / monthlyIncome).toFixed(2)) : 0,
  }
}

function loadList(key, fallback) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || 'null')
    return Array.isArray(parsed) ? parsed : fallback
  } catch {
    return fallback
  }
}

function attachLedger(dashboard) {
  const expenses = loadList(EXPENSE_KEY, seedExpenses)
  const loans = loadList(LOAN_KEY, [])
  const goals = loadList(GOAL_KEY, null)
  return {
    ...dashboard,
    expenses,
    expenseSummary: summariseExpenses(expenses),
    loans,
    loanRisk: assessLoanRisk(loans, dashboard.income?.baseline),
    goals: Array.isArray(goals) ? goals : dashboard.goals,
  }
}

export function persistExpenses(expenses) {
  localStorage.setItem(EXPENSE_KEY, JSON.stringify(expenses))
}

export function persistLoans(loans) {
  localStorage.setItem(LOAN_KEY, JSON.stringify(loans))
}

export function persistGoals(goals) {
  localStorage.setItem(GOAL_KEY, JSON.stringify(goals))
}

export function addMockExpense(expense) {
  const current = loadList(EXPENSE_KEY, seedExpenses)
  persistExpenses([expense, ...current])
  return getMockDashboard()
}

export function addMockLoan(loan) {
  const current = loadList(LOAN_KEY, [])
  persistLoans([loan, ...current])
  return getMockDashboard()
}

export function addMockGoal(goal) {
  const dash = getMockDashboard()
  const current = loadList(GOAL_KEY, dash.goals || [])
  const next = {
    id: goal.id || `GOAL${Date.now()}`,
    name: goal.name,
    target: Number(goal.target) || 0,
    current: Number(goal.current) || 0,
    icon: goal.icon || '🎯',
    status: 'active',
  }
  persistGoals([next, ...current])
  return getMockDashboard()
}

export function contributeMockGoal(goalId, amount = 500) {
  const dash = getMockDashboard()
  const current = loadList(GOAL_KEY, dash.goals || [])
  const next = current.map((g) => {
    if (g.id !== goalId) return g
    const target = Number(g.target) || 0
    const saved = Math.min(target, (Number(g.current) || 0) + Number(amount))
    return {
      ...g,
      current: saved,
      status: saved >= target && target > 0 ? 'completed' : g.status || 'active',
    }
  })
  persistGoals(next)
  return getMockDashboard()
}

export function deleteMockGoal(goalId) {
  const dash = getMockDashboard()
  const current = loadList(GOAL_KEY, dash.goals || [])
  persistGoals(current.filter((g) => g.id !== goalId))
  return getMockDashboard()
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function applyStoredProfile(dashboard) {
  try {
    const stored = JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null')
    if (!stored) return dashboard
    return {
      ...dashboard,
      user: { ...dashboard.user, ...stored.user },
      settings: { ...dashboard.settings, ...stored.settings },
    }
  } catch {
    return dashboard
  }
}

export function getMockDashboard() {
  // Default to the completed demo story so the premium UI matches the design.
  // Call resetDemo() to return to the pre-transaction state.
  const base = localStorage.getItem(DEMO_KEY) === 'before' ? clone(dashboardBefore) : clone(dashboardAfter)
  return attachLedger(applyStoredProfile(base))
}

export function applyMockTransaction() {
  localStorage.setItem(DEMO_KEY, 'after')
  return attachLedger(applyStoredProfile(clone(dashboardAfter)))
}

export function resetMockDashboard() {
  localStorage.setItem(DEMO_KEY, 'before')
  return attachLedger(applyStoredProfile(clone(dashboardBefore)))
}

export function persistProfile({ user, settings }) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ user, settings }))
}

function mapWeekly(payload, sparkline) {
  if (Array.isArray(payload.weekly) && payload.weekly.length) {
    return payload.weekly.map((w) => ({
      label: w.label,
      income: w.income ?? w.value ?? 0,
      saved: w.saved ?? 0,
      baseline: w.baseline ?? payload.income_profile?.baseline ?? 0,
    }))
  }
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return (sparkline || []).map((income, i) => ({
    label: labels[i] || `D${i + 1}`,
    income,
    saved: 0,
    baseline: payload.income_profile?.baseline ?? 0,
  }))
}

function mapGoals(payload, balance) {
  if (Array.isArray(payload.goals) && payload.goals.length) {
    return payload.goals.map((g, i) => ({
      id: g.id || g.goal_id || `goal-${i}`,
      name: g.name,
      target: Number(g.target) || 0,
      current: Number(g.current) || 0,
      icon: g.icon || '🎯',
      status: g.status || 'active',
      progress: g.progress,
    }))
  }
  return goalsFromBalance(balance)
}

function mapTrend(trend) {
  const t = String(trend || '').toUpperCase()
  if (t === 'INCREASING' || t === 'UP') return 'UP'
  if (t === 'DECLINING' || t === 'DECREASING' || t === 'DOWN') return 'DOWN'
  return 'STABLE'
}

function mapLoanRisk(payload, loans, baseline) {
  const raw = payload.loan_risk || payload.loanRisk
  if (raw) {
    return {
      level: raw.level || 'low',
      activeLoans: raw.active_loans ?? raw.activeLoans ?? (loans?.length || 0),
      totalMonthlyPayment: raw.total_monthly_payment ?? raw.totalMonthlyPayment ?? 0,
      paymentToIncomeRatio: raw.payment_to_income_ratio ?? raw.paymentToIncomeRatio ?? 0,
    }
  }
  return assessLoanRisk(loans || [], baseline)
}

/** Normalize older API shapes into the dashboard view model. */
export function normalizeDashboard(payload) {
  if (!payload) return null
  let src = payload
  if (payload.financial_profile) {
    src = {
      ...payload.financial_profile,
      ...payload,
      transactions: payload.transactions || payload.recent_transactions || [],
      loans: payload.loans || payload.active_loans || [],
    }
  }

  if (src.income && src.savings && src.resilience) {
    const loans = src.loans || []
    return attachLedger(applyStoredProfile({
      ...src,
      user: { ...mockUser, ...src.user },
      settings: { ...mockSettings, ...src.settings },
      weekly: src.weekly || mapWeekly(src, src.income?.sparkline),
      goals: src.goals || goalsFromBalance(src.savings?.balance || 0),
      loanRisk: mapLoanRisk(src, loans, src.income?.baseline),
      loans,
      expenses: src.expenses || [],
      expenseSummary: src.expenseSummary || summariseExpenses(src.expenses || []),
    }))
  }

  const incomeProfile = src.income_profile || {}
  const pocket = src.savings_pocket || {}
  const score = src.resilience_score || {}
  const factors = score.factors || {}
  const rainy = pocket.rainy_day || src.emergency_buffer || {}
  const today = incomeProfile.today_income ?? incomeProfile.today
  const baseline = incomeProfile.baseline
  const surplus =
    pocket.surplus != null
      ? Number(pocket.surplus)
      : today != null && baseline != null
        ? Number(today) - Number(baseline)
        : null
  const sparkline = (src.weekly || []).map((w) => w.income)
  const balance = pocket.current_balance ?? rainy.current ?? 0
  const emergencyCurrent = rainy.current ?? balance
  const emergencyTarget = rainy.target ?? src.emergency_buffer?.target ?? 0
  const loans = src.loans || src.active_loans || []
  const prediction = incomeProfile.prediction || {}
  const vol = incomeProfile.volatility

  return attachLedger(applyStoredProfile({
    currency: src.currency || 'INR',
    user: { ...mockUser, ...src.user },
    settings: { ...mockSettings, ...src.settings },
    income: {
      today: today ?? null,
      baseline: baseline ?? null,
      surplus,
      trend: mapTrend(incomeProfile.trend),
      volatility: typeof vol === 'number' ? vol : null,
      volatilityLabel: typeof vol === 'string' ? vol : incomeProfile.volatility_label || 'medium',
      consistency: incomeProfile.consistency ?? null,
      prediction: {
        next7Days: prediction.next_7_days ?? prediction.next7Days ?? null,
        min: prediction.min ?? null,
        max: prediction.max ?? null,
        confidence: prediction.confidence || 'medium',
      },
      sparkline,
    },
    savings: {
      suggested: pocket.suggested_amount ?? 0,
      streak: pocket.streak ?? 0,
      balance,
      monthlySaved: src.month_total_saved ?? 0,
      emergencyProgress: emergencyTarget
        ? Math.round((Number(rainy.progress ?? 0) <= 1 && rainy.progress != null
          ? Number(rainy.progress) * 100
          : (emergencyCurrent / emergencyTarget) * 100))
        : 0,
      emergencyCurrent,
      emergencyTarget,
      activity: (src.savings_activity || []).map((a) => ({
        date: a.date,
        amount: a.amount,
        note: a.note || '',
      })),
    },
    resilience: {
      score: score.score ?? 0,
      previousScore: score.previous_score ?? score.score ?? 0,
      change: score.change ?? score.score_change ?? 0,
      factors: {
        incomeStability: factors.income_stability ?? factors.incomeStability ?? 0,
        incomeTrend: factors.income_trend ?? factors.incomeTrend ?? 0,
        savingsBehaviour: factors.savings_behavior ?? factors.savingsBehaviour ?? 0,
        emergencyBuffer: factors.emergency_buffer ?? factors.emergencyBuffer ?? 0,
        debtBurden: factors.debt_burden ?? factors.debtBurden ?? 0,
      },
      explanation: score.explanation || '',
    },
    loanRisk: mapLoanRisk(src, loans, baseline),
    loans,
    nudge: {
      triggered: src.nudge?.triggered ?? Boolean(src.nudge?.message || src.nudge_context),
      title: src.nudge?.title || 'AI Nudge',
      message: src.nudge?.message || '',
    },
    weekly: mapWeekly(src, sparkline),
    goals: mapGoals(src, balance),
    transactions: (src.transactions || []).map((t, i) => ({
      id: t.id || t.transaction_id || `tx-${i}`,
      date: t.date,
      source: t.source,
      amount: t.amount,
      vsBaseline: t.vs_baseline ?? t.vsBaseline ?? 0,
      saved: t.saved ?? 0,
    })),
  }))
}
