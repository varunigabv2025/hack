import { motion } from 'framer-motion'
import { PiggyBank } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import SavingsPocket from '../components/SavingsPocket'

export default function Savings() {
  const { data, status, refresh } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message={t('errorLoadSavings')} onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy"
          >
            <PiggyBank className="h-6 w-6 text-burgundy" /> {t('savingsTitle')}
          </motion.h2>
          <p className="text-sm text-muted">
            {t('savingsIntro')}
          </p>

          <SavingsPocket savings={data.savings} data={data} />

          {(data.savings.activity || []).length > 0 && (
            <section className="card">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{t('savingsActivity')}</p>
              <ul className="mt-3 divide-y divide-line/60">
                {data.savings.activity.map((row) => (
                  <li key={`${row.date}-${row.amount}-${row.note}`} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
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
              className="card text-center"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{t('currentBalance')}</p>
              <p className="mt-2 text-3xl font-bold text-gradient-burgundy">{formatMoney(data.savings.balance)}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card text-center"
            >
              <p className="text-xs uppercase tracking-wide text-muted">{t('savedThisMonth')}</p>
              <p className="mt-2 text-3xl font-bold text-gradient-burgundy">{formatMoney(data.savings.monthlySaved)}</p>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
