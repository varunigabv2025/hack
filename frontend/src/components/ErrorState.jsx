export default function ErrorState({ message, onRetry, retryLabel }) {
  return (
    <div className="rounded-3xl border border-line bg-card p-6 text-left">
      <p className="text-base font-semibold text-ink">{message}</p>
      <p className="mt-2 text-sm text-muted">Your numbers are safe. Try once more when ready.</p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-primary mt-5 min-h-12 w-full"
      >
        {retryLabel}
      </button>
    </div>
  )
}
