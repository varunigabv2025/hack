import { getCurrency, convertFromInr } from '../data/currencies'

function getFormatter(code) {
  const c = getCurrency(code)
  const locale = code === 'INR' ? 'en-IN' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: code,
    maximumFractionDigits: code === 'INR' || code === 'JPY' || code === 'KRW' ? 0 : 2,
  })
}

export function formatMoney(value, currencyCode = 'INR') {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const converted = convertFromInr(Number(value), currencyCode)
  return getFormatter(currencyCode).format(converted)
}

export function formatSignedMoney(value, currencyCode = 'INR') {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const n = Number(value)
  const formatted = formatMoney(Math.abs(n), currencyCode)
  if (n > 0) return `+${formatted}`
  if (n < 0) return `−${formatted}`
  return formatted
}

export function formatSigned(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const n = Number(value)
  return `${n > 0 ? '+' : ''}${n}`
}

export function formatDay(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function greetingForNow(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function initials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'RE'
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
}
