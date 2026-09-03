import { formatSigned } from '../lib/format'
import { strings } from '../i18n/strings'

export default function ScoreCard({ score = 0, change = 0, language, large = false }) {
  const copy = strings[language] || strings.en
  const size = large ? 240 : 180
  const stroke = large ? 16 : 12
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, Number(score) || 0)) / 100
  const offset = c * (1 - pct)
  const tone = score >= 70 ? '#22C55E' : score >= 40 ? '#38BDF8' : '#F59E0B'
  const up = change >= 0

  return (
    <section className="card flex flex-col items-center text-center">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{copy.score.title}</p>
      <div className="relative mt-3">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="block max-w-full">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1E293B" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ filter: `drop-shadow(0 0 10px ${tone}66)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className={`font-semibold leading-none tabular-nums text-ink ${large ? 'text-6xl' : 'text-5xl'}`}>
            {Math.round(score)}
          </p>
          <p className="mt-2 text-xs uppercase tracking-wider text-muted">{copy.score.of}</p>
        </div>
      </div>
      <p className={`mt-4 text-sm font-semibold tabular-nums ${up ? 'text-cta' : 'text-income'}`}>
        {formatSigned(change)} {copy.score.week}
      </p>
    </section>
  )
}
