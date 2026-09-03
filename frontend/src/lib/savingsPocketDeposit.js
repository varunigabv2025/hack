/** Pure helpers for savings-pocket deposits (no React). */

function num(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

/** Daily essentials from monthly expense / emergency target (same basis as Bad Week). */
export function dailyEssentials(dashboard = {}) {
  const monthly = num(
    dashboard?.user?.monthlyExpense,
    num(dashboard?.savings?.emergencyTarget, 8000),
  )
  return Math.max(1, Math.round(monthly / 30))
}

/** How many days the emergency buffer covers at current / projected balance. */
export function getProtectionDays(dashboard = {}, balanceOverride) {
  const buffer = Math.max(
    0,
    balanceOverride != null
      ? num(balanceOverride, 0)
      : num(dashboard?.savings?.emergencyCurrent, dashboard?.savings?.balance, 0),
  )
  const daily = dailyEssentials(dashboard)
  return Math.max(0, Math.floor(buffer / daily))
}

/** Max the customer can still sweep from today's surplus / suggested. */
export function getAvailableToSaveToday(dashboard = {}) {
  const suggested = Math.max(0, num(dashboard?.savings?.suggested, 0))
  const surplus = Math.max(0, num(dashboard?.income?.surplus, 0))
  if (suggested > 0) return suggested
  return surplus
}

/**
 * Project savings fields after depositing `amount` into the pocket.
 * Caps at today's remaining available and subtracts from suggested / surplus.
 * Does not mutate the input dashboard.
 */
export function projectPocketDeposit(dashboard = {}, amount) {
  const available = getAvailableToSaveToday(dashboard)
  const requested = Math.max(0, Math.round(num(amount, 0)))
  const amt = Math.min(requested, available)
  const savings = dashboard?.savings || {}
  const income = dashboard?.income || {}
  const prevBalance = num(savings.balance, 0)
  const prevCurrent = num(savings.emergencyCurrent, prevBalance)
  const target = Math.max(1, num(savings.emergencyTarget, 8000))
  const prevStreak = num(savings.streak, 0)
  const prevSuggested = Math.max(0, num(savings.suggested, 0))
  const prevSurplus =
    income.surplus == null || income.surplus === ''
      ? null
      : Math.max(0, num(income.surplus, 0))
  const nextBalance = prevBalance + amt
  const nextCurrent = prevCurrent + amt
  const nextProgress = Math.min(100, Math.round((nextCurrent / target) * 100))
  const today = new Date().toISOString().slice(0, 10)
  const alreadySavedToday = (Array.isArray(savings.activity) ? savings.activity : []).some(
    (row) => row?.date === today && num(row.amount, 0) > 0,
  )
  const nextStreak = amt > 0 && !alreadySavedToday ? prevStreak + 1 : prevStreak
  const nextSuggested = Math.max(0, prevSuggested - amt)
  const nextSurplus = prevSurplus == null ? null : Math.max(0, prevSurplus - amt)

  return {
    amount: amt,
    available,
    requested,
    capped: requested > available,
    previous: {
      balance: prevBalance,
      emergencyCurrent: prevCurrent,
      emergencyProgress: Math.min(100, Math.max(0, num(savings.emergencyProgress, 0))),
      streak: prevStreak,
      monthlySaved: num(savings.monthlySaved, 0),
      suggested: prevSuggested,
      surplus: prevSurplus,
    },
    next: {
      balance: nextBalance,
      emergencyCurrent: nextCurrent,
      emergencyProgress: nextProgress,
      streak: nextStreak,
      monthlySaved: num(savings.monthlySaved, 0) + amt,
      suggested: nextSuggested,
      surplus: nextSurplus,
      activity: [
        { date: today, amount: amt, note: 'Surplus sweep' },
        ...(Array.isArray(savings.activity) ? savings.activity : []),
      ],
    },
    protectionDays: getProtectionDays(dashboard, nextCurrent),
    streakIncreased: nextStreak > prevStreak,
  }
}
