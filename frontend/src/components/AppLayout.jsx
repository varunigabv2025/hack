import Sidebar from './Sidebar'
import Header from './Header'
import FloatingChatButton from './FloatingChatButton'

export default function AppLayout({ children }) {
  return (
    <div className="min-h-svh bg-animated-gradient text-ink lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-5 lg:px-6 lg:py-4">
          <Header />
          {children}
        </div>
      </div>
      <FloatingChatButton />
    </div>
  )
}
