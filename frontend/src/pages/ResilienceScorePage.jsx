import { motion } from 'framer-motion'
import { formatSigned } from '../lib/format'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import ResilienceScore from '../components/ResilienceScore'
import { TrendingUp, ArrowUpRight } from 'lucide-react'

export default function ResilienceScorePage() {
  const { data, status, refresh } = useApp()
  const score = data?.resilience

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message="Could not load score." onRetry={refresh} /> : null}
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Score movement</p>
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
                {formatSigned(score.change)} points this week
              </motion.p>
            </motion.section>

            {score.explanation && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card bg-gradient-to-br from-white to-burgundy-soft/20"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy">AI Explanation</p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{score.explanation}</p>
              </motion.section>
            )}
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
