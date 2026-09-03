import { strings } from '../i18n/strings'
import { useApp } from '../context/AppContext'

export default function LanguageToggle() {
  const { language, setLanguage } = useApp()
  const copy = strings[language] || strings.en

  return (
    <div
      role="group"
      aria-label={copy.lang.label}
      className="flex rounded-full border border-line bg-card p-1"
    >
      {['en', 'ta'].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          className={[
            'min-h-9 min-w-10 cursor-pointer rounded-full px-3 text-xs font-semibold transition-colors duration-200',
            language === code ? 'bg-cta text-background' : 'text-muted hover:text-ink',
          ].join(' ')}
        >
          {copy.lang[code]}
        </button>
      ))}
    </div>
  )
}
