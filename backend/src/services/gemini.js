/**
 * Google Gemini helper. Returns parsed JSON / text, or null if no key.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../.env') })

const FALLBACK_MODELS = [
  'gemini-3.6-flash',
  'gemini-3-flash',
  'gemini-flash-latest',
]

export function geminiApiKey() {
  return String(process.env.GEMINI_API_KEY || '')
    .trim()
    .replace(/^['"]|['"]$/g, '')
}

export function hasGeminiKey() {
  return Boolean(geminiApiKey())
}

export function geminiModel() {
  return process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash'
}

function modelList() {
  return [...new Set([geminiModel(), ...FALLBACK_MODELS].filter(Boolean))]
}

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || []
  return parts
    .map((p) => p.text)
    .filter(Boolean)
    .join('\n')
    .trim()
}

function parseJsonLoose(raw) {
  const text = String(raw || '').trim()
  const fenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '')
  try {
    return JSON.parse(fenced)
  } catch {
    const start = fenced.indexOf('{')
    const end = fenced.lastIndexOf('}')
    if (start >= 0 && end > start) return JSON.parse(fenced.slice(start, end + 1))
    throw new Error('Gemini did not return JSON')
  }
}

async function callOnce(model, { systemPrompt, userPrompt, temperature, json }) {
  const apiKey = geminiApiKey()
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`
  const payload = {
    systemInstruction: { parts: [{ text: systemPrompt }] },
    contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    generationConfig: {
      temperature,
      maxOutputTokens: 2048,
      ...(String(model).includes('2.5') || String(model).includes('3.')
        ? { thinkingConfig: { thinkingBudget: 0 } }
        : {}),
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = data?.error?.message || 'request failed'
    const err = new Error(`Gemini ${res.status} (${model}): ${String(msg).slice(0, 280)}`)
    err.status = res.status
    throw err
  }

  const text = extractText(data)
  if (!text) {
    const cand = data?.candidates?.[0]
    const reason =
      cand?.finishReason || data?.promptFeedback?.blockReason || 'empty-parts'
    console.warn('[gemini] empty body', {
      model,
      reason,
      partKeys: (cand?.content?.parts || []).map((p) => Object.keys(p)),
    })
    const err = new Error(`Gemini empty response (${model}): ${reason}`)
    err.status = 400
    throw err
  }
  return text
}

async function callGemini(opts) {
  if (!hasGeminiKey()) return null
  let lastErr
  for (const model of modelList()) {
    try {
      return await callOnce(model, opts)
    } catch (err) {
      lastErr = err
      console.warn('[gemini]', err.message)
      if (err.status && ![400, 404, 429, 503].includes(err.status)) break
    }
  }
  throw lastErr
}

export async function generateGeminiJson({ systemPrompt, userPrompt, temperature = 0.4 }) {
  let raw = ''
  try {
    raw = await callGemini({ systemPrompt, userPrompt, temperature, json: true })
  } catch (err) {
    console.warn('[gemini] JSON mode failed:', err.message)
    raw = await callGemini({ systemPrompt, userPrompt, temperature, json: false })
  }
  if (raw == null) return null
  try {
    return parseJsonLoose(raw)
  } catch {
    console.warn('[gemini] wrapping prose as JSON:', String(raw).slice(0, 160))
    return { title: 'AI Nudge', message: String(raw).replace(/\s+/g, ' ').trim().slice(0, 280) }
  }
}

export async function generateGeminiText({ systemPrompt, userPrompt, temperature = 0.4 }) {
  const raw = await callGemini({ systemPrompt, userPrompt, temperature, json: false })
  if (raw == null) return null
  return String(raw).trim()
}

