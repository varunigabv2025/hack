import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ExternalLink, Scale, ShieldCheck } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import {
  CRISIS_SUPPORT_LINKS,
  RESPONSIBLE_AI_RULES,
  detectCrisis,
} from '../lib/responsibleAi'

const RULE_KEYS = {
  'no-loan-default': 'ruleNoLoanDefault',
  'no-promises': 'ruleNoPromises',
  'no-blame': 'ruleNoBlame',
  uncertainty: 'ruleExplainUncertainty',
  'crisis-support': 'ruleCrisisSupport',
  'no-sensitive-scoring': 'ruleNoSensitiveScoring',
  'correct-data': 'ruleCorrectData',
}

export default function ResponsibleAi() {
  const { data } = useApp()
  const { t } = useLang()
  const crisis = detectCrisis(data || {})

  return (
    <AppLayout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto flex max-w-3xl flex-col gap-4">
        <header>
          <p className="page-kicker">{t('kickerTrustSafety')}</p>
          <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold tracking-tight text-burgundy">
            <Scale className="h-7 w-7 text-burgundy" />
            {t('responsibleAiTitle')}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t('responsibleAiIntro')}
          </p>
        </header>

        {crisis.active && (
          <article className="rounded-[1.25rem] border border-rose/30 bg-rose-soft/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-rose">{t('crisisPathwayActive')}</p>
            <p className="mt-2 text-sm font-semibold text-ink">{crisis.message}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted">
              {crisis.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              {CRISIS_SUPPORT_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target={l.href.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-burgundy"
                >
                  {l.label} <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </article>
        )}

        <section className="space-y-2">
          {RESPONSIBLE_AI_RULES.map((rule, i) => (
            <motion.article
              key={rule.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-2xl border border-line/70 bg-white/80 px-4 py-3.5"
            >
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-burgundy" />
                <div>
                  <p className="text-sm font-semibold text-burgundy">
                    {RULE_KEYS[rule.id] ? t(RULE_KEYS[rule.id]) : rule.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-relaxed text-muted">{rule.detail}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </section>

        <article className="rounded-2xl border border-line/70 bg-ivory/80 px-4 py-3.5 text-sm text-muted">
          <p className="font-semibold text-ink">{t('correctIncorrectData')}</p>
          <p className="mt-1 text-[12px] leading-relaxed">
            Recommendations only use facts you can see and edit. Update profile, expenses, and loans anytime so the
            engine stays fair to your real situation.
          </p>
          <Link to="/settings" className="mt-2 inline-flex text-xs font-semibold text-burgundy hover:underline">
            {t('openSettingsCorrectData')}
          </Link>
        </article>
      </motion.div>
    </AppLayout>
  )
}
