import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Mic, Send, Sparkles, Volume2, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import { fetchCoachReply, fetchNudge, fetchSchemeAnalysis } from '../services/api'
import { coachReply, formatSchemeReply, isSchemeQuestion, openingMessages } from '../lib/chatCoach'
import {
  difficultyOpening,
  difficultySuggestions,
  interpretDifficulty,
} from '../lib/difficultyCoach'
import { FOCUS_CATALOG } from '../lib/personalization'
import { canListen, canSpeak, listenOnce, speakText, stopSpeaking } from '../lib/voice'

function looksLikeDifficulty(text) {
  return /rain|flood|loan|debt|emi|medical|hospital|family|school|fuel|petrol|no work|suspend|hard|difficult|stress|easy mode|low literacy|மழை|கடன்|மருத்துவ|குடும்ப|வேலை|எளிய|தமிழ்|difficulty|crisis|help me/i.test(
    String(text || ''),
  )
}

export default function FloatingChatButton() {
  const { data, updateProfile } = useApp()
  const { lang, t } = useLang()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(true)
  const listRef = useRef(null)

  useEffect(() => {
    if (!data) return
    let cancelled = false

    async function seed() {
      const intro = difficultyOpening(data, lang)
      const local = openingMessages(data)
      try {
        const nudge = await fetchNudge(data)
        if (cancelled) return
        setMessages([
          {
            id: 'open-nudge',
            role: 'bot',
            title: nudge.title || intro.title,
            text: nudge.message,
          },
          {
            id: 'open-diff',
            role: 'bot',
            title: intro.title,
            text: intro.text,
          },
        ])
      } catch {
        if (!cancelled) {
          setMessages([
            local[0],
            { id: 'open-diff', role: 'bot', title: intro.title, text: intro.text },
          ].filter(Boolean))
        }
      }
    }

    seed()
    return () => {
      cancelled = true
    }
  }, [data, lang])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  function pushBot(text, title) {
    setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'bot', text, title }])
    if (autoSpeak && canSpeak()) speakText(text, { lang })
  }

  function sendText(text) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: trimmed }])
    setInput('')
    setBusy(true)

    async function reply() {
      try {
        if (looksLikeDifficulty(trimmed)) {
          const result = interpretDifficulty(trimmed, data, lang)
          if (result.applied?.length && result.patches && (result.patches.user || result.patches.settings)) {
            updateProfile(result.patches)
          }
          pushBot(
            result.reply,
            result.applied?.length ? t('accountCustomized') : undefined,
          )
          return
        }

        const textOut = isSchemeQuestion(trimmed)
          ? formatSchemeReply(await fetchSchemeAnalysis(data))
          : await fetchCoachReply(trimmed, data)
        pushBot(textOut)
      } catch {
        if (looksLikeDifficulty(trimmed)) {
          const result = interpretDifficulty(trimmed, data, lang)
          if (result.applied?.length && result.patches) updateProfile(result.patches)
          pushBot(result.reply)
        } else {
          pushBot(coachReply(trimmed, data))
        }
      } finally {
        setBusy(false)
      }
    }

    window.setTimeout(reply, 160)
  }

  function onSubmit(e) {
    e.preventDefault()
    sendText(input)
  }

  async function onVoice() {
    if (!canListen() || busy) return
    setListening(true)
    stopSpeaking()
    const transcript = await listenOnce({ lang })
    setListening(false)
    if (transcript?.trim()) sendText(transcript.trim())
  }

  const suggestions = difficultySuggestions(lang)

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex h-[min(72vh,520px)] w-[min(94vw,380px)] flex-col overflow-hidden rounded-[1.4rem] border border-line/80 bg-card shadow-[0_20px_55px_rgba(74,26,61,0.2)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-burgundy/20 bg-burgundy px-4 py-3.5 text-white">
              <div className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12">
                  <Sparkles className="h-4 w-4 text-gold-soft" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">
                    {t('resilienceCoach')}
                  </p>
                  <p className="truncate text-[11px] text-white/70">
                    {t('coachSubtitle')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {canSpeak() && (
                  <button
                    type="button"
                    onClick={() => setAutoSpeak((v) => !v)}
                    className={[
                      'tap-target cursor-pointer rounded-lg p-1.5',
                      autoSpeak ? 'bg-white/20 text-gold-soft' : 'text-white/70 hover:bg-white/10',
                    ].join(' ')}
                    aria-label={t('toggleSpokenReplies')}
                    title={autoSpeak ? t('voiceRepliesOn') : t('voiceRepliesOff')}
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="tap-target cursor-pointer rounded-lg p-1.5 text-white/80 hover:bg-white/10"
                  aria-label={t('closeAiChat')}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {(data?.settings?.focusAreas || []).length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-b border-line/60 bg-ivory/90 px-3 py-2">
                {(data.settings.focusAreas || []).slice(0, 4).map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-burgundy-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-burgundy"
                  >
                    {FOCUS_CATALOG[f]?.short?.[lang] || f.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}

            <div ref={listRef} className="flex-1 space-y-2.5 overflow-y-auto bg-ivory px-3 py-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={[
                    'max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'ml-auto bg-burgundy text-white'
                      : 'mr-auto border border-line bg-white text-ink',
                  ].join(' ')}
                >
                  {msg.title && msg.role === 'bot' && (
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-burgundy">
                      {msg.title}
                    </p>
                  )}
                  {msg.text}
                </div>
              ))}
              {busy && <p className="text-xs text-muted">{t('coachTyping')}</p>}
            </div>

            <div className="border-t border-line bg-white px-3 py-2.5">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendText(s)}
                    className="tap-target cursor-pointer rounded-full border border-line bg-ivory px-2.5 py-1.5 text-[11px] font-medium text-burgundy hover:bg-burgundy-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                {canListen() && (
                  <button
                    type="button"
                    onClick={onVoice}
                    disabled={busy || listening}
                    className={[
                      'tap-target flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl',
                      listening ? 'bg-rose-soft text-rose' : 'bg-burgundy-soft text-burgundy',
                    ].join(' ')}
                    aria-label={t('voiceLog')}
                  >
                    <Mic className="h-4 w-4" />
                  </button>
                )}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chatPlaceholder')}
                  className="input min-h-11 flex-1 text-sm"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="tap-target flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-burgundy text-white disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        aria-label={open ? t('closeAiChat') : t('openAiChat')}
        aria-expanded={open}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-burgundy text-white shadow-md"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-gold" />
        )}
      </motion.button>
    </div>
  )
}
