import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, PiggyBank, Sparkles, Zap } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'
import { useApp } from '../context/AppContext'
import { generateAiBrief } from '../lib/aiBrief'
import { useSavingsDepositAnimation } from '../hooks/useSavingsDepositAnimation'
import SavingsDepositCoins from './SavingsDepositCoins'

export default function SavingsPocket({ savings, data }) {
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const { depositToPocket } = useApp()
  const brief = data ? generateAiBrief(data) : null
  const line = brief?.nextAction || brief?.focus || t('coachSurplusFallback')

  const {
    amount,
    available,
    maxAvailable,
    inputAmount,
    onInputChange,
    useMaxAvailable,
    amountInvalid,
    canDeposit,
    isDepositing,
    balance,
    progress: liveProgress,
    streak,
    streakPulse,
    coins,
    confirmation,
    error,
    statusMessage,
    reducedMotion,
    buttonRef,
    balanceRef,
    runDeposit,
  } = useSavingsDepositAnimation({
    savings,
    dashboard: data,
    onDeposit: depositToPocket,
    formatMoney,
    t,
  })

  const progress = Math.min(100, Math.max(0, liveProgress))
  const showDepositForm = maxAvailable > 0 || isDepositing || confirmation
  const ctaLabel = isDepositing
    ? t('addingToPocket')
    : t('saveToPocket', { amount: formatMoney(amount || 0) })

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.15 }}
      className="h-fit w-full flex-none"
    >
      <SavingsDepositCoins coins={coins} reducedMotion={reducedMotion} />

      <section className="card savings-pocket-card relative !p-3">
        <div className="relative flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-burgundy/10">
            <PiggyBank className="h-3.5 w-3.5 text-burgundy" />
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
            {t('savingsTitle')}
          </p>
        </div>

        <div className="relative mt-2.5 grid gap-2.5 sm:grid-cols-2">
          <div>
            <p className="flex items-center gap-1 text-xs text-muted">
              <Zap className="h-3 w-3 text-burgundy" aria-hidden="true" />
              {t('safeToSaveToday')}
            </p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-futuristic tabular-nums">
              {formatMoney(available)}
            </p>
          </div>

          <div className="rounded-xl border border-gold/25 bg-gold-soft px-3 py-2">
            <p className="text-xs text-muted">{t('savingsStreak')}</p>
            <motion.p
              className="mt-1 flex items-center gap-1.5 text-xl font-bold text-gold"
              animate={
                streakPulse
                  ? { scale: [1, 1.08, 1], color: ['#e0b45c', '#c9962e', '#e0b45c'] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <Flame className="h-4 w-4 text-gold" aria-hidden="true" />
              {streak} {t('days')}
            </motion.p>
          </div>
        </div>

        <dl className="relative mt-2.5 grid grid-cols-2 gap-3 border-t border-line/50 pt-2.5">
          <div ref={balanceRef}>
            <dt className="text-[11px] text-muted">{t('currentBalance')}</dt>
            <dd className="mt-0.5 text-base font-semibold text-ink tabular-nums">
              {formatMoney(balance)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-muted">{t('totalSavedThisMonth')}</dt>
            <dd className="mt-0.5 text-base font-semibold text-ink">
              {formatMoney(savings?.monthlySaved)}
            </dd>
          </div>
        </dl>

        <div className="relative mt-2.5">
          <div className="mb-1.5 flex items-center justify-between text-[11px]">
            <span className="text-muted">{t('emergencyBufferProgress')}</span>
            <span className="font-semibold text-burgundy tabular-nums">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-burgundy-soft/70">
            <motion.div
              className="progress-futuristic h-full rounded-full"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: isDepositing && !reducedMotion ? 0.85 : 1.2,
                ease: [0.23, 1, 0.32, 1],
              }}
            />
          </div>
        </div>

        {showDepositForm ? (
          <div className="relative mt-3 space-y-2">
            <label className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-muted" htmlFor="pocket-save-amount">
              {t('enterSaveAmount')}
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted" aria-hidden="true">
                  ₹
                </span>
                <input
                  id="pocket-save-amount"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input w-full pl-7 tabular-nums"
                  value={inputAmount}
                  onChange={(e) => onInputChange(e.target.value)}
                  disabled={isDepositing || maxAvailable <= 0}
                  aria-invalid={amountInvalid}
                  aria-describedby="pocket-save-hint"
                  placeholder={maxAvailable > 0 ? String(maxAvailable) : '0'}
                />
              </div>
              <button
                type="button"
                className="btn-secondary shrink-0 px-3 text-xs"
                onClick={useMaxAvailable}
                disabled={isDepositing || maxAvailable <= 0}
              >
                {t('saveMax')}
              </button>
            </div>
            <p id="pocket-save-hint" className="text-[11px] text-muted">
              {amountInvalid
                ? t('saveAmountInvalid', { max: formatMoney(maxAvailable) })
                : t('saveAmountHint', { max: formatMoney(maxAvailable) })}
            </p>
            <button
              ref={buttonRef}
              type="button"
              className="btn-primary flex w-full min-h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-70"
              onClick={runDeposit}
              disabled={!canDeposit}
              aria-label={ctaLabel}
              aria-busy={isDepositing}
            >
              {ctaLabel}
            </button>
          </div>
        ) : null}

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {statusMessage}
        </div>

        {confirmation ? (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="mt-2.5 rounded-lg border border-gold/30 bg-gold-soft px-3 py-2 text-[12px] font-medium leading-snug text-burgundy-deep"
            role="status"
          >
            {confirmation}
          </motion.p>
        ) : null}

        {error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2.5 rounded-lg border border-burgundy/20 bg-burgundy-soft px-3 py-2 text-[12px] font-medium leading-snug text-burgundy"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}

        <div className="relative mt-2.5 rounded-xl bg-burgundy px-3 py-2 text-white">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
                <Sparkles className="h-3 w-3" /> {t('aiDailyBrief')}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/90">
                {line}
              </p>
            </div>
            <Link
              to="/lab"
              className="shrink-0 rounded-lg bg-white/15 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white/25"
            >
              {t('lab')}
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
