import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BadgeCheck, Building2, Copy, Download, Handshake, Landmark,
  Share2, Shield, Users,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import DataQualityPanel from '../components/DataQualityPanel'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import {
  buildResiliencePassport,
  loadPassportPermissions,
  savePassportPermissions,
} from '../lib/resiliencePassport'

const toneChip = {
  gold: 'bg-gold-soft text-burgundy',
  burgundy: 'bg-burgundy-soft text-burgundy',
  rose: 'bg-rose-soft text-rose',
  muted: 'bg-beige text-muted',
}

const partnerIcon = {
  ngo: Users,
  mfi: Building2,
  union: Handshake,
  insurance: Shield,
  government: Landmark,
  platforms: Share2,
}

export default function Passport() {
  const { data, status, refresh } = useApp()
  const { t } = useLang()
  const [permissions, setPermissions] = useState(loadPassportPermissions)
  const [copied, setCopied] = useState(false)

  const passport = useMemo(
    () => (data ? buildResiliencePassport(data, permissions) : null),
    [data, permissions],
  )

  function togglePermission(id) {
    setPermissions((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      savePassportPermissions(next)
      return next
    })
  }

  async function copySummary() {
    if (!passport) return
    const text = JSON.stringify(passport.portableSummary, null, 2)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  function downloadSummary() {
    if (!passport) return
    const blob = new Blob([JSON.stringify(passport.portableSummary, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${passport.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={t('errorLoadPassport')} onRetry={refresh} />
      ) : null}

      {status === 'ready' && data && passport ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
          <header className="relative overflow-hidden rounded-[1.5rem] border border-burgundy/20 bg-burgundy p-5 text-white sm:p-7">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">{t('kickerWorkerOwned')}</p>
            <h2
              className="mt-2 flex flex-wrap items-center gap-2 text-[1.85rem] font-bold leading-none tracking-tight !text-white sm:text-[2.15rem]"
              style={{ color: '#ffffff' }}
            >
              <BadgeCheck className="h-8 w-8 shrink-0 text-gold" aria-hidden="true" />
              <span style={{ color: '#ffffff' }}>{t('passportTitle')}</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85">
              {passport.positioning}
            </p>
            <div className="mt-5 flex flex-wrap items-end gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{t('passportId')}</p>
                <p className="font-mono text-lg font-semibold text-gold">{passport.id}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{t('holder')}</p>
                <p className="text-sm font-semibold">
                  {passport.holder.name} · {passport.holder.occupation}
                  {passport.holder.state ? ` · ${passport.holder.state}` : ''}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{t('personalResilience')}</p>
                <p className="text-2xl font-bold tabular-nums">{passport.resilienceScore}
                  <span className="text-base font-medium text-white/60"> / 100</span>
                </p>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={copySummary}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copied ? t('copied') : t('copyPortableSummary')}
                </button>
                <button
                  type="button"
                  onClick={downloadSummary}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-gold px-3.5 py-2 text-xs font-semibold text-white"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t('downloadJson')}
                </button>
              </div>
            </div>
          </header>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {passport.pillars.map((pillar, i) => (
              <motion.article
                key={pillar.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-[1.25rem] border border-line/80 bg-white/80 p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted">{pillar.title}</p>
                  <span
                    className={[
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide',
                      toneChip[pillar.level.tone] || toneChip.muted,
                    ].join(' ')}
                  >
                    {pillar.level.label}
                  </span>
                </div>
                <p className="mt-2 text-xl font-bold tracking-tight text-burgundy">{pillar.value}</p>
                <p className="mt-1.5 text-[12px] leading-relaxed text-muted">{pillar.detail}</p>
              </motion.article>
            ))}
          </section>

          <section className="grid items-start gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <article className="h-fit rounded-[1.35rem] border border-line/80 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('schemeEligibilitySnapshot')}</p>
              <p className="mt-1 text-sm text-muted">{t('schemeEligibilityHint')}</p>
              <ul className="mt-4 space-y-2">
                {passport.schemes.length ? (
                  passport.schemes.map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-xl bg-ivory px-3.5 py-2.5"
                    >
                      <span className="text-sm font-semibold text-ink">{s.name}</span>
                      <span className="text-xs font-bold text-burgundy">{s.match}% {t('match').toLowerCase()}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-muted">{t('noHighFitSchemes')}</li>
                )}
              </ul>
              <Link to="/schemes" className="mt-4 inline-flex text-sm font-semibold text-burgundy hover:underline">
                {t('openSchemeStudio')}
              </Link>
            </article>

            <article className="h-fit rounded-[1.35rem] border border-line/80 bg-white p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('dataSharingPermissions')}</p>
              <p className="mt-1 text-sm text-muted">
                {t('dataSharingHint')}
              </p>
              <ul className="mt-4 space-y-2">
                {passport.sharing.map((p) => {
                  const Icon = partnerIcon[p.id] || Share2
                  return (
                    <li
                      key={p.id}
                      className="flex items-start gap-3 rounded-xl border border-line/60 px-3 py-2.5"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-burgundy-soft text-burgundy">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-ink">{p.label}</p>
                        <p className="text-[11px] leading-relaxed text-muted">{p.blurb}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={p.enabled}
                        aria-label={`Share with ${p.label}`}
                        onClick={() => togglePermission(p.id)}
                        className={[
                          'relative mt-1 h-6 w-11 shrink-0 cursor-pointer rounded-full transition',
                          p.enabled ? 'bg-burgundy' : 'bg-line',
                        ].join(' ')}
                      >
                        <span
                          className={[
                            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition',
                            p.enabled ? 'left-5' : 'left-0.5',
                          ].join(' ')}
                        />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </article>
          </section>

          <article className="rounded-[1.35rem] border border-gold/25 bg-gold-soft p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-burgundy">{t('futurePartnerships')}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">
              A portable resilience profile can unlock fairer support with NGOs, microfinance institutions,
              worker unions, insurers, government programs, and delivery or ride-hailing platforms — without
              reducing a worker to a single credit number.
            </p>
            <p className="mt-3 text-xs text-muted">{passport.disclaimer}</p>
          </article>

          <DataQualityPanel dashboard={data} />
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
