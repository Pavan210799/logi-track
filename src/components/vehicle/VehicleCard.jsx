import { Eye, Fuel, Gauge, Pencil, Trash2, Truck, UserRound, Weight, Wrench } from 'lucide-react'
import StatusBadge from '../layout/StatusBadge.jsx'
import IconButton from '../layout/IconButton.jsx'
import NumberPlate from '../layout/NumberPlate.jsx'
import { daysUntil, formatDate, formatNumber, fuelBarColor, getInitials } from '../../utils/format.js'

// Top band color for each status
const bandColors = {
  on_trip: 'from-blue-500 via-blue-600 to-indigo-700',
  available: 'from-emerald-400 via-emerald-500 to-teal-600',
  maintenance: 'from-amber-400 via-orange-500 to-orange-600',
  inactive: 'from-slate-400 via-slate-500 to-slate-600',
}

// Small grey box with an icon, a label and a value
function InfoTile({ icon, label, value }) {
  const Icon = icon
  return (
    <div className="min-w-0 rounded-xl bg-sand px-2 py-2">
      <p className="flex items-center gap-1 text-[0.65rem] font-semibold tracking-wide text-gray-500 uppercase">
        <Icon size={12} className="shrink-0" />
        {label}
      </p>
      <p className="mt-0.5 truncate text-[0.8rem] font-bold text-gray-800">{value}</p>
    </div>
  )
}

function VehicleCard({ vehicle, driverName, onView, onEdit, onDelete }) {
  const daysLeft = daysUntil(vehicle.nextServiceDate)

  let serviceText = 'Next service ' + formatDate(vehicle.nextServiceDate)
  let serviceStyle = 'bg-sand text-gray-600'
  if (daysLeft < 0) {
    serviceText = 'Service overdue by ' + Math.abs(daysLeft) + (daysLeft === -1 ? ' day' : ' days')
    serviceStyle = 'bg-red-50 text-red-700'
  } else if (daysLeft === 0) {
    serviceText = 'Service due today'
    serviceStyle = 'bg-amber-50 text-amber-700'
  } else if (daysLeft === 1) {
    serviceText = 'Service due tomorrow'
    serviceStyle = 'bg-amber-50 text-amber-700'
  } else if (daysLeft <= 7) {
    serviceText = 'Service due in ' + daysLeft + ' days'
    serviceStyle = 'bg-amber-50 text-amber-700'
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-premium ring-1 ring-line-soft transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-premium-hover hover:ring-burgundy/15">
      <div
        className={
          'relative overflow-hidden bg-linear-135 px-4 pt-4 pb-9 text-white ' +
          (bandColors[vehicle.status] || bandColors.inactive)
        }
      >
        <span className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/10"></span>
        <span className="absolute -bottom-14 left-12 h-24 w-24 rounded-full bg-white/10"></span>

        <div className="relative flex items-start justify-between gap-2">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/20 ring-1 ring-white/30 transition duration-200 group-hover:scale-105">
            <Truck size={22} />
          </div>
          <StatusBadge status={vehicle.status} />
        </div>
        <p className="relative mt-3 truncate text-[0.95rem] font-bold">
          {vehicle.make} {vehicle.model}
        </p>
        <p className="relative truncate text-xs text-white/80">
          {vehicle.type} · {vehicle.year}
        </p>
      </div>

      <div className="relative -mt-4.5 px-4">
        <NumberPlate number={vehicle.registrationNumber} />
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pt-3.5 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <InfoTile icon={Weight} label="Capacity" value={formatNumber(vehicle.capacityKg) + ' kg'} />
          <InfoTile icon={Gauge} label="Odometer" value={formatNumber(vehicle.odometerKm) + ' km'} />
        </div>

        <div className="flex items-center gap-2.5 rounded-xl border border-line px-2.5 py-2">
          {driverName ? (
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-burgundy-light to-burgundy text-[0.7rem] font-bold text-white">
              {getInitials(driverName)}
            </div>
          ) : (
            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-dashed border-gray-300 text-gray-400">
              <UserRound size={15} />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-[0.65rem] font-semibold tracking-wide text-gray-500 uppercase">Driver</p>
            <p
              className={
                driverName
                  ? 'truncate text-[0.82rem] font-bold text-gray-800'
                  : 'truncate pr-1 text-[0.82rem] font-medium text-gray-400 italic'
              }
            >
              {driverName || 'Not assigned'}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-semibold text-gray-600">
              <Fuel size={14} />
              {vehicle.fuelType}
            </span>
            <span className="font-bold text-gray-800">{vehicle.fuelLevel}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-100">
            <div
              className={'h-full rounded-full ' + fuelBarColor(vehicle.fuelLevel)}
              style={{ width: vehicle.fuelLevel + '%' }}
            ></div>
          </div>
        </div>

        <p className={'mt-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ' + serviceStyle}>
          <Wrench size={13} className="shrink-0" />
          <span className="truncate">{serviceText}</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line bg-sand/60 px-3 py-2">
        <button
          type="button"
          onClick={onView}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-[0.8rem] font-semibold text-accent transition hover:bg-burgundy/5"
        >
          <Eye size={16} />
          View details
        </button>
        <div className="flex shrink-0 items-center">
          <IconButton label="Edit vehicle" onClick={onEdit}>
            <Pencil size={16} />
          </IconButton>
          <IconButton label="Remove vehicle" danger onClick={onDelete}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>
    </article>
  )
}

export default VehicleCard
