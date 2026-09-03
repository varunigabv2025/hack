import { Router } from 'express'
import { demoProfiles, getDemoProfile } from '../data/demoProfiles.js'
import { generateFallbackNudge } from '../services/nudgeEngine.js'

const router = Router()

/** GET /demo/profiles — list deterministic workers */
router.get('/profiles', (_req, res) => {
  res.json({
    profiles: demoProfiles.map(({ id, name, occupation, state, story, expectedAfterLast }) => ({
      id,
      name,
      occupation,
      state,
      story,
      expectedAfterLast,
    })),
  })
})

/** GET /demo/profiles/:id — full history for seeding Member 1 DB */
router.get('/profiles/:id', (req, res) => {
  const profile = getDemoProfile(req.params.id)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  res.json(profile)
})

/**
 * GET /demo/preview/:id
 * Shows what fallback nudge judges will hear for that worker's expected state.
 */
router.get('/preview/:id', (req, res) => {
  const profile = getDemoProfile(req.params.id)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  const e = profile.expectedAfterLast
  const nudge = generateFallbackNudge({
    trend: e.trend,
    streak: e.streak,
    score: e.score,
    change: e.change,
    suggestedAmount: e.suggested,
    todayIncome: e.today,
    baseline: e.baseline,
  })
  res.json({ profile: { id: profile.id, name: profile.name, story: profile.story }, expected: e, nudge })
})

export default router

