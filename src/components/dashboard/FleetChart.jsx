import DashboardPanel from './DashboardPanel.jsx'
import { ChartColumn } from 'lucide-react'

function FleetChart({ fleetActivityLog, totalVehicles }) {
  const title = 'Fleet Performance Overview'
  const color = 'var(--color-burgundy-light)'

  // Labels like 'Oct 6'
  const labels = fleetActivityLog.map(function (day) {
    return new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  })

  // Percent of vehicles used each day
  const values = fleetActivityLog.map(function (day) {
    return Math.round((day.activeVehicles / totalVehicles) * 100)
  })

  const width = 420
  const height = 200
  const padLeft = 36
  const padRight = 16
  const padTop = 20
  const padBottom = 32
  const chartW = width - padLeft - padRight
  const chartH = height - padTop - padBottom
  const max = 100
  const bottomY = padTop + chartH

  const points = values.map(function (value, index) {
    return {
      x: padLeft + index * (chartW / (values.length - 1)),
      y: bottomY - (value / max) * chartH,
      value: value,
    }
  })

  const linePoints = points
    .map(function (p) {
      return p.x + ',' + p.y
    })
    .join(' ')

  // Shape under the line for the shaded area
  const areaPoints =
    linePoints + ' ' + points[points.length - 1].x + ',' + bottomY + ' ' + points[0].x + ',' + bottomY

  return (
    <DashboardPanel
      icon={<ChartColumn size={20} />}
      title={title}
      subtitle="Daily vehicle utilization, last 10 days (%)"
    >
      <div className="grid min-h-52.5 flex-1 place-items-center">
        <svg viewBox={'0 0 ' + width + ' ' + height} className="h-auto w-full max-w-110" role="img" aria-label={title}>
          <defs>
            <linearGradient id="fleetAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map(function (tick) {
            const y = bottomY - (tick / max) * chartH
            return (
              <g key={tick}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} className="stroke-line-soft" />
                <text x={6} y={y + 4} className="fill-gray-400 text-[9px]">
                  {tick}
                </text>
              </g>
            )
          })}

          <polygon points={areaPoints} fill="url(#fleetAreaGradient)" />
          <polyline points={linePoints} fill="none" style={{ stroke: color }} strokeWidth="3" strokeLinejoin="round" />

          {points.map(function (p, index) {
            return (
              <g key={labels[index]}>
                <circle cx={p.x} cy={p.y} r="4.5" style={{ fill: 'var(--color-surface)', stroke: color }} strokeWidth="2.5" />
                <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-gray-500 text-[9px] font-bold">
                  {p.value}%
                </text>
                <text x={p.x} y={height - 10} textAnchor="middle" className="fill-gray-400 text-[9px]">
                  {labels[index]}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-2.5 flex justify-center text-[0.8rem] text-gray-500">
        <span className="flex items-center gap-1.5">
          <i className="inline-block h-0.75 w-4 rounded-full" style={{ background: color }}></i>
          Vehicle Utilization
        </span>
      </div>
    </DashboardPanel>
  )
}

export default FleetChart
