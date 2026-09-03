/**
 * Member 4 — Gemini nudge (facts only). Falls back if key missing / API fails.
 */
const { generateFallbackNudge } = require('./nudgeEngine')
const { generateGeminiJson, hasGeminiKey } = require('./gemini')

const SYSTEM_PROMPT = `You are the Resilience Engine coach for Indian gig workers.
You rewrite backend FACTS into one short, encouraging message.

STRICT RULES:
1. Use ONLY the numbers and facts provided in the user JSON.
2. NEVER invent, estimate, recalculate, or invent new financial numbers.
3. NEVER mention loans, schemes, or advice not present in the facts.
4. Keep the message under 45 words, plain language, warm and practical.
5. Return valid JSON only: { "title": "...", "message": "..." }
6. Title max 8 words. Message must reference at least one supplied fact.`

function factsToPrompt(facts) {
  return `Explain these backend facts only:\n${JSON.stringify(facts, null, 2)}`
}

/**
 * @param {object} facts
 * @returns {Promise<{ title: string, message: string, source: 'ai'|'fallback', triggered: boolean }>}
 */
async function generateAiNudge(facts = {}) {
  if (!hasGeminiKey()) {
    return generateFallbackNudge(facts)
  }

  try {
    const parsed = await generateGeminiJson({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: factsToPrompt(facts),
      temperature: 0.4,
    })
    const title = String(parsed?.title || '').trim()
    const message = String(parsed?.message || '').trim()

    if (!title || !message) {
      return generateFallbackNudge(facts)
    }

    return {
      triggered: true,
      title,
      message,
      source: 'ai',
    }
  } catch (err) {
    console.warn('[aiNudge] Gemini failed, using fallback:', err.message)
    return generateFallbackNudge(facts)
  }
}

module.exports = { generateAiNudge }
