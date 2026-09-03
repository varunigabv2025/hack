/**
 * Gemini chat coach — answers from supplied dashboard facts only.
 */
import { generateFallbackNudge, extractNudgeFacts } from './nudgeEngine.js'
import { generateGeminiText, hasGeminiKey } from './gemini.js'

const SYSTEM_PROMPT = `You are the Resilience Engine coach for Indian gig workers.
Answer the user's question using ONLY the FACTS JSON.
STRICT RULES:
1. Never invent, estimate, or recalculate financial numbers.
2. Never claim eligibility for a scheme. You may name ranked schemes already in the facts.
3. Keep the reply under 70 words, warm and practical.
4. If the facts do not contain the answer, say so and suggest Scheme Studio or What-If Lab.`

export async function generateAiChatReply({ question, dashboard = {}, facts } = {}) {
  const resolvedFacts = facts && Object.keys(facts).length ? facts : extractNudgeFacts(dashboard)
  const fallback = generateFallbackNudge(resolvedFacts).message

  if (!hasGeminiKey()) {
    return { reply: fallback, source: 'fallback' }
  }

  try {
    const reply = await generateGeminiText({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: JSON.stringify({
        question: String(question || '').slice(0, 500),
        facts: resolvedFacts,
        user: dashboard.user
          ? { name: dashboard.user.name, occupation: dashboard.user.occupation, state: dashboard.user.state }
          : undefined,
        savings: dashboard.savings
          ? {
              suggested: dashboard.savings.suggested,
              streak: dashboard.savings.streak,
              emergencyProgress: dashboard.savings.emergencyProgress,
              balance: dashboard.savings.balance,
            }
          : undefined,
        income: dashboard.income
          ? {
              today: dashboard.income.today,
              baseline: dashboard.income.baseline,
              surplus: dashboard.income.surplus,
              trend: dashboard.income.trend,
            }
          : undefined,
        resilience: dashboard.resilience
          ? { score: dashboard.resilience.score, change: dashboard.resilience.change }
          : undefined,
      }),
      temperature: 0.35,
    })

    if (!reply) return { reply: fallback, source: 'fallback' }
    return { reply, source: 'ai' }
  } catch (err) {
    console.warn('[aiChat] Gemini failed, using fallback:', err.message)
    return { reply: fallback, source: 'fallback' }
  }
}

