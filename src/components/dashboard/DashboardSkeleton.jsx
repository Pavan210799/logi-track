import Skeleton from '../layout/Skeleton.jsx'

const cardBox = 'rounded-2xl border border-line-soft bg-surface shadow-premium'
const fourColumns = 'grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4'
const barHeights = ['h-[70%]', 'h-[50%]', 'h-[80%]', 'h-[95%]', 'h-[60%]', 'h-[72%]', 'h-[90%]']

function StatCardSkeleton() {
  return (
    <div className={'flex flex-col gap-2.5 p-3.5 sm:px-4 sm:pt-4 sm:pb-3.5 ' + cardBox}>
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl sm:h-10 sm:w-10" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-10 sm:h-6 md:h-7" />
        <Skeleton className="h-5.75 w-12 rounded-full" />
      </div>
      <div className="flex h-4.25 items-center">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

function ChartCardSkeleton({ bars }) {
  return (
    <div className={'flex flex-col gap-4 p-5 ' + cardBox}>
      <div className="flex items-center gap-3 border-b border-line pb-4">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-3 w-52" />
        </div>
      </div>
      {bars ? (
        <div className="flex h-53 items-end justify-around gap-3 px-4">
          {barHeights.map(function (height, index) {
            return <Skeleton key={index} className={'w-full max-w-12 rounded-t-md rounded-b-none ' + height} />
          })}
        </div>
      ) : (
        <Skeleton className="h-60 rounded-xl lg:h-53" />
      )}
    </div>
  )
}

function ListCardSkeleton({ rows }) {
  const rowList = []
  for (let index = 0; index < rows; index++) {
    rowList.push(index)
  }

  return (
    <div className={'flex flex-col overflow-hidden ' + cardBox}>
      <div className="flex items-center gap-3 border-b border-line p-4">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        {rowList.map(function (index) {
          return (
            <div key={index} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-1/2" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Same layout as the Dashboard page, shown while its data loads
function DashboardSkeleton() {
  const statCards = [1, 2, 3, 4]

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5.5">
      <section className="flex flex-col gap-3">
        <Skeleton className="h-5.75 w-36" />
        <div className={fourColumns}>
          {statCards.map(function (number) {
            return <StatCardSkeleton key={number} />
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-5.75 w-40" />
        <div className={fourColumns}>
          {statCards.map(function (number) {
            return <StatCardSkeleton key={number} />
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-5.75 w-32" />
        <div className="grid grid-cols-1 gap-4 lg:min-h-97.5 lg:grid-cols-2">
          <ChartCardSkeleton bars />
          <ChartCardSkeleton />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <Skeleton className="h-5.75 w-24" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[65fr_35fr]">
          <ListCardSkeleton rows={6} />
          <ListCardSkeleton rows={6} />
        </div>
      </section>
    </div>
  )
}

export default DashboardSkeleton
