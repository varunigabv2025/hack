import { Sparkles } from 'lucide-react'
import { strings } from '../i18n/strings'

export default function NudgeCard({ nudge, language }) {
  const copy = strings[language] || strings.en
  const message = nudge?.triggered ? nudge.message : null

  return (
    <section className="card border-engine/25 bg-gradient-to-br from-card to-[#082f49]/55">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-engine">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        {copy.nudge.title}
      </div>
      <p className="text-base leading-relaxed text-ink">{message || copy.nudge.fallback}</p>
    </section>
  )
}
