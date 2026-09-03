import { NavLink } from 'react-router-dom'
import { Gauge, Home, List, Wallet } from 'lucide-react'
import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'
import LanguageToggle from './LanguageToggle'

const tabs = [
  { to: '/', icon: Home, key: 'home' },
  { to: '/savings', icon: Wallet, key: 'savings' },
  { to: '/score', icon: Gauge, key: 'score' },
  { to: '/activity', icon: List, key: 'activity' },
]

export default function Navbar({ children }) {
  const { language, live } = useApp()
  const copy = strings[language] || strings.en

  return (
    <div className="min-h-svh bg-background text-ink">
      <div className="mx-auto flex min-h-svh w-full max-w-lg flex-col px-4 pb-28 pt-4 sm:max-w-2xl lg:max-w-6xl lg:pb-8 lg:pt-24">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted">{copy.brand}</p>
          <LanguageToggle />
        </div>
        {!live && (
          <p className="mb-4 rounded-xl border border-line bg-card px-3 py-2 text-xs text-muted">
            {copy.header.mock}
          </p>
        )}
        <main className="flex-1">{children}</main>
      </div>

      <nav
        aria-label="Primary"
        className="fixed bottom-0 left-0 right-0 z-30 border-t border-line bg-background/95 backdrop-blur-md lg:top-0 lg:bottom-auto lg:border-b lg:border-t-0"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 py-2 sm:max-w-2xl lg:max-w-6xl">
          {tabs.map(({ to, icon: Icon, key }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                [
                  'flex min-h-12 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-xs font-medium transition-colors duration-200 lg:flex-row lg:gap-2',
                  isActive ? 'bg-card-2 text-cta' : 'text-muted hover:text-ink',
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {copy.nav[key]}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
