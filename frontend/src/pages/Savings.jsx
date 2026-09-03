import { useState } from 'react'
import { motion } from 'framer-motion'
import { PiggyBank, ArrowRight, Sparkles } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import SavingsPocket from '../components/SavingsPocket'

export default function Savings() {
  const { data, status, refresh } = useApp()
  const { formatMoney } = useMoney()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message="Could not load savings." onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy"
          >
            <PiggyBank className="h-6 w-6 text-burgundy" /> Savings Pocket
          </motion.h2>
          <p className="text-sm text-muted">
            When you earn more than usual, the engine identifies what you can safely put aside.
          </p>

          <SavingsPocket savings={data.savings} data={data} />

          {(data.savings.activity || []).length > 0 && (
            <section className="card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Savings activity</p>
              <ul className="mt-3 divide-y divide-line/60">
                {data.savings.activity.map((row) => (
                  <li key={`${row.date}-${row.amount}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <div>
                      <p className="text-sm font-medium text-ink">{row.note || 'Sweep'}</p>
                      <p className="text-xs text-muted">{row.date}</p>
                    </div>
                    <p className="text-sm font-semibold text-burgundy">{formatMoney(row.amount)}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="card text-center"
            >
              <p className="text-xs uppercase tracking-wide text-muted">Current balance</p>
              <p className="mt-2 text-3xl font-bold text-gradient-burgundy">{formatMoney(data.savings.balance)}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ y: -4 }}
              className="card text-center"
            >
              <p className="text-xs uppercase tracking-wide text-muted">Saved this month</p>
              <p className="mt-2 text-3xl font-bold text-gradient-burgundy">{formatMoney(data.savings.monthlySaved)}</p>
            </motion.div>
          </div>

          {data.savings.suggested > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card-glow-burgundy rounded-2xl p-6 text-center text-white"
            >
              <Sparkles className="mx-auto mb-3 h-6 w-6" />
              <p className="text-lg font-bold">You can safely save {formatMoney(data.savings.suggested)} today</p>
              <p className="mt-1 text-sm text-white/80">Based on your surplus above baseline</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-burgundy shadow-lg transition-all"
              >
                {saved ? '✓ Saved!' : <><ArrowRight className="h-4 w-4" /> Save Now</>}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
