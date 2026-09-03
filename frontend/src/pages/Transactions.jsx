import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, RefreshCw, ListOrdered } from 'lucide-react'
import { useMoney } from '../hooks/useMoney'
import { useApp } from '../context/AppContext'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import TransactionTable from '../components/TransactionTable'

const sources = ['Uber', 'Swiggy', 'Ola', 'Zomato', 'Cash']

function todayIso() { return new Date().toISOString().slice(0, 10) }

export default function Transactions() {
  const { data, status, refresh, submitTransaction, reset, live } = useApp()
  const { formatMoney } = useMoney()
  const [amount, setAmount] = useState('1100')
  const [source, setSource] = useState('Uber')
  const [date, setDate] = useState(todayIso)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!Number(amount)) { setFormError('Enter an amount'); return }
    setBusy(true)
    setFormError('')
    try {
      const payload = await submitTransaction({ amount: Number(amount), source, date })
      setResult(payload)
    } catch { setFormError('Could not send transaction') }
    finally { setBusy(false) }
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message="Could not load transactions." onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 text-2xl font-bold text-gradient-burgundy"
          >
            <ListOrdered className="h-6 w-6 text-burgundy" /> Transactions
          </motion.h2>

          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <motion.form
              onSubmit={onSubmit}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card space-y-4"
            >
              <h3 className="text-sm font-bold text-ink">Log a transaction</h3>
              <p className="text-sm text-muted">POST /transactions — the engine returns baseline, savings, score, and nudge.</p>

              <label className="block" htmlFor="amount">
                <span className="mb-2 block text-sm text-muted">Income</span>
                <input
                  id="amount"
                  className="input text-2xl font-bold"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
                />
              </label>

              <div>
                <p className="mb-2 text-sm text-muted">Source</p>
                <div className="flex flex-wrap gap-2">
                  {sources.map((item) => (
                    <motion.button
                      key={item}
                      type="button"
                      onClick={() => setSource(item)}
                      whileHover={{ scale: 1.08, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className={[
                        'min-h-10 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-all duration-300',
                        source === item
                          ? 'border-burgundy bg-gradient-to-r from-burgundy to-burgundy/90 text-white shadow-lg shadow-burgundy/20'
                          : 'border-line bg-card text-ink hover:border-burgundy-soft',
                      ].join(' ')}
                    >
                      {item}
                    </motion.button>
                  ))}
                </div>
              </div>

              <label className="block" htmlFor="date">
                <span className="mb-2 block text-sm text-muted">Date</span>
                <input id="date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              </label>

              {formError && <p className="text-sm font-semibold text-rose">{formError}</p>}

              <motion.button
                type="submit"
                disabled={busy}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary flex min-h-11 w-full items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="h-4 w-4" /> {busy ? 'Sending...' : 'Send to engine'}
              </motion.button>

              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl bg-emerald-soft px-4 py-3 text-sm font-medium text-ink"
                  >
                    ✅ Pipeline updated · Score {result.resilience?.previousScore} → {result.resilience?.score} ·
                    Safe to save {formatMoney(result.savings?.suggested)}
                  </motion.div>
                )}
              </AnimatePresence>

              {!live && (
                <motion.button
                  type="button"
                  onClick={reset}
                  whileHover={{ scale: 1.02 }}
                  className="btn-secondary flex min-h-11 w-full items-center justify-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" /> Reset demo
                </motion.button>
              )}
            </motion.form>

            <TransactionTable transactions={data.transactions} />
          </div>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
