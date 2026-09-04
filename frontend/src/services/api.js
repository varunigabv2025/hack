import { applyMockTransaction, getMockDashboard, resetMockDashboard } from '../data/mockData'
import { factsFromDashboard, generateFallbackNudge } from '../lib/nudgeFallback'
import { analyseSchemes } from '../lib/schemeAnalysis'
import { getUserId } from '../utils/auth'

const API_URL = import.meta.env.VITE_API_URL || ''
// Empty = same-origin (Vite proxies /nudge and /schemes to Member 4 backend)
const NUDGE_URL = import.meta.env.VITE_NUDGE_URL ?? API_URL ?? ''


function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function request(base, path, options = {}) {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    credentials: 'include', // Include cookies for authentication
    ...options,
  })
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`)
    err.status = res.status
    try {
      const data = await res.json()
      err.message = data.message || err.message
    } catch (e) {
      // Response not JSON, use default error message
    }
    throw err
  }
  return res.json()
}

export function isLiveApi() {
  return Boolean(API_URL)
}

export async function getDashboard() {
  const userId = getUserId()
  if (!userId) {
    throw new Error('User not authenticated. Please log in.')
  }
  
  if (!API_URL) {
    await delay()
    return getMockDashboard()
  }
  return request(API_URL, `/dashboard/${userId}`)
}

export async function addTransaction(transaction) {
  const userId = getUserId()
  if (!userId) {
    throw new Error('User not authenticated. Please log in.')
  }
  
  if (!API_URL) {
    await delay(520)
    return applyMockTransaction(transaction)
  }
  // Ensure transaction has user_id from authenticated user
  const payload = {
    user_id: userId,
    ...transaction
  }
  return request(API_URL, '/transactions', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getTransactions() {
  const userId = getUserId()
  if (!userId) {
    throw new Error('User not authenticated. Please log in.')
  }
  
  if (!API_URL) {
    await delay(200)
    return getMockDashboard().transactions || []
  }
  return request(API_URL, `/transactions/${userId}`)
}

/**
 * Check if the authenticated user has entered income for today
 * @returns {Promise<boolean>} true if today's income exists
 */
export async function hasTodaysIncome() {
  try {
    const userId = getUserId()
    if (!userId) {
      return false
    }
    
    // Get user's transactions
    const response = await getTransactions()
    const transactions = response.transactions || response || []
    
    // Get today's date in ISO format (YYYY-MM-DD)
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0] // e.g., "2026-09-04"
    
    // Check if any transaction matches today's date
    const hasTodayTransaction = transactions.some(txn => {
      if (!txn.date) return false
      
      // Handle ISO date with time: "2026-09-04T00:00:00.000Z"
      const txnDateStr = new Date(txn.date).toISOString().split('T')[0]
      return txnDateStr === todayStr
    })
    
    return hasTodayTransaction
  } catch (error) {
    console.error('Error checking today\'s income:', error)
    return false // On error, assume no income (will show income setup)
  }
}

export async function resetDemo() {
  if (API_URL) return getDashboard()
  await delay(200)
  return resetMockDashboard()
}

/** Member 4 — fetch AI/fallback nudge from facts or dashboard snapshot. */
export async function fetchNudge(dashboardOrFacts = {}) {
  const facts =
    dashboardOrFacts.income || dashboardOrFacts.resilience
      ? factsFromDashboard(dashboardOrFacts)
      : dashboardOrFacts

  try {
    const payload = await request(NUDGE_URL, '/nudge', {
      method: 'POST',
      body: JSON.stringify({ facts }),
    })
    return {
      triggered: payload.nudge?.triggered ?? true,
      title: payload.nudge?.title,
      message: payload.nudge?.message,
      source: payload.meta?.source || 'api',
    }
  } catch {
    return generateFallbackNudge(facts)
  }
}

/** Gemini coach reply for the floating chat. */
export async function fetchCoachReply(question, dashboard = {}) {
  try {
    const payload = await request(NUDGE_URL, '/nudge/chat', {
      method: 'POST',
      body: JSON.stringify({ question, dashboard }),
    })
    if (payload?.reply) return payload.reply
  } catch {
    /* local fallback below */
  }
  return generateFallbackNudge(factsFromDashboard(dashboard)).message
}

/** AI + ranked government scheme analysis for the user profile. */
export async function fetchSchemeAnalysis(dashboard = {}) {
  const local = analyseSchemes(dashboard)

  try {
    const payload = await request(NUDGE_URL, '/schemes/analyse', {
      method: 'POST',
      body: JSON.stringify(dashboard),
    })

    // Keep rich frontend catalog fields; merge AI insight + server ranks by id
    const serverRanked = payload.ranked || []
    const merged = local.ranked
      .map((scheme) => {
        const hit = serverRanked.find((s) => s.id === scheme.id)
        return hit
          ? { ...scheme, match: hit.match, priority: hit.priority, reason: hit.reason || scheme.reason }
          : scheme
      })
      .sort((a, b) => b.match - a.match)

    return {
      ctx: payload.ctx || local.ctx,
      ranked: merged,
      insight: payload.insight || local.insight,
      summary: {
        ...local.summary,
        ...(payload.summary || {}),
        headline: local.summary.headline,
      },
    }
  } catch {
    return local
  }
}

/** Goals API — live Mongo backend or local mock ledger. */
export async function createGoal(goal) {
  if (!API_URL) {
    await delay(280)
    const { addMockGoal } = await import('../data/mockData')
    return addMockGoal(goal)
  }
  const payload = await request(API_URL, '/goals', {
    method: 'POST',
    body: JSON.stringify(goal),
  })
  return payload.goal || payload
}

export async function listGoals(userId) {
  if (!API_URL) {
    await delay(200)
    return getMockDashboard().goals || []
  }
  const payload = await request(API_URL, `/goals/${encodeURIComponent(userId)}`)
  return payload.goals || []
}

export async function contributeGoal(goalId, amount = 500) {
  if (!API_URL) {
    await delay(280)
    const { contributeMockGoal } = await import('../data/mockData')
    return contributeMockGoal(goalId, amount)
  }
  const payload = await request(API_URL, `/goals/${encodeURIComponent(goalId)}/contribute`, {
    method: 'POST',
    body: JSON.stringify({ amount }),
  })
  return payload.goal || payload
}

export async function deleteGoal(goalId) {
  if (!API_URL) {
    await delay(200)
    const { deleteMockGoal } = await import('../data/mockData')
    return deleteMockGoal(goalId)
  }
  return request(API_URL, `/goals/${encodeURIComponent(goalId)}`, { method: 'DELETE' })
}

/** Deposit suggested surplus into the savings pocket (mock ledger; live contributes to emergency goal when present). */
export async function depositToPocket(amount) {
  const amt = Math.max(0, Math.round(Number(amount) || 0))
  if (amt <= 0) {
    const err = new Error('Invalid deposit amount')
    err.code = 'INVALID_AMOUNT'
    throw err
  }

  if (!API_URL) {
    await delay(520)
    const { depositMockPocket } = await import('../data/mockData')
    return depositMockPocket(amt)
  }

  const dash = await getDashboard()
  const goals = dash.goals || dash.Goals || []
  const emergency =
    goals.find((g) => g.id === 'emergency') ||
    goals.find((g) => /emergency|buffer|rainy/i.test(String(g.name || '')))

  if (emergency?.id) {
    await contributeGoal(emergency.id, amt)
  }

  // Client ledger keeps pocket fields in sync for demo UX when backend has no deposit route.
  const { depositMockPocket } = await import('../data/mockData')
  return depositMockPocket(amt)
}
