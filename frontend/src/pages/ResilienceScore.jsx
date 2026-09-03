import { formatSigned } from '../lib/format'
import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import ScoreCard from '../components/ScoreCard'
import ScoreBreakdown from '../components/ScoreBreakdown'

export default function ResilienceScore() {
  const { data, status, refresh, language } = useApp()
  const copy = strings[language] || strings.en
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
          <ScoreCard score={score.score} change={score.change} language={language} large />
          <section className="card flex flex-col justify-center">
            <h2 className="text-xs font-medium uppercase tracking-wide text-muted">{copy.score.movement}</h2>
            <p className="mt-4 font-mono text-4xl font-semibold tabular-nums">
              {score.previous_score} → {score.score}
            </p>
            <p className={`mt-3 text-sm font-semibold ${score.change >= 0 ? 'text-cta' : 'text-income'}`}>
              {formatSigned(score.change)} {copy.score.week}
            </p>
            {score.explanation && (
              <p className="mt-6 text-sm leading-relaxed text-muted">{score.explanation}</p>
            )}
          </section>
          <div className="lg:col-span-2">
            <ScoreBreakdown factors={score.factors} language={language} />
          </div>
        </div>
      ) : null}
    </Navbar>
  )
}
