// Grey pulsing block shown in place of content while data loads
function Skeleton({ className }) {
  const classes = className || ''

  // Default rounding only when the caller did not pass its own
  const corners = classes.includes('rounded') ? '' : 'rounded-lg '

  return <div className={'skeleton-shimmer ' + corners + classes}></div>
}

export default Skeleton
