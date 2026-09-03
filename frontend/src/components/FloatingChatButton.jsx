import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { fetchCoachReply, fetchNudge, fetchSchemeAnalysis } from '../services/api'
import { coachReply, formatSchemeReply, isSchemeQuestion, openingMessages } from '../lib/chatCoach'

const SUGGESTIONS = ['How is my score?', 'Which schemes suit me?', 'What should I do today?']

export default function FloatingChatButton() {
  const { data } = useApp()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const listRef = useRef(null)

  // Seed conversation from nudge / facts whenever dashboard loads
  useEffect(() => {
    if (!data) return
    let cancelled = false

    async function seed() {
      const local = openingMessages(data)
      try {
        const nudge = await fetchNudge(data)
        if (cancelled) return
        setMessages([
          {
            id: 'open-nudge',
            role: 'bot',
            title: nudge.title,
            text: nudge.message,
          },
          local[1],
        ].filter(Boolean))
      } catch {
        if (!cancelled) setMessages(local)
      }
    }

    seed()
    return () => {
      cancelled = true
    }
  }, [data])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, open])

  function sendText(text) {
    const trimmed = text.trim()
    if (!trimmed || busy) return

    const userMsg = { id: `u-${Date.now()}`, role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setBusy(true)

    async function reply() {
      try {
        const text = isSchemeQuestion(trimmed)
          ? formatSchemeReply(await fetchSchemeAnalysis(data))
          : await fetchCoachReply(trimmed, data)
        setMessages((prev) => [...prev, { id: `b-${Date.now()}`, role: 'bot', text }])
      } catch {
        setMessages((prev) => [
          ...prev,
          { id: `b-${Date.now()}`, role: 'bot', text: coachReply(trimmed, data) },
        ])
      } finally {
        setBusy(false)
      }
    }

    window.setTimeout(reply, 180)
  }

  function onSubmit(e) {
    e.preventDefault()
    sendText(input)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="flex h-[min(70vh,480px)] w-[min(92vw,360px)] flex-col overflow-hidden rounded-[1.35rem] border border-line bg-card shadow-[0_18px_50px_rgba(74,26,61,0.18)]"
          >
            <div className="flex items-center justify-between gap-2 border-b border-burgundy/20 bg-gradient-to-r from-burgundy to-burgundy-deep px-4 py-3.5 text-white">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/12">
                  <Sparkles className="h-4 w-4 text-gold-soft" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Resilience Coach</p>
                  <p className="text-[11px] text-white/70">Gemini coach · facts from your dashboard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-ivory px-3 py-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={[
                    'max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'ml-auto bg-burgundy text-white'
                      : 'mr-auto border border-line bg-white text-ink',
                  ].join(' ')}
                >
                  {msg.title && msg.role === 'bot' && (
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-burgundy">
                      {msg.title}
                    </p>
                  )}
                  {msg.text}
                </div>
              ))}
              {busy && (
                <p className="text-xs text-muted">Coach is typing…</p>
              )}
            </div>

            <div className="border-t border-line bg-white px-3 py-2">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => sendText(s)}
                    className="cursor-pointer rounded-full border border-line bg-ivory px-2.5 py-1 text-[11px] font-medium text-burgundy hover:bg-burgundy-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <form onSubmit={onSubmit} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about score, savings, or schemes…"
                  className="input min-h-10 flex-1 text-sm"
                  aria-label="Chat message"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-burgundy text-white disabled:opacity-50"
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
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
        aria-expanded={open}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-burgundy text-white shadow-[0_10px_28px_rgba(107,45,91,0.35)]"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-white bg-gold" />
        )}
      </motion.button>
    </div>
  )
}
