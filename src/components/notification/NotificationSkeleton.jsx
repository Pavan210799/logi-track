import Skeleton from '../layout/Skeleton.jsx'

// Same shape as the notification rows, shown while they load
function NotificationSkeleton({ rows }) {
  const rowList = []
  for (let index = 0; index < rows; index++) {
    rowList.push(index)
  }

  return (
    <ul className="divide-y divide-line">
      {rowList.map(function (index) {
        return (
          <li key={index} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl sm:h-11 sm:w-11" />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40 max-w-full" />
              <Skeleton className="h-3.5 w-full max-w-md" />
              <Skeleton className="h-3 w-48 max-w-full" />
            </div>
            <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
              <Skeleton className="h-8.5 w-8.5" />
              <Skeleton className="h-8.5 w-8.5" />
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default NotificationSkeleton
