import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CloudRain, AlertTriangle, Wrench, HeartPulse, Fuel, Ban,
  TrendingDown, Users, ArrowRight, Shield, Hourglass,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import DataQualityPanel from '../components/DataQualityPanel'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'
import { shockKey } from '../lib/i18n'
import { BAD_WEEK_SCENARIOS, runBadWeek } from '../lib/badWeekSimulator'
import { getPersonalization } from '../lib/personalization'

const ICONS = {
  'no-work-3': Hourglass,
  'rain-flood': CloudRain,
  'vehicle-repair': Wrench,
  medical: HeartPulse,
  'fuel-price': Fuel,
  'account-suspend': Ban,
  'income-drop-30': TrendingDown,
  'family-expense': Users,
}

function shockLabel(t, id, fallback) {
  const key = shockKey(id)
  const translated = t(key)
  return translated !== key ? translated : fallback
}

function shockBlurb(t, id, fallback) {
  const key = shockKey(id, 'blurb')
  const translated = t(key)
  return translated !== key ? translated : fallback
}

export default function BadWeek() {
  const { data, status, refresh } = useApp()
  const { formatMoney } = useMoney()
  const { lang, t } = useLang()
  const preferred = getPersonalization(data || {}, lang).primary?.badWeekId || 'no-work-3'
  const [scenarioId, setScenarioId] = useState(preferred)

  useEffect(() => {
    if (preferred) setScenarioId(preferred)
  }, [preferred])

  const result = useMemo(
    () => (data ? runBadWeek(data, scenarioId) : null),
    [data, scenarioId],
  )

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={t('errorLoadBadWeek')} onRetry={refresh} />
      ) : null}

      {status === 'ready' && data && result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <header>
            <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold leading-none tracking-tight text-burgundy sm:text-[2.15rem]">
              <AlertTriangle className="h-8 w-8 shrink-0 text-burgundy" aria-hidden="true" />
              {t('badWeekTitle')}
            </h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-muted">
              {t('badWeekIntro')}
            </p>
          </header>

          <div className="grid grid-cols-2 divide-x divide-y divide-line/60 overflow-hidden rounded-[1.25rem] border border-line/80 bg-white/75 md:grid-cols-4 md:divide-y-0">
            {[
              { value: formatMoney(result.inputs.baseline), label: t('baselinePerDay') },
              { value: formatMoney(result.inputs.essentials), label: t('essentialsPerDay') },
              { value: formatMoney(result.inputs.buffer), label: t('resilienceBuffer') },
              { value: formatMoney(result.inputs.suggested), label: t('safeToSave') },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-lg font-bold tabular-nums tracking-tight text-burgundy">{item.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <section>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">
              {t('pickAShock')}
            </p>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {BAD_WEEK_SCENARIOS.map((s) => {
                const Icon = ICONS[s.id] || AlertTriangle
                const active = scenarioId === s.id
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setScenarioId(s.id)}
                    className={[
                      'cursor-pointer rounded-[1.15rem] border px-3.5 py-3 text-left transition',
                      active
                        ? 'border-burgundy bg-burgundy text-white shadow-md shadow-burgundy/20'
                        : 'border-line/80 bg-white/80 text-ink hover:border-burgundy/40 hover:bg-burgundy-soft/40',
                    ].join(' ')}
                  >
                    <Icon className={['mb-2 h-4 w-4', active ? 'text-white' : 'text-muted'].join(' ')} />
                    <p className="text-sm font-semibold leading-snug">{shockLabel(t, s.id, s.label)}</p>
                    <p className={['mt-1 text-[11px] leading-relaxed', active ? 'text-white/75' : 'text-muted'].join(' ')}>
                      {shockBlurb(t, s.id, s.blurb)}
                    </p>
                  </button>
                )
              })}
            </div>
          </section>

          <AnimatePresence mode="wait">
            <motion.section
              key={scenarioId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid gap-3 lg:grid-cols-2"
            >
              <article className="rounded-[1.35rem] border border-rose/25 bg-white p-5 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose">{t('withoutSavingsPocket')}</p>
                <p className="mt-3 whitespace-pre-line text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
                  {result.withoutPocket.headline.replace(/^Without a savings pocket:\n/, '')}
                </p>
                <p className="mt-3 text-sm text-muted">
                  Float cash after shock: {formatMoney(result.withoutPocket.cash)} · Daily gap:{' '}
                  {formatMoney(result.inputs.dailyGap)}
                </p>
              </article>

              <article className="rounded-[1.35rem] border border-gold/30 bg-gold-soft p-5 sm:p-6">
                <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">
                  <Shield className="h-3.5 w-3.5" /> {t('withResilienceBuffer')}
                </p>
                <p className="mt-3 whitespace-pre-line text-xl font-bold leading-snug tracking-tight text-burgundy sm:text-2xl">
                  {result.withBuffer.headline.replace(/^With a ₹[\d,]+ resilience buffer:\n/, '')}
                </p>
                <p className="mt-3 text-sm text-muted">
                  {t('bufferAfterShock', {
                    amount: formatMoney(result.withBuffer.cash),
                    days: result.deltaDays,
                  })}
                  {result.deltaDays === 1 ? '' : 's'} vs no pocket
                </p>
              </article>
            </motion.section>
          </AnimatePresence>

          <article className="overflow-hidden rounded-[1.35rem] border border-burgundy/20 bg-burgundy p-5 text-white sm:p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-burgundy">{t('recommendedActionToday')}</p>
            <p className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{result.recommended.actionLine}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/savings"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-white"
              >
                {t('takeThisAction')} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/lab"
                className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25"
              >
                {t('openWhatIfLab')}
              </Link>
            </div>
            {result.inputs.oneTimeCost > 0 && (
              <p className="mt-4 text-xs text-white/70">
                One-time hit modeled: {formatMoney(result.inputs.oneTimeCost)} · Shocked daily income:{' '}
                {formatMoney(result.inputs.shockedIncome)}
              </p>
            )}
            <p className="mt-2 text-[11px] text-white/55">{result.disclaimer}</p>
          </article>

          <DataQualityPanel dashboard={data} />
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
