import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, CheckCircle2, Circle, ExternalLink, FileText, Landmark, Radar, Route, Sparkles,
} from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'
import { fetchSchemeAnalysis } from '../services/api'
import { analyseSchemes } from '../lib/schemeAnalysis'
import { generateAiBrief } from '../lib/aiBrief'

const TABS = [
  { id: 'radar', label: 'Radar', icon: Radar },
  { id: 'journey', label: 'Journey', icon: Route },
  { id: 'vault', label: 'Docs', icon: FileText },
]

const DOC_KEY = 're_scheme_docs'
const DEFAULT_DOCS = ['Aadhaar', 'Bank account', 'Mobile number']

const DOC_MAP = {
  eshram: ['Aadhaar', 'Aadhaar-linked mobile', 'Bank account', 'Recent photo / selfie'],
  pmsby: ['Savings account', 'Aadhaar', 'Nominee details', 'Consent for auto-debit'],
  pmjjby: ['Savings account', 'Aadhaar', 'Age proof (18–50)', 'Nominee details'],
  apy: ['Savings account', 'Aadhaar', 'Mobile number', 'Nominee details'],
  pmjay: ['Aadhaar', 'Ration / SECC details', 'Family member details', 'Mobile number'],
  'state-gig': ['Aadhaar', 'Platform ID / work proof', 'State residence proof', 'Bank account'],
  mudra: ['Aadhaar', 'PAN (if available)', 'Bank statements', 'Business / work proof'],
  udyam: ['Aadhaar', 'PAN (if available)', 'Bank account', 'Mobile number'],
  pmsym: ['Aadhaar', 'Savings account', 'Age proof', 'Occupation proof'],
  vishwakarma: ['Aadhaar', 'Bank account', 'Trade / skill proof'],
}

function docsFor(schemeId) {
  return DOC_MAP[schemeId] || DEFAULT_DOCS
}

function loadDocChecks() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DOC_KEY) || '{}')
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function splitNextAction(text = '') {
  const idx = text.indexOf(':')
  if (idx === -1) return { kicker: 'Next', body: text }
  return { kicker: text.slice(0, idx).trim() || 'Next', body: text.slice(idx + 1).trim() }
}

function MatchRing({ value }) {
  const r = 38
  const c = 2 * Math.PI * r
  const offset = c - (Math.min(100, value) / 100) * c
  return (
    <svg width={96} height={96} viewBox="0 0 96 96" className="shrink-0">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#F3EBE2" strokeWidth="7" />
      <motion.circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="url(#matchGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        transform="rotate(-90 48 48)"
      />
      <defs>
        <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6B2D5B" />
          <stop offset="100%" stopColor="#C9842F" />
        </linearGradient>
      </defs>
      <text x="48" y="46" textAnchor="middle" fontSize="18" fontWeight="800" fill="#6B2D5B">
        {value}%
      </text>
      <text x="48" y="62" textAnchor="middle" fontSize="8" fontWeight="700" fill="#8A7F88" letterSpacing="0.12em">
        MATCH
      </text>
    </svg>
  )
}

function priorityClass(priority) {
  if (priority === 'High') return 'bg-burgundy text-white'
  if (priority === 'Medium') return 'bg-gold-soft text-gold-deep'
  return 'bg-beige text-muted'
}

export default function Schemes() {
  const { data, status, refresh } = useApp()
  const { formatMoney } = useMoney()
  const [analysis, setAnalysis] = useState(null)
  const [loadingAi, setLoadingAi] = useState(false)
  const [tab, setTab] = useState('radar')
  const [activeId, setActiveId] = useState(null)
  const [docChecks, setDocChecks] = useState(loadDocChecks)

  useEffect(() => {
    if (!data) return
    let cancelled = false
    const local = analyseSchemes(data)
    setAnalysis(local)
    setActiveId(local.ranked[0]?.id || null)
    setLoadingAi(true)
    fetchSchemeAnalysis(data)
      .then((result) => {
        if (cancelled) return
        setAnalysis(result)
        setActiveId((prev) => prev || result.ranked[0]?.id || null)
      })
      .finally(() => {
        if (!cancelled) setLoadingAi(false)
      })
    return () => {
      cancelled = true
    }
  }, [data])

  useEffect(() => {
    if (tab !== 'vault' || !activeId) return
    const el = document.getElementById(`docs-${activeId}`)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [tab, activeId])

  const active = useMemo(
    () => analysis?.ranked?.find((s) => s.id === activeId) || analysis?.ranked?.[0],
    [analysis, activeId],
  )

  const brief = data ? generateAiBrief(data) : null
  const next = splitNextAction(brief?.nextAction || '')

  function toggleDoc(schemeId, doc) {
    setDocChecks((prev) => {
      const nextMap = {
        ...prev,
        [schemeId]: { ...prev[schemeId], [doc]: !prev[schemeId]?.[doc] },
      }
      localStorage.setItem(DOC_KEY, JSON.stringify(nextMap))
      return nextMap
    })
  }
  const sourceLabel = loadingAi ? 'analysing…' : analysis?.insight?.source === 'ai' ? 'AI live' : 'fallback'

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message="Could not load scheme analysis." onRetry={refresh} />
      ) : null}

      {status === 'ready' && data && analysis ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0 max-w-2xl">
              <p className="page-kicker">Scheme Studio</p>
              <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold leading-none tracking-tight text-burgundy sm:text-[2.15rem]">
                <Landmark className="h-8 w-8 shrink-0" aria-hidden="true" />
                Scheme Matcher
              </h2>
              <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
                Find government schemes, welfare programs and financial protection relevant to your profile.
              </p>
              <p className="mt-1.5 text-[12px] font-medium text-ink/70">
                {analysis.ctx.occupation} · {analysis.ctx.state} · {analysis.summary.high} high-fit matches
                <span className="ml-2 font-normal text-muted">· {sourceLabel}</span>
              </p>
            </div>

            <div className="inline-flex shrink-0 gap-1 self-start rounded-full border border-line bg-white/80 p-1 lg:self-end">
              {TABS.map((t) => {
                const Icon = t.icon
                const on = tab === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={[
                      'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold transition-colors',
                      on ? 'bg-burgundy text-white' : 'text-muted hover:bg-burgundy-soft hover:text-burgundy',
                    ].join(' ')}
                  >
                    <Icon className="h-3.5 w-3.5" /> {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-y divide-line/60 overflow-hidden rounded-[1.25rem] border border-line/80 bg-white/75 md:grid-cols-4 md:divide-y-0">
            {[
              { value: formatMoney(analysis.ctx.baseline), label: 'Baseline' },
              { value: `${analysis.ctx.score} / 100`, label: 'Resilience' },
              { value: `${analysis.ctx.streak} DAYS`, label: 'Save streak' },
              { value: `${analysis.ctx.buffer}%`, label: 'Buffer' },
            ].map((item) => (
              <div key={item.label} className="px-4 py-3">
                <p className="text-lg font-bold tabular-nums tracking-tight text-burgundy">{item.value}</p>
                <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.12em] text-muted">{item.label}</p>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'radar' && (
              <motion.section
                key="radar"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <article className="card-panel">
                  {active && (
                    <div className="grid gap-4 lg:grid-cols-[auto_minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start">
                      <MatchRing value={active.match} />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Best match</p>
                        <h3 className="mt-1.5 text-[1.25rem] font-bold leading-tight text-ink">{active.name}</h3>
                        <p className="mt-1 text-[12px] text-muted">
                          {active.category}
                          <span className="mx-1.5 text-line">·</span>
                          {active.priority} fit
                        </p>
                        <p className="mt-2 text-[13px] leading-relaxed text-ink/85">{active.reason}</p>
                        {active.benefit && (
                          <div className="mt-3 rounded-xl bg-ivory/80 px-3.5 py-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Why it matters</p>
                            <p className="mt-1.5 text-[13px] leading-relaxed text-ink/80">{active.benefit}</p>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => setTab('vault')}
                          className="mb-3 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-burgundy hover:opacity-80"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          Open document checklist
                        </button>
                        {brief && (
                          <div className="rounded-xl bg-burgundy px-3.5 py-3 text-white">
                            <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-soft">
                              <Sparkles className="h-3 w-3" /> AI brief
                            </p>
                            <p className="mt-1.5 text-[12px] font-semibold text-white/70">{next.kicker}</p>
                            <p className="text-[13px] leading-snug text-white">{next.body}</p>
                          </div>
                        )}
                        {active.link && (
                          <a
                            href={active.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-burgundy hover:opacity-80"
                          >
                            View official page <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </article>

                <article className="card-panel !px-6 !py-6">
                  <div className="mb-5 px-1">
                    <h3 className="text-[1.35rem] font-bold text-ink">Best matches for you</h3>
                    <p className="mt-1 text-[15px] text-muted">Ranked by profile fit</p>
                  </div>
                  <ul className="flex flex-1 flex-col">
                    {analysis.ranked.map((scheme) => {
                      const on = scheme.id === active?.id
                      return (
                        <li key={scheme.id} className="border-t border-line/60 first:border-t-0">
                          <button
                            type="button"
                            onClick={() => setActiveId(scheme.id)}
                            className={[
                              'flex w-full cursor-pointer items-center gap-4 rounded-xl px-3 py-4 text-left transition-colors',
                              on ? 'bg-burgundy-soft/70' : 'hover:bg-ivory/90',
                            ].join(' ')}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2.5">
                                <p className="truncate text-[16px] font-semibold text-ink">{scheme.name}</p>
                                <span
                                  className={[
                                    'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                                    priorityClass(scheme.priority),
                                  ].join(' ')}
                                >
                                  {scheme.priority}
                                </span>
                              </div>
                              <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-beige">
                                <div
                                  className="h-full rounded-full bg-gradient-to-r from-burgundy to-gold"
                                  style={{ width: `${scheme.match}%` }}
                                />
                              </div>
                            </div>
                            <p className="w-14 shrink-0 text-right text-[16px] font-bold tabular-nums text-burgundy">
                              {scheme.match}%
                            </p>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </article>
              </motion.section>
            )}

            {tab === 'journey' && (
              <motion.section
                key="journey"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                <article className="card-panel">
                  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-burgundy">
                    <Sparkles className="h-3.5 w-3.5" />
                    {analysis.insight?.title || 'AI Journey'}
                  </p>
                  <p className="text-[14px] leading-relaxed text-ink/85">{analysis.insight?.narrative}</p>
                </article>
                {(analysis.insight?.actionPlan || []).map((step) => (
                  <article key={`${step.step}-${step.schemeId}`} className="card-panel">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
                      Step {step.step}
                    </p>
                    <p className="mt-1 text-[14px] font-bold text-ink">{step.scheme}</p>
                    <p className="mt-2 text-[13px] leading-relaxed text-muted">{step.action}</p>
                  </article>
                ))}
              </motion.section>
            )}

            {tab === 'vault' && (
              <motion.section
                key="vault"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-4"
              >
                <div className="px-1">
                  <h3 className="text-[1.35rem] font-bold text-ink">Document checklists</h3>
                  <p className="mt-1 text-[15px] text-muted">
                    A separate list for each scheme. Tick what you already have.
                  </p>
                </div>
                {analysis.ranked.map((scheme) => {
                  const items = docsFor(scheme.id)
                  const done = items.filter((doc) => docChecks[scheme.id]?.[doc]).length
                  const pct = items.length ? Math.round((done / items.length) * 100) : 0
                  const focused = scheme.id === active?.id
                  return (
                    <article
                      key={scheme.id}
                      id={`docs-${scheme.id}`}
                      className={[
                        'card-panel !px-6 !py-6',
                        focused ? 'ring-1 ring-burgundy/25' : '',
                      ].join(' ')}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="text-[1.15rem] font-bold text-ink">{scheme.name}</h4>
                            <span
                              className={[
                                'shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide',
                                priorityClass(scheme.priority),
                              ].join(' ')}
                            >
                              {scheme.priority}
                            </span>
                          </div>
                          <p className="mt-1 text-[13px] text-muted">
                            {scheme.category}
                            <span className="mx-1.5 text-line">·</span>
                            {done} of {items.length} ready
                          </p>
                        </div>
                        <p className="text-[16px] font-bold tabular-nums text-burgundy">{scheme.match}%</p>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-beige">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-burgundy to-gold"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <ul className="mt-5 space-y-2">
                        {items.map((doc) => {
                          const on = Boolean(docChecks[scheme.id]?.[doc])
                          return (
                            <li key={doc}>
                              <button
                                type="button"
                                onClick={() => toggleDoc(scheme.id, doc)}
                                className={[
                                  'flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
                                  on
                                    ? 'border-burgundy/20 bg-burgundy-soft/60'
                                    : 'border-line/70 bg-white hover:bg-ivory/90',
                                ].join(' ')}
                              >
                                {on ? (
                                  <CheckCircle2 className="h-5 w-5 shrink-0 text-burgundy" aria-hidden="true" />
                                ) : (
                                  <Circle className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
                                )}
                                <span className="text-[15px] font-medium text-ink">{doc}</span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>

                      {scheme.link ? (
                        <a
                          href={scheme.link}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex cursor-pointer items-center gap-1.5 text-[14px] font-semibold text-burgundy hover:opacity-80"
                        >
                          View official page <ExternalLink className="h-4 w-4" />
                        </a>
                      ) : null}
                    </article>
                  )
                })}
              </motion.section>
            )}
          </AnimatePresence>

          {tab === 'radar' && (analysis.insight?.actionPlan || []).length > 0 && (
            <section className="card-panel !py-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Next best action</p>
              <ol className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
                {(analysis.insight.actionPlan).slice(0, 3).map((step, i, arr) => (
                  <li key={`${step.step}-${step.schemeId}`} className="flex min-w-0 flex-1 items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveId(step.schemeId)
                        setTab('radar')
                      }}
                      className="flex min-w-0 cursor-pointer items-start gap-2.5 rounded-xl px-1 py-1 text-left hover:bg-ivory/80"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-burgundy-soft text-[11px] font-bold text-burgundy">
                        {step.step}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold text-ink">{step.scheme}</span>
                        <span className="mt-0.5 line-clamp-2 block text-[11px] leading-snug text-muted">
                          {step.action}
                        </span>
                      </span>
                    </button>
                    {i < arr.length - 1 ? (
                      <ArrowRight className="mx-1 hidden h-4 w-4 shrink-0 text-gold/80 sm:block" aria-hidden="true" />
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          )}
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
