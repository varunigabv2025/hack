import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'
import { useLang } from '../hooks/useLang'

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Healthcare', 'Education',
  'Entertainment', 'Utilities', 'Insurance', 'Shopping', 'Debt Payment', 'Savings', 'Other',
]

export default function Expenses() {
  const { data, status, refresh, addExpense } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const [amount, setAmount] = useState('200')
  const [category, setCategory] = useState('Food')
  const [essential, setEssential] = useState(true)
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('All')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const summary = data?.expenseSummary || {}
  const expenses = data?.expenses || []
  const breakdown = summary.category_breakdown || {}
  const visible = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)),
    [expenses, filter],
  )

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError('')
    
    try {
      await addExpense({
        amount: Number(amount) || 0,
        date: new Date().toISOString().slice(0, 10),
        category,
        essential,
        description,
      })
      
      // Clear form on success
      setDescription('')
      setAmount('200')
    } catch (error) {
      console.error('Failed to add expense:', error)
      setSubmitError(error.message || 'Failed to add expense. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message={t('errorLoadExpenses')} onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-4">
          <div>
            <p className="page-kicker">Spending Tracker</p>
            <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold text-burgundy">
              <Receipt className="h-8 w-8" /> {t('expensesTitle')}
            </h2>
            <p className="mt-2 text-[13px] text-muted">
              {t('expensesIntro')}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: t('total'), value: formatMoney(summary.total_expenses || 0) },
              { label: t('essential'), value: formatMoney(summary.essential_expenses || 0) },
              { label: t('nonEssential'), value: formatMoney(summary.non_essential_expenses || 0) },
              { label: t('count'), value: summary.expense_count || 0 },
            ].map((item) => (
              <article key={item.label} className="card-panel !px-4 !py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-burgundy">{item.value}</p>
              </article>
            ))}
          </div>

          <article className="card-panel">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">{t('categoryBreakdown')}</p>
            <ul className="space-y-2">
              {Object.entries(breakdown).map(([cat, row]) => (
                <li key={cat}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="font-medium text-ink">{cat}</span>
                    <span className="font-semibold text-burgundy">{formatMoney(row.total)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-beige">
                    <div
                      className="h-full rounded-full bg-burgundy"
                      style={{ width: `${summary.total_expenses ? Math.round((row.total / summary.total_expenses) * 100) : 0}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="card-panel">
            <h3 className="mb-3 text-sm font-bold text-ink">{t('logAnExpense')}</h3>
            {submitError && (
              <div className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {submitError}
              </div>
            )}
            <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
              <input 
                className="input" 
                inputMode="numeric" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} 
                placeholder={t('amount')}
                disabled={submitting}
              />
              <select 
                className="input" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input 
                className="input sm:col-span-2" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder={t('descriptionOptional')}
                disabled={submitting}
              />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input 
                  type="checkbox" 
                  checked={essential} 
                  onChange={(e) => setEssential(e.target.checked)}
                  disabled={submitting}
                />
                {t('essential')}
              </label>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={submitting}
              >
                {submitting ? 'Saving...' : t('saveExpense')}
              </button>
            </form>
          </article>

          <article className="card-panel">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {[t('all'), ...Object.keys(breakdown)].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c === t('all') ? 'All' : c)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold ${filter === (c === t('all') ? 'All' : c) ? 'bg-burgundy text-white' : 'bg-beige text-burgundy'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <div className="py-8 text-center">
                <Receipt className="mx-auto h-12 w-12 text-muted opacity-30" />
                <p className="mt-3 text-sm text-muted">
                  {expenses.length === 0 ? 'No expenses logged yet.' : 'No expenses in this category.'}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line/60">
                {visible.map((row) => (
                  <li key={row.id || row.expense_id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-ink">{row.category}{row.essential ? ` · ${t('essential').toLowerCase()}` : ''}</p>
                      <p className="text-xs text-muted">{row.date}{row.description ? ` · ${row.description}` : ''}</p>
                    </div>
                    <p className="font-semibold text-burgundy">{formatMoney(row.amount)}</p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
