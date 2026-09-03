import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addTransaction, fetchNudge, getDashboard, isLiveApi, resetDemo } from '../services/api'
import { addMockExpense, addMockLoan, normalizeDashboard, persistProfile } from '../data/mockData'

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
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
