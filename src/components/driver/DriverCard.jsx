import { Eye, IdCard, MapPin, Package, Pencil, Star, Timer, Trash2, Truck } from 'lucide-react'
import StatusBadge from '../layout/StatusBadge.jsx'
import IconButton from '../layout/IconButton.jsx'
import NumberPlate from '../layout/NumberPlate.jsx'
import { daysUntil, formatDate, formatNumber, getInitials } from '../../utils/format.js'

// Top band color for each status
const bandColors = {
  on_trip: 'from-blue-500 via-blue-600 to-indigo-700',
  available: 'from-emerald-400 via-emerald-500 to-teal-600',
  assigned: 'from-violet-500 via-violet-600 to-purple-700',
  off_duty: 'from-slate-400 via-slate-500 to-slate-600',
}

// Colored box for one performance number
function MetricTile({ icon, label, value, style }) {
  const Icon = icon
  return (
    <div className={'min-w-0 rounded-xl px-1 py-2 text-center ' + style}>
      <p className="flex items-center justify-center gap-1 text-[0.95rem] leading-tight font-extrabold">
        <Icon size={13} className="shrink-0" />
        {value}
      </p>
      <p className="mt-0.5 truncate text-[0.6rem] font-bold text-gray-500 uppercase">{label}</p>
    </div>
  )
}

function DriverCard({ driver, vehicleNumber, onView, onEdit, onDelete }) {
  const isNew = driver.totalDeliveries === 0
  const daysLeft = daysUntil(driver.licenseExpiry)

  let licenseText = 'Valid till ' + formatDate(driver.licenseExpiry)
  let licenseStyle = 'bg-sand text-gray-600'
  if (daysLeft < 0) {
    licenseText = 'Expired on ' + formatDate(driver.licenseExpiry)
    licenseStyle = 'bg-red-50 text-red-700'
  } else if (daysLeft === 0) {
    licenseText = 'Expires today'
    licenseStyle = 'bg-amber-50 text-amber-700'
  } else if (daysLeft <= 30) {
    licenseText = 'Expires in ' + daysLeft + (daysLeft === 1 ? ' day' : ' days')
    licenseStyle = 'bg-amber-50 text-amber-700'
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface shadow-premium ring-1 ring-line-soft transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-premium-hover hover:ring-burgundy/15">
      <div className={'relative h-22 overflow-hidden bg-linear-135 ' + (bandColors[driver.status] || bandColors.off_duty)}>
        <span className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/10"></span>
        <span className="absolute -bottom-14 -left-6 h-24 w-24 rounded-full bg-white/10"></span>
        {isNew && (
          <span className="absolute top-3 left-3 rounded-full bg-white/20 px-2 py-0.5 text-[0.65rem] font-bold tracking-wide text-white ring-1 ring-white/30">
            NEW
          </span>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={driver.status} />
        </div>
      </div>

      <div className="relative -mt-10 flex flex-col items-center px-4 text-center">
        <div className="grid h-20 w-20 place-items-center rounded-full bg-linear-to-br from-burgundy-light to-burgundy-dark text-xl font-bold text-white shadow-lg ring-4 ring-surface transition duration-200 group-hover:scale-105">
          {getInitials(driver.name)}
        </div>
        <p className="mt-2.5 w-full truncate text-base font-bold">{driver.name}</p>
        <p className="mt-0.5 flex max-w-full items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} className="shrink-0" />
          <span className="truncate">
            {driver.city} · {driver.experienceYears} yrs exp
          </span>
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pt-4 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <MetricTile
            icon={Star}
            label="Rating"
            value={isNew ? '-' : driver.rating}
            style="bg-amber-50 text-amber-600"
          />
          <MetricTile
            icon={Package}
            label="Deliveries"
            value={formatNumber(driver.totalDeliveries)}
            style="bg-violet-50 text-violet-600"
          />
          <MetricTile
            icon={Timer}
            label="On time"
            value={isNew ? '-' : driver.onTimeRate + '%'}
            style="bg-emerald-50 text-emerald-600"
          />
        </div>

        <div className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-line px-2.5 py-2">
          <Truck size={16} className="shrink-0 text-gray-400" />
          {vehicleNumber ? (
            <NumberPlate number={vehicleNumber} small />
          ) : (
            <span className="text-[0.8rem] text-gray-400 italic">No vehicle assigned</span>
          )}
        </div>

        <p
          title={'License ' + licenseText.toLowerCase()}
          className={'mt-auto flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold ' + licenseStyle}
        >
          <IdCard size={13} className="shrink-0" />
          <span className="truncate">{licenseText}</span>
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-line bg-sand/60 px-3 py-2">
        <button
          type="button"
          onClick={onView}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-[0.8rem] font-semibold text-accent transition hover:bg-burgundy/5"
        >
          <Eye size={16} />
          View profile
        </button>
        <div className="flex shrink-0 items-center">
          <IconButton label="Edit driver" onClick={onEdit}>
            <Pencil size={16} />
          </IconButton>
          <IconButton label="Remove driver" danger onClick={onDelete}>
            <Trash2 size={16} />
          </IconButton>
        </div>
      </div>
    </article>
  )
}

export default DriverCard
