import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BadgeCheck, FlaskConical, Landmark, ArrowRight, ShieldAlert, Receipt } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import IncomeMetric from '../components/IncomeMetric'
import SavingsPocket from '../components/SavingsPocket'
import ResilienceScore from '../components/ResilienceScore'
import TransactionTable from '../components/TransactionTable'
import NextActionCard from '../components/NextActionCard'
import EventSignalCard from '../components/EventSignalCard'
import SpokenNudgeLine from '../components/SpokenNudgeLine'
import { analyseSchemes } from '../lib/schemeAnalysis'
import { getEventSignals } from '../lib/eventSignals'

export default function Dashboard() {
  const { data, status, refresh } = useApp()
  const { formatMoney, formatSignedMoney } = useMoney()
  const { lang, t } = useLang()
  const income = data?.income || {}
  const hasToday = income.today != null
  const schemeSummary = data ? analyseSchemes(data).summary : null
  const loanLevel = data?.loanRisk?.level || 'low'
  const showEvent = data
    ? getEventSignals(data).some((s) => s.severity === 'high')
    : false

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={t('errorLoadDashboard')} onRetry={refresh} />
      ) : null}
      {status === 'ready' && data ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <SpokenNudgeLine dashboard={data} lang={lang} />
          <NextActionCard dashboard={data} compact />
          {showEvent ? <EventSignalCard dashboard={data} /> : null}

          <section className="grid gap-3 md:grid-cols-3">
            <IncomeMetric
              label={t('todayIncome')}
              value={hasToday ? formatMoney(income.today) : '—'}
              hint={
                hasToday
                  ? t('hintAboveUsual', { amount: formatSignedMoney(income.surplus) })
                  : t('noPayLoggedToday')
              }
              tone="burgundy"
              sparkline={income.sparkline}
              delay={0}
              showHintArrow
            />
            <IncomeMetric
              label={t('baseline')}
              value={formatMoney(income.baseline)}
              hint={t('last30DayAverage')}
              tone="gold"
              sparkline={income.sparkline}
              delay={0.1}
            />
            <IncomeMetric
              label={t('surplus')}
              value={hasToday ? formatMoney(income.surplus) : '—'}
              hint={t('opportunityBuildResilience')}
              tone="emerald"
              sparkline={income.sparkline}
              delay={0.2}
            />
          </section>

          <section className="grid grid-cols-2 gap-2 md:grid-cols-4">
            {[
              { label: t('volatility'), value: income.volatilityLabel || '—' },
              {
                label: t('consistency'),
                value: income.consistency != null ? `${Math.round(income.consistency * 100)}%` : '—',
              },
              {
                label: t('sevenDayOutlook'),
                value: income.prediction?.next7Days != null ? formatMoney(income.prediction.next7Days) : '—',
              },
              { label: t('loanRisk'), value: t(loanLevel) || loanLevel },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-line/70 bg-white/70 px-3 py-2.5">
                <p className="text-base font-bold capitalize tracking-tight text-burgundy">{item.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted">{item.label}</p>
              </div>
            ))}
          </section>

          <section className="flex flex-col gap-3 xl:flex-row xl:items-start">
            <div className="flex h-fit w-full min-w-0 flex-none flex-col gap-3 xl:w-1/2">
              <SavingsPocket savings={data.savings} data={data} />
              <div className="grid grid-cols-2 gap-2">
                <Link to="/loans" className="rounded-2xl border border-line/70 bg-white/75 px-3 py-2.5 transition hover:border-burgundy/30">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <ShieldAlert className="h-3.5 w-3.5 text-burgundy" /> {t('loans')}
                  </p>
                  <p className="mt-0.5 text-[11px] capitalize text-muted">
                    {t('activeLoansCount', {
                      level: t(loanLevel) || loanLevel,
                      count: data.loanRisk?.activeLoans || 0,
                    })}
                  </p>
                </Link>
                <Link to="/expenses" className="rounded-2xl border border-line/70 bg-white/75 px-3 py-2.5 transition hover:border-burgundy/30">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <Receipt className="h-3.5 w-3.5 text-burgundy" /> {t('expenses')}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {t('expensesLogged', { count: data.expenseSummary?.expense_count || 0 })}
                  </p>
                </Link>
                <Link to="/schemes" className="rounded-2xl border border-line/70 bg-white/75 px-3 py-2.5 transition hover:border-burgundy/30">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <Landmark className="h-3.5 w-3.5 text-burgundy" /> {t('schemes')}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">
                    {schemeSummary
                      ? t('schemesHighFit', { count: schemeSummary.high })
                      : t('openMatcher')}
                  </p>
                </Link>
                <Link to="/lab" className="rounded-2xl border border-line/70 bg-white/75 px-3 py-2.5 transition hover:border-burgundy/30">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                    <FlaskConical className="h-3.5 w-3.5 text-burgundy" /> {t('whatIf')}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted">{t('surplusScenarios')}</p>
                </Link>
              </div>
              <TransactionTable transactions={data.transactions} limit={4} />
            </div>
            <div className="flex h-fit w-full min-w-0 flex-none flex-col gap-3 xl:w-1/2">
              <ResilienceScore resilience={data.resilience} />
              <Link
                to="/passport"
                className="flex items-center justify-between gap-3 rounded-2xl border border-line/70 bg-white/75 px-3.5 py-3 transition hover:border-gold/40"
              >
                <span className="flex items-center gap-2.5">
                  <BadgeCheck className="h-4 w-4 text-burgundy" />
                  <span>
                    <span className="block text-sm font-semibold text-burgundy">{t('passportTitle')}</span>
                    <span className="block text-[11px] text-muted">{t('passportSubtitle')}</span>
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-burgundy" />
              </Link>
            </div>
          </section>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
