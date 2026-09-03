import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Receipt } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'

const CATEGORIES = [
  'Food', 'Transport', 'Housing', 'Healthcare', 'Education',
  'Entertainment', 'Utilities', 'Insurance', 'Shopping', 'Debt Payment', 'Savings', 'Other',
]

export default function Expenses() {
  const { data, status, refresh, addExpense } = useApp()
  const { formatMoney } = useMoney()
  const [amount, setAmount] = useState('200')
  const [category, setCategory] = useState('Food')
  const [essential, setEssential] = useState(true)
  const [description, setDescription] = useState('')
  const [filter, setFilter] = useState('All')

  const summary = data?.expenseSummary || {}
  const expenses = data?.expenses || []
  const breakdown = summary.category_breakdown || {}
  const visible = useMemo(
    () => (filter === 'All' ? expenses : expenses.filter((e) => e.category === filter)),
    [expenses, filter],
  )

  function onSubmit(e) {
    e.preventDefault()
    addExpense({
      id: `EXP${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      amount: Number(amount) || 0,
      category,
      essential,
      description,
    })
    setDescription('')
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message="Could not load expenses." onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-4">
          <div>
            <p className="page-kicker">Member 1 backend</p>
            <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold text-burgundy">
              <Receipt className="h-8 w-8" /> Expenses
            </h2>
            <p className="mt-2 text-[13px] text-muted">
              Track spend by category. Totals are sums of what you logged — no AI estimates.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: 'Total', value: formatMoney(summary.total_expenses || 0) },
              { label: 'Essential', value: formatMoney(summary.essential_expenses || 0) },
              { label: 'Non-essential', value: formatMoney(summary.non_essential_expenses || 0) },
              { label: 'Count', value: summary.expense_count || 0 },
            ].map((item) => (
              <article key={item.label} className="card-panel !px-4 !py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{item.label}</p>
                <p className="mt-1 text-xl font-bold text-burgundy">{item.value}</p>
              </article>
            ))}
          </div>

          <article className="card-panel">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-muted">Category breakdown</p>
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
            <h3 className="mb-3 text-sm font-bold text-ink">Log an expense</h3>
            <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
              <input className="input" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount" />
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <input className="input sm:col-span-2" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" />
              <label className="flex items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={essential} onChange={(e) => setEssential(e.target.checked)} />
                Essential
              </label>
              <button type="submit" className="btn-primary">Save expense</button>
            </form>
          </article>

          <article className="card-panel">
            <div className="mb-3 flex flex-wrap gap-1.5">
              {['All', ...Object.keys(breakdown)].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className={`cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-semibold ${filter === c ? 'bg-burgundy text-white' : 'bg-beige text-burgundy'}`}
                >
                  {c}
                </button>
              ))}
            </div>
            <ul className="divide-y divide-line/60">
              {visible.map((row) => (
                <li key={row.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-semibold text-ink">{row.category}{row.essential ? ' · essential' : ''}</p>
                    <p className="text-xs text-muted">{row.date}{row.description ? ` · ${row.description}` : ''}</p>
                  </div>
                  <p className="font-semibold text-burgundy">{formatMoney(row.amount)}</p>
                </li>
              ))}
            </ul>
          </article>
        </motion.div>
      ) : null}
    </AppLayout>
  )
}
