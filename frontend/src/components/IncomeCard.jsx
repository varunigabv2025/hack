import { formatInr, formatSignedInr } from '../lib/format'
import { strings } from '../i18n/strings'

export default function IncomeCard({ todayIncome, baseline, language }) {
  const copy = strings[language] || strings.en
  const hasIncome = todayIncome != null && todayIncome !== ''
  const delta = hasIncome && baseline != null ? Number(todayIncome) - Number(baseline) : null

  let relation = copy.income.empty
  if (delta != null) {
    if (delta > 0) relation = `${formatSignedInr(delta)} ${copy.income.above}`
    else if (delta < 0) relation = `${formatSignedInr(delta)} ${copy.income.below}`
    else relation = copy.income.even
  }

  return (
    <section className="card">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{copy.income.title}</p>
      <p className="mt-3 font-mono text-4xl font-semibold tabular-nums text-income sm:text-5xl">
        {hasIncome ? formatInr(todayIncome) : '—'}
      </p>
      <p className="mt-3 text-sm text-muted">{relation}</p>
    </section>
  )
}
