const express = require('express')
const { synthesizeSpeech } = require('../services/tamilTts')

const router = express.Router()

/**
 * POST /voice/tts
 * Body: { text, lang?: 'ta'|'en' }
 * Returns audio/mpeg — Tamil uses Google ta voice (Indian Tamil accent).
 */
router.post('/tts', async (req, res, next) => {
  try {
    const text = String(req.body?.text || '').trim().slice(0, 800)
    const lang = req.body?.lang === 'en' ? 'en' : 'ta'
    if (!text) {
      return res.status(400).json({ error: 'text required' })
    }

    const audio = await synthesizeSpeech(text, lang)
    res.set({
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-store',
      'Content-Length': audio.length,
    })
    res.send(audio)
  } catch (err) {
    console.warn('[voice/tts]', err.message)
    next(err)
  }
})

router.get('/health', (_req, res) => {
  res.json({
    ok: true,
    tamilVoice: 'ta-IN-PallaviNeural',
    fallbackVoice: 'ta-IN-ValluvarNeural',
    accent: 'Indian Tamil (Tamil Nadu) — not Hindi',
  })
})

module.exports = router
