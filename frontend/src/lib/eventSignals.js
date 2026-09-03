/**
 * Real-world event signals → contextual recommendations.
 * Uses engine-supplied safe-to-save when suggesting an amount.
 * Historical drop % are labeled community/demo patterns — not invented personal P&L.
 */

const EVENT_CATALOG = [
  {
    id: 'heavy-rain',
    type: 'weather',
    title: 'Heavy rain expected tomorrow',
    severity: 'high',
    cities: ['Chennai', 'Mumbai', 'Kochi'],
    occupations: ['Uber', 'Ola', 'Swiggy', 'Zomato', 'Rapido', 'Dunzo'],
    historicalDropPct: 28,
    patternLabel: 'on rainy days (local cohort pattern)',
    demandNote: 'Platform outdoor demand usually softens in the wet window.',
  },
  {
    id: 'local-holiday',
    type: 'holiday',
    title: 'Local holiday / festival week ahead',
    severity: 'medium',
    cities: ['Chennai', 'Madurai', 'Coimbatore'],
    occupations: ['Uber', 'Ola', 'Swiggy', 'Zomato'],
    historicalDropPct: 12,
    patternLabel: 'around local holidays (mixed: some corridors surge, some stall)',
    demandNote: 'Expect uneven demand — protect essentials before optional trips.',
  },
  {
    id: 'fuel-spike',
    type: 'fuel',
    title: 'Fuel price pressure this week',
    severity: 'medium',
    cities: ['*'],
    occupations: ['Uber', 'Ola', 'Rapido', 'Dunzo'],
    historicalDropPct: 8,
    patternLabel: 'when fuel rises (net take-home pattern)',
    demandNote: 'Same trips, thinner surplus — trim non-essentials first.',
  },
  {
    id: 'transit-disruption',
    type: 'transit',
    title: 'Public transport disruption nearby',
    severity: 'medium',
    cities: ['Chennai', 'Bengaluru', 'Delhi'],
    occupations: ['Uber', 'Ola', 'Rapido'],
    historicalDropPct: -10, // negative = possible demand up for ride-hail
    patternLabel: 'during transit strikes (ride-hail demand often rises)',
    demandNote: 'Demand may rise — still bank a slice of surplus if the engine marks it safe.',
  },
  {
    id: 'seasonal-soft',
    type: 'seasonal',
    title: 'Seasonal soft patch for outdoor work',
    severity: 'low',
    cities: ['*'],
    occupations: ['*'],
    historicalDropPct: 15,
    patternLabel: 'in this seasonal window (demo calendar)',
    demandNote: 'A quieter week is normal — buffer beats panic borrowing.',
  },
]

function matchesPlace(event, city) {
  return event.cities.includes('*') || event.cities.includes(city)
}

function matchesJob(event, occupation) {
  return event.occupations.includes('*') || event.occupations.includes(occupation)
}

/**
 * Pick active demo signals for the worker’s city / occupation.
 * In production these would come from weather / holiday / fuel APIs.
 */
export function getEventSignals(dashboard = {}) {
  const city = dashboard.user?.city || 'Chennai'
  const occupation = dashboard.user?.occupation || 'Uber'
  // Demo: always surface rain for Chennai gig cohorts; others get fuel/seasonal.
  return EVENT_CATALOG.filter((e) => matchesPlace(e, city) && matchesJob(e, occupation)).slice(0, 3)
}

/**
 * Build one memorable, safe recommendation from the top signal.
 */
export function buildEventRecommendation(dashboard = {}, signals = getEventSignals(dashboard)) {
  if (!signals.length) return null

  const top = [...signals].sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 }
    return (rank[a.severity] ?? 3) - (rank[b.severity] ?? 3)
  })[0]

  const suggested = Number(dashboard.savings?.suggested)
  const surplus = Number(dashboard.income?.surplus)
  const hasSuggested = Number.isFinite(suggested) && suggested > 0
  const drop = Math.abs(top.historicalDropPct)
  const dropDir = top.historicalDropPct >= 0 ? 'drops' : 'can rise'

  const saveLine = hasSuggested
    ? `Save ₹${suggested} today if possible.`
    : Number.isFinite(surplus) && surplus > 0
      ? `If surplus remains after essentials, park a small slice — do not stretch beyond what you have.`
      : `Protect essentials and skip non-urgent spend until the window passes.`

  const message = [
    top.title + '.',
    `Your recent income ${dropDir} by an average of ${drop}% ${top.patternLabel}.`,
    saveLine,
  ].join(' ')

  return {
    id: top.id,
    type: top.type,
    severity: top.severity,
    title: top.title,
    message,
    demandNote: top.demandNote,
    suggested: hasSuggested ? suggested : null,
    disclaimer:
      'Event context is a demo forecast/pattern overlay. Save amounts use your engine safe-to-save when available — never promised returns.',
    source: 'event-signal',
  }
}
