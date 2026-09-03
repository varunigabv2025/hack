/**
 * frontend/src/pages/ProtectionHub.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * "Protect Yourself" — Financial Protection Hub page.
 *
 * Route: /protection
 *
 * Users pick ONE protection area; a personalised detail panel slides into view
 * below the cards. Priority (LOW / MEDIUM / HIGH) is derived from live dashboard
 * data (emergency progress, occupation, age, income trend) — no fake data.
 *
 * Design matches the existing Resilience Engine system:
 *   - AppLayout wrapper (Sidebar + Header + FloatingChatButton)
 *   - Skeleton / ErrorState loading guards
 *   - .card / .card-panel / .card-glow-burgundy CSS classes from index.css
 *   - burgundy / gold / ink / muted colour tokens
 *   - framer-motion entrance animations
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ExternalLink, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { PROTECTION_TYPES, computePriority } from '../data/protectionData'

// ─── Priority badge ───────────────────────────────────────────────────────────
const PRIORITY_STYLE = {
  high: {
    badge: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
    label: 'HIGH PRIORITY',
  },
  medium: {
    badge: 'bg-gold-soft text-gold-deep border border-gold/40',
    dot: 'bg-gold',
    label: 'MEDIUM PRIORITY',
  },
  low: {
    badge: 'bg-beige text-muted border border-line',
    dot: 'bg-muted',
    label: 'LOW PRIORITY',
  },
}

function PriorityBadge({ level }) {
  const cfg = PRIORITY_STYLE[level] ?? PRIORITY_STYLE.low
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

// ─── Selection card ───────────────────────────────────────────────────────────
function ProtectionCard({ type, priority, isSelected, onClick, delay }) {
  const cfg = PRIORITY_STYLE[priority] ?? PRIORITY_STYLE.low

  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={[
        // base card
        'w-full text-left rounded-2xl border px-4 py-3.5 transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2',
        // selected vs unselected
        isSelected
          ? 'border-burgundy bg-burgundy-soft shadow-[0_0_0_2px_#6b214855]'
          : 'border-line bg-white hover:border-burgundy/40 hover:shadow-[0_4px_16px_rgba(107,33,72,0.08)]',
      ].join(' ')}
      aria-pressed={isSelected}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* emoji icon */}
          <span
            className={[
              'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-xl',
              isSelected ? 'bg-burgundy text-white' : 'bg-beige',
            ].join(' ')}
            aria-hidden="true"
          >
            {type.emoji}
          </span>

          <div className="min-w-0">
            <p className={`text-sm font-semibold leading-tight ${isSelected ? 'text-burgundy' : 'text-ink'}`}>
              {type.title}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-muted">
              {type.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
          <PriorityBadge level={priority} />
          <ChevronRight
            className={`h-3.5 w-3.5 transition-transform duration-200 ${isSelected ? 'rotate-90 text-burgundy' : 'text-muted'}`}
          />
        </div>
      </div>
    </motion.button>
  )
}

// ─── Detail panel ─────────────────────────────────────────────────────────────
function DetailPanel({ type, priority, data }) {
  const isInternal = type.ctaLink?.startsWith('/')
  const emergencyProgress = data?.savings?.emergencyProgress ?? 50

  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={type.id}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.26 }}
        className="card-panel"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-burgundy text-2xl">
              {type.emoji}
            </span>
            <div>
              <p className="page-kicker">Protection Detail</p>
              <h3 className="font-display mt-0.5 text-lg font-bold leading-tight text-burgundy">
                {type.title}
              </h3>
            </div>
          </div>
          <PriorityBadge level={priority} />
        </div>

        {/* Why it matters */}
        <p className="mt-4 text-[13px] leading-relaxed text-muted">
          {type.why}
        </p>

        {/* Personalised insight row — only when we have data */}
        {data && (
          <div className="mt-3 rounded-xl border border-line bg-beige px-3.5 py-2.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-burgundy">
              Your Situation
            </p>
            <p className="mt-1 text-[13px] text-ink">
              {type.id === 'health' && (
                emergencyProgress < 50
                  ? `Your emergency fund is at ${emergencyProgress}% — a medical event would strain your buffer.`
                  : `Your emergency fund is at ${emergencyProgress}% — keep building it to stay covered.`
              )}
              {type.id === 'accident' && (
                `You work as ${data.user?.occupation ?? 'a gig worker'} — on-road roles carry higher physical risk.`
              )}
              {type.id === 'life' && (
                `Age ${data.user?.age ?? '—'} is a good time to lock in an affordable term plan before premiums rise.`
              )}
              {type.id === 'retirement' && (
                data.user?.age >= 30
                  ? `At age ${data.user.age}, each year of delay reduces your retirement corpus significantly.`
                  : `Starting at age ${data.user?.age ?? '—'} gives you a long compounding runway.`
              )}
              {type.id === 'income' && (
                data.income?.trend === 'DOWN'
                  ? 'Your income trend is declining — a dedicated buffer is critical right now.'
                  : `Your income is ${(data.income?.trend ?? 'STABLE').toLowerCase()}. An income buffer adds an extra layer of safety.`
              )}
            </p>
          </div>
        )}

        {/* Recommendation */}
        <div className="mt-3 rounded-xl border border-burgundy/20 bg-burgundy-soft px-3.5 py-2.5">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-burgundy">
            Recommended Action
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink">
            {type.recommendation}
          </p>
        </div>

        {/* CTA */}
        <div className="mt-4">
          {isInternal ? (
            <Link
              to={type.ctaLink}
              className="inline-flex items-center gap-2 rounded-xl bg-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-burgundy-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
            >
              {type.ctaLabel}
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <a
              href={type.ctaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-burgundy px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-burgundy-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2"
            >
              {type.ctaLabel}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </motion.article>
    </AnimatePresence>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ProtectionHub() {
  const { data, status, refresh } = useApp()
  const [selectedId, setSelectedId] = useState(null)

  const selectedType = PROTECTION_TYPES.find((t) => t.id === selectedId) ?? null

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message="Could not load dashboard data." onRetry={refresh} />
      ) : null}

      {/* Render as soon as AppLayout is ready — no hard dependency on data */}
      {status !== 'loading' ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-4"
        >
          {/* ── Page header ── */}
          <div>
            <p className="page-kicker">Financial Safety</p>
            <h2 className="mt-1 flex items-center gap-2 text-[1.75rem] font-bold leading-none tracking-tight text-burgundy sm:text-[2rem]">
              <ShieldCheck className="h-7 w-7 flex-shrink-0" aria-hidden="true" />
              Protect Yourself
            </h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              Choose a protection area to explore options that may suit you.
            </p>
          </div>

          {/* ── Two-column layout on md+ ── */}
          <div className="grid gap-4 md:grid-cols-2 md:items-start">

            {/* Left: selection cards */}
            <section aria-label="Protection options" className="flex flex-col gap-2">
              {PROTECTION_TYPES.map((type, i) => {
                const priority = computePriority(type.id, data)
                return (
                  <ProtectionCard
                    key={type.id}
                    type={type}
                    priority={priority}
                    isSelected={selectedId === type.id}
                    onClick={() => setSelectedId(selectedId === type.id ? null : type.id)}
                    delay={i * 0.06}
                  />
                )
              })}
            </section>

            {/* Right: detail panel or placeholder */}
            <section aria-label="Protection details" className="md:sticky md:top-6">
              {selectedType ? (
                <DetailPanel
                  type={selectedType}
                  priority={computePriority(selectedType.id, data)}
                  data={data}
                />
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line py-12 text-center"
                >
                  <span className="text-3xl" aria-hidden="true">🛡️</span>
                  <p className="mt-3 text-sm font-medium text-muted">
                    Select a protection area<br />to see personalised details.
                  </p>
                </motion.div>
              )}
            </section>

          </div>

          {/* ── Footer note ── */}
          <p className="text-[11px] text-muted/70">
            Priority levels are personalised based on your income, savings buffer, occupation, and age. They are guidance only, not financial advice.
          </p>

        </motion.div>
      ) : null}
    </AppLayout>
  )
}
