import { useCallback, useState } from 'react'
import { Mic, Volume2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import { canListen, canSpeak, listenOnce, parseAmountFromSpeech, speakText, stopSpeaking } from '../lib/voice'
import { buildSpokenNudge } from '../lib/i18n'

/**
 * Premium, compact vernacular controls for the header.
 */
export default function VernacularBar({ onVoiceAmount }) {
  const { data, updateProfile } = useApp()
  const { lang, t } = useLang()
  const lowLiteracy = Boolean(data?.settings?.lowLiteracy)
  const [listening, setListening] = useState(false)

  const setLang = useCallback(
    (next) => {
      updateProfile({ user: { language: next } })
    },
    [updateProfile],
  )

  const toggleLiteracy = useCallback(() => {
    updateProfile({ settings: { lowLiteracy: !lowLiteracy } })
  }, [lowLiteracy, updateProfile])

  const speakNudge = useCallback(() => {
    const line = buildSpokenNudge(data || {}, lang)
    speakText(line, { lang })
  }, [data, lang])

  const startVoice = useCallback(async () => {
    if (!canListen() || !onVoiceAmount) return
    setListening(true)
    stopSpeaking()
    const transcript = await listenOnce({ lang })
    setListening(false)
    const amount = parseAmountFromSpeech(transcript || '')
    if (amount) onVoiceAmount(amount, transcript)
  }, [lang, onVoiceAmount])

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <div className="inline-flex rounded-full border border-line/80 bg-white/90 p-0.5 shadow-sm">
        <button
          type="button"
          onClick={() => setLang('en')}
          className={[
            'cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition',
            lang === 'en' ? 'bg-burgundy text-white' : 'text-muted hover:text-burgundy',
          ].join(' ')}
          aria-pressed={lang === 'en'}
        >
          {t('english')}
        </button>
        <button
          type="button"
          onClick={() => setLang('ta')}
          className={[
            'cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-bold transition',
            lang === 'ta' ? 'bg-burgundy text-white' : 'text-muted hover:text-burgundy',
          ].join(' ')}
          aria-pressed={lang === 'ta'}
        >
          {t('tamil')}
        </button>
      </div>

      <button
        type="button"
        onClick={toggleLiteracy}
        className={[
          'cursor-pointer rounded-full border px-2.5 py-1 text-[11px] font-semibold transition',
          lowLiteracy
            ? 'border-burgundy bg-burgundy-soft text-burgundy'
            : 'border-line/80 bg-white/90 text-muted hover:text-burgundy',
        ].join(' ')}
        aria-pressed={lowLiteracy}
      >
        {t('lowLiteracy')}
      </button>

      {canSpeak() && (
        <button
          type="button"
          onClick={speakNudge}
          className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-line/80 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-burgundy shadow-sm transition hover:border-burgundy/30"
          aria-label={t('speak')}
          title={t('speak')}
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t('speak')}</span>
        </button>
      )}

      {onVoiceAmount && canListen() && (
        <button
          type="button"
          onClick={startVoice}
          disabled={listening}
          className={[
            'inline-flex cursor-pointer items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-sm transition',
            listening
              ? 'border-rose bg-rose-soft text-rose'
              : 'border-line/80 bg-white/90 text-burgundy hover:border-burgundy/30',
          ].join(' ')}
        >
          <Mic className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{listening ? t('listening') : t('voiceLog')}</span>
        </button>
      )}
    </div>
  )
}
