import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlaskConical, Wand2 } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'
import { runWhatIf } from '../lib/whatIfLab'
import { INCOME_PRESETS, runIncomeScenario } from '../lib/incomeSimulator'

const PRESETS = [50, 100, 120, 200, 300]

export default function AiLab() {
  const { data, status, refresh } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const suggested = data?.savings?.suggested ?? 0
  const [amount, setAmount] = useState(suggested || 120)
  const [shock, setShock] = useState(-20)

  useEffect(() => {
    if (suggested > 0) setAmount(suggested)
  }, [suggested])

  const result = useMemo(() => (data ? runWhatIf(data, amount) : null), [data, amount])
  const incomeScene = useMemo(() => (data ? runIncomeScenario(data, shock) : null), [data, shock])

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={t('errorLoadWhatIf')} onRetry={refresh} />
      ) : null}

      {status === 'ready' && data && result ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <div>
            <p className="page-kicker">{t('kickerAiCoaching')}</p>
            <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold leading-none tracking-tight text-burgundy sm:text-[2.15rem]">
              <FlaskConical className="h-8 w-8 shrink-0 text-burgundy" />
              {t('whatIfLabTitle')}
            </h2>
            <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
              {t('whatIfLabIntro')}
            </p>
            <p className="mt-1.5 text-[12px] font-medium text-ink/70">
              {t('scenarioOnlyNote')}
            </p>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-line/60 overflow-hidden rounded-[1.25rem] border border-line/80 bg-white/75 md:grid-cols-4 md:divide-y-0">
            {[
              { value: formatMoney(suggested), label: t('safeToSave') },
              { value: formatMoney(amount), label: t('thisScenario') },
              { value: `${data.savings?.emergencyProgress ?? 0}%`, label: t('buffer') },
              { value: `${data.resilience?.score ?? 0} / 100`, label: t('personalResilience') },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-lg font-bold tabular-nums tracking-tight text-burgundy">{item.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <article className="card-panel space-y-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('saveAmount')}</p>
              <p className="text-2xl font-bold tabular-nums text-burgundy">{formatMoney(amount)}</p>
            </div>

            <input
              type="range"
              min={0}
              max={500}
              step={10}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full accent-burgundy"
              aria-label={t('saveAmount')}
            />

            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(p)}
                  className={[
                    'cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    amount === p ? 'bg-burgundy text-white' : 'bg-beige text-burgundy',
                  ].join(' ')}
                >
                  ₹{p}
                </button>
              ))}
              {suggested > 0 && (
                <button
                  type="button"
                  onClick={() => setAmount(suggested)}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-[11px] font-semibold text-burgundy"
                >
                  <Wand2 className="h-3 w-3" /> {t('suggested')}
                </button>
              )}
            </div>

            <p className="rounded-xl bg-ivory px-3.5 py-3 text-[13px] leading-relaxed text-ink">
              {result.narrative}
            </p>
          </article>

          <article className="card-panel !px-6 !py-6 space-y-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('suggestedSplit')}</p>
              <p className="mt-0.5 text-[12px] text-muted">Ranked by your current buffer and streak facts</p>
            </div>
            {result.allocations.map((row) => (
              <div key={row.label} className="border-t border-line/60 pt-4 first:border-t-0 first:pt-0">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[16px] font-semibold text-ink">{row.label}</span>
                  <span className="shrink-0 text-[16px] font-bold tabular-nums text-burgundy">
                    {formatMoney(row.amount)} · {row.pct}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-beige">
                  <motion.div
                    className="h-full rounded-full bg-burgundy"
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
                <p className="mt-2 text-[13px] text-muted">{row.why}</p>
              </div>
            ))}
          </article>

          {incomeScene ? (
            <article className="card-panel !px-6 !py-6">
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('incomeShockSimulator')}</p>
                <p className="mt-0.5 text-[12px] text-muted">{incomeScene.description} · does not change your saved data</p>
              </div>
              <div className="mb-4 flex flex-wrap gap-1.5">
                {INCOME_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setShock(p)}
                    className={[
                      'cursor-pointer rounded-full px-3 py-1.5 text-[13px] font-semibold',
                      shock === p ? 'bg-burgundy text-white' : 'bg-beige text-burgundy',
                    ].join(' ')}
                  >
                    {p > 0 ? `+${p}%` : `${p}%`}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { title: t('current'), row: incomeScene.current },
                  { title: t('simulated'), row: incomeScene.simulated },
                ].map((col) => (
                  <div key={col.title} className="rounded-xl border border-line/70 bg-white px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wide text-muted">{col.title}</p>
                    <dl className="mt-2 space-y-1.5 text-sm">
                      <div className="flex justify-between"><dt className="text-muted">{t('income')}</dt><dd className="font-semibold">{formatMoney(col.row.income)}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted">{t('baseline')}</dt><dd className="font-semibold">{formatMoney(col.row.baseline)}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted">{t('surplus')}</dt><dd className="font-semibold">{formatMoney(col.row.surplus)}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted">{t('safeToSave')}</dt><dd className="font-semibold">{formatMoney(col.row.safeToSave)}</dd></div>
                      <div className="flex justify-between"><dt className="text-muted">{t('score')}</dt><dd className="font-semibold">{col.row.score}</dd></div>
                    </dl>
                  </div>
                ))}
              </div>
              <ul className="mt-4 space-y-1.5 text-[13px] text-ink/80">
                {incomeScene.insights.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </article>
          ) : null}

          {result.schemes.length ? (
            <article className="card-panel !px-6 !py-6">
              <div className="mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('schemeFocus')}</p>
                <p className="mt-0.5 text-[12px] text-muted">Highest-fit schemes for this surplus scenario</p>
              </div>
              <ul className="flex flex-col">
                {result.schemes.map((s) => (
                  <li key={s.id} className="border-t border-line/60 first:border-t-0">
                    <div className="flex items-center gap-4 py-4">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[16px] font-semibold text-ink">{s.name}</p>
                        <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-beige">
                          <motion.div
                            className="h-full rounded-full bg-burgundy"
                            initial={{ width: 0 }}
                            animate={{ width: `${s.match}%` }}
                            transition={{ duration: 0.6 }}
                          />
                        </div>
                      </div>
                      <p className="w-14 shrink-0 text-right text-[16px] font-bold tabular-nums text-burgundy">
                        {s.match}%
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                to="/schemes"
                className="mt-2 inline-flex cursor-pointer text-[16px] font-semibold text-burgundy hover:opacity-80"
              >
                {t('openSchemeStudio')}
              </Link>
            </article>
          ) : null}
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
