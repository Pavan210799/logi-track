import Skeleton from '../layout/Skeleton.jsx'

// Same shape as VehicleCard, shown while vehicles load
function VehicleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-surface shadow-premium ring-1 ring-line-soft">
      <Skeleton className="h-36.75 rounded-none" />
      <div className="relative -mt-4.5 px-4">
        <div className="h-8 w-40 rounded-md bg-surface p-0.5">
          <Skeleton className="h-full w-full rounded-md" />
        </div>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-3.5 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-13.25 rounded-xl" />
          <Skeleton className="h-13.25 rounded-xl" />
        </div>
        <Skeleton className="h-13.25 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <Skeleton className="h-7" />
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <Skeleton className="h-6.5 w-26" />
        <Skeleton className="h-6 w-16" />
      </div>
    </div>
  )
}

export default VehicleCardSkeleton
