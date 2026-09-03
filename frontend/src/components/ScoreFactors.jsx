import { motion } from 'framer-motion'
import { Shield, TrendingUp, Coins, BatteryMedium } from 'lucide-react'
import { useLang } from '../hooks/useLang'

const rows = [
  { key: 'incomeStability', labelKey: 'incomeStability', icon: Shield },
  { key: 'incomeTrend', labelKey: 'incomeTrend', icon: TrendingUp },
  { key: 'savingsBehaviour', labelKey: 'savingsBehaviour', icon: Coins },
  { key: 'emergencyBuffer', labelKey: 'emergencyBuffer', icon: BatteryMedium },
  { key: 'debtBurden', labelKey: 'debtBurden', icon: Shield },
]

export default function ScoreFactors({ factors = {} }) {
  const { t } = useLang()

  return (
    <ul className="space-y-4">
      {rows.map((row, i) => {
        const value = Number(factors[row.key]) || 0
        const Icon = row.icon
        return (
          <li key={row.key} className="flex items-center gap-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F1E6EF] text-[#6b2148]">
              <Icon className="h-3.5 w-3.5" strokeWidth={2.25} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="truncate text-[13px] text-[#8A8791]">{t(row.labelKey)}</span>
                <span className="text-[13px] font-semibold tabular-nums text-[#2C2430]">
                  {value}
                  <span className="font-normal text-[#8A8791]">/100</span>
                </span>
              </div>
              <div className="relative h-2 rounded-full bg-[#EFE4DC]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#6b2148]"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, value)}%` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                />
                <motion.span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[2.5px] border-white bg-[#6b2148] shadow-[0_1px_4px_rgba(91,26,91,0.28)]"
                  initial={{ left: 0 }}
                  animate={{ left: `calc(${Math.min(100, value)}% - 7px)` }}
                  transition={{ duration: 1, delay: 0.3 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
