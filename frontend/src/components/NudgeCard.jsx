import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function RobotMascot() {
  return (
    <motion.svg
      width="96" height="96" viewBox="0 0 96 96" fill="none" className="shrink-0"
      aria-hidden="true"
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <rect x="24" y="36" width="48" height="40" rx="14" fill="#F3E8EF" stroke="#6B2D5B" strokeWidth="1.5" />
      <rect x="28" y="16" width="40" height="28" rx="12" fill="#fff" stroke="#6B2D5B" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="3.5" fill="#6B2D5B" />
      <circle cx="56" cy="30" r="3.5" fill="#6B2D5B" />
      <circle cx="41" cy="29" r="1.2" fill="#fff" />
      <circle cx="57" cy="29" r="1.2" fill="#fff" />
      <line x1="48" y1="16" x2="48" y2="8" stroke="#C9842F" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="6" r="3" fill="#C9842F" />
      <rect x="12" y="44" width="12" height="6" rx="3" fill="#F3E8EF" stroke="#6B2D5B" strokeWidth="1.2" />
      <rect x="72" y="44" width="12" height="6" rx="3" fill="#F3E8EF" stroke="#6B2D5B" strokeWidth="1.2" />
      <rect x="32" y="76" width="12" height="8" rx="4" fill="#F3E8EF" stroke="#6B2D5B" strokeWidth="1.2" />
      <rect x="52" y="76" width="12" height="8" rx="4" fill="#F3E8EF" stroke="#6B2D5B" strokeWidth="1.2" />
      <text x="48" y="60" textAnchor="middle" fontSize="14">❤️</text>
    </motion.svg>
  )
}

export default function NudgeCard({ nudge }) {
  if (!nudge?.triggered && !nudge?.message) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="card relative h-full overflow-hidden bg-gradient-to-br from-white via-burgundy-soft/20 to-gold-soft/20"
    >
      <motion.div
        className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
        AI Nudge
      </motion.div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold tracking-tight text-ink">{nudge.title || 'AI Nudge'}</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{nudge.message}</p>
        </div>
        <RobotMascot />
      </div>
      <div className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-gradient-to-tr from-burgundy/10 to-gold/10 blur-xl" aria-hidden="true" />
    </motion.section>
  )
}
