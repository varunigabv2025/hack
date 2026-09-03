const express = require('express')
const { analyseSchemesWithAi } = require('../services/schemeAnalyser')
const { hasGeminiKey } = require('../services/gemini')

const router = express.Router()

/**
 * POST /schemes/analyse
 * Body: dashboard snapshot or profile facts.
 * Returns ranked schemes + AI/fallback recommendation plan.
 */
router.post('/analyse', async (req, res, next) => {
  try {
    const result = await analyseSchemesWithAi(req.body || {})
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    gemini: hasGeminiKey(),
  })
})

module.exports = router
