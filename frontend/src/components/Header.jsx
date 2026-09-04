import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Bell, Menu } from 'lucide-react'
import { greetingForNow, initials } from '../lib/format'
import { useApp } from '../context/AppContext'
import CurrencySelector from './CurrencySelector'
import VernacularBar from './VernacularBar'
import { useLang } from '../hooks/useLang'

export default function Header() {
  const { data, setSidebarOpen } = useApp()
  const { pathname } = useLocation()
  const { lang, t } = useLang()
  const name = data?.user?.name || 'there'
  const showGreeting = pathname === '/'

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mb-3 flex flex-col gap-2.5"
    >
      <div
        className={
          showGreeting
            ? 'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'
            : 'flex items-center justify-between gap-2'
        }
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            type="button"
            className="tap-target cursor-pointer rounded-lg border border-line bg-card/90 p-2 text-ink shadow-sm lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label={t('openMenu')}
          >
            <Menu className="h-4 w-4" />
          </button>
          {showGreeting ? (
            <div className="min-w-0">
              <p className="page-kicker leading-none !text-gold" style={{ color: '#e0b45c' }}>{t('personalResilience')}</p>
              <h1 className="mt-1 truncate text-base font-semibold tracking-tight text-burgundy sm:text-lg">
                {lang === 'ta' ? `${t('greetingHi')}, ${name}` : `${greetingForNow()}, ${name}`}
              </h1>
            </div>
          ) : (
            <div className="min-w-0 sm:hidden" />
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <CurrencySelector />
          <button
            type="button"
            className="tap-target flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-line bg-card text-muted transition hover:border-burgundy/25 hover:text-burgundy"
            aria-label={t('notifications')}
          >
            <Bell className="h-3.5 w-3.5" />
          </button>
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full bg-burgundy text-[11px] font-semibold text-white"
            aria-hidden="true"
          >
            {initials(name)}
          </div>
        </div>
      </div>

      <VernacularBar />
    </motion.header>
  )
}
