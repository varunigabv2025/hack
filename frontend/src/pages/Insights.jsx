import { motion } from 'framer-motion'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'
import AppLayout from '../components/AppLayout'
import NudgeCard from '../components/NudgeCard'
import NextActionCard from '../components/NextActionCard'
import { useMoney } from '../hooks/useMoney'
import { TrendingUp, BarChart3, Target, Shield } from 'lucide-react'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.7, delay }}
      whileHover={{ y: -8, boxShadow: `0 20px 50px ${color}25` }}
      className="card relative overflow-hidden"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10" style={{ background: color }} />
      <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${color}18` }}>
        <Icon className="h-5 w-5" style={{ color }} />
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
    </motion.div>
  )
}

function AnimatedBarChart({ data, title }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="card relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            'linear-gradient(#6b2148 1px, transparent 1px), linear-gradient(90deg, #6b2148 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />
      <p className="relative mb-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
        {title}
      </p>
      <div className="relative flex items-end justify-center gap-4 px-2" style={{ height: 180 }}>
        {data.map((d, i) => {
          const h = Math.max(28, (d.value / max) * 140)
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-3">
              <div className="bar-3d" style={{ height: h }}>
                <div className="bar-3d__face" />
                <div className="bar-3d__side" />
                <div className="bar-3d__top" />
                <div className="bar-3d__glow" />
              </div>
              <span className="text-[10px] font-medium text-muted">{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DonutChart({ segments, title, delay = 0 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  let cumulative = 0
  const r = 60
  const c = 2 * Math.PI * r

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -20 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ delay, duration: 0.8 }}
      className="card"
    >
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{title}</p>
      <div className="flex items-center gap-6">
        <svg width="150" height="150" viewBox="0 0 150 150" className="shrink-0">
          {segments.map((seg, i) => {
            const fraction = seg.value / total
            const dashArray = `${fraction * c} ${c}`
            const rotation = (cumulative / total) * 360 - 90
            cumulative += seg.value
            return (
              <motion.circle
                key={i}
                cx="75" cy="75" r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="14"
                strokeDasharray={dashArray}
                strokeLinecap="round"
                transform={`rotate(${rotation} 75 75)`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.2, delay: delay + 0.2 * i }}
              />
            )
          })}
        </svg>
        <ul className="space-y-2">
          {segments.map((seg) => (
            <li key={seg.label} className="flex items-center gap-2 text-sm">
              <span className="h-3 w-3 rounded-full" style={{ background: seg.color }} />
              <span className="text-muted">{seg.label}</span>
              <span className="ml-auto font-semibold text-ink">{seg.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
}

export default function Insights() {
  const { data } = useApp()
  const { formatMoney } = useMoney()
  const { t } = useLang()
  const income = data?.income || {}
  const resilience = data?.resilience || {}
  const savings = data?.savings || {}

  const weeklyData = (data?.weekly?.length
    ? data.weekly.map((w) => ({ label: w.label, value: w.income }))
    : (income.sparkline || []).map((v, i) => ({
        label: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] || `D${i + 1}`,
        value: v,
      })))

  const donutSegments = [
    { label: t('stability'), value: resilience.factors?.incomeStability || 0, color: '#6b2148' },
    { label: t('trend'), value: resilience.factors?.incomeTrend || 0, color: '#8a2f5c' },
    { label: t('savings'), value: resilience.factors?.savingsBehaviour || 0, color: '#3f0f2a' },
    { label: t('buffer'), value: resilience.factors?.emergencyBuffer || 0, color: '#A56B96' },
  ]

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-burgundy"
        >
          {t('financialInsights')}
        </motion.h2>
        <p className="text-sm text-muted">{t('insightsSubtitle')}</p>

        {data ? <NextActionCard dashboard={data} /> : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={TrendingUp} label={t('todayIncome')} value={formatMoney(income.today)} color="#6b2148" delay={0.1} />
          <StatCard icon={BarChart3} label={t('baseline')} value={formatMoney(income.baseline)} color="#8a2f5c" delay={0.2} />
          <StatCard icon={Target} label={t('score')} value={`${resilience.score || 0}/100`} color="#3f0f2a" delay={0.3} />
          <StatCard icon={Shield} label={t('buffer')} value={`${savings.emergencyProgress || 0}%`} color="#A56B96" delay={0.4} />
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <AnimatedBarChart data={weeklyData} title={t('weeklyIncomeTrend')} />
          <DonutChart segments={donutSegments} title={t('scoreBreakdown')} delay={0.4} />
        </div>

        <NudgeCard nudge={data?.nudge} />
      </motion.div>
    </AppLayout>
  )
}
