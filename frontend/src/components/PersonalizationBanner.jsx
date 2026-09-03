import { Link } from 'react-router-dom'
import { Compass, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import {
  clearPersonalizationPatch,
  getPersonalization,
  removeFocusPatch,
} from '../lib/personalization'

/**
 * Always-visible coach personalization for every chosen difficulty.
 */
export default function PersonalizationBanner() {
  const { data, updateProfile } = useApp()
  const { lang } = useLang()
  const pers = getPersonalization(data || {}, lang)

  if (!pers.active || !pers.primary) return null

  function clearAll() {
    updateProfile(clearPersonalizationPatch())
  }

  function clearOne(id) {
    updateProfile(removeFocusPatch(data?.settings || {}, id))
  }

  return (
    <section
      className="mb-3 rounded-[1.15rem] border border-burgundy/20 bg-burgundy-soft/70 px-3.5 py-3"
      aria-label={pers.summary || 'Personalization'}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-burgundy text-white">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy">
                {lang === 'ta' ? 'தனிப்பயனாக்கம்' : 'Personalized for you'}
              </p>
              <p className="text-sm font-semibold text-burgundy-deep">{pers.headline}</p>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed text-ink/85">{pers.primary.guidance}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {pers.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => clearOne(item.id)}
                className="inline-flex items-center gap-1 rounded-full border border-burgundy/20 bg-white px-2.5 py-1 text-[11px] font-semibold text-burgundy"
                title={lang === 'ta' ? 'நீக்கு' : 'Remove'}
              >
                {item.short}
                <X className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <Link
            to={pers.primary.to}
            className="inline-flex rounded-full bg-burgundy px-3.5 py-2 text-xs font-semibold text-white"
          >
            {pers.primary.cta}
          </Link>
          <button
            type="button"
            onClick={clearAll}
            className="text-[11px] font-medium text-muted hover:text-burgundy"
          >
            {lang === 'ta' ? 'அனைத்தையும் அழி' : 'Clear all'}
          </button>
        </div>
      </div>
    </section>
  )
}
