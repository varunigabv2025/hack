import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, ShieldAlert, CreditCard } from 'lucide-react'
import AppLayout from '../components/AppLayout'
import Skeleton from '../components/Skeleton'
import ErrorState from '../components/ErrorState'
import { useApp } from '../context/AppContext'
import { useMoney } from '../hooks/useMoney'

const levelStyle = {
  low: 'bg-[#E8F4EC] text-[#2F7A4F]',
  medium: 'bg-gold-soft text-gold-deep',
  high: 'bg-[#FDECEC] text-[#B42318]',
}

export default function Loans() {
  const { data, status, refresh, addLoan } = useApp()
  const { formatMoney } = useMoney()
  const [name, setName] = useState('App loan')
  const [amount, setAmount] = useState('10000')
  const [monthly, setMonthly] = useState('1500')

  const risk = data?.loanRisk || { level: 'low', activeLoans: 0, totalMonthlyPayment: 0 }
  const loans = data?.loans || []

  function onSubmit(e) {
    e.preventDefault()
    addLoan({
      id: `L${Date.now()}`,
      name,
      amount: Number(amount) || 0,
      monthlyPayment: Number(monthly) || 0,
      status: 'active',
    })
    setAmount('')
    setMonthly('')
  }

  return (
    <AppLayout>
      {status === 'loading' ? <Skeleton /> : null}
      {status === 'error' ? <ErrorState message="Could not load loans." onRetry={refresh} /> : null}
      {status === 'ready' && data ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-3xl space-y-4">
          <div>
            <p className="page-kicker">Member 2 engine</p>
            <h2 className="mt-1 flex items-center gap-2.5 text-[1.85rem] font-bold text-burgundy">
              <ShieldAlert className="h-8 w-8" /> Loan stacking
            </h2>
            <p className="mt-2 text-[13px] text-muted">
              Risk uses the published rules: 0–1 active loans = low, 2 = medium, 3+ = high.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <article className="card-panel">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Risk level</p>
              <p className={`mt-2 inline-flex rounded-full px-3 py-1 text-sm font-bold uppercase ${levelStyle[risk.level] || levelStyle.low}`}>
                {risk.level}
              </p>
            </article>
            <article className="card-panel">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Active loans</p>
              <p className="mt-2 text-2xl font-bold text-burgundy">{risk.activeLoans}</p>
            </article>
            <article className="card-panel">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Monthly payment</p>
              <p className="mt-2 text-2xl font-bold text-burgundy">{formatMoney(risk.totalMonthlyPayment)}</p>
            </article>
          </div>

          {risk.level !== 'low' && (
            <p className="flex items-start gap-2 rounded-xl bg-[#FDECEC] px-3.5 py-3 text-sm text-[#B42318]">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              Stacking multiple loans raises payment burden. The resilience score already includes a debt-burden factor.
            </p>
          )}

          <article className="card-panel">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-ink">
              <CreditCard className="h-4 w-4 text-burgundy" /> Add a loan
            </h3>
            <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-3">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
              <input className="input" inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value.replace(/\D/g, ''))} placeholder="Amount" />
              <input className="input" inputMode="numeric" value={monthly} onChange={(e) => setMonthly(e.target.value.replace(/\D/g, ''))} placeholder="Monthly payment" />
              <button type="submit" className="btn-primary sm:col-span-3">Save loan</button>
            </form>
          </article>

          <article className="card-panel">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Active loans</p>
            {loans.length === 0 ? (
              <p className="mt-3 text-sm text-muted">No loans on file — stacking risk is low.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line/60">
                {loans.map((loan) => (
                  <li key={loan.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-semibold text-ink">{loan.name}</p>
                      <p className="text-xs text-muted">{formatMoney(loan.amount)} principal</p>
                    </div>
                    <p className="font-semibold text-burgundy">{formatMoney(loan.monthlyPayment)}/mo</p>
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
