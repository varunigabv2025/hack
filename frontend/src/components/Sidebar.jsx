import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical, Globe2, Home, Landmark, LineChart, ListOrdered, Settings,
  Sparkles, Target, X, PiggyBank, ShieldAlert, Receipt,
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const links = [
  { to: '/', label: 'Dashboard', icon: Home, end: true },
  { to: '/savings', label: 'Savings Pocket', icon: PiggyBank },
  { to: '/score', label: 'Resilience Score', icon: LineChart },
  { to: '/transactions', label: 'Transactions', icon: ListOrdered },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/loans', label: 'Loan stacking', icon: ShieldAlert },
  { to: '/insights', label: 'Insights', icon: Sparkles },
  { to: '/schemes', label: 'Scheme Studio', icon: Landmark },
  { to: '/lab', label: 'AI What-If Lab', icon: FlaskConical },
  { to: '/goals', label: 'Goals', icon: Target },
  { to: '/network', label: 'Global Network', icon: Globe2 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const orbitSymbols = [
  { s: '$', code: 'USD', a: 0, c: '#C9842F' },
  { s: '€', code: 'EUR', a: 60, c: '#8B4B78' },
  { s: '¥', code: 'JPY', a: 120, c: '#A66B1E' },
  { s: '₹', code: 'INR', a: 180, c: '#6B2D5B' },
  { s: '£', code: 'GBP', a: 240, c: '#9A6420' },
  { s: '₩', code: 'KRW', a: 300, c: '#4A1A3D' },
]

function NavBody({ onNavigate }) {
  const { currency, setCurrency } = useApp()
  return (
    <>
      <div className="mb-7 flex items-start justify-between gap-3 px-2">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-burgundy to-burgundy-deep text-white shadow-md shadow-burgundy/25">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Resilience</p>
          <p className="text-lg font-semibold tracking-tight text-burgundy">Engine</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            Income clarity. Savings discipline. Scheme guidance.
          </p>
        </div>
        {onNavigate && (
          <button type="button" className="cursor-pointer rounded-lg p-1 text-muted lg:hidden" onClick={onNavigate}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium transition-all duration-300',
                isActive
                  ? 'bg-burgundy text-white shadow-md shadow-burgundy/20'
                  : 'text-muted hover:bg-burgundy-soft hover:text-burgundy',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl bg-gradient-to-br from-ivory to-burgundy-soft/30 px-4 py-4">
        <div className="relative mb-3 flex h-24 items-center justify-center" aria-hidden="true">
          <svg width="96" height="96" viewBox="0 0 96 96" className="animate-spin-slow absolute inset-0 m-auto">
            <circle cx="48" cy="48" r="36" fill="none" stroke="#E8E2DA" strokeWidth="1" strokeDasharray="3 3" />
          </svg>
          {orbitSymbols.map(({ s, code, a, c }) => {
            const rad = (a * Math.PI) / 180
            const x = 48 + 36 * Math.cos(rad)
            const y = 48 + 36 * Math.sin(rad)
            const active = currency === code
            return (
              <button
                key={s}
                type="button"
                onClick={() => setCurrency(code)}
                aria-label={`Switch to ${code}`}
                aria-pressed={active}
                className="absolute cursor-pointer text-sm font-bold transition-transform hover:scale-125"
                style={{
                  left: `${(x / 96) * 100}%`,
                  top: `${(y / 96) * 100}%`,
                  transform: `translate(-50%, -50%) scale(${active ? 1.25 : 1})`,
                  color: c,
                  textShadow: active ? `0 0 8px ${c}` : undefined,
                }}
              >
                {s}
              </button>
            )
          })}
        </div>
        <p className="text-center text-xs leading-relaxed text-muted">
          Different currencies. Different lives. Same goal — financial resilience.
        </p>
      </div>
    </>
  )
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp()

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            key="overlay"
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r border-line/50 bg-card/90 backdrop-blur-xl px-4 py-6 lg:flex">
        <NavBody />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line/50 bg-card/95 backdrop-blur-xl px-4 py-6 lg:hidden"
          >
            <NavBody onNavigate={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
