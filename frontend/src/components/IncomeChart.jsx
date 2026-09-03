import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatInr } from '../lib/format'
import { strings } from '../i18n/strings'

export default function IncomeChart({ weekly = [], language, showSavings = false }) {
  const copy = strings[language] || strings.en

  if (!weekly.length) {
    return (
      <section className="card">
        <h2 className="text-sm font-semibold text-ink">{copy.savings.incomeVsSave}</h2>
        <p className="mt-3 text-sm text-muted">{copy.activity.empty}</p>
      </section>
    )
  }

  return (
    <section className="card overflow-hidden">
      <h2 className="mb-4 text-sm font-semibold text-ink">
        {showSavings ? copy.savings.incomeVsSave : copy.baseline.title}
      </h2>
      <div className="h-52 w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={weekly} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#1E293B" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#64748B"
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: '#334155' }}
              contentStyle={{
                background: '#0F172A',
                border: '1px solid #334155',
                borderRadius: 12,
                color: '#F8FAFC',
              }}
              formatter={(value, name) => [formatInr(value), name]}
            />
            <Bar dataKey="income" name="Income" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            {showSavings && <Bar dataKey="saved" name="Saved" fill="#22C55E" radius={[6, 6, 0, 0]} />}
            <Line type="monotone" dataKey="baseline" name="Usual" stroke="#94A3B8" dot={false} strokeDasharray="5 5" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
