import Skeleton from '../layout/Skeleton.jsx'

// Same shape as DriverCard, shown while drivers load
function DriverCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-premium ring-1 ring-line-soft">
      <Skeleton className="h-22 rounded-none" />
      <div className="relative -mt-10 flex flex-col items-center px-4">
        <div className="h-20 w-20 rounded-full bg-surface p-1">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
        <Skeleton className="mt-3 h-5 w-32" />
        <Skeleton className="mt-1.5 h-3.5 w-24" />
      </div>

      <div className="flex flex-col gap-3 px-4 pt-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-12.75 rounded-xl" />
          <Skeleton className="h-12.75 rounded-xl" />
          <Skeleton className="h-12.75 rounded-xl" />
        </div>
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-7" />
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <Skeleton className="h-6.5 w-26" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

export default DriverCardSkeleton
