import { useState } from 'react'
import { strings } from '../i18n/strings'
import { formatInr } from '../lib/format'
import { useApp } from '../context/AppContext'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import TransactionList from '../components/TransactionList'

const sources = ['Uber', 'Swiggy', 'Ola', 'Zomato', 'Cash']

function todayIso() {
  return new Date().toISOString().slice(0, 10)
}

export default function Transactions() {
  const { data, status, refresh, language, submitTransaction, reset, live } = useApp()
  const copy = strings[language] || strings.en
  const [amount, setAmount] = useState('1100')
  const [source, setSource] = useState('Uber')
  const [date, setDate] = useState(todayIso)
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [formError, setFormError] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (!Number(amount)) {
      setFormError('Enter an amount')
      return
    }
    setBusy(true)
    setFormError('')
    try {
      const payload = await submitTransaction({
        amount: Number(amount),
        source,
        date,
      })
      setResult(payload)
    } catch {
      setFormError(copy.status.error)
    } finally {
      setBusy(false)
    }
  }

  return (
    <Navbar>
      <Header name={data?.user?.name} />
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? (
        <ErrorState message={copy.status.error} onRetry={refresh} retryLabel={copy.status.retry} />
      ) : null}
      {status === 'ready' && data ? (
        <div className="space-y-4">
          <form onSubmit={onSubmit} className="card space-y-4">
            <h2 className="text-sm font-semibold">{copy.activity.add}</h2>
            <p className="text-sm text-muted">{copy.activity.hint}</p>
            <label className="block" htmlFor="amount">
              <span className="mb-2 block text-sm">{copy.activity.amount}</span>
              <input
                id="amount"
                className="input text-2xl font-semibold tabular-nums"
                inputMode="numeric"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))}
              />
            </label>
            <div>
              <p className="mb-2 text-sm">{copy.activity.source}</p>
              <div className="flex flex-wrap gap-2">
                {sources.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSource(item)}
                    className={[
                      'min-h-11 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors duration-200',
                      source === item ? 'border-income bg-income text-background' : 'border-line bg-card text-ink',
                    ].join(' ')}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <label className="block" htmlFor="date">
              <span className="mb-2 block text-sm">{copy.activity.date}</span>
              <input id="date" type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>
            {formError && <p className="text-sm text-income">{formError}</p>}
            <button type="submit" disabled={busy} className="btn-primary min-h-12 w-full disabled:opacity-60">
              {copy.activity.submit}
            </button>
          </form>

          {result && (
            <div className="rounded-3xl border border-cta/30 bg-card p-5">
              <p className="text-sm font-semibold text-cta">{copy.activity.success}</p>
              <p className="mt-2 text-sm text-muted">
                Score {result.resilience_score?.previous_score} → {result.resilience_score?.score} · Safe to save{' '}
                {formatInr(result.savings_pocket?.suggested_amount)}
              </p>
              {result.nudge?.message && <p className="mt-3 text-sm leading-relaxed">{result.nudge.message}</p>}
            </div>
          )}

          <TransactionList transactions={data.transactions} language={language} />

          {!live && (
            <button type="button" onClick={reset} className="btn-secondary min-h-12 w-full">
              {copy.activity.reset}
            </button>
          )}
        </div>
      ) : null}
    </Navbar>
  )
}
