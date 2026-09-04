import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useReducedMotion } from 'framer-motion'
import {
  getAvailableToSaveToday,
  projectPocketDeposit,
} from '../lib/savingsPocketDeposit'

const DEPOSIT_MS = 850

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function rectCenter(el) {
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
}

/**
 * Orchestrates a trustworthy savings-pocket deposit:
 * disable CTA → coin flight → count-up balance/progress/streak → confirmation or rollback.
 */
export function useSavingsDepositAnimation({
  savings,
  dashboard,
  onDeposit,
  formatMoney,
  t,
}) {
  const reducedMotion = useReducedMotion()
  const buttonRef = useRef(null)
  const balanceRef = useRef(null)

  const available = getAvailableToSaveToday(dashboard)
  const [inputAmount, setInputAmount] = useState(() =>
    available > 0 ? String(available) : '',
  )
  const [inputTouched, setInputTouched] = useState(false)

  const [isDepositing, setIsDepositing] = useState(false)
  const [liveBalance, setLiveBalance] = useState(null)
  const [liveProgress, setLiveProgress] = useState(null)
  const [liveStreak, setLiveStreak] = useState(null)
  const [liveAvailable, setLiveAvailable] = useState(null)
  const [streakPulse, setStreakPulse] = useState(false)
  const [coins, setCoins] = useState([])
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  // Keep the input synced to remaining available until the user edits it.
  useEffect(() => {
    if (isDepositing) return
    if (!inputTouched) {
      setInputAmount(available > 0 ? String(available) : '')
      return
    }
    setInputAmount((prev) => {
      const typed = Math.round(Number(prev) || 0)
      if (available <= 0) return ''
      if (typed > available) return String(available)
      return prev
    })
    if (available <= 0) setInputTouched(false)
  }, [available, inputTouched, isDepositing])

  const parsedAmount = Math.max(0, Math.round(Number(inputAmount) || 0))
  const amount = Math.min(parsedAmount, available)
  const amountInvalid =
    inputAmount !== '' && (parsedAmount <= 0 || parsedAmount > available)
  const canDeposit = amount > 0 && available > 0 && !isDepositing && !amountInvalid

  const displayAvailable = liveAvailable != null ? liveAvailable : available
  const balance = liveBalance != null ? liveBalance : Number(savings?.balance) || 0
  const progress =
    liveProgress != null
      ? liveProgress
      : Math.min(100, Math.max(0, Number(savings?.emergencyProgress) || 0))
  const streak = liveStreak != null ? liveStreak : Number(savings?.streak) || 0

  const clearTransient = useCallback(() => {
    setConfirmation('')
    setError('')
    setStatusMessage('')
    setCoins([])
    setStreakPulse(false)
  }, [])

  const onInputChange = useCallback((value) => {
    setInputTouched(true)
    const cleaned = String(value).replace(/[^\d]/g, '')
    setInputAmount(cleaned)
  }, [])

  const useMaxAvailable = useCallback(() => {
    setInputTouched(true)
    setInputAmount(available > 0 ? String(available) : '')
  }, [available])

  const runDeposit = useCallback(async () => {
    if (!canDeposit || typeof onDeposit !== 'function') return

    clearTransient()
    setIsDepositing(true)

    const projected = projectPocketDeposit(dashboard, amount)
    if (projected.amount <= 0) {
      const fail = t('depositNothingLeft')
      setError(fail)
      setStatusMessage(fail)
      setIsDepositing(false)
      return
    }

    const { previous, next, protectionDays, streakIncreased } = projected

    setLiveBalance(previous.balance)
    setLiveProgress(previous.emergencyProgress)
    setLiveStreak(previous.streak)
    setLiveAvailable(previous.suggested)

    let apiError = null
    const apiPromise = Promise.resolve()
      .then(() => onDeposit(projected.amount))
      .catch((err) => {
        apiError = err
      })

    if (reducedMotion) {
      setLiveBalance(next.balance)
      setLiveProgress(next.emergencyProgress)
      setLiveStreak(next.streak)
      setLiveAvailable(next.suggested)
      await apiPromise
    } else {
      const from = rectCenter(buttonRef.current)
      const to = rectCenter(balanceRef.current)
      if (from && to) {
        setCoins(
          [0, 1, 2].map((i) => ({
            id: `${Date.now()}-${i}`,
            from,
            to,
            delay: i * 0.08,
          })),
        )
      }

      const anims = [
        animate(previous.balance, next.balance, {
          duration: DEPOSIT_MS / 1000,
          ease: [0.23, 1, 0.32, 1],
          onUpdate: (v) => setLiveBalance(Math.round(v)),
        }),
        animate(previous.emergencyProgress, next.emergencyProgress, {
          duration: DEPOSIT_MS / 1000,
          ease: [0.23, 1, 0.32, 1],
          onUpdate: (v) => setLiveProgress(Math.round(v)),
        }),
        animate(previous.suggested, next.suggested, {
          duration: DEPOSIT_MS / 1000,
          ease: [0.23, 1, 0.32, 1],
          onUpdate: (v) => setLiveAvailable(Math.round(v)),
        }),
      ]

      await Promise.all([...anims.map((a) => a.finished), sleep(DEPOSIT_MS), apiPromise])
      setCoins([])
      setLiveBalance(next.balance)
      setLiveProgress(next.emergencyProgress)
      setLiveStreak(next.streak)
      setLiveAvailable(next.suggested)
      if (streakIncreased) {
        setStreakPulse(true)
        window.setTimeout(() => setStreakPulse(false), 700)
      }
    }

    if (apiError) {
      setLiveBalance(null)
      setLiveProgress(null)
      setLiveStreak(null)
      setLiveAvailable(null)
      setCoins([])
      const fail = t('depositFailed')
      setError(fail)
      setStatusMessage(fail)
      setIsDepositing(false)
      return
    }

    const confirmKey = protectionDays === 1 ? 'depositConfirmOne' : 'depositConfirm'
    const msg = t(confirmKey, {
      amount: formatMoney(projected.amount),
      days: protectionDays,
    })
    setConfirmation(msg)
    setStatusMessage(msg)
    setInputTouched(false)
    setInputAmount(next.suggested > 0 ? String(next.suggested) : '')
    setLiveAvailable(null)
    setIsDepositing(false)
  }, [
    amount,
    canDeposit,
    clearTransient,
    dashboard,
    formatMoney,
    onDeposit,
    reducedMotion,
    t,
  ])

  return {
    amount,
    available: displayAvailable,
    maxAvailable: available,
    inputAmount,
    onInputChange,
    useMaxAvailable,
    amountInvalid,
    canDeposit,
    isDepositing,
    balance,
    progress,
    streak,
    streakPulse,
    coins,
    confirmation,
    error,
    statusMessage,
    reducedMotion: Boolean(reducedMotion),
    buttonRef,
    balanceRef,
    runDeposit,
  }
}
