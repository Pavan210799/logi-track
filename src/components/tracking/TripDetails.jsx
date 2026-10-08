import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Gauge, Phone, UserRound, X } from 'lucide-react'
import NumberPlate from '../layout/NumberPlate.jsx'
import { formatDateTime, formatMinutes, formatStatus, timeAgo } from '../../utils/format.js'

// One stop on the route: pickup, current spot, or delivery
function RouteStop({ dotClass, label, title, text, isLast }) {
  return (
    <li className="relative flex gap-3 pb-4 last:pb-0">
      {!isLast && <span className="absolute top-4 bottom-0 left-[7px] w-0.5 bg-line"></span>}
      <span className={'relative mt-1 h-4 w-4 shrink-0 rounded-full border-[3px] border-surface shadow ' + dotClass}></span>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-bold tracking-wide text-gray-400 uppercase">{label}</p>
        <p className="truncate text-[0.85rem] font-semibold text-gray-900">{title}</p>
        <p className="text-[0.75rem] text-gray-500">{text}</p>
      </div>
    </li>
  )
}

// Details of the selected trip: arrival estimate, progress, route, vehicle, and driver
function TripDetails({ trip, onClose }) {
  const isLate = trip.lateMinutes > 0
  const shipment = trip.shipment

  return (
    <div className="animate-scale-in overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card">
      <div className="relative overflow-hidden bg-linear-to-br from-burgundy-light to-burgundy-dark px-4 py-3.5 text-white">
        <span className="pointer-events-none absolute -top-10 -right-6 h-28 w-28 animate-float rounded-full bg-white/10"></span>
        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[0.7rem] font-semibold tracking-wide text-white/70 uppercase">
              {formatStatus(shipment.status)} · {formatStatus(shipment.priority)}
            </p>
            <p className="truncate text-lg font-bold">{shipment.trackingNumber}</p>
            <p className="truncate text-[0.8rem] text-white/80">{shipment.customerCompany}</p>
          </div>
          <button
            type="button"
            aria-label="Close trip details"
            onClick={onClose}
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg bg-white/15 transition duration-200 hover:rotate-90 hover:bg-white/25"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className={'rounded-xl p-3 ' + (isLate ? 'bg-danger-soft' : 'bg-success-soft')}>
            <p className="text-[0.68rem] font-bold tracking-wide text-gray-500 uppercase">Estimated arrival</p>
            <p className={'mt-1 text-[0.95rem] font-extrabold ' + (isLate ? 'text-red-700' : 'text-emerald-700')}>
              {formatDateTime(trip.eta)}
            </p>
            <p className={'text-[0.72rem] font-semibold ' + (isLate ? 'text-red-600' : 'text-emerald-600')}>
              {isLate ? formatMinutes(trip.lateMinutes) + ' late' : 'On time'}
            </p>
          </div>
          <div className="rounded-xl bg-sand p-3">
            <p className="text-[0.68rem] font-bold tracking-wide text-gray-500 uppercase">Scheduled</p>
            <p className="mt-1 text-[0.95rem] font-extrabold text-gray-800">{formatDateTime(shipment.scheduledDelivery)}</p>
            <p className="text-[0.72rem] text-gray-500">{shipment.distanceKm} km trip</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-[0.75rem]">
            <span className="font-semibold text-gray-700">Trip progress</span>
            <span className="font-bold text-accent">{trip.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-burgundy-light to-burgundy transition-all duration-700"
              style={{ width: trip.progress + '%' }}
            ></div>
          </div>
          <p className="mt-1.5 text-[0.72rem] text-gray-500">
            {trip.doneKm} km done · {trip.remainingKm} km left
          </p>
        </div>

        <ul>
          <RouteStop
            dotClass="bg-emerald-500"
            label="Pickup"
            title={trip.pickup.name}
            text={trip.pickup.city + ' · ' + formatDateTime(shipment.pickupDate)}
          />
          <RouteStop
            dotClass={(shipment.status === 'delayed' ? 'bg-red-500' : 'bg-blue-500') + ' animate-pulse'}
            label="Now"
            title={trip.position.speedKmh + ' km/h'}
            text={'Updated ' + timeAgo(trip.position.updatedAt)}
          />
          <RouteStop
            dotClass="bg-burgundy"
            label="Delivery"
            title={trip.delivery.name}
            text={trip.delivery.city + ' · ' + trip.delivery.address}
            isLast
          />
        </ul>

        <div className="grid gap-2 rounded-xl border border-line p-3">
          {trip.vehicle && (
            <div className="flex items-center justify-between gap-2">
              <NumberPlate number={trip.vehicle.registrationNumber} small />
              <span className="inline-flex items-center gap-1 truncate text-[0.75rem] text-gray-500">
                <Gauge size={13} className="shrink-0" />
                {trip.vehicle.make} {trip.vehicle.model}
              </span>
            </div>
          )}
          {trip.driver && (
            <div className="flex items-center justify-between gap-2 text-[0.8rem]">
              <span className="inline-flex min-w-0 items-center gap-1.5 font-semibold text-gray-800">
                <UserRound size={14} className="shrink-0 text-gray-400" />
                <span className="truncate">{trip.driver.name}</span>
              </span>
              <a
                href={'tel:' + trip.driver.phone.replace(/\s/g, '')}
                className="inline-flex shrink-0 items-center gap-1 text-[0.75rem] font-semibold text-accent hover:underline"
              >
                <Phone size={12} />
                {trip.driver.phone}
              </a>
            </div>
          )}
        </div>

        <Link
          to={'/shipments?view=' + shipment.id}
          className="group inline-flex items-center justify-center gap-1.5 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-accent transition hover:-translate-y-0.5 hover:border-burgundy/30 hover:shadow-md"
        >
          <Clock size={15} />
          Full shipment history
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}

export default TripDetails
