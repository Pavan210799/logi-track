import DashboardPanel from './DashboardPanel.jsx'
import { CircleCheck } from 'lucide-react'

function DeliveryChart({ fleetActivityLog }) {
  const title = 'Delivery Performance'
  const lastSevenDays = fleetActivityLog.slice(-7)

  // Labels like 'Mon'
  const labels = lastSevenDays.map(function (day) {
    return new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short' })
  })

  // Percent of deliveries on time each day
  const values = lastSevenDays.map(function (day) {
    return Math.round((day.onTime / day.deliveries) * 100)
  })

  const width = 420
  const height = 200
  const padLeft = 36
  const padRight = 16
  const padTop = 16
  const padBottom = 32
  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom
  const max = 100
  const barGap = 12
  const barWidth = (chartW - barGap * (values.length - 1)) / values.length

  return (
    <DashboardPanel
      icon={<CircleCheck size={20} />}
      title={title}
      subtitle="On-time delivery rate, last 7 days (%)"
    >
      <div className="grid min-h-52.5 flex-1 place-items-center">
        <svg viewBox={'0 0 ' + width + ' ' + height} className="h-auto w-full max-w-110" role="img" aria-label={title}>
          <defs>
            <linearGradient id="deliveryBarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: 'var(--color-burgundy-light)' }} />
              <stop offset="100%" style={{ stopColor: 'var(--color-burgundy)' }} />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map(function (tick) {
            const y = padTop + chartH - (tick / max) * chartH
            return (
              <g key={tick}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} className="stroke-line-soft" />
                <text x={6} y={y + 4} className="fill-gray-400 text-[9px]">
                  {tick}
                </text>
              </g>
            )
          })}

          {values.map(function (value, index) {
            const barH = (value / max) * chartH
            const x = padLeft + index * (barWidth + barGap)
            const y = padTop + chartH - barH
            return (
              <g key={labels[index]}>
                <rect x={x} y={y} width={barWidth} height={barH} rx="6" fill="url(#deliveryBarGradient)" />
                <text x={x + barWidth / 2} y={height - 10} textAnchor="middle" className="fill-gray-400 text-[9px]">
                  {labels[index]}
                </text>
                <text x={x + barWidth / 2} y={y - 6} textAnchor="middle" className="fill-gray-500 text-[9px] font-bold">
                  {value}%
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </DashboardPanel>
  )
}

export default DeliveryChart
