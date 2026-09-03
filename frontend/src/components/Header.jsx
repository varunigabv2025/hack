import { formatLongDate, greetingForNow, initials } from '../lib/format'
import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'

export default function Header({ name }) {
  const { language } = useApp()
  const copy = strings[language] || strings.en
  const greeting = copy.header[greetingForNow()]
  const dateLabel = formatLongDate()

  return (
    <header className="mb-5 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm text-muted">{dateLabel}</p>
        <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {greeting}
        </h1>
        {name && <p className="mt-1 text-sm text-muted">{name}</p>}
      </div>
      <div
        aria-hidden="true"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-card-2 text-sm font-semibold text-engine"
      >
        {initials(name)}
      </div>
    </header>
  )
}
