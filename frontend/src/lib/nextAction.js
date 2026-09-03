/**
 * Exactly one next action from dashboard facts.
 * Answers: “What should I do next?”
 * Respects Responsible AI: never default to recommending a loan.
 */

import { analyseSchemes } from './schemeAnalysis'
import { assertSafeAction, detectCrisis } from './responsibleAi'
import { buildEventRecommendation, getEventSignals } from './eventSignals'
import { resolvePersonalizedAction } from './personalization'

function num(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function safe(action) {
  const check = assertSafeAction(action)
  if (!check.ok) {
    return {
      id: 'safe-fallback',
      title: 'Protect essentials first',
      titleKey: 'nextActionProtectEssentials',
      detail: 'We paused an unsafe suggestion. Focus on buffer, schemes, or verified support.',
      cta: 'Open Responsible AI',
      ctaKey: 'ctaOpenResponsibleAi',
      to: '/responsible-ai',
      tone: 'burgundy',
    }
  }
  return action
}

/**
 * @returns {{
 *   id: string,
 *   title: string,
 *   detail: string,
 *   cta: string,
 *   to: string,
 *   tone: 'burgundy' | 'gold' | 'rose'
 * }}
 */
export function resolveNextAction(dashboard = {}) {
  const income = dashboard.income || {}
  const savings = dashboard.savings || {}
  const resilience = dashboard.resilience || {}
  const loanRisk = dashboard.loanRisk || {}
  const expenses = dashboard.expenses || []
  const suggested = Math.max(0, num(savings.suggested, 0))
  const surplus = Math.max(0, num(income.surplus, 0))
  const buffer = Math.max(0, num(savings.emergencyCurrent, savings.balance, 0))
  const bufferPct = num(savings.emergencyProgress, 0)
  const score = num(resilience.score, 0)
  const activeLoans = num(loanRisk.activeLoans, 0)
  const risk = String(loanRisk.level || 'low').toLowerCase()

  const crisis = detectCrisis(dashboard)
  if (crisis.active) {
    return safe({
      id: 'crisis-support',
      title: 'Contact verified human or government support',
      ctaKey: 'ctaOpenResponsibleAi',
      detail: crisis.message || 'Stress signals are high. Prefer official help before any new borrowing.',
      cta: 'Open Responsible AI',
      to: '/responsible-ai',
      tone: 'rose',
    })
  }

  const personalized = resolvePersonalizedAction(dashboard, dashboard.user?.language === 'ta' ? 'ta' : 'en')
  if (personalized) {
    return safe(personalized)
  }

  if (risk === 'high' || (activeLoans >= 2 && risk !== 'low')) {
    return safe({
      id: 'avoid-loan',
      title: 'Avoid taking another loan this week',
      titleKey: 'nextActionAvoidLoan',
      detail: `Loan risk is ${risk} with ${activeLoans} active loan${activeLoans === 1 ? '' : 's'}. Protect cash flow before stacking debt.`,
      cta: 'Review loan stacking',
      ctaKey: 'ctaReviewLoanStacking',
      to: '/loans',
      tone: 'rose',
    })
  }

  const eventRec = buildEventRecommendation(dashboard, getEventSignals(dashboard))
  if (eventRec && eventRec.severity === 'high' && suggested > 0 && surplus > 0) {
    return safe({
      id: 'event-save',
      title: `Save ₹${suggested} ahead of ${eventRec.title.toLowerCase()}`,
      titleKey: 'nextActionSaveToday',
      titleVars: { amount: suggested },
      detail: eventRec.message,
      cta: 'Open savings',
      ctaKey: 'ctaOpenSavings',
      to: '/savings',
      tone: 'gold',
    })
  }

  if (buffer < 500) {
    return safe({
      id: 'build-500',
      title: 'Build a ₹500 emergency buffer',
      titleKey: 'nextActionBuildBuffer',
      detail: `Your resilience pocket is ₹${buffer.toLocaleString('en-IN')}. A ₹500 floor stops a bad day from becoming a debt day.`,
      cta: 'Open savings pocket',
      ctaKey: 'ctaOpenSavings',
      to: '/savings',
      tone: 'burgundy',
    })
  }

  if (suggested > 0 && surplus > 0) {
    return safe({
      id: 'save-today',
      title: `Save ₹${suggested} today`,
      titleKey: 'nextActionSaveToday',
      titleVars: { amount: suggested },
      detail: `Engine safe-to-save is ₹${suggested} from today’s surplus of ₹${surplus.toLocaleString('en-IN')}.`,
      cta: 'Go to savings',
      ctaKey: 'ctaOpenSavings',
      to: '/savings',
      tone: 'gold',
    })
  }

  const nonEssential = expenses.find((e) => e && e.essential === false)
  if (nonEssential) {
    const amt = num(nonEssential.amount, 0)
    return safe({
      id: 'delay-expense',
      title: 'Delay a non-essential expense',
      detail:
        amt > 0
          ? `Pause “${nonEssential.description || nonEssential.category}” (₹${amt.toLocaleString('en-IN')}) until your buffer is stronger.`
          : 'Pause one non-essential spend this week and sweep the amount into your pocket.',
      cta: 'Review expenses',
      ctaKey: 'ctaReviewExpenses',
      to: '/expenses',
      tone: 'burgundy',
    })
  }

  const schemes = analyseSchemes(dashboard)
  const eshram = schemes.ranked?.find((s) => s.id === 'eshram')
  const highScheme = schemes.ranked?.find((s) => s.priority === 'High')

  if (eshram && (eshram.priority === 'High' || eshram.match >= 70)) {
    return safe({
      id: 'eshram',
      title: 'Complete e-Shram registration',
      detail: 'e-Shram unlocks worker identity and scheme access. One registration, many benefits.',
      cta: 'Open Scheme Studio',
      ctaKey: 'ctaOpenSchemeStudio',
      to: '/schemes',
      tone: 'gold',
    })
  }

  if (highScheme && bufferPct < 70) {
    return safe({
      id: 'scheme-docs',
      title: 'Upload one missing document',
      detail: `You’re a strong match for ${highScheme.name}. Gather Aadhaar / bank proof so registration is one sitting.`,
      cta: 'See scheme plan',
      ctaKey: 'ctaOpenSchemeStudio',
      to: '/schemes',
      tone: 'burgundy',
    })
  }

  if (score < 60 || bufferPct < 40) {
    return safe({
      id: 'support-org',
      title: 'Contact a verified support organization',
      detail: 'When the buffer is thin, talk to a worker helpline or NGO before taking informal credit.',
      cta: 'Open Responsible AI',
      ctaKey: 'ctaOpenResponsibleAi',
      to: '/responsible-ai',
      tone: 'rose',
    })
  }

  if (eventRec && suggested > 0) {
    return safe({
      id: 'event-prep',
      title: `Prepare for ${eventRec.title.toLowerCase()}`,
      detail: eventRec.message,
      cta: 'Open savings',
      ctaKey: 'ctaOpenSavings',
      to: '/savings',
      tone: 'gold',
    })
  }

  if (bufferPct >= 40 && score >= 65) {
    return safe({
      id: 'passport-share',
      title: 'Review your Resilience Passport',
      detail: 'Your profile is strong enough to share selectively with NGOs, unions, or scheme partners — you control permissions.',
      cta: 'Open passport',
      ctaKey: 'ctaOpenPassport',
      to: '/passport',
      tone: 'burgundy',
    })
  }

  if (suggested > 0) {
    return safe({
      id: 'save-engine',
      title: `Save ₹${suggested} today`,
      titleKey: 'nextActionSaveToday',
      titleVars: { amount: suggested },
      detail: 'This is the engine’s safe-to-save amount — not a promised return.',
      cta: 'Open savings',
      ctaKey: 'ctaOpenSavings',
      to: '/savings',
      tone: 'gold',
    })
  }

  return safe({
    id: 'community',
    title: 'Check community resilience signals',
    detail: 'See anonymized local volatility and support options — then decide your next buffer step.',
    cta: 'Open community view',
    ctaKey: 'ctaOpenCommunity',
    to: '/network',
    tone: 'burgundy',
  })
}
