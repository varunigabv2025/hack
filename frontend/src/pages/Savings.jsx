import { lazy, Suspense } from 'react'
import { formatDay, formatInr } from '../lib/format'
import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import SavingsCard from '../components/SavingsCard'

const IncomeChart = lazy(() => import('../components/IncomeChart'))

export default function Savings() {
  const { data, status, refresh, language } = useApp()
  const copy = strings[language] || strings.en
  const income = data?.income_profile || {}
  const buffer = data?.emergency_buffer || {}
  const pct = buffer.target ? Math.min(100, Math.round((buffer.current / buffer.target) * 100)) : 0
  const activity = data?.savings_activity || []

  return (
    <Navbar>
      <Header name={data?.user?.name} />
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={copy.status.error} onRetry={refresh} retryLabel={copy.status.retry} />
      ) : null}
      {status === 'ready' && data ? (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted">{copy.savings.story}</p>
          <SavingsCard
            pocket={data.savings_pocket}
            todayIncome={income.today_income}
            baseline={income.baseline}
            language={language}
            featured
          />
          <section className="grid gap-3 sm:grid-cols-2">
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-muted">{copy.savings.month}</p>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                {formatInr(data.month_total_saved)}
              </p>
            </article>
            <article className="card">
              <p className="text-xs uppercase tracking-wide text-muted">{copy.savings.buffer}</p>
              <p className="mt-2 font-mono text-3xl font-semibold tabular-nums">
                {formatInr(buffer.current)}
              </p>
              <p className="mt-1 text-xs text-muted">
                {copy.savings.of} {formatInr(buffer.target)}
              </p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-card-2">
                <div className="h-full rounded-full bg-cta transition-[width] duration-300" style={{ width: `${pct}%` }} />
              </div>
            </article>
          </section>
          <Suspense fallback={<div className="h-56 animate-pulse rounded-3xl bg-card" />}>
            <IncomeChart weekly={data.weekly} language={language} showSavings />
          </Suspense>
          <section className="card">
            <h2 className="text-sm font-semibold">{copy.savings.activity}</h2>
            {activity.length === 0 ? (
              <p className="mt-3 text-sm text-muted">{copy.savings.emptyActivity}</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {activity.map((row) => (
                  <li key={`${row.date}-${row.amount}`} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm text-ink">{row.note}</p>
                      <p className="text-xs text-muted">{formatDay(row.date)}</p>
                    </div>
                    <p className="font-mono font-semibold tabular-nums text-cta">{formatInr(row.amount)}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      ) : null}
    </Navbar>
  )
}
