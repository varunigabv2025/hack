import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CloudRain, HandHeart, Landmark, PiggyBank, Users, AlertTriangle, ArrowRight,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import { getCommunityResilience } from '../lib/communityResilience'

export default function GlobalNetwork() {
  const { data, status, refresh } = useApp()
  const { t } = useLang()
  const community = data ? getCommunityResilience(data) : null

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={t('errorLoadCommunity')} onRetry={refresh} />
      ) : null}

      {status === 'ready' && data && community ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <header>
            <p className="page-kicker">{t('kickerAnonymized')}</p>
            <h2 className="mt-1 text-[1.85rem] font-bold tracking-tight text-burgundy">{t('communityTitle')}</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              Local patterns for {community.cohort.toLowerCase()} — never individual identities.
            </p>
            <p className="mt-1 text-[11px] text-muted">{community.sampleSize} · {community.privacyNote}</p>
          </header>

          <article className="rounded-[1.35rem] border border-burgundy/20 bg-burgundy p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('localIncomeVolatility')}</p>
            <p className="mt-3 text-lg font-semibold leading-snug sm:text-xl">{community.headline}</p>
            <p className="mt-3 text-sm text-burgundy">{community.recommendedPreparation}</p>
            <Link
              to="/bad-week"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-2 text-xs font-semibold text-burgundy-deep"
            >
              {t('stressTestMyBuffer')} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </article>

          <div className="grid gap-3 md:grid-cols-2">
            <article className="rounded-2xl border border-line/70 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy">
                <CloudRain className="h-3.5 w-3.5" /> {t('weatherDisruption')}
              </p>
              <p className="mt-2 text-sm font-semibold text-ink">{community.weatherAlert.title}</p>
              <p className="mt-1 text-[12px] text-muted">{community.weatherAlert.detail}</p>
              {community.weatherAlert.active && (
                <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-rose">
                  <AlertTriangle className="h-3 w-3" /> {t('alertActiveCorridor')}
                </p>
              )}
            </article>

            <article className="rounded-2xl border border-line/70 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-burgundy">
                <Landmark className="h-3.5 w-3.5" /> {t('localSchemeCompletion')}
              </p>
              <ul className="mt-3 space-y-2">
                {community.schemeCompletion.map((s) => (
                  <li key={s.scheme} className="flex items-center justify-between text-sm">
                    <span className="text-ink">{s.scheme}</span>
                    <span className="font-semibold text-burgundy">{s.rate}%</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted">Share of anonymized cohort with registration recorded.</p>
            </article>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <article className="rounded-2xl border border-line/70 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <Users className="h-3.5 w-3.5" /> {t('supportGroups')}
              </p>
              <ul className="mt-2 space-y-2">
                {community.supportGroups.map((g) => (
                  <li key={g.name}>
                    <p className="text-sm font-semibold text-ink">{g.name}</p>
                    <p className="text-[11px] text-muted">{g.focus}</p>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-line/70 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <HandHeart className="h-3.5 w-3.5" /> {t('emergencyResources')}
              </p>
              <ul className="mt-2 space-y-2">
                {community.emergencyResources.map((r) => (
                  <li key={r.name} className="text-sm">
                    <span className="font-semibold text-ink">{r.name}</span>
                    <span className="ml-1 text-[11px] text-muted">· {r.type}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-line/70 bg-white/80 p-4">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-muted">
                <PiggyBank className="h-3.5 w-3.5" /> {t('savingsCircles')}
              </p>
              <ul className="mt-2 space-y-2">
                {community.savingsCircles.map((c) => (
                  <li key={c.name}>
                    <p className="text-sm font-semibold text-ink">{c.name}</p>
                    <p className="text-[11px] text-muted">{c.members} · {c.focus}</p>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
