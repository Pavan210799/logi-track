import Skeleton from '../layout/Skeleton.jsx'

// One line of text: the row keeps the text height, the bar is a bit thinner
function TextLine({ height, width }) {
  return (
    <div className={'flex items-center ' + height}>
      <Skeleton className={'h-3 ' + width} />
    </div>
  )
}

// Same columns as ShipmentTable, shown while shipments load
function ShipmentTableSkeleton({ rows }) {
  const rowList = []
  for (let index = 0; index < rows; index++) {
    rowList.push(index)
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-sand text-[0.7rem] font-bold tracking-wide text-gray-500 uppercase">
        <tr>
          <th className="px-4 py-3">Shipment</th>
          <th className="hidden px-4 py-3 md:table-cell">Route</th>
          <th className="hidden px-4 py-3 xl:table-cell">Driver and vehicle</th>
          <th className="hidden px-4 py-3 lg:table-cell">Delivery</th>
          <th className="hidden px-4 py-3 sm:table-cell">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {rowList.map(function (index) {
          return (
            <tr key={index}>
              <td className="px-4 py-3">
                <TextLine height="h-5" width="w-32" />
                <TextLine height="h-4" width="w-24" />
                <div className="mt-1 md:hidden">
                  <TextLine height="h-4" width="w-36" />
                </div>
                <Skeleton className="mt-1.5 h-6 w-20 rounded-full sm:hidden" />
              </td>
              <td className="hidden px-4 py-3 md:table-cell">
                <TextLine height="h-5" width="w-36" />
                <TextLine height="h-4" width="w-14" />
              </td>
              <td className="hidden px-4 py-3 xl:table-cell">
                <TextLine height="h-5" width="w-28" />
                <TextLine height="h-4" width="w-24" />
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                <TextLine height="h-5" width="w-28" />
                <TextLine height="h-4" width="w-12" />
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <Skeleton className="h-6 w-22 rounded-full" />
              </td>
              <td className="px-3 py-3">
                <Skeleton className="ml-auto h-8.5 w-24" />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ShipmentTableSkeleton
