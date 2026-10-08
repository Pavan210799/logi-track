import Skeleton from './Skeleton.jsx'
import { firstTabSpan, tabGridClass } from './tabGrid.js'

// Search box, filters and main buttons, and status tabs while the page loads
function ToolbarSkeleton({ tabCount }) {
  const tabs = []
  for (let index = 0; index < tabCount; index++) {
    tabs.push(index)
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <Skeleton className="h-10 w-full lg:flex-1" />
        <div className="grid grid-cols-2 gap-3 lg:w-96 lg:shrink-0">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </div>
      <div className={tabGridClass(tabCount)}>
        {tabs.map(function (index) {
          return <Skeleton key={index} className={'h-10 rounded-xl' + firstTabSpan(index, tabCount)} />
        })}
      </div>
    </div>
  )
}

export default ToolbarSkeleton
