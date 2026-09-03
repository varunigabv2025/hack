import { Link } from 'react-router-dom'
import { CloudRain, Fuel, CalendarDays, Bus, Leaf } from 'lucide-react'
import { buildEventRecommendation, getEventSignals } from '../lib/eventSignals'
import { useLang } from '../hooks/useLang'

const ICONS = {
  weather: CloudRain,
  holiday: CalendarDays,
  fuel: Fuel,
  transit: Bus,
  seasonal: Leaf,
}

/**
 * Slim real-world event strip — one memorable recommendation.
 */
export default function EventSignalCard({ dashboard }) {
  const { t } = useLang()
  if (!dashboard) return null
  const signals = getEventSignals(dashboard)
  const rec = buildEventRecommendation(dashboard, signals)
  if (!rec) return null

  const Icon = ICONS[rec.type] || CloudRain

  return (
    <article className="rounded-[1.25rem] border border-gold/30 bg-gold-soft px-4 py-3.5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-burgundy shadow-sm">
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy">{t('realWorldSignal')}</p>
          <p className="mt-1 text-sm font-semibold leading-snug text-ink">{rec.message}</p>
          <p className="mt-1.5 text-[11px] text-muted">{rec.disclaimer}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Link to="/savings" className="text-[11px] font-semibold text-burgundy hover:underline">
              {t('openSavings')}
            </Link>
            <Link to="/network" className="text-[11px] font-semibold text-muted hover:underline">
              {t('communityView')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
