import { motion } from 'framer-motion'
import { ArrowUpRight, Wallet, Crosshair, Target } from 'lucide-react'

function getPoints(values = []) {
  if (!values.length) return []
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = Math.max(max - min, 1)
  return values.map((v, i) => ({
    x: 4 + (i / Math.max(values.length - 1, 1)) * 92,
    y: 36 - ((v - min) / span) * 28,
  }))
}

function buildSmoothPath(points) {
  if (!points.length) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`

  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d
}

const toneConfig = {
  burgundy: {
    icon: Wallet,
    iconWrap: 'bg-[#F3E8EF]',
    iconColor: '#6B2D5B',
    stroke: '#6B2D5B',
    chipBg: '#F3E8EF',
    chipText: '#6B2D5B',
    fillTop: '0.18',
  },
  gold: {
    icon: Crosshair,
    iconWrap: 'bg-[#FEF6E7]',
    iconColor: '#C9842F',
    stroke: '#C9842F',
    chipBg: '#FEF6E7',
    chipText: '#C9842F',
    fillTop: '0.16',
  },
  emerald: {
    icon: Target,
    iconWrap: 'bg-[#E8F4EC]',
    iconColor: '#2F7A4F',
    stroke: '#2F7A4F',
    chipBg: '#E8F4EC',
    chipText: '#2F7A4F',
    fillTop: '0.16',
  },
}

export default function IncomeMetric({
  label,
  value,
  hint,
  tone = 'burgundy',
  sparkline = [],
  delay = 0,
  showHintArrow = false,
}) {
  const t = toneConfig[tone] || toneConfig.burgundy
  const Icon = t.icon
  const points = getPoints(sparkline)
  const linePath = buildSmoothPath(points)
  const last = points[points.length - 1]
  const first = points[0]
  const areaPath = linePath && first && last
    ? `${linePath} L ${last.x} 44 L ${first.x} 44 Z`
    : ''
  const gradId = `metric-fill-${tone}`

  return (
    <article className="rounded-[1.25rem] border border-[#EFE8E1] bg-white px-5 py-5 shadow-[0_1px_2px_rgba(30,36,48,0.04),0_8px_24px_rgba(30,36,48,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-full ${t.iconWrap}`}
            >
              <Icon className="h-4 w-4" style={{ color: t.iconColor }} aria-hidden="true" />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8A8791]">
              {label}
            </p>
          </div>

          <p className="mt-3 text-[2rem] font-bold leading-none tracking-tight text-[#1E2430]">
            {value}
          </p>

          {hint ? (
            <p
              className="mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: t.chipBg, color: t.chipText }}
            >
              {(showHintArrow || tone === 'burgundy') && (
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {hint}
            </p>
          ) : null}
        </div>

        {linePath ? (
          <div className="mt-1 h-[92px] w-[132px] shrink-0" aria-hidden="true">
            <svg viewBox="0 0 100 44" className="h-full w-full overflow-visible">
              <defs>
                <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={t.stroke} stopOpacity={t.fillTop} />
                  <stop offset="100%" stopColor={t.stroke} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              <motion.path
                d={areaPath}
                fill={`url(#${gradId})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: delay + 0.15 }}
              />

              <motion.path
                d={linePath}
                fill="none"
                stroke={t.stroke}
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: delay + 0.1, ease: [0.23, 1, 0.32, 1] }}
              />

              {points.map((p, i) => (
                <motion.circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="2.6"
                  fill={t.stroke}
                  stroke="#FFFFFF"
                  strokeWidth="1.4"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: delay + 0.25 + i * 0.04 }}
                />
              ))}
            </svg>
          </div>
        ) : null}
      </div>
    </article>
  )
}
