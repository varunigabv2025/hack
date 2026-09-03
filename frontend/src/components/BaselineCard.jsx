import { formatInr } from '../lib/format'
import { strings } from '../i18n/strings'

export default function BaselineCard({ baseline, todayIncome, trend, language }) {
  const copy = strings[language] || strings.en
  const today = todayIncome == null ? 0 : Number(todayIncome)
  const usual = Number(baseline) || 0
  const max = Math.max(today, usual, 1)

  return (
    <section className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{copy.baseline.title}</p>
      <p className="mt-3 font-mono text-4xl font-semibold tabular-nums text-ink sm:text-5xl">
        {formatInr(baseline)}
      </p>
      <p className="mt-2 text-sm text-engine">{copy.trend[trend] || trend}</p>
      <p className="mt-1 text-xs text-muted">{copy.baseline.hint}</p>
      <div className="mt-5 space-y-3">
        <Meter label={copy.baseline.today} value={today} max={max} color="bg-income" />
        <Meter label={copy.baseline.usual} value={usual} max={max} color="bg-muted" />
      </div>
    </section>
  )
}

function Meter({ label, value, max, color }) {
  const width = `${Math.min(100, (value / max) * 100)}%`
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span className="tabular-nums">{formatInr(value)}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-card-2">
        <div className={`h-full rounded-full ${color} transition-[width] duration-300`} style={{ width }} />
      </div>
    </div>
  )
}
