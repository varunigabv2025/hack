import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import IncomeCard from '../components/IncomeCard'
import BaselineCard from '../components/BaselineCard'
import SavingsCard from '../components/SavingsCard'
import ScoreCard from '../components/ScoreCard'
import ScoreBreakdown from '../components/ScoreBreakdown'
import NudgeCard from '../components/NudgeCard'

const IncomeChart = lazy(() => import('../components/IncomeChart'))

export default function Dashboard() {
  const { data, status, refresh, language } = useApp()
  const copy = strings[language] || strings.en
  const income = data?.income_profile || {}
  const score = data?.resilience_score || {}

  return (
    <Navbar>
      <Header name={data?.user?.name} />
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={copy.status.error} onRetry={refresh} retryLabel={copy.status.retry} />
      ) : null}
      {status === 'ready' && data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <IncomeCard todayIncome={income.today_income} baseline={income.baseline} language={language} />
          <BaselineCard
            baseline={income.baseline}
            todayIncome={income.today_income}
            trend={income.trend}
            language={language}
          />
          {income.today_income == null && (
            <div className="lg:col-span-2">
              <Link to="/activity" className="btn-primary flex min-h-12 items-center justify-center">
                {copy.activity.add}
              </Link>
            </div>
          )}
          <div className="lg:col-span-2">
            <SavingsCard
              pocket={data.savings_pocket}
              todayIncome={income.today_income}
              baseline={income.baseline}
              language={language}
              featured
            />
          </div>
          <ScoreCard score={score.score} change={score.change} language={language} />
          <ScoreBreakdown factors={score.factors} language={language} />
          <div className="lg:col-span-2">
            <NudgeCard nudge={data.nudge} language={language} />
          </div>
          <div className="min-w-0 lg:col-span-2">
            <Suspense fallback={<div className="h-56 animate-pulse rounded-3xl bg-card" />}>
              <IncomeChart weekly={data.weekly} language={language} />
            </Suspense>
          </div>
        </div>
      ) : null}
    </Navbar>
  )
}
