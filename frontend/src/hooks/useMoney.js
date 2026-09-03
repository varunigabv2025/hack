import { useCallback, useMemo } from 'react'
import { useApp } from '../context/AppContext'
import { formatMoney as fmt, formatSignedMoney as fmtSigned } from '../lib/format'
import { getCurrency } from '../data/currencies'

export function useMoney() {
  const { currency, setCurrency } = useApp()
  const active = useMemo(() => getCurrency(currency), [currency])

  const formatMoney = useCallback((value) => fmt(value, currency), [currency])
  const formatSignedMoney = useCallback((value) => fmtSigned(value, currency), [currency])

  return { currency, active, setCurrency, formatMoney, formatSignedMoney }
}
