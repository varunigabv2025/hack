/**
 * Anonymized community resilience aggregates (demo sample).
 * Never shows individual worker data.
 */

const COMMUNITIES = {
  'Chennai|Uber': {
    city: 'Chennai',
    cohort: 'Delivery / ride-hailing workers',
    sampleSize: 'n≈1,200 (anonymized demo)',
    volatility: { label: 'Elevated', weekChangePct: -24, cause: 'last week’s rain' },
    weatherAlert: {
      active: true,
      title: 'Rain disruption watch',
      detail: 'Outdoor trip density usually falls on wet evenings in this corridor.',
    },
    supportGroups: [
      { name: 'Chennai Gig Workers Collective', focus: 'Peer advice & document camps' },
      { name: 'North Chennai Riders Helpdesk', focus: 'Emergency fuel & repair pooling' },
    ],
    emergencyResources: [
      { name: 'Night shelter directory (city)', type: 'Shelter' },
      { name: '24×7 worker helpline desk', type: 'Helpline' },
    ],
    savingsCircles: [
      { name: 'Anna Nagar 5-day buffer circle', members: '48 anonymized', focus: 'Rainy-week buffer' },
    ],
    schemeCompletion: [
      { scheme: 'e-Shram', rate: 62 },
      { scheme: 'PMSBY', rate: 41 },
      { scheme: 'PM-SYM', rate: 28 },
    ],
    preparation: 'build a 5-day buffer',
  },
  'Chennai|Swiggy': {
    city: 'Chennai',
    cohort: 'Food delivery workers',
    sampleSize: 'n≈900 (anonymized demo)',
    volatility: { label: 'Elevated', weekChangePct: -18, cause: 'festival lane closures' },
    weatherAlert: {
      active: false,
      title: 'Clear evening window',
      detail: 'Demand usually recovers after 7pm when rain eases.',
    },
    supportGroups: [
      { name: 'Delivery Partners Mutual Aid', focus: 'Medical & bike repair floats' },
    ],
    emergencyResources: [
      { name: 'Partner first-aid clinic list', type: 'Health' },
    ],
    savingsCircles: [
      { name: 'Weekend surplus circle', members: '36 anonymized', focus: 'Festival week saves' },
    ],
    schemeCompletion: [
      { scheme: 'e-Shram', rate: 55 },
      { scheme: 'PMJJBY', rate: 33 },
    ],
    preparation: 'keep two soft evenings for essentials only',
  },
  default: {
    city: 'Your city',
    cohort: 'Gig workers (local aggregate)',
    sampleSize: 'n≈600 (anonymized demo)',
    volatility: { label: 'Moderate', weekChangePct: -9, cause: 'soft demand week' },
    weatherAlert: {
      active: false,
      title: 'No major disruption flagged',
      detail: 'Community income is within a normal weekly band.',
    },
    supportGroups: [
      { name: 'Local worker support circle', focus: 'Scheme help & peer tips' },
    ],
    emergencyResources: [
      { name: 'District labour helpline', type: 'Helpline' },
    ],
    savingsCircles: [
      { name: 'Neighborhood buffer circle', members: '24 anonymized', focus: 'Shared emergency float' },
    ],
    schemeCompletion: [
      { scheme: 'e-Shram', rate: 48 },
      { scheme: 'PMSBY', rate: 30 },
    ],
    preparation: 'hold one day of essentials in your pocket',
  },
}

function keyFor(dashboard) {
  const city = dashboard?.user?.city || 'Chennai'
  const occ = dashboard?.user?.occupation || 'Uber'
  return `${city}|${occ}`
}

export function getCommunityResilience(dashboard = {}) {
  const key = keyFor(dashboard)
  const base = COMMUNITIES[key] || {
    ...COMMUNITIES.default,
    city: dashboard?.user?.city || COMMUNITIES.default.city,
    cohort: `${dashboard?.user?.occupation || 'Gig'} workers (local aggregate)`,
  }

  const drop = Math.abs(base.volatility.weekChangePct)
  const headline =
    base.volatility.weekChangePct < 0
      ? `${base.cohort} in ${base.city} experienced a ${drop}% income drop during ${base.volatility.cause}.`
      : `${base.cohort} in ${base.city} saw income rise ${drop}% versus the prior week.`

  return {
    ...base,
    headline,
    recommendedPreparation: `Recommended preparation: ${base.preparation}.`,
    privacyNote:
      'Aggregated and anonymized only. No individual earnings, names, or GPS trails are shown.',
  }
}
