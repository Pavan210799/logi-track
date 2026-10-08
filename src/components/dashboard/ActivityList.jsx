import {
  Activity,
  CircleCheck,
  PackageCheck,
  PackagePlus,
  PackageX,
  Pencil,
  Trash2,
  Truck,
  UserCheck,
  UserMinus,
  UserPen,
  UserPlus,
} from 'lucide-react'
import { formatDateTime } from '../../utils/format.js'

// Icon and colors for each type of activity
const activityTypes = {
  shipment_created: { icon: PackagePlus, ring: 'ring-violet-100', label: 'New' },
  shipment_picked_up: { icon: Truck, ring: 'ring-blue-100', label: 'Pickup' },
  shipment_delivered: { icon: CircleCheck, ring: 'ring-emerald-100', label: 'Done' },
  driver_assigned: { icon: UserCheck, ring: 'ring-amber-100', label: 'Assign' },
  shipment_updated: { icon: PackageCheck, ring: 'ring-sky-100', label: 'Edited' },
  shipment_removed: { icon: PackageX, ring: 'ring-red-100', label: 'Removed' },
  vehicle_added: { icon: Truck, ring: 'ring-emerald-100', label: 'Added' },
  vehicle_updated: { icon: Pencil, ring: 'ring-sky-100', label: 'Edited' },
  vehicle_removed: { icon: Trash2, ring: 'ring-red-100', label: 'Removed' },
  driver_added: { icon: UserPlus, ring: 'ring-emerald-100', label: 'Added' },
  driver_updated: { icon: UserPen, ring: 'ring-sky-100', label: 'Edited' },
  driver_removed: { icon: UserMinus, ring: 'ring-red-100', label: 'Removed' },
}

// Used for any type not listed above
const otherType = { icon: Activity, ring: 'ring-gray-100', label: 'Update' }

function ActivityList({ activities }) {
  const otherActivities = activities.filter(function (item) {
    return item.type !== 'shipment_delayed'
  })

  const latestActivities = []
  const typesShown = []
  otherActivities.forEach(function (item) {
    if (latestActivities.length < 4 && !typesShown.includes(item.type)) {
      latestActivities.push(item)
      typesShown.push(item.type)
    }
  })

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-emerald-200/50 bg-surface shadow-card">
      <div className="h-1.5 w-full bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600"></div>

      <header className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600 ring-2 ring-emerald-100">
            <Activity size={18} />
          </div>
          <div>
            <h2 className="text-[0.95rem] font-bold text-gray-900">Recent Activities</h2>
            <p className="text-[0.72rem] text-gray-500">Live fleet feed</p>
          </div>
        </div>
        <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[0.68rem] font-semibold text-emerald-700">Today</span>
      </header>

      <div className="flex-1 overflow-auto px-3 py-3">
        <ul className="flex flex-col gap-3">
          {latestActivities.map(function (item) {
            const type = activityTypes[item.type] || otherType
            const Icon = type.icon

            return (
              <li key={item.id} className="group flex items-center gap-3">
                <div
                  className={
                    'grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface text-gray-700 shadow-sm ring-4 transition duration-300 group-hover:scale-115 group-hover:-rotate-12 group-hover:text-accent group-hover:shadow-md ' +
                    type.ring
                  }
                >
                  <Icon size={15} />
                </div>

                <div className="min-w-0 flex-1 rounded-xl border border-line/80 bg-linear-to-br from-sand to-surface px-3 py-2.5 transition duration-300 group-hover:translate-x-1 group-hover:border-burgundy/20 group-hover:shadow-md">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide text-gray-600 transition-colors duration-300 group-hover:bg-burgundy/10 group-hover:text-accent">
                      {type.label}
                    </span>
                    <span className="shrink-0 text-[0.68rem] text-gray-400">{formatDateTime(item.createdAt)}</span>
                  </div>
                  <p className="text-[0.8rem] leading-snug font-medium text-gray-700 transition-colors duration-300 group-hover:text-gray-900">{item.message}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default ActivityList
