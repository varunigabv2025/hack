import { test } from 'node:test'
import assert from 'node:assert/strict'
import { generateFallbackNudge } from './nudgeEngine.js'

test('uptrend + streak + score change produces encouraging message with facts only', () => {
  const nudge = generateFallbackNudge({
    trend: 'UP',
    streak: 4,
    score: 72,
    change: 5,
    suggestedAmount: 120,
  })
  assert.equal(nudge.triggered, true)
  assert.equal(nudge.source, 'fallback')
  assert.match(nudge.message, /4-day/)
  assert.match(nudge.message, /5 point/)
  assert.match(nudge.message, /120/)
  assert.doesNotMatch(nudge.message, /₹999|invented/i)
})

test('downtrend without streak stays protective', () => {
  const nudge = generateFallbackNudge({
    trend: 'DOWN',
    streak: 0,
    score: 58,
    change: -5,
    suggestedAmount: 0,
  })
  assert.match(nudge.message, /softer|Protect essentials/i)
})

test('empty facts still returns a safe prompt to log income', () => {
  const nudge = generateFallbackNudge({})
  assert.equal(nudge.triggered, true)
  assert.match(nudge.message, /Log today's income|income/i)
})

