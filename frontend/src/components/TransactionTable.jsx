import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { formatDay } from '../lib/format'
import { useMoney } from '../hooks/useMoney'

const brandColors = {
  Uber: { bg: '#000', text: '#fff', letter: 'U' },
  Swiggy: { bg: '#FC8019', text: '#fff', letter: 'S' },
  Zomato: { bg: '#E23744', text: '#fff', letter: 'Z' },
  Ola: { bg: '#79B93C', text: '#fff', letter: 'O' },
  Rapido: { bg: '#FECF2F', text: '#1a1a1a', letter: 'R' },
  Dunzo: { bg: '#00D290', text: '#fff', letter: 'D' },
  Cash: { bg: '#6B2D5B', text: '#fff', letter: '₹' },
}

function SourceBadge({ source }) {
  const brand = brandColors[source] || { bg: '#6B2D5B', text: '#fff', letter: (source || '?')[0].toUpperCase() }
  return (
    <span
      className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold shadow-sm"
      style={{ background: brand.bg, color: brand.text }}
    >
      {brand.letter}
    </span>
  )
}

export default function TransactionTable({ transactions = [], limit }) {
  const { formatMoney, formatSignedMoney } = useMoney()
  const rows = limit ? transactions.slice(0, limit) : transactions

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between px-5 py-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Recent Transactions</h2>
        <Link to="/transactions" className="cursor-pointer text-sm font-semibold text-burgundy hover:opacity-80 transition-opacity">
          View all
        </Link>
      </div>

      {!rows.length ? (
        <p className="px-5 pb-5 text-sm text-muted">No transactions yet. Log today&apos;s pay to start.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-y border-line/50 bg-ivory/50 text-[11px] uppercase tracking-wide text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Source</th>
                <th className="px-5 py-3 font-semibold">Amount</th>
                <th className="px-5 py-3 font-semibold">Vs Baseline</th>
                <th className="px-5 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <motion.tr
                  key={`${row.date}-${row.source}-${row.amount}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="border-b border-line/30 last:border-0 hover:bg-ivory/50 transition-colors"
                >
                  <td className="whitespace-nowrap px-5 py-3.5 text-ink">{formatDay(row.date)}</td>
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-2">
                      <SourceBadge source={row.source} />
                      <span className="font-medium text-ink">{row.source}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-semibold tabular-nums">{formatMoney(row.amount)}</td>
                  <td className={['px-5 py-3.5 font-semibold tabular-nums', row.vsBaseline > 0 ? 'text-emerald' : row.vsBaseline < 0 ? 'text-rose' : 'text-muted'].join(' ')}>
                    {formatSignedMoney(row.vsBaseline)}
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {row.saved > 0 ? (
                      <span className="inline-flex rounded-full bg-emerald-soft px-2 py-0.5 text-xs font-semibold text-emerald">
                        {formatMoney(row.saved)} saved
                      </span>
                    ) : (
                      'No sweep'
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
