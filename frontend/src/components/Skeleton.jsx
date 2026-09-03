export default function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true">
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-2xl bg-line/70" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 animate-pulse rounded-2xl bg-line/70 lg:col-span-1" />
        <div className="h-64 animate-pulse rounded-2xl bg-line/70 lg:col-span-1" />
        <div className="h-64 animate-pulse rounded-2xl bg-line/70 lg:col-span-1" />
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-line/70" />
    </div>
  )
}
