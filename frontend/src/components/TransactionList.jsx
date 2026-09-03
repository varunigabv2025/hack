import { formatDay, formatInr, formatSignedInr } from '../lib/format'
import { strings } from '../i18n/strings'

export default function TransactionList({ transactions = [], language }) {
  const copy = strings[language] || strings.en

  if (!transactions.length) {
    return (
      <section className="card">
        <h2 className="text-sm font-semibold text-ink">{copy.activity.title}</h2>
        <p className="mt-3 text-sm text-muted">{copy.activity.empty}</p>
      </section>
    )
  }

  return (
    <section className="card overflow-hidden p-0">
      <div className="hidden grid-cols-5 gap-2 border-b border-line px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted sm:grid">
        <span>{copy.activity.date}</span>
        <span>{copy.activity.source}</span>
        <span>{copy.activity.amount}</span>
        <span>{copy.activity.vs}</span>
        <span>{copy.activity.saved}</span>
      </div>
      <ul className="divide-y divide-line">
        {transactions.map((row) => (
          <li key={`${row.date}-${row.source}-${row.amount}`} className="px-4 py-3">
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-5 sm:items-center sm:gap-2">
              <p className="text-sm font-medium text-ink">{formatDay(row.date)}</p>
              <p className="text-right text-sm text-muted sm:text-left">{row.source}</p>
              <p className="font-mono text-sm font-semibold tabular-nums">{formatInr(row.amount)}</p>
              <p
                className={[
                  'font-mono text-sm tabular-nums',
                  row.vs_baseline > 0 ? 'text-cta' : row.vs_baseline < 0 ? 'text-income' : 'text-muted',
                ].join(' ')}
              >
                {formatSignedInr(row.vs_baseline)}
              </p>
              <p className="col-span-2 text-sm text-muted sm:col-span-1">
                {row.saved > 0 ? formatInr(row.saved) : copy.activity.none}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
