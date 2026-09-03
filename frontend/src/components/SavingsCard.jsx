import { Flame } from 'lucide-react'
import { formatInr, formatSignedInr } from '../lib/format'
import { strings } from '../i18n/strings'

export default function SavingsCard({ pocket, todayIncome, baseline, language, featured = false }) {
  const copy = strings[language] || strings.en
  const surplus =
    todayIncome != null && baseline != null ? Number(todayIncome) - Number(baseline) : null

  return (
    <section className={featured ? 'card border-cta/30 bg-gradient-to-br from-card to-[#052e16]/50' : 'card'}>
      <p className="text-xs font-medium uppercase tracking-wide text-cta">{copy.savings.title}</p>
      <p className="mt-3 font-mono text-5xl font-semibold tabular-nums text-cta">
        {formatInr(pocket?.suggested_amount)}
      </p>
      <p className="mt-2 text-base font-semibold text-ink">{copy.savings.safe}</p>
      <p className="mt-1 text-xs text-muted">{copy.savings.engine}</p>

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label={copy.savings.surplus} value={surplus == null ? '—' : formatSignedInr(surplus)} />
        <Stat
          label={copy.savings.streak}
          value={copy.savings.days(pocket?.streak || 0)}
          icon={<Flame className="h-4 w-4 text-income" aria-hidden="true" />}
        />
        <Stat label={copy.savings.balance} value={formatInr(pocket?.current_balance)} />
      </dl>
    </section>
  )
}

function Stat({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-card-2/80 px-3 py-3">
      <p className="flex items-center gap-1 text-xs text-muted">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tabular-nums text-ink">{value}</p>
    </div>
  )
}
