const tipWidth = 112
const tipHeight = 36

// Small tooltip drawn inside a chart's SVG; it glides between points and flips below when there is no room above
function ChartTooltip({ x, y, viewWidth, title, text }) {
  const left = Math.min(Math.max(x - tipWidth / 2, 2), viewWidth - tipWidth - 2)
  const above = y - tipHeight - 10 >= 0
  const top = above ? y - tipHeight - 10 : y + 12
  const pointerX = x - left

  return (
    <g pointerEvents="none" className="animate-fade-in">
      <g className="transition-transform duration-300 ease-out" style={{ transform: 'translate(' + left + 'px, ' + top + 'px)' }}>
        <rect width={tipWidth} height={tipHeight} rx="8" className="fill-gray-900 drop-shadow-lg" />
        <path
          d={above ? 'M' + (pointerX - 5) + ' ' + tipHeight + ' l5 5 l5 -5 Z' : 'M' + (pointerX - 5) + ' 0 l5 -5 l5 5 Z'}
          className="fill-gray-900"
        />
        <text x={tipWidth / 2} y="14" textAnchor="middle" className="fill-surface text-[8.5px] font-semibold opacity-75">
          {title}
        </text>
        <text x={tipWidth / 2} y="27" textAnchor="middle" className="fill-surface text-[9.5px] font-bold">
          {text}
        </text>
      </g>
    </g>
  )
}

export default ChartTooltip
