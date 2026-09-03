import { Volume2 } from 'lucide-react'
import { buildSpokenNudge, t as translate } from '../lib/i18n'
import { speakText } from '../lib/voice'

/** One calm spoken-nudge line — premium, not a second hero card. */
export default function SpokenNudgeLine({ dashboard, lang = 'en' }) {
  if (!dashboard) return null
  const line = buildSpokenNudge(dashboard, lang)

  return (
    <div className="flex items-start gap-3 rounded-[1.15rem] border border-burgundy/15 bg-white/70 px-3.5 py-3">
      <button
        type="button"
        onClick={() => speakText(line, { lang })}
        className="tap-target mt-0.5 flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-burgundy text-white shadow-sm shadow-burgundy/20"
        aria-label={translate(lang, 'speakNudge')}
      >
        <Volume2 className="h-4 w-4" />
      </button>
      <p className="min-w-0 text-[13px] leading-relaxed text-ink/90 sm:text-sm">{line}</p>
    </div>
  )
}
