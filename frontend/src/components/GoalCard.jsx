import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function GoalCard() {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card-glow-burgundy flex flex-col justify-between rounded-2xl p-6 sm:flex-row sm:items-center sm:gap-6"
    >
      <div>
        <p className="text-lg font-bold leading-snug text-white">Build resilience today for a better tomorrow.</p>
        <p className="mt-2 text-sm text-white/80">Set a rainy-day target and keep your streak alive.</p>
      </div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="shrink-0">
        <Link
          to="/goals"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-6 py-3 font-semibold text-burgundy shadow-lg transition-all hover:shadow-xl sm:mt-0"
        >
          Set Your Goal →
        </Link>
      </motion.div>
    </motion.div>
  )
}
