import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, PiggyBank, Sparkles, Zap } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { generateAiBrief } from '../lib/aiBrief'

export default function SavingsPocket({ savings, data }) {
  const { formatMoney } = useMoney()
  const progress = Math.min(100, Math.max(0, savings?.emergencyProgress || 0))
  const brief = data ? generateAiBrief(data) : null
  const line = brief?.nextAction || brief?.focus || 'Ask the coach what to do with today’s surplus.'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="h-fit w-full flex-none"
    >
      <section className="card savings-pocket-card relative !p-3">
      <div className="relative flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-burgundy/10">
          <PiggyBank className="h-3.5 w-3.5 text-burgundy" />
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          Savings Pocket
        </p>
      </div>

      <div className="relative mt-2.5 grid gap-2.5 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1 text-xs text-muted">
            <Zap className="h-3 w-3 text-burgundy" aria-hidden="true" />
            Safe to save today
          </p>
          <p className="mt-1 text-3xl font-extrabold tracking-tight text-futuristic">
            {formatMoney(savings?.suggested)}
          </p>
        </div>

        <div className="rounded-xl border border-burgundy/10 bg-burgundy-soft/60 px-3 py-2">
          <p className="text-xs text-muted">Savings streak</p>
          <p className="mt-1 flex items-center gap-1.5 text-xl font-bold text-burgundy">
            <Flame className="h-4 w-4 text-burgundy" aria-hidden="true" />
            {savings?.streak || 0} Days
          </p>
        </div>
      </div>

      <dl className="relative mt-2.5 grid grid-cols-2 gap-3 border-t border-line/50 pt-2.5">
        <div>
          <dt className="text-[11px] text-muted">Current balance</dt>
          <dd className="mt-0.5 text-base font-semibold text-ink">{formatMoney(savings?.balance)}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-muted">Total saved this month</dt>
          <dd className="mt-0.5 text-base font-semibold text-ink">
            {formatMoney(savings?.monthlySaved)}
          </dd>
        </div>
      </dl>

      <div className="relative mt-2.5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="text-muted">Emergency buffer progress</span>
          <span className="font-semibold text-burgundy">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-burgundy-soft/70">
          <motion.div
            className="progress-futuristic h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
          />
        </div>
      </div>

      <div className="relative mt-2.5 rounded-xl bg-gradient-to-r from-burgundy to-burgundy-deep px-3 py-2 text-white">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
              <Sparkles className="h-3 w-3" /> AI Daily Brief
            </p>
            <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/90">
              {line || 'Ask the coach what to do with today’s surplus.'}
            </p>
          </div>
          <Link
            to="/lab"
            className="shrink-0 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/25"
          >
            Lab
          </Link>
        </div>
      </div>
      </section>
    </motion.div>
  )
}
