import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useLang } from '../hooks/useLang'

function RobotMascot() {
  return (
    <motion.svg
      width="96" height="96" viewBox="0 0 96 96" fill="none" className="shrink-0"
      aria-hidden="true"
      animate={{ y: [0, -6, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <rect x="24" y="36" width="48" height="40" rx="14" fill="#F3E8EF" stroke="#6b2148" strokeWidth="1.5" />
      <rect x="28" y="16" width="40" height="28" rx="12" fill="#fff" stroke="#6b2148" strokeWidth="1.5" />
      <circle cx="40" cy="30" r="3.5" fill="#6b2148" />
      <circle cx="56" cy="30" r="3.5" fill="#6b2148" />
      <circle cx="41" cy="29" r="1.2" fill="#fff" />
      <circle cx="57" cy="29" r="1.2" fill="#fff" />
      <line x1="48" y1="16" x2="48" y2="8" stroke="#a86b2d" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="6" r="3" fill="#a86b2d" />
      <rect x="12" y="44" width="12" height="6" rx="3" fill="#F3E8EF" stroke="#6b2148" strokeWidth="1.2" />
      <rect x="72" y="44" width="12" height="6" rx="3" fill="#F3E8EF" stroke="#6b2148" strokeWidth="1.2" />
      <rect x="32" y="76" width="12" height="8" rx="4" fill="#F3E8EF" stroke="#6b2148" strokeWidth="1.2" />
      <rect x="52" y="76" width="12" height="8" rx="4" fill="#F3E8EF" stroke="#6b2148" strokeWidth="1.2" />
      <text x="48" y="60" textAnchor="middle" fontSize="14">❤️</text>
    </motion.svg>
  )
}

export default function NudgeCard({ nudge }) {
  const { t } = useLang()
  if (!nudge?.triggered && !nudge?.message) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card relative overflow-hidden bg-white"
    >
      <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-burgundy">
        <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        {t('aiNudge')}
      </div>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-bold tracking-tight text-ink">{nudge.title || t('aiNudge')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{nudge.message}</p>
        </div>
        <RobotMascot />
      </div>
    </motion.section>
  )
}
