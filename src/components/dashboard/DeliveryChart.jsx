import { useState } from 'react'
import DashboardPanel from './DashboardPanel.jsx'
import ChartTooltip from './ChartTooltip.jsx'
import { CircleCheck } from 'lucide-react'

function fullDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function DeliveryChart({ fleetActivityLog }) {
  const title = 'Delivery Performance'
  const lastSevenDays = fleetActivityLog.slice(-7)
  const [activeIndex, setActiveIndex] = useState(null)

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
        <svg
          viewBox={'0 0 ' + width + ' ' + height}
          className="h-auto w-full max-w-110"
          role="img"
          aria-label={title}
          onMouseLeave={function () {
            setActiveIndex(null)
          }}
        >
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
            const isActive = activeIndex === index
            const isDimmed = activeIndex !== null && !isActive
            return (
              <g
                key={labels[index]}
                className="cursor-pointer"
                onMouseEnter={function () {
                  setActiveIndex(index)
                }}
                onClick={function () {
                  setActiveIndex(index)
                }}
              >
                <rect
                  x={x - barGap / 2}
                  y={padTop}
                  width={barWidth + barGap}
                  height={chartH}
                  rx="8"
                  className={'transition-opacity duration-200 fill-burgundy/5 ' + (isActive ? 'opacity-100' : 'opacity-0')}
                />
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx="6"
                  fill="url(#deliveryBarGradient)"
                  className={
                    'transition-[opacity,filter] duration-300 ' +
                    (isDimmed ? 'opacity-40 ' : 'opacity-100 ') +
                    (isActive ? 'drop-shadow-[0_6px_10px_rgba(107,18,32,0.35)] brightness-110' : '')
                  }
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className={'text-[9px] transition-colors ' + (isActive ? 'fill-accent font-bold' : 'fill-gray-400')}
                >
                  {labels[index]}
                </text>
                {!isActive && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className={'fill-gray-500 text-[9px] font-bold transition-opacity duration-300 ' + (isDimmed ? 'opacity-40' : '')}
                  >
                    {value}%
                  </text>
                )}
              </g>
            )
          })}

          {activeIndex !== null && (
            <ChartTooltip
              x={padLeft + activeIndex * (barWidth + barGap) + barWidth / 2}
              y={padTop + chartH - (values[activeIndex] / max) * chartH}
              viewWidth={width}
              title={fullDate(lastSevenDays[activeIndex].date)}
              text={values[activeIndex] + '% · ' + lastSevenDays[activeIndex].onTime + '/' + lastSevenDays[activeIndex].deliveries + ' on time'}
            />
          )}
        </svg>
      </div>
    </DashboardPanel>
  )
}

export default DeliveryChart
