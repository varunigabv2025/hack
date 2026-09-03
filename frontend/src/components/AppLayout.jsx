import { useEffect } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import FloatingChatButton from './FloatingChatButton'
import PersonalizationBanner from './PersonalizationBanner'
import { useApp } from '../context/AppContext'

export default function AppLayout({ children }) {
  const { data } = useApp()
  const lowLiteracy = Boolean(data?.settings?.lowLiteracy)
  const lang = data?.user?.language === 'ta' ? 'ta' : 'en'

  useEffect(() => {
    document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'
  }, [lang])

  return (
    <div
      className={[
        'min-h-svh bg-animated-gradient text-ink lg:flex',
        lowLiteracy ? 'mode-literacy' : '',
        lang === 'ta' ? 'lang-ta' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
          <Header />
          <PersonalizationBanner />
          {children}
        </div>
      </div>
      <FloatingChatButton />
    </div>
  )
}
