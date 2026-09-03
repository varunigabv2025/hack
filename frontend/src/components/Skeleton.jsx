export default function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite">
      <div className="h-28 animate-pulse rounded-3xl bg-card" />
      <div className="mx-auto h-52 w-52 animate-pulse rounded-full bg-card" />
      <div className="flex gap-3 overflow-hidden">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 w-36 shrink-0 animate-pulse rounded-2xl bg-card" />
        ))}
      </div>
      <div className="h-56 animate-pulse rounded-3xl bg-card" />
      <div className="h-48 animate-pulse rounded-3xl bg-card" />
    </div>
  )
}
