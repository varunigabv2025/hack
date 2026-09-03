/**
 * Indian Tamil (ta-IN) neural TTS via Microsoft Edge Read Aloud.
 * Voice: ta-IN-PallaviNeural — Tamil Nadu Tamil, NOT Hindi.
 */

const TAMIL_VOICE = 'ta-IN-PallaviNeural'
const TAMIL_VOICE_FALLBACK = 'ta-IN-ValluvarNeural'

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)))
    stream.on('end', () => resolve(Buffer.concat(chunks)))
    stream.on('error', reject)
  })
}

async function synthesizeWithEdge(text, voiceName) {
  const mod = await import('msedge-tts')
  const MsEdgeTTS = mod.MsEdgeTTS || mod.default?.MsEdgeTTS
  const OUTPUT_FORMAT = mod.OUTPUT_FORMAT || mod.default?.OUTPUT_FORMAT
  if (!MsEdgeTTS || !OUTPUT_FORMAT) {
    throw new Error('msedge-tts export missing')
  }

  const tts = new MsEdgeTTS()
  await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3)
  const result = await Promise.resolve(tts.toStream(String(text).slice(0, 800)))
  const audioStream = result.audioStream || result
  const buf = await streamToBuffer(audioStream)
  if (!buf.length) throw new Error('Empty Tamil audio stream')
  return buf
}

/**
 * @param {string} text
 * @param {'ta'|'en'} lang
 */
async function synthesizeSpeech(text, lang = 'ta') {
  const raw = String(text || '').replace(/\s+/g, ' ').trim()
  if (!raw) throw new Error('Empty TTS text')

  // English still allowed for EN mode; Tamil path is neural ta-IN only.
  if (lang === 'en') {
    return synthesizeWithEdge(raw, 'en-IN-NeerjaNeural')
  }

  try {
    return await synthesizeWithEdge(raw, TAMIL_VOICE)
  } catch (err) {
    console.warn('[tamilTts] Pallavi failed, trying Valluvar:', err.message)
    return synthesizeWithEdge(raw, TAMIL_VOICE_FALLBACK)
  }
}

module.exports = {
  synthesizeSpeech,
  TAMIL_VOICE,
  TAMIL_VOICE_FALLBACK,
}
