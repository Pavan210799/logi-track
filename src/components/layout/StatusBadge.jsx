import { formatStatus } from '../../utils/format.js'

// Colors for every status and priority
const badgeStyles = {
  on_trip: 'bg-blue-50 text-blue-700 ring-blue-200',
  available: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  assigned: 'bg-violet-50 text-violet-700 ring-violet-200',
  maintenance: 'bg-amber-50 text-amber-700 ring-amber-200',
  inactive: 'bg-gray-100 text-gray-600 ring-gray-200',
  off_duty: 'bg-slate-100 text-slate-600 ring-slate-200',
  pending: 'bg-slate-100 text-slate-700 ring-slate-200',
  in_transit: 'bg-sky-50 text-sky-700 ring-sky-200',
  delayed: 'bg-red-50 text-red-700 ring-red-200',
  delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  completed: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  in_progress: 'bg-amber-50 text-amber-700 ring-amber-200',
  scheduled: 'bg-violet-50 text-violet-700 ring-violet-200',
  urgent: 'bg-red-50 text-red-700 ring-red-200',
  express: 'bg-amber-50 text-amber-700 ring-amber-200',
  standard: 'bg-gray-100 text-gray-600 ring-gray-200',
}

function StatusBadge({ status }) {
  const style = badgeStyles[status] || 'bg-gray-100 text-gray-600 ring-gray-200'

  return (
    <span
      className={
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold whitespace-nowrap ring-1 ring-inset ' +
        style
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
      {formatStatus(status)}
    </span>
  )
}

export default StatusBadge
