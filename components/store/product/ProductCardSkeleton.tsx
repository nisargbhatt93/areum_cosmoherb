export default function ProductCardSkeleton() {
  return (
    <div className="card">
      <div className="skeleton aspect-square" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-full rounded" />
        <div className="skeleton h-3 w-2/3 rounded" />
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded" />
          <div className="skeleton h-5 w-12 rounded" />
        </div>
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
