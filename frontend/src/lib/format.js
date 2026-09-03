const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatInr(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  return inr.format(Number(value))
}

export function formatSigned(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const n = Number(value)
  const prefix = n > 0 ? '+' : ''
  return `${prefix}${n}`
}

export function formatSignedInr(value) {
  if (value == null || Number.isNaN(Number(value))) return '—'
  const n = Number(value)
  const formatted = formatInr(Math.abs(n))
  if (n > 0) return `+${formatted}`
  if (n < 0) return `−${formatted}`
  return formatted
}

export function formatDay(iso) {
  if (!iso) return '—'
  const d = new Date(`${iso}T00:00:00`)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function greetingForNow(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
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
