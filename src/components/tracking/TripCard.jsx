import { ArrowRight } from 'lucide-react'
import NumberPlate from '../layout/NumberPlate.jsx'
import StatusBadge from '../layout/StatusBadge.jsx'
import { formatDateTime } from '../../utils/format.js'

// One trip in the list next to the map
function TripCard({ trip, isSelected, onSelect }) {
  const isLate = trip.lateMinutes > 0
  const barColor = trip.shipment.status === 'delayed' ? 'from-red-400 to-red-600' : 'from-blue-400 to-blue-600'

  return (
    <button
      type="button"
      onClick={function () {
        onSelect(trip.shipment.id)
      }}
      className={
        'group w-full cursor-pointer rounded-xl border p-3 text-left transition duration-200 hover:-translate-y-0.5 hover:shadow-md ' +
        (isSelected ? 'border-burgundy/40 bg-burgundy/[0.03] ring-2 ring-burgundy/15' : 'border-line bg-surface hover:border-burgundy/25')
      }
    >
      <div className="flex items-center justify-between gap-2">
        {trip.vehicle ? <NumberPlate number={trip.vehicle.registrationNumber} small /> : <span></span>}
        <StatusBadge status={trip.shipment.status} />
      </div>

      <p className="mt-2 truncate text-[0.85rem] font-bold text-gray-900">
        {trip.shipment.trackingNumber}
        <span className="font-medium text-gray-400"> · {trip.shipment.customerCompany}</span>
      </p>
      <p className="mt-0.5 flex min-w-0 items-center gap-1 text-[0.76rem] text-gray-500">
        <span className="truncate">{trip.pickup.city}</span>
        <ArrowRight size={12} className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
        <span className="truncate">{trip.delivery.city}</span>
        {trip.driver && <span className="truncate text-gray-400">· {trip.driver.name}</span>}
      </p>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className={'h-full rounded-full bg-linear-to-r transition-all duration-700 ' + barColor}
          style={{ width: trip.progress + '%' }}
        ></div>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2 text-[0.72rem]">
        <span className="text-gray-500">{trip.remainingKm} km left</span>
        <span className={'font-semibold ' + (isLate ? 'text-red-600' : 'text-emerald-600')}>ETA {formatDateTime(trip.eta)}</span>
      </div>
    </button>
  )
}

export default TripCard
