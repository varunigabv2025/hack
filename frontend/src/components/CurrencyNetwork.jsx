import { motion } from 'framer-motion'
import { currencies } from '../data/currencies'
import { useMoney } from '../hooks/useMoney'

const markers = [
  { code: 'USD', left: '18%', top: '38%' },
  { code: 'EUR', left: '48%', top: '30%' },
  { code: 'GBP', left: '44%', top: '26%' },
  { code: 'INR', left: '68%', top: '48%' },
  { code: 'JPY', left: '82%', top: '36%' },
  { code: 'NGN', left: '50%', top: '58%' },
]

export default function CurrencyNetwork() {
  const { currency, setCurrency } = useMoney()
  const list = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'NGN'].map((code) =>
    currencies.find((c) => c.code === code),
  )

  return (
    <section className="card">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Global Currency Network</h2>
        <a href="/network" className="text-sm font-semibold text-burgundy hover:opacity-80 transition-opacity">View map</a>
      </div>

      <div className="relative mb-5 h-44 overflow-hidden rounded-2xl bg-gradient-to-br from-ivory to-burgundy-soft/20">
        <svg viewBox="0 0 400 180" className="absolute inset-0 h-full w-full opacity-30" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 22} y1="0" x2={i * 22} y2="180" stroke="#D6CFC5" strokeWidth="0.5" />
          ))}
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * 22} x2="400" y2={i * 22} stroke="#D6CFC5" strokeWidth="0.5" />
          ))}
          <ellipse cx="200" cy="90" rx="150" ry="70" fill="none" stroke="#C9C0B5" strokeDasharray="3 4" />
        </svg>
        {markers.map((m, i) => {
          const c = currencies.find((x) => x.code === m.code)
          const active = currency === m.code
          return (
            <motion.button
              key={m.code}
              type="button"
              onClick={() => setCurrency(m.code)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: active ? 1.15 : 1, opacity: 1 }}
              transition={{ delay: 0.1 * i, type: 'spring', stiffness: 300 }}
              whileHover={{ scale: 1.3, y: -4 }}
              aria-label={`Switch to ${c?.name}`}
              aria-pressed={active}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-xs font-bold text-white shadow-lg"
              style={{
                left: m.left,
                top: m.top,
                background: c?.accent,
                boxShadow: active ? `0 0 0 3px white, 0 4px 16px ${c?.accent}60` : `0 4px 12px ${c?.accent}40`,
              }}
            >
              {c?.symbol}
            </motion.button>
          )
        })}
      </div>

      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {list.map((item, i) => {
          const active = currency === item.code
          return (
            <motion.li key={item.code}>
              <button
                type="button"
                onClick={() => setCurrency(item.code)}
                aria-pressed={active}
                className={[
                  'flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition-all',
                  active ? 'bg-burgundy-soft ring-2 ring-burgundy/30' : 'bg-ivory/80 hover:bg-burgundy-soft/50',
                ].join(' ')}
              >
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ background: item.accent }}
                >
                  {item.symbol}
                </span>
                <div className="text-left">
                  <p className="text-xs font-semibold text-ink">{item.code}</p>
                  <p className="text-[11px] text-muted">{item.region}</p>
                </div>
              </button>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
