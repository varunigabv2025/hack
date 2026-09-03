import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlaskConical, Landmark, ArrowRight, ShieldAlert, Receipt } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import IncomeMetric from '../components/IncomeMetric'
import SavingsPocket from '../components/SavingsPocket'
import ResilienceScore from '../components/ResilienceScore'
import TransactionTable from '../components/TransactionTable'
import CurrencyNetwork from '../components/CurrencyNetwork'
import { analyseSchemes } from '../lib/schemeAnalysis'

export default function Dashboard() {
  const { data, status, refresh } = useApp()
  const { formatMoney, formatSignedMoney } = useMoney()
  const income = data?.income || {}
  const hasToday = income.today != null
  const schemeSummary = data ? analyseSchemes(data).summary : null

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message="Could not load your dashboard." onRetry={refresh} />
      ) : null}
      {status === 'ready' && data ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <section className="grid gap-3 md:grid-cols-3">
            <IncomeMetric
              label="Today's Income"
              value={hasToday ? formatMoney(income.today) : '—'}
              hint={hasToday ? `${formatSignedMoney(income.surplus)} above your usual` : 'No pay logged today'}
              tone="burgundy"
              sparkline={income.sparkline}
              delay={0}
              showHintArrow
            />
            <IncomeMetric
              label="Usual Income (Baseline)"
              value={formatMoney(income.baseline)}
              hint="Last 30-day average"
              tone="gold"
              sparkline={income.sparkline}
              delay={0.1}
            />
            <IncomeMetric
              label="Surplus Today"
              value={hasToday ? formatMoney(income.surplus) : '—'}
              hint="Opportunity to build resilience"
              tone="emerald"
              sparkline={income.sparkline}
              delay={0.2}
            />
          </section>

          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              {
                label: 'Volatility',
                value: income.volatilityLabel || '—',
              },
              {
                label: 'Consistency',
                value: income.consistency != null ? `${Math.round(income.consistency * 100)}%` : '—',
              },
              {
                label: '7-day outlook',
                value: income.prediction?.next7Days != null ? formatMoney(income.prediction.next7Days) : '—',
              },
              {
                label: 'Loan risk',
                value: data.loanRisk?.level || 'low',
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[1.25rem] border border-line/80 bg-white/75 px-4 py-3">
                <p className="text-lg font-bold capitalize tracking-tight text-burgundy">{item.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{item.label}</p>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3 xl:flex-row xl:items-start">
            <div className="flex h-fit w-full min-w-0 flex-none flex-col gap-3 xl:w-1/2">
              <SavingsPocket savings={data.savings} data={data} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Link to="/loans" className="card !p-3.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-burgundy-soft text-burgundy">
                      <ShieldAlert className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">Loan stacking</p>
                      <p className="truncate text-xs capitalize text-muted">{data.loanRisk?.level || 'low'} risk · {data.loanRisk?.activeLoans || 0} active</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-burgundy" />
                </Link>
                <Link to="/expenses" className="card !p-3.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold">
                      <Receipt className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">Expenses</p>
                      <p className="truncate text-xs text-muted">{data.expenseSummary?.expense_count || 0} logged</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-burgundy" />
                </Link>
                {schemeSummary && (
                  <div className="card !p-3.5 flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-burgundy-soft text-burgundy">
                        <Landmark className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-ink">Scheme Studio</p>
                        <p className="truncate text-xs text-muted">
                          {schemeSummary.high} high-fit · {schemeSummary.medium} medium-fit
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/schemes"
                      className="btn-primary inline-flex h-9 items-center gap-1.5 whitespace-nowrap px-3 text-xs"
                    >
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
                <div className="card !p-3.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gold-soft text-gold">
                      <FlaskConical className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink">What-If Lab</p>
                      <p className="truncate text-xs text-muted">Surplus split scenarios</p>
                    </div>
                  </div>
                  <Link
                    to="/lab"
                    className="btn-gold inline-flex h-9 items-center gap-1.5 whitespace-nowrap px-3 text-xs"
                  >
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <TransactionTable transactions={data.transactions} limit={4} />
            </div>
            <div className="flex h-fit w-full min-w-0 flex-none flex-col gap-3 xl:w-1/2">
              <ResilienceScore resilience={data.resilience} />
              <CurrencyNetwork />
            </div>
          </section>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
