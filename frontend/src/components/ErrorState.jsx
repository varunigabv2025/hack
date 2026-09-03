export default function ErrorState({ message, onRetry, retryLabel = 'Try again' }) {
  return (
    <div className="card">
      <p className="text-base font-semibold text-ink">{message}</p>
      <p className="mt-2 text-sm text-muted">Your numbers are safe. Try once more when ready.</p>
      <button type="button" onClick={onRetry} className="btn-primary mt-5 min-h-11">
        {retryLabel}
      </button>
    </div>
  )
}
