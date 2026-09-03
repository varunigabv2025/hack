import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass } from 'lucide-react'
import { resolveNextAction } from '../lib/nextAction'
import DataQualityPanel from './DataQualityPanel'
import { useLang } from '../hooks/useLang'

const toneClass = {
  burgundy: 'bg-burgundy',
  gold: 'bg-gold',
  rose: 'bg-rose',
}

const CTA_KEYS = {
  'Open savings': 'ctaOpenSavings',
  'Go to savings': 'ctaOpenSavings',
  'Open savings pocket': 'ctaOpenSavings',
  'Review expenses': 'ctaReviewExpenses',
  'Open Scheme Studio': 'ctaOpenSchemeStudio',
  'See scheme plan': 'ctaOpenSchemeStudio',
  'Open Responsible AI': 'ctaOpenResponsibleAi',
  'Review loan stacking': 'ctaReviewLoanStacking',
  'Open passport': 'ctaOpenPassport',
  'Open community view': 'ctaOpenCommunity',
}

export default function NextActionCard({ dashboard, compact = false, showQuality = true }) {
  const { t } = useLang()
  if (!dashboard) return null
  const action = resolveNextAction(dashboard)
  const tone = toneClass[action.tone] || toneClass.burgundy
  const title = action.titleKey
    ? t(action.titleKey, action.titleVars)
    : action.title
  const ctaKey = action.ctaKey || CTA_KEYS[action.cta]
  const cta = ctaKey ? t(ctaKey) : action.cta

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={[
        'relative overflow-hidden rounded-[1.25rem] border border-line/80 bg-white',
        compact ? 'p-3.5' : 'p-4 sm:p-5',
      ].join(' ')}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-burgundy-soft text-burgundy">
              <Compass className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('nextAction')}</p>
          </div>
          <h3
            className={[
              'font-bold tracking-tight text-burgundy',
              compact ? 'text-base' : 'text-lg sm:text-xl',
            ].join(' ')}
          >
            {title}
          </h3>
          {!compact && (
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{action.detail}</p>
          )}
        </div>
        <Link
          to={action.to}
          className={[
            'tap-target inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold text-white',
            tone,
          ].join(' ')}
        >
          {cta}
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      {showQuality ? <DataQualityPanel dashboard={dashboard} embedded /> : null}
    </motion.section>
  )
}
