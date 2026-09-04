import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw, ListOrdered, Mic } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import TransactionTable from '../components/TransactionTable'
import { canListen, listenOnce, parseAmountFromSpeech, stopSpeaking } from '../lib/voice'

const sources = ['Uber', 'Swiggy', 'Ola', 'Zomato', 'Cash']

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function Transactions() {
  const { data, status, refresh, submitTransaction, reset, live } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const [amount, setAmount] = useState('1100')
  const [source, setSource] = useState('Uber')
  const [date, setDate] = useState(todayIso)
  const [busy, setBusy] = useState(false)
  const [listening, setListening] = useState(false)
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!Number(amount)) {
      setFormError(t('errorEnterAmount'))
      return
    }
    setBusy(true)
    setFormError('')
    try {
      const payload = await submitTransaction({ amount: Number(amount), source, date })
      setResult(payload)
    } catch {
      setFormError(t('errorSendTransaction'))
    } finally {
      setBusy(false)
    }
  }

  async function onVoiceIncome() {
    if (!canListen()) {
      setFormError(t('errorVoiceUnavailable'))
      return
    }
    setListening(true)
    setFormError('')
    stopSpeaking()
    const transcript = await listenOnce({ lang: data?.user?.language === 'ta' ? 'ta' : 'en' })
    setListening(false)
    const parsed = parseAmountFromSpeech(transcript || '')
    if (!parsed) {
      setFormError(t('errorHearAmount'))
      return
    }
    setAmount(String(parsed))
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message={t('errorLoadTransactions')} onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
          <h2 className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy">
            <ListOrdered className="h-6 w-6 text-burgundy" />
            {t('logIncome')}
          </h2>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={onSubmit} className="card space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-ink">{t('logIncome')}</h3>
                  <p className="mt-1 text-xs text-muted">
                    {t('typeOrSpeakAmount')}
                  </p>
                </div>
                {canListen() && (
                  <button
                    type="button"
                    onClick={onVoiceIncome}
                    disabled={listening}
                    className={[
                      'tap-target inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold',
                      listening ? 'bg-rose-soft text-rose' : 'bg-burgundy text-white',
                    ].join(' ')}
                  >
                    <Mic className="h-3.5 w-3.5" />
                    {listening ? t('listening') : t('voiceLog')}
                  </button>
                )}
              </div>

              <label className="block" htmlFor="amount">
                <span className="mb-2 block text-sm text-muted">{t('amount')}</span>
                <input
                  id="amount"
                  className="input text-2xl font-bold"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                />
              </label>

              <div>
                <p className="mb-2 text-sm text-muted">{t('source')}</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setSource(item)}
                      className={[
                        'tap-target min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition',
                        source === item
                          ? 'border-burgundy bg-burgundy text-white'
                          : 'border-line bg-card text-ink hover:border-burgundy/30',
                      ].join(' ')}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <label className="block" htmlFor="date">
                <span className="mb-2 block text-sm text-muted">{t('date')}</span>
                <input id="date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>

              {formError && <p className="text-sm font-semibold text-rose">{formError}</p>}

              <button
                type="submit"
                disabled={busy}
                className="btn-primary tap-target flex min-h-12 w-full items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {busy ? '…' : t('submit')}
              </button>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl bg-gold-soft px-4 py-3 text-sm font-medium text-ink"
                  >
                    {t('score')} {result.resilience?.previousScore} → {result.resilience?.score} ·{' '}
                    {formatMoney(result.savings?.suggested)}
                  </motion.div>
                )}
              </AnimatePresence>

              {!live && (
                <button
                  type="button"
                  onClick={reset}
                  className="btn-secondary tap-target flex min-h-11 w-full items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> {t('resetDemo')}
                </button>
              )}
            </form>

            <TransactionTable transactions={data.transactions} />
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
