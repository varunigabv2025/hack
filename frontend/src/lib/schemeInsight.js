/** Local AI-style scheme insight (offline-safe fallback). */

export function generateFallbackSchemeInsight(ctx, ranked) {
  const top = ranked.filter((s) => s.priority === 'High').slice(0, 3)
  const focus = top.length ? top : ranked.slice(0, 3)
  const names = focus.map((s) => s.name).join(', ')

  const actionPlan = focus.slice(0, 3).map((s, i) => ({
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
              ? 'Check PM-JAY eligibility on the official portal with your household documents.'
              : s.id === 'state-gig'
                ? `Track ${ctx.state} gig-worker welfare registration announcements.`
                : s.id === 'mudra'
                  ? 'Only explore MUDRA if cashflow stays stable — avoid stacking app loans.'
                  : 'Review the official portal and keep Aadhaar, bank, and mobile ready.',
  }))

  const narrative = [
    `${ctx.name}, as a ${ctx.occupation} worker in ${ctx.state}, your resilience score is ${ctx.score}/100 with a ${ctx.streak}-day savings streak.`,
    `AI analysis recommends prioritising: ${names}.`,
    ctx.buffer < 60
      ? 'Because your emergency buffer is still growing, finish registration + insurance before taking credit.'
      : 'Your buffer looks healthier — you can layer pension and formalisation after insurance.',
  ].join(' ')

  return {
    title: 'AI Scheme Recommendation',
    narrative,
    priorityOrder: focus.map((s) => s.id),
    actionPlan,
    disclaimer: 'Advisory only. Verify eligibility on official government portals before applying.',
    source: 'fallback',
  }
}
