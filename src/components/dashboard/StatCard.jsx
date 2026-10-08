import {
  CircleCheck,
  Clock,
  MapPin,
  Package,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  Truck,
  Users,
  Wrench,
} from 'lucide-react'

// Icon for each card
const cardIcons = {
  vehicles: Truck,
  drivers: Users,
  shipments: Package,
  maintenance: Wrench,
  delivered: CircleCheck,
  inTransit: MapPin,
  delayed: TriangleAlert,
  pending: Clock,
}

// Colors for each card (full class names so Tailwind works)
const toneStyles = {
  orange: { accent: 'bg-orange-600', icon: 'from-orange-400 to-orange-600 shadow-orange-600/30' },
  purple: { accent: 'bg-violet-600', icon: 'from-violet-400 to-violet-600 shadow-violet-600/30' },
  blue: { accent: 'bg-blue-600', icon: 'from-blue-400 to-blue-600 shadow-blue-600/30' },
  amber: { accent: 'bg-amber-600', icon: 'from-amber-400 to-amber-600 shadow-amber-600/30' },
  green: { accent: 'bg-emerald-600', icon: 'from-emerald-400 to-emerald-600 shadow-emerald-600/30' },
  sky: { accent: 'bg-sky-600', icon: 'from-sky-400 to-sky-600 shadow-sky-600/30' },
  red: { accent: 'bg-red-600', icon: 'from-red-400 to-red-600 shadow-red-600/30' },
  slate: { accent: 'bg-slate-600', icon: 'from-slate-400 to-slate-600 shadow-slate-600/30' },
}

function StatCard({ label, value, lastWeek, tone, icon, note }) {
  const style = toneStyles[tone] || toneStyles.slate
  const CardIcon = cardIcons[icon] || Package

  // Percent change from last week
  const change = Math.round(((value - lastWeek) / lastWeek) * 100)
  const isUp = change >= 0

  // Green when going up, red when going down
  const trendColor = isUp ? 'bg-success-soft text-emerald-600' : 'bg-danger-soft text-red-600'

  return (
    <article className="relative flex h-full min-w-0 flex-col gap-2.5 overflow-hidden rounded-2xl border border-line-soft bg-linear-160 from-surface to-surface-2 p-3.5 shadow-premium sm:px-4 sm:pt-4 sm:pb-3.5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-premium-hover group">
      <span className={'absolute inset-x-0 top-0 h-0.75 ' + style.accent}></span>
      <span className={'absolute -right-7.5 -bottom-7.5 h-22.5 w-22.5 rounded-full opacity-[0.06] transition-transform duration-500 group-hover:scale-150 ' + style.accent}></span>

      <div className="flex items-center justify-between gap-2">
        <p className="min-w-0 text-[0.75rem] leading-snug font-semibold text-gray-500 sm:text-[0.8rem]">{label}</p>
        <div className={'grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-10 sm:w-10 ' + style.icon}>
          <CardIcon size={19} />
        </div>
      </div>

      {/* Number with its change badge beside it, message on the next line */}
      <div className="flex items-center gap-2">
        <p className="text-xl leading-none font-bold tracking-tight sm:text-2xl md:text-[1.75rem]">{value}</p>
        <span className={'inline-flex shrink-0 items-center gap-0.75 rounded-full px-2 py-0.75 text-[0.7rem] font-bold ' + trendColor}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </span>
      </div>

      <p className="truncate text-[0.72rem] text-gray-500">{note}</p>
    </article>
  )
}

export default StatCard
