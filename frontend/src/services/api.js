import { applyMockTransaction, getMockDashboard, resetMockDashboard } from '../data/mockData'

const API_URL = import.meta.env.VITE_API_URL || ''

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  if (!res.ok) {
    const err = new Error(`Request failed (${res.status})`)
    err.status = res.status
    throw err
  }
  return res.json()
}

export function isLiveApi() {
  return Boolean(API_URL)
}

export async function getDashboard() {
  if (!API_URL) {
    await delay()
    return getMockDashboard()
  }
  return request('/dashboard')
}

export async function addTransaction(transaction) {
  if (!API_URL) {
    await delay(520)
    return applyMockTransaction(transaction)
  }
  return request('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  })
}

export async function getTransactions() {
  if (!API_URL) {
    await delay(200)
    return getMockDashboard().transactions || []
  }
  return request('/transactions')
}

export async function resetDemo() {
  if (API_URL) return getDashboard()
  await delay(200)
  return resetMockDashboard()
}
