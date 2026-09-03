/**
 * Data-quality transparency for recommendations.
 * Counts come only from dashboard facts — never invented.
 */

function daysBetween(a, b) {
  const t0 = new Date(a).getTime()
  const t1 = new Date(b).getTime()
  if (!Number.isFinite(t0) || !Number.isFinite(t1)) return 0
  return Math.max(1, Math.round(Math.abs(t1 - t0) / 86400000) + 1)
}

/**
 * @param {object} dashboard
 * @returns {{
 *   incomeEntries: number,
 *   daysOfHistory: number,
 *   activeLoans: number,
 *   expenseRecords: number,
 *   quality: 'High' | 'Medium' | 'Low',
 *   score: number,
 *   lines: string[],
 *   note: string
 * }}
 */
export function assessDataQuality(dashboard = {}) {
  const txs = Array.isArray(dashboard.transactions) ? dashboard.transactions : []
  const expenses = Array.isArray(dashboard.expenses) ? dashboard.expenses : []
  const loans = Array.isArray(dashboard.loans) ? dashboard.loans : []
  const weekly = Array.isArray(dashboard.weekly) ? dashboard.weekly : []
  const sparkline = Array.isArray(dashboard.income?.sparkline) ? dashboard.income.sparkline : []

  const incomeEntries = Math.max(txs.length, weekly.length, sparkline.length)
  const activeLoans =
    dashboard.loanRisk?.activeLoans != null
      ? Number(dashboard.loanRisk.activeLoans) || 0
      : loans.filter((l) => (l.status || 'active') === 'active').length
  const expenseRecords =
    dashboard.expenseSummary?.expense_count != null
      ? Number(dashboard.expenseSummary.expense_count) || expenses.length
      : expenses.length

  const dates = txs.map((t) => t.date).filter(Boolean).sort()
  let daysOfHistory = 0
  if (dates.length >= 2) {
    daysOfHistory = daysBetween(dates[0], dates[dates.length - 1])
  } else if (weekly.length > 1) {
    daysOfHistory = weekly.length
  } else if (sparkline.length > 1) {
    daysOfHistory = sparkline.length
  } else {
    daysOfHistory = Math.max(incomeEntries, 1)
  }

  // Weighted confidence from coverage — transparent, not a hidden model.
  let score = 0
  if (incomeEntries >= 14) score += 35
  else if (incomeEntries >= 7) score += 22
  else if (incomeEntries >= 3) score += 12
  else score += 4

  if (daysOfHistory >= 28) score += 35
  else if (daysOfHistory >= 14) score += 22
  else if (daysOfHistory >= 7) score += 12
  else score += 4

  if (expenseRecords >= 8) score += 15
  else if (expenseRecords >= 3) score += 10
  else if (expenseRecords >= 1) score += 5

  // Loan ledger present (even zero active) slightly improves repayment context.
  if (Array.isArray(dashboard.loans)) score += 10
  else if (dashboard.loanRisk) score += 5

  if (dashboard.savings?.streak != null) score += 5

  const quality = score >= 75 ? 'High' : score >= 45 ? 'Medium' : 'Low'

  const lines = [
    `${incomeEntries} income ${incomeEntries === 1 ? 'entry' : 'entries'}`,
    `${daysOfHistory} ${daysOfHistory === 1 ? 'day' : 'days'} of history`,
    `${activeLoans} active ${activeLoans === 1 ? 'loan' : 'loans'}`,
    `${expenseRecords} expense ${expenseRecords === 1 ? 'record' : 'records'}`,
  ]

  return {
    incomeEntries,
    daysOfHistory,
    activeLoans,
    expenseRecords,
    quality,
    score: Math.min(100, score),
    lines,
    note:
      quality === 'High'
        ? 'Recommendations rest on a solid local history.'
        : quality === 'Medium'
          ? 'Useful guidance — confidence rises as you log more days.'
          : 'Early signal only — keep logging income and expenses.',
  }
}
