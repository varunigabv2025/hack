import { useLang } from '../hooks/useLang'

export default function ErrorState({ message, onRetry, retryLabel }) {
  const { t } = useLang()
  return (
    <div className="card">
      <p className="text-base font-semibold text-ink">{message}</p>
      <p className="mt-2 text-sm text-muted">{t('errorSafeMessage')}</p>
      <button type="button" onClick={onRetry} className="btn-primary mt-5 min-h-11">
        {retryLabel || t('tryAgain')}
      </button>
    </div>
  )
}
