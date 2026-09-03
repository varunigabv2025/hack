import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle, BadgeCheck, FlaskConical, Globe2, Home, Landmark, LineChart, ListOrdered, Settings,
  Sparkles, Target, X, PiggyBank, ShieldAlert, Receipt, Scale,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLang } from '../hooks/useLang'

const links = [
  { to: '/', labelKey: 'navDashboard', icon: Home, end: true },
  { to: '/bad-week', labelKey: 'navBadWeek', icon: AlertTriangle },
  { to: '/passport', labelKey: 'navPassport', icon: BadgeCheck },
  { to: '/network', labelKey: 'navCommunity', icon: Globe2 },
  { to: '/savings', labelKey: 'navSavings', icon: PiggyBank },
  { to: '/score', labelKey: 'navScore', icon: LineChart },
  { to: '/transactions', labelKey: 'navTransactions', icon: ListOrdered },
  { to: '/expenses', labelKey: 'navExpenses', icon: Receipt },
  { to: '/loans', labelKey: 'navLoans', icon: ShieldAlert },
  { to: '/insights', labelKey: 'navInsights', icon: Sparkles },
  { to: '/schemes', labelKey: 'navSchemes', icon: Landmark },
  { to: '/lab', labelKey: 'navLab', icon: FlaskConical },
  { to: '/responsible-ai', labelKey: 'navResponsibleAi', icon: Scale },
  { to: '/goals', labelKey: 'navGoals', icon: Target },
  { to: '/settings', labelKey: 'navSettings', icon: Settings },
]

function NavBody({ onNavigate }) {
  const { t } = useLang()
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-5 flex shrink-0 items-start justify-between gap-3 px-2">
        <div>
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-burgundy text-white">
            <Globe2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">{t('brandResilience')}</p>
          <p className="font-display text-lg font-semibold tracking-tight text-burgundy-deep">{t('brandEngine')}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted">
            {t('sidebarTagline')}
          </p>
        </div>
        {onNavigate && (
          <button type="button" className="cursor-pointer rounded-lg p-1 text-muted lg:hidden" onClick={onNavigate} aria-label={t('closeMenu')}>
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain pr-1">
        {links.map(({ to, labelKey, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              [
                'flex min-h-11 shrink-0 cursor-pointer items-center gap-3 rounded-xl px-3 text-sm font-medium',
                isActive
                  ? 'bg-burgundy text-white'
                  : 'text-muted hover:bg-burgundy-soft hover:text-burgundy',
              ].join(' ')
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp()
  const { t } = useLang()

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            key="overlay"
            type="button"
            aria-label={t('closeMenu')}
            className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col overflow-hidden border-r border-line/50 bg-card/90 px-4 py-6 backdrop-blur-xl lg:flex">
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
            className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col overflow-hidden border-r border-line/50 bg-card/95 px-4 py-6 backdrop-blur-xl lg:hidden"
          >
            <NavBody onNavigate={() => setSidebarOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
