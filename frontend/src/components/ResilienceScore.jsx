import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Info, Minus } from 'lucide-react'
import ScoreFactors from './ScoreFactors'
import ResilienceOrb from './ResilienceOrb'
import { useLang } from '../hooks/useLang'

function DeltaPill({ score, previousScore, change }) {
  const { t } = useLang()
  const prev = previousScore == null ? score : Number(previousScore)
  const delta = change != null ? Number(change) : score - prev

  if (delta > 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-burgundy/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#6b2148] backdrop-blur-sm">
        <ArrowUpRight className="h-3.5 w-3.5 text-[#e0b45c]" aria-hidden="true" />
        {t('pointsThisWeek', { delta })}
      </span>
    )
  }
  if (delta < 0) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FDECEC] px-3.5 py-1.5 text-xs font-semibold text-[#B42318]">
        <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />
        {t('pointsDownThisWeek', { delta })}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line/70 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#8A8791] backdrop-blur-sm">
      <Minus className="h-3.5 w-3.5" aria-hidden="true" />
      {t('noChangeThisWeek')}
    </span>
  )
}

export default function ResilienceScore({ resilience }) {
  const { t } = useLang()
  const score = Number(resilience?.score) || 0
  const previousScore = resilience?.previousScore ?? resilience?.previous_score ?? score
  const change = resilience?.change ?? resilience?.score_change

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.25 }}
      className="relative overflow-hidden rounded-[1.35rem] border border-line bg-card p-4 shadow-card"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,rgba(255,255,255,0.95),transparent_55%)]" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
            {t('resilienceScore')}
          </p>
          <Info className="h-3.5 w-3.5 text-muted/70" aria-hidden="true" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-muted shadow-sm">
          <span className="h-2 w-2 rounded-full bg-gold" aria-hidden="true" />
          {t('live')}
        </span>
      </div>

      <div className="relative mt-3">
        <ResilienceOrb score={score} />

        <div className="mt-2 flex justify-center">
          <DeltaPill score={score} previousScore={previousScore} change={change} />
        </div>

        <div className="mt-5 border-t border-[#EFE6DE] pt-5">
          <ScoreFactors factors={resilience?.factors} />
        </div>
      </div>
    </motion.section>
  )
}
