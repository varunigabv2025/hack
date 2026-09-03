import { strings } from '../i18n/strings'

const ORDER = ['income_stability', 'income_trend', 'savings_behavior', 'emergency_buffer']

export default function ScoreBreakdown({ factors = {}, language }) {
  const copy = strings[language] || strings.en

  return (
    <section className="card">
      <h2 className="text-xs font-medium uppercase tracking-wide text-muted">{copy.score.factors}</h2>
      <ul className="mt-4 space-y-4">
        {ORDER.map((key) => {
          const value = Number(factors[key]) || 0
          return (
            <li key={key}>
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <span className="text-sm text-ink">{copy.score[key]}</span>
                <span className="font-mono text-sm font-semibold tabular-nums">{value}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-card-2">
                <div
                  className="h-full rounded-full bg-engine transition-[width] duration-300"
                  style={{ width: `${Math.min(100, value)}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
