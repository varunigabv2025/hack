import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { addTransaction, getDashboard, isLiveApi, resetDemo } from '../services/api'

const AppContext = createContext(null)
const LANG_KEY = 're_language'

export function AppProvider({ children }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [language, setLanguageState] = useState(() => localStorage.getItem(LANG_KEY) || 'en')
  const live = isLiveApi()

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang)
    localStorage.setItem(LANG_KEY, lang)
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
  }, [])

  useEffect(() => {
    document.documentElement.lang = language === 'ta' ? 'ta' : 'en'
  }, [language])

  const refresh = useCallback(async () => {
    setStatus('loading')
    setError(null)
    try {
      const payload = await getDashboard()
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
    const payload = await addTransaction(transaction)
    setData(payload)
    setStatus('ready')
    return payload
  }, [])

  const reset = useCallback(async () => {
    const payload = await resetDemo()
    setData(payload)
    setStatus('ready')
    return payload
  }, [])

  const value = useMemo(
    () => ({
      data,
      status,
      error,
      language,
      setLanguage,
      live,
      refresh,
      submitTransaction,
      reset,
    }),
    [data, status, error, language, setLanguage, live, refresh, submitTransaction, reset],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
