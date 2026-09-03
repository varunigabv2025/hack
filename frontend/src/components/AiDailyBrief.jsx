import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical, Sparkles } from 'lucide-react'
import { generateAiBrief } from '../lib/aiBrief'
import { fetchNudge } from '../services/api'
import { useLang } from '../hooks/useLang'

export default function AiDailyBrief({ data }) {
  const { t } = useLang()
  const [brief, setBrief] = useState(() => (data ? generateAiBrief(data) : null))
  const [nudgeLine, setNudgeLine] = useState('')

  useEffect(() => {
    if (!data) return
    setBrief(generateAiBrief(data))
    let cancelled = false
    fetchNudge(data)
      .then((n) => {
        if (!cancelled && n?.message) setNudgeLine(n.message)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [data])

  if (!brief) return null

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-burgundy/15 bg-burgundy px-4 py-3.5 text-white"
    >
      <div className="pointer-events-none absolute -right-8 top-0 h-24 w-24 rounded-full bg-gold/15 blur-2xl" />

      <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold-soft" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-soft">
              {t('aiDailyBrief')}
            </p>
          </div>
          <p className="text-sm font-semibold tracking-tight">{brief.greeting}</p>
          <p className="mt-0.5 text-xs leading-snug text-white/80">
            {nudgeLine || brief.focus}
          </p>
          <p className="mt-1.5 text-xs font-medium text-gold-soft">{brief.nextAction}</p>
        </div>

        <div className="flex shrink-0 gap-2">
          <Link
            to="/lab"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-gold px-3 text-xs font-semibold text-white shadow-sm"
          >
            <FlaskConical className="h-3.5 w-3.5" /> {t('lab')}
          </Link>
          <Link
            to="/schemes"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/25 bg-white/10 px-3 text-xs font-semibold text-white"
          >
            {t('schemes')} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
