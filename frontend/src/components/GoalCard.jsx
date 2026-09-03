import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLang } from '../hooks/useLang'

export default function GoalCard() {
  const { t } = useLang()

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-glow-burgundy flex flex-col justify-between rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-6"
    >
      <div>
        <p className="text-lg font-bold leading-snug text-white">{t('goalCardHeadline')}</p>
        <p className="mt-2 text-sm text-white/80">{t('goalCardSubline')}</p>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
        <Link
          to="/goals"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-burgundy shadow-lg transition-all hover:shadow-xl sm:mt-0"
        >
          {t('setYourGoal')}
        </Link>
      </motion.div>
    </motion.div>
  )
}
