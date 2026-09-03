const express = require('express')
const { generateAiNudge } = require('../services/aiNudge')
const { generateAiChatReply } = require('../services/aiChat')
const { hasGeminiKey, geminiModel } = require('../services/gemini')
const { extractNudgeFacts, generateFallbackNudge } = require('../services/nudgeEngine')

const router = express.Router()

/** POST /nudge/chat — Gemini coach reply from dashboard facts */
router.post('/chat', async (req, res, next) => {
  try {
    const body = req.body || {}
    const question = body.question || body.message || ''
    const dashboard = body.dashboard || body
    const result = await generateAiChatReply({
      question,
      dashboard,
      facts: body.facts,
    })
    res.json(result)
  } catch (err) {
    next(err)
  }
})

/**
 * POST /nudge
 * Body: either raw facts or a full dashboard snapshot.
 * Member 1 can call this after pipeline calculation.
 */
router.post('/', async (req, res, next) => {
  try {
    const body = req.body || {}
    const facts =
      body.facts ||
      (body.income || body.income_profile || body.resilience || body.resilience_score
        ? extractNudgeFacts(body)
        : body)

    const forceFallback = body.forceFallback === true || req.query.fallback === '1'
    const nudge = forceFallback ? generateFallbackNudge(facts) : await generateAiNudge(facts)

    res.json({
      nudge: {
        triggered: nudge.triggered,
        title: nudge.title,
        message: nudge.message,
      },
      meta: {
        source: nudge.source,
        facts,
      },
    })
  } catch (err) {
    next(err)
  }
})

/** GET /nudge/health — quick check for demo */
router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    gemini: hasGeminiKey(),
    model: geminiModel(),
  })
})

module.exports = router
