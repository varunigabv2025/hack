/**
 * Member 4 — AI Government Scheme Analyser
 * Ranking is deterministic from profile facts; AI only explains recommendations.
 * Never invents eligibility or new numbers.
 */

import { generateGeminiJson, hasGeminiKey } from './gemini.js'

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

const SCHEME_CATALOG = [
  {
    id: 'eshram',
    name: 'e-Shram',
    category: 'Identity & benefits',
    fit: (c) => (['Uber', 'Ola', 'Swiggy', 'Zomato', 'Rapido', 'Dunzo'].includes(c.occupation) ? 96 : 70),
    why: () => 'Platform / gig work maps to unorganised work — e-Shram is the base registration.',
  },
  {
    id: 'pmsby',
    name: 'PM Suraksha Bima Yojana',
    category: 'Insurance',
    fit: (c) => (c.baseline != null && c.baseline < 1200 ? 92 : 84),
    why: (c) =>
      c.baseline != null && c.baseline < 1200
        ? 'Usual daily income is modest — low-cost accident cover protects income shocks.'
        : 'Gig driving/delivery has on-road risk; PMSBY is an affordable safety layer.',
  },
  {
    id: 'pmjjby',
    name: 'PM Jeevan Jyoti Bima Yojana',
    category: 'Insurance',
    fit: (c) => (c.score < 65 || c.buffer < 50 ? 88 : 72),
    why: (c) =>
      c.score < 65
        ? 'Resilience score is still building — life cover reduces family risk.'
        : 'Pairs with a growing savings habit for household protection.',
  },
  {
    id: 'apy',
    name: 'Atal Pension Yojana',
    category: 'Retirement',
    fit: (c) => {
      let s = 68
      if (c.streak >= 3) s += 12
      if (c.suggested > 0) s += 8
      if (c.baseline >= 700) s += 5
      return Math.min(95, s)
    },
    why: (c) =>
      c.streak >= 3
        ? `A ${c.streak}-day savings streak can convert into retirement contributions via APY.`
        : 'Small auto-debits on surplus days can fund a future pension.',
  },
  {
    id: 'pmjay',
    name: 'Ayushman Bharat (PM-JAY)',
    category: 'Health',
    fit: (c) => (c.buffer < 60 ? 86 : c.score < 70 ? 78 : 64),
    why: (c) =>
      c.buffer < 60
        ? 'Emergency buffer under 60% — health cover reduces medical-bill shocks.'
        : 'Useful hospitalisation backstop alongside the savings pocket.',
  },
  {
    id: 'state-gig',
    name: 'State Gig Worker Welfare Boards',
    category: 'State welfare',
    fit: (c) => {
      const gigStates = ['Tamil Nadu', 'Karnataka', 'Rajasthan', 'Telangana', 'Maharashtra']
      if (gigStates.includes(c.state) && c.occupation) return 90
      return c.occupation ? 74 : 55
    },
    why: (c) =>
      c.state
        ? `${c.state} is active on platform-worker welfare — watch registration drives.`
        : 'Several states are creating gig-worker boards — register when enrollment opens.',
  },
  {
    id: 'mudra',
    name: 'PM Mudra / micro-credit pathways',
    category: 'Credit',
    fit: (c) => {
      if (c.trend === 'UP' && c.score >= 70 && c.surplus > 0) return 80
      if (c.trend === 'DOWN' || c.score < 60) return 35
      return 55
    },
    why: (c) =>
      c.trend === 'UP' && c.score >= 70
        ? 'Income trend and score look stable enough to explore micro-credit carefully.'
        : 'Skip high-cost loans for now; rebuild surplus and score first.',
  },
  {
    id: 'udyam',
    name: 'Udyam Registration',
    category: 'Enterprise',
    fit: (c) => (c.occupation && c.streak >= 2 ? 76 : 62),
    why: () => 'If self-employed, Udyam helps formalise work identity.',
  },
]

export function buildProfileContext(body = {}) {
  const user = body.user || {}
  const income = body.income || body.income_profile || {}
  const savings = body.savings || body.savings_pocket || {}
  const resilience = body.resilience || body.resilience_score || {}

  return {
    occupation: user.occupation || body.occupation || 'Uber',
    state: user.state || body.state || 'Tamil Nadu',
    name: user.name || body.name || 'User',
    baseline: income.baseline ?? body.baseline,
    today: income.today ?? income.today_income ?? body.today,
    surplus: income.surplus ?? body.surplus,
    trend: income.trend || body.trend || 'STABLE',
    streak: savings.streak ?? body.streak ?? 0,
    suggested: savings.suggested ?? savings.suggested_amount ?? body.suggested ?? 0,
    buffer: savings.emergencyProgress ?? body.buffer ?? 0,
    score: resilience.score ?? body.score ?? 0,
  }
}

export function rankSchemes(ctx) {
  return SCHEME_CATALOG.map((scheme) => {
    const match = clamp(Math.round(scheme.fit(ctx)), 0, 100)
    return {
      id: scheme.id,
      name: scheme.name,
      category: scheme.category,
      match,
      priority: match >= 85 ? 'High' : match >= 70 ? 'Medium' : 'Low',
      reason: scheme.why(ctx),
    }
  }).sort((a, b) => b.match - a.match)
}

export function generateFallbackSchemeInsight(ctx, ranked) {
  const top = ranked.filter((s) => s.priority === 'High').slice(0, 3)
  const focus = top.length ? top : ranked.slice(0, 3)
  const names = focus.map((s) => s.name).join(', ')

  const steps = focus.slice(0, 3).map((s, i) => ({
    step: i + 1,
    schemeId: s.id,
    scheme: s.name,
    action:
      s.id === 'eshram'
        ? 'Register on e-Shram with your Aadhaar-linked mobile to get a UAN.'
        : s.id === 'pmsby' || s.id === 'pmjjby'
          ? `Ask your bank to enable ${s.name} on your savings account.`
          : s.id === 'apy'
            ? 'Start a small APY contribution on surplus days from your savings streak.'
            : s.id === 'pmjay'
              ? 'Check PM-JAY eligibility with your ration / SECC details on the official portal.'
              : s.id === 'state-gig'
                ? `Track ${ctx.state} gig-worker welfare registration announcements.`
                : s.id === 'mudra'
                  ? 'Only explore MUDRA if cashflow stays stable — avoid stacking app loans.'
                  : 'Review the official portal and keep documents (Aadhaar, bank, mobile) ready.',
  }))

  const narrative = [
    `${ctx.name}, as a ${ctx.occupation} worker in ${ctx.state}, your resilience score is ${ctx.score}/100 with a ${ctx.streak}-day savings streak.`,
    focus.length
      ? `AI analysis recommends prioritising: ${names}.`
      : 'AI analysis found a few schemes worth reviewing once your buffer improves.',
    ctx.buffer < 60
      ? 'Because your emergency buffer is still growing, insurance and registration should come before credit.'
      : 'Your buffer looks healthier — you can layer pension / formalisation on top of insurance.',
  ].join(' ')

  return {
    title: 'AI Scheme Recommendation',
    narrative,
    priorityOrder: focus.map((s) => s.id),
    actionPlan: steps,
    disclaimer: 'Advisory only. Verify eligibility on official government portals before applying.',
    source: 'fallback',
  }
}

const SYSTEM_PROMPT = `You are the Resilience Engine scheme coach for Indian gig workers.
You receive a PROFILE and a RANKED list of government schemes (already scored).
Write a short recommendation plan.

STRICT RULES:
1. Use ONLY the supplied profile facts and ranked scheme list.
2. NEVER invent new schemes, benefits amounts, or eligibility claims.
3. NEVER recalculate match scores — use the provided match values.
4. Recommend the top High/Medium schemes in plain language.
5. Return JSON only:
{
  "title": "string",
  "narrative": "string (max 70 words)",
  "priorityOrder": ["schemeId", "..."],
  "actionPlan": [{"step":1,"schemeId":"...","scheme":"...","action":"..."}]
}`

export async function generateAiSchemeInsight(ctx, ranked) {
  const fallback = generateFallbackSchemeInsight(ctx, ranked)
  if (!hasGeminiKey()) return fallback

  try {
    const parsed = await generateGeminiJson({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: JSON.stringify({
        profile: ctx,
        rankedSchemes: ranked.slice(0, 6).map((s) => ({
          id: s.id,
          name: s.name,
          match: s.match,
          priority: s.priority,
          reason: s.reason,
        })),
      }),
      temperature: 0.35,
    })
    if (!parsed?.narrative || !Array.isArray(parsed.actionPlan)) return fallback

    return {
      title: parsed.title || fallback.title,
      narrative: String(parsed.narrative),
      priorityOrder: Array.isArray(parsed.priorityOrder) ? parsed.priorityOrder : fallback.priorityOrder,
      actionPlan: parsed.actionPlan,
      disclaimer: fallback.disclaimer,
      source: 'ai',
    }
  } catch (err) {
    console.warn('[schemeAnalyser] Gemini failed, using fallback:', err.message)
    return fallback
  }
}

export async function analyseSchemesWithAi(body = {}) {
  const ctx = buildProfileContext(body)
  const ranked = rankSchemes(ctx)
  const forceFallback = body.forceFallback === true
  const insight = forceFallback
    ? generateFallbackSchemeInsight(ctx, ranked)
    : await generateAiSchemeInsight(ctx, ranked)

  return {
    ctx,
    ranked,
    insight,
    summary: {
      total: ranked.length,
      high: ranked.filter((s) => s.priority === 'High').length,
      medium: ranked.filter((s) => s.priority === 'Medium').length,
      topId: ranked[0]?.id,
    },
  }
}
