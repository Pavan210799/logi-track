import { Link } from 'react-router-dom'
import { ArrowRight, Bell, ChevronRight, CircleAlert, Clock, IdCard, Wrench } from 'lucide-react'
import { formatDateTime } from '../../utils/format.js'

// Icon and colors for each type of alert
const alertTypes = {
  shipment_delayed: {
    icon: Clock,
    stripe: 'bg-red-500',
    chip: 'bg-red-600 text-white',
    iconBox: 'bg-surface text-red-600 shadow-sm ring-1 ring-red-100',
    titleStyle: 'text-red-700',
  },
  maintenance_due: {
    icon: Wrench,
    stripe: 'bg-amber-500',
    chip: 'bg-amber-600 text-white',
    iconBox: 'bg-surface text-amber-600 shadow-sm ring-1 ring-amber-100',
    titleStyle: 'text-amber-800',
  },
  driver_status: {
    icon: IdCard,
    stripe: 'bg-violet-500',
    chip: 'bg-violet-600 text-white',
    iconBox: 'bg-surface text-violet-600 shadow-sm ring-1 ring-violet-100',
    titleStyle: 'text-violet-800',
  },
}

// Used for any type not listed above
const otherType = {
  icon: CircleAlert,
  stripe: 'bg-gray-400',
  chip: 'bg-gray-600 text-white',
  iconBox: 'bg-surface text-gray-600 shadow-sm ring-1 ring-gray-200',
  titleStyle: 'text-gray-800',
}

function AlertList({ notifications }) {
  // Unread danger and warning alerts only
  const importantAlerts = notifications.filter(function (item) {
    return !item.read && (item.severity === 'danger' || item.severity === 'warning')
  })

  const latestAlerts = []
  const typesShown = []
  importantAlerts.forEach(function (item) {
    if (latestAlerts.length < 3 && !typesShown.includes(item.type)) {
      latestAlerts.push(item)
      typesShown.push(item.type)
    }
  })

  return (
    <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-red-200/60 bg-linear-to-br from-[#fff5f5] via-surface to-[#fff9f0] dark:border-red-500/20 dark:from-[#25151a] dark:to-[#241b14] shadow-card">
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-red-200/30 blur-2xl"></div>
      <div className="pointer-events-none absolute -bottom-10 left-8 h-28 w-28 rounded-full bg-amber-200/25 blur-2xl"></div>

      <header className="relative flex items-start justify-between gap-3 border-b border-red-100/80 bg-linear-to-r from-burgundy-dark to-burgundy px-4 py-3.5 text-white">
        <div className="flex items-center gap-3">
          <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
            <Bell size={22} className="text-white" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-red-400 ring-2 ring-burgundy-dark"></span>
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight">Alerts</h2>
            <p className="mt-0.5 text-[0.78rem] text-[#f3d5da]">Issues that need attention</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full bg-white/20 px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-wide">
          {latestAlerts.length} active
        </span>
      </header>

      <ul className="relative flex flex-1 flex-col gap-3 p-4">
        {latestAlerts.map(function (item) {
          const style = alertTypes[item.type] || otherType
          const Icon = style.icon
          const severityLabel = item.severity === 'danger' ? 'Urgent' : 'Warning'

          return (
            <li key={item.id}>
              <Link
                to="/notifications"
                className="shine group relative flex items-center gap-3 overflow-hidden rounded-xl border border-surface/80 bg-surface/90 p-3 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-burgundy/20 hover:bg-surface hover:shadow-md"
              >
                <span className={'absolute inset-y-2 left-0 w-1 rounded-r-full transition-all duration-300 group-hover:inset-y-0 group-hover:w-1.5 ' + style.stripe}></span>
                <div className={'ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl transition duration-300 group-hover:scale-110 group-hover:-rotate-6 ' + style.iconBox}>
                  <Icon size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <strong className={'text-[0.88rem] font-bold ' + style.titleStyle}>{item.title}</strong>
                    <span className={'rounded-md px-1.5 py-0.5 text-[0.65rem] font-bold uppercase ' + style.chip}>
                      {severityLabel}
                    </span>
                  </div>
                  <p className="mb-2 text-[0.82rem] leading-snug text-gray-600">{item.message}</p>
                  <span className="inline-flex items-center gap-1 text-[0.72rem] font-medium text-gray-400">
                    <Clock size={12} className="opacity-70" />
                    {formatDateTime(item.createdAt)}
                  </span>
                </div>
                <ChevronRight
                  size={18}
                  className="shrink-0 -translate-x-2 text-gray-300 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:text-accent group-hover:opacity-100"
                />
              </Link>
            </li>
          )
        })}
      </ul>

      <Link
        to="/notifications"
        className="group relative flex items-center justify-center gap-1.5 border-t border-red-100/80 px-4 py-3 text-sm font-semibold text-accent transition hover:bg-surface/70"
      >
        View all alerts
        <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
      </Link>
    </section>
  )
}

export default AlertList
