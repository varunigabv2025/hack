import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import ResilienceScore from '../components/ResilienceScore'
import { TrendingUp, ArrowUpRight, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ResilienceScorePage() {
  const { data, status, refresh } = useApp()
  const { t } = useLang()
  const score = data?.resilience
  const delta = score?.change ?? (score?.score - (score?.previousScore ?? score?.score))
  const deltaLabel =
    delta > 0
      ? t('pointsThisWeek', { delta })
      : delta < 0
        ? t('pointsDownThisWeek', { delta })
        : t('noChangeThisWeek')

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message={t('errorLoadScore')} onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]"
        >
          <ResilienceScore resilience={score} />
          <div className="space-y-4">
            <motion.section
              initial={{ opacity: 0, y: 30, rotateX: -8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="card shimmer-border"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t('scoreMovement')}</p>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-4xl font-bold text-muted">{score.previousScore}</span>
                <ArrowUpRight className="h-6 w-6 text-emerald" />
                <span className="text-4xl font-bold text-gradient-burgundy">{score.score}</span>
              </div>
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-3 py-1 text-sm font-semibold text-emerald"
              >
                <TrendingUp className="h-4 w-4" />
                {deltaLabel}
              </motion.p>
            </motion.section>

            {score.explanation && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-white"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy">{t('aiExplanation')}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{score.explanation}</p>
              </motion.section>
            )}

            <Link
              to="/passport"
              className="card flex items-center justify-between gap-3 !p-4 transition hover:border-burgundy/30"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-soft text-gold">
                  <BadgeCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-burgundy">{t('passportTitle')}</p>
                  <p className="text-xs text-muted">{t('passportShareSubtitle')}</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-burgundy" />
            </Link>
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
