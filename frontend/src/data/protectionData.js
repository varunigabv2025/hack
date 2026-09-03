/**
 * frontend/src/data/protectionData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Static configuration for the Financial Protection Hub.
 *
 * Each protection type defines:
 *   - id, emoji, title
 *   - tagline: one-line impact statement
 *   - why: short explanation (1–2 sentences max)
 *   - recommendation: actionable advice
 *   - ctaLabel: button text
 *   - ctaLink: external or internal URL
 *   - basePriority: 'low' | 'medium' | 'high' — overridden by personalisation
 *
 * Priority is computed at runtime by computePriority(type, data) below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const PROTECTION_TYPES = [
  {
    id: 'health',
    emoji: '🏥',
    title: 'Health Protection',
    tagline: 'Medical expenses can quickly reduce emergency savings.',
    why: 'A single hospitalisation can wipe out months of savings. Basic health coverage keeps your buffer intact.',
    recommendation: 'Consider PM-JAY (Ayushman Bharat) or a basic health plan. Maintain at least ₹5,000 medical emergency reserve.',
    ctaLabel: 'Explore Options',
    ctaLink: 'https://pmjay.gov.in',
    basePriority: 'medium',
  },
  {
    id: 'accident',
    emoji: '🦺',
    title: 'Accident Protection',
    tagline: 'Physical work raises the risk of income-stopping injuries.',
    why: 'Delivery riders, auto drivers, and daily-wage workers face higher accident exposure. A small personal accident policy replaces lost income.',
    recommendation: 'A personal accident cover of ₹5–10 lakh costs as little as ₹300/year. Look for group accident policies via aggregator apps.',
    ctaLabel: 'Check Eligibility',
    ctaLink: 'https://bimabazaar.com',
    basePriority: 'low',
  },
  {
    id: 'life',
    emoji: '❤️',
    title: 'Life Protection',
    tagline: 'Your income is the financial backbone for those who depend on you.',
    why: 'If you support family members, a term life policy ensures they are not left without income.',
    recommendation: 'A ₹25 lakh term plan costs roughly ₹400–600/month. PM Jeevan Jyoti Bima Yojana offers basic cover at ₹436/year.',
    ctaLabel: 'Explore Options',
    ctaLink: 'https://financialservices.gov.in/insurance-divisions/Government-Sponsored-Socially-Oriented-Insurance-Schemes/Pradhan-Mantri-Jeevan-Jyoti-Bima-Yojana',
    basePriority: 'medium',
  },
  {
    id: 'retirement',
    emoji: '👴',
    title: 'Retirement Planning',
    tagline: 'Small daily savings now can build a meaningful retirement corpus.',
    why: 'Gig workers often lack employer pension. Starting early, even with small amounts, makes a large difference due to compounding.',
    recommendation: 'NPS Lite (Swavalamban) allows contributions from ₹1,000/year. APY (Atal Pension Yojana) guarantees ₹1,000–5,000/month from age 60.',
    ctaLabel: 'Explore Options',
    ctaLink: 'https://npscra.nsdl.co.in',
    basePriority: 'low',
  },
  {
    id: 'income',
    emoji: '💼',
    title: 'Income Protection',
    tagline: 'Variable income is your biggest financial risk.',
    why: 'When gig work slows down or your vehicle needs repair, income stops. A dedicated income buffer smooths these gaps.',
    recommendation: 'Build a 2-week income buffer (14× daily baseline) before investing elsewhere. Credit unions and NBFC microloans can bridge emergency gaps.',
    ctaLabel: 'Build Your Buffer',
    ctaLink: '/savings',
    basePriority: 'medium',
  },
]

/**
 * computePriority(typeId, data)
 * Personalises protection priority using live dashboard data.
 *
 * Rules (in descending importance):
 *   health:
 *     - emergencyProgress < 40  → HIGH  (low buffer = high medical risk)
 *     - emergencyProgress < 70  → MEDIUM
 *     - else                    → LOW
 *
 *   accident:
 *     - occupation contains gig keywords (uber, ola, zomato, swiggy, delivery, auto, driver, rider, coolie)
 *       → HIGH (physical-labour / on-road workers)
 *     - else → LOW
 *
 *   life:
 *     - age < 35 AND emergencyProgress < 60 → MEDIUM (young, unprotected dependents possible)
 *     - age >= 35                           → HIGH
 *     - else                                → LOW
 *
 *   retirement:
 *     - age >= 40                           → HIGH
 *     - age >= 30                           → MEDIUM
 *     - else                                → LOW
 *
 *   income:
 *     - savings.emergencyProgress < 30      → HIGH (very exposed)
 *     - income.trend === 'DOWN'             → HIGH
 *     - savings.emergencyProgress < 60      → MEDIUM
 *     - else                                → LOW
 *
 * @param {string} typeId
 * @param {object|null} data  — AppContext data object (may be null)
 * @returns {'low'|'medium'|'high'}
 */
export function computePriority(typeId, data) {
  if (!data) {
    return PROTECTION_TYPES.find((t) => t.id === typeId)?.basePriority ?? 'medium'
  }

  const emergencyProgress = data.savings?.emergencyProgress ?? 50
  const age = data.user?.age ?? 28
  const occupation = String(data.user?.occupation ?? '').toLowerCase()
  const trend = data.income?.trend ?? 'STABLE'

  const GIG_KEYWORDS = ['uber', 'ola', 'zomato', 'swiggy', 'delivery', 'auto', 'driver', 'rider', 'coolie', 'porter', 'rapido']
  const isPhysicalWorker = GIG_KEYWORDS.some((kw) => occupation.includes(kw))

  switch (typeId) {
    case 'health':
      if (emergencyProgress < 40) return 'high'
      if (emergencyProgress < 70) return 'medium'
      return 'low'

    case 'accident':
      if (isPhysicalWorker) return 'high'
      return 'low'

    case 'life':
      if (age >= 35) return 'high'
      if (age >= 28 && emergencyProgress < 60) return 'medium'
      return 'low'

    case 'retirement':
      if (age >= 40) return 'high'
      if (age >= 30) return 'medium'
      return 'low'

    case 'income':
      if (emergencyProgress < 30 || trend === 'DOWN') return 'high'
      if (emergencyProgress < 60) return 'medium'
      return 'low'

    default:
      return 'medium'
  }
}
