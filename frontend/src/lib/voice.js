/**
 * Browser TTS + speech recognition helpers.
 * Tamil uses backend /voice/tts (real Indian Tamil accent MP3).
 * English uses speechSynthesis with en-IN when available.
 */

let activeAudio = null

export function canSpeak() {
  return typeof window !== 'undefined' && ('speechSynthesis' in window || typeof Audio !== 'undefined')
}

export function canListen() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)
  )
}

function pickTamilBrowserVoice(voices) {
  // Strict: only Tamil locale voices — never Hindi (hi-IN) fallback.
  const scored = voices
    .map((v) => {
      const label = `${v.lang} ${v.name}`
      if (/^hi(-|_)/i.test(v.lang) || /hindi|हिन्दी/i.test(label)) return { v, score: -100 }
      let score = 0
      if (/^ta(-|_)IN/i.test(v.lang)) score += 80
      else if (/^ta(-|_)/i.test(v.lang)) score += 60
      else return { v, score: 0 }
      if (/tamil|தமிழ்|valluvar|pallavi/i.test(label)) score += 30
      if (/neural|natural|google|microsoft/i.test(label)) score += 10
      return { v, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored[0]?.v || null
}

function pickEnglishVoice(voices) {
  return (
    voices.find((v) => /en(-|_)IN/i.test(v.lang)) ||
    voices.find((v) => /en(-|_)GB/i.test(v.lang)) ||
    voices.find((v) => /^en/i.test(v.lang)) ||
    null
  )
}

function speakBrowser(text, lang) {
  if (!('speechSynthesis' in window)) return false
  window.speechSynthesis.cancel()

  const speakNow = () => {
    const voices = window.speechSynthesis.getVoices() || []
    if (lang === 'ta') {
      const match = pickTamilBrowserVoice(voices)
      if (!match) {
        console.warn('[voice] No ta-IN browser voice; refusing Hindi fallback')
        return
      }
      const utter = new SpeechSynthesisUtterance(String(text))
      utter.voice = match
      utter.lang = match.lang || 'ta-IN'
      utter.rate = 0.92
      utter.pitch = 1
      window.speechSynthesis.speak(utter)
      return
    }
    const utter = new SpeechSynthesisUtterance(String(text))
    utter.lang = 'en-IN'
    utter.rate = 1
    const match = pickEnglishVoice(voices)
    if (match) {
      utter.voice = match
      utter.lang = match.lang || 'en-IN'
    }
    window.speechSynthesis.speak(utter)
  }

  const voices = window.speechSynthesis.getVoices()
  if (!voices?.length) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null
      speakNow()
    }
    setTimeout(speakNow, 280)
  } else {
    speakNow()
  }
  return true
}

async function speakTamilNeural(text) {
  const res = await fetch('/voice/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: String(text).slice(0, 800), lang: 'ta' }),
  })
  if (!res.ok) throw new Error(`Tamil TTS ${res.status}`)
  const blob = await res.blob()
  const url = URL.createObjectURL(blob)
  stopSpeaking()
  const audio = new Audio(url)
  activeAudio = audio
  audio.onended = () => {
    URL.revokeObjectURL(url)
    if (activeAudio === audio) activeAudio = null
  }
  audio.onerror = () => {
    URL.revokeObjectURL(url)
    if (activeAudio === audio) activeAudio = null
  }
  await audio.play()
  return true
}

/**
 * Speak text. Tamil prefers neural Indian Tamil accent via /voice/tts.
 */
export function speakText(text, { lang = 'en' } = {}) {
  if (!text || typeof window === 'undefined') return false
  stopSpeaking()

  if (lang === 'ta') {
    speakTamilNeural(text).catch(() => {
      // Fallback: OS Tamil voice if installed (still better than English accent)
      speakBrowser(text, 'ta')
    })
    return true
  }

  return speakBrowser(text, 'en')
}

export function stopSpeaking() {
  if (typeof window === 'undefined') return
  if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  if (activeAudio) {
    try {
      activeAudio.pause()
      activeAudio.src = ''
    } catch {
      /* ignore */
    }
    activeAudio = null
  }
}

/**
 * Listen once; resolve with transcript or null.
 */
export function listenOnce({ lang = 'en', timeoutMs = 8000 } = {}) {
  return new Promise((resolve) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) {
      resolve(null)
      return
    }
    const rec = new SR()
    rec.lang = lang === 'ta' ? 'ta-IN' : 'en-IN'
    rec.interimResults = false
    rec.maxAlternatives = 1
    let done = false
    const finish = (value) => {
      if (done) return
      done = true
      try {
        rec.stop()
      } catch {
        /* ignore */
      }
      resolve(value)
    }
    const timer = setTimeout(() => finish(null), timeoutMs)
    rec.onresult = (event) => {
      clearTimeout(timer)
      const text = event.results?.[0]?.[0]?.transcript || ''
      finish(text)
    }
    rec.onerror = () => {
      clearTimeout(timer)
      finish(null)
    }
    rec.onend = () => {
      clearTimeout(timer)
      if (!done) finish(null)
    }
    try {
      rec.start()
    } catch {
      clearTimeout(timer)
      finish(null)
    }
  })
}

/** Pull first integer amount from a voice transcript. */
export function parseAmountFromSpeech(transcript = '') {
  const cleaned = String(transcript).replace(/,/g, '')
  const digit = cleaned.match(/(\d{2,6})/)
  if (digit) return Number(digit[1])
  const map = {
    hundred: 100,
    dual: 200,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    நூறு: 100,
    இருநூறு: 200,
    முந்நூறு: 300,
    நானூறு: 400,
    ஐந்நூறு: 500,
    ஆயிரம்: 1000,
    'ஆயிரம் நூறு': 1100,
  }
  const lower = cleaned.toLowerCase()
  for (const [word, val] of Object.entries(map)) {
    if (lower.includes(word)) return val
  }
  return null
}
