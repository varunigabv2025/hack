import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Menu } from 'lucide-react'
import { greetingForNow, initials } from '../lib/format'
import { useApp } from '../context/AppContext'
import CurrencySelector from './CurrencySelector'

export default function Header() {
  const { data, setSidebarOpen } = useApp()
  const { pathname } = useLocation()
  const name = data?.user?.name || 'there'
  const showGreeting = pathname === '/'

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={
        showGreeting
          ? 'mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
          : 'mb-3 flex items-center justify-between gap-2 sm:justify-end'
      }
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          className="cursor-pointer rounded-lg border border-line bg-card/90 p-1.5 text-ink shadow-sm lg:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        {showGreeting ? (
          <div className="min-w-0">
            <p className="page-kicker leading-none">Personal resilience</p>
            <h1 className="mt-1 truncate text-base font-semibold tracking-tight text-burgundy sm:text-lg">
              {greetingForNow()}, {name}
            </h1>
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <CurrencySelector />
        <button
          type="button"
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-muted transition hover:border-burgundy/25 hover:text-burgundy"
          aria-label="Notifications"
        >
          <Bell className="h-3.5 w-3.5" />
        </button>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-burgundy to-burgundy-deep text-[11px] font-semibold text-white shadow-sm shadow-burgundy/20"
          aria-hidden="true"
        >
          {initials(name)}
        </div>
      </div>
    </motion.header>
  )
}
