import { assessDataQuality } from '../lib/dataQuality'
import { useLang } from '../hooks/useLang'

const qualityTone = {
  High: 'bg-gold-soft text-gold',
  Medium: 'bg-burgundy-soft text-burgundy',
  Low: 'bg-beige text-muted',
}

const qualityKey = {
  High: 'qualityHigh',
  Medium: 'qualityMedium',
  Low: 'qualityLow',
}

export default function DataQualityPanel({ dashboard, embedded = false }) {
  const { t } = useLang()
  if (!dashboard) return null
  const q = assessDataQuality(dashboard)

  return (
    <div
      className={
        embedded
          ? 'mt-3 border-t border-line/70 pt-3'
          : 'rounded-[1.25rem] border border-line/80 bg-white/80 px-4 py-3.5'
      }
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
          {t('basedOn')}
        </p>
        <span
          className={[
            'rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            qualityTone[q.quality] || qualityTone.Medium,
          ].join(' ')}
        >
          {t('dataQuality')}: {t(qualityKey[q.quality] || 'qualityMedium')}
        </span>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4">
        {q.lines.map((line) => (
          <li key={line} className="text-[12px] font-medium text-ink/85">
            {line}
          </li>
        ))}
      </ul>
      {!embedded && <p className="mt-2 text-[11px] text-muted">{q.note}</p>}
    </div>
  )
}
