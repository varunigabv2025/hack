import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  addTransaction,
  contributeGoal,
  createGoal,
  deleteGoal,
  depositToPocket as depositToPocketApi,
  fetchNudge,
  getDashboard,
  isLiveApi,
  resetDemo,
} from '../services/api'
import {
  addMockExpense,
  addMockGoal,
  addMockLoan,
  contributeMockGoal,
  deleteMockGoal,
  normalizeDashboard,
  persistProfile,
} from '../data/mockData'

const AppContext = createContext(null)
const CURRENCY_KEY = 're_currency'

export function AppProvider({ children }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [currency, setCurrencyState] = useState(() => localStorage.getItem(CURRENCY_KEY) || 'INR')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const live = isLiveApi()

  const setCurrency = useCallback((code) => {
    setCurrencyState(code)
    localStorage.setItem(CURRENCY_KEY, code)
  }, [])

  const refresh = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const payload = normalizeDashboard(await getDashboard())
      try {
        const nudge = await fetchNudge(payload)
        if (nudge?.message) payload.nudge = { ...payload.nudge, ...nudge }
      } catch {
        /* keep mock nudge */
      }
      setData(payload)
      setStatus('ready')
    } catch (err) {
      setError(err.message || 'Failed to load')
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const submitTransaction = useCallback(async (transaction) => {
    const payload = normalizeDashboard(await addTransaction(transaction))
    setData(payload)
    setStatus('ready')
    return payload
  }, [])

  const reset = useCallback(async () => {
    const payload = normalizeDashboard(await resetDemo())
    setData(payload)
    setStatus('ready')
    return payload
  }, [])

  const addExpense = useCallback((expense) => {
    const payload = normalizeDashboard(addMockExpense(expense))
    setData(payload)
    return payload
  }, [])

  const addLoan = useCallback((loan) => {
    const payload = normalizeDashboard(addMockLoan(loan))
    setData(payload)
    return payload
  }, [])

  const addGoal = useCallback(async (goal) => {
    if (!live) {
      const payload = normalizeDashboard(addMockGoal(goal))
      setData(payload)
      return payload
    }
    const userId = data?.user?.user_id || data?.user?.id || 'demo-user-1'
    await createGoal({
      user_id: userId,
      name: goal.name,
      target: goal.target,
      icon: goal.icon,
      current: goal.current || 0,
    })
    await refresh()
  }, [live, data, refresh])

  const contributeToGoal = useCallback(async (goalId, amount = 500) => {
    if (!live) {
      const payload = normalizeDashboard(contributeMockGoal(goalId, amount))
      setData(payload)
      return payload
    }
    await contributeGoal(goalId, amount)
    await refresh()
  }, [live, refresh])

  const removeGoal = useCallback(async (goalId) => {
    if (!live) {
      const payload = normalizeDashboard(deleteMockGoal(goalId))
      setData(payload)
      return payload
    }
    await deleteGoal(goalId)
    await refresh()
  }, [live, refresh])

  const depositToPocket = useCallback(async (amount) => {
    const payload = normalizeDashboard(await depositToPocketApi(amount))
    setData(payload)
    setStatus('ready')
    return payload
  }, [])

  const updateProfile = useCallback((patch) => {
    setData((prev) => {
      if (!prev) return prev
      const next = {
        ...prev,
        user: { ...prev.user, ...patch.user },
        settings: { ...prev.settings, ...patch.settings },
      }
      persistProfile({ user: next.user, settings: next.settings })
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      data,
      status,
      error,
      currency,
      setCurrency,
      sidebarOpen,
      setSidebarOpen,
      live,
      refresh,
      submitTransaction,
      reset,
      updateProfile,
      addExpense,
      addLoan,
      addGoal,
      contributeToGoal,
      removeGoal,
      depositToPocket,
    }),
    [
      data,
      status,
      error,
      currency,
      setCurrency,
      sidebarOpen,
      live,
      refresh,
      submitTransaction,
      reset,
      updateProfile,
      addExpense,
      addLoan,
      addGoal,
      contributeToGoal,
      removeGoal,
      depositToPocket,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
