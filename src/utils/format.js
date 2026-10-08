// Show a date like 'Oct 6, 2026'
export function formatDate(dateText) {
  if (!dateText) {
    return '-'
  }
  return new Date(dateText.slice(0, 10) + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Show a date and time like 'Oct 6, 3:20 PM'
export function formatDateTime(dateText) {
  if (!dateText) {
    return '-'
  }
  return new Date(dateText).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

// Show a status like 'in_transit' as 'In Transit'
export function formatStatus(status) {
  return status
    .split('_')
    .map(function (word) {
      return word[0].toUpperCase() + word.slice(1)
    })
    .join(' ')
}

// Show a number like 125664 as '1,25,664'
export function formatNumber(value) {
  return Number(value).toLocaleString('en-IN')
}

// Initials from a name, like 'PK' for 'Pavan Kumar'
export function getInitials(name) {
  return name
    .split(' ')
    .map(function (word) {
      return word[0]
    })
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Fuel bar is red when low, amber when getting low, green when fine
export function fuelBarColor(level) {
  if (level < 20) {
    return 'bg-red-500'
  }
  if (level < 40) {
    return 'bg-amber-500'
  }
  return 'bg-emerald-500'
}

// Days from today until a date (negative if it has passed)
export function daysUntil(dateText) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateText.slice(0, 10) + 'T00:00:00')
  return Math.round((date - today) / (1000 * 60 * 60 * 24))
}

// Sorted list of different values, ready for FilterSelect
export function uniqueOptions(values) {
  const unique = []
  values.forEach(function (value) {
    if (value && !unique.includes(value)) {
      unique.push(value)
    }
  })
  unique.sort()

  return unique.map(function (value) {
    return { value: value, label: value }
  })
}

// Show a time like 'Oct 6, 3:20 PM' as '5 min ago', '3 hr ago' or '2 days ago'
export function timeAgo(dateText) {
  const minutes = Math.round((new Date() - new Date(dateText)) / (1000 * 60))
  if (minutes < 1) {
    return 'Just now'
  }
  if (minutes < 60) {
    return minutes + ' min ago'
  }
  const hours = Math.round(minutes / 60)
  if (hours < 24) {
    return hours + ' hr ago'
  }
  const days = Math.round(hours / 24)
  return days === 1 ? 'Yesterday' : days + ' days ago'
}

// Heading for a day in a list: 'Today', 'Yesterday' or the date
export function dayLabel(dateText) {
  const days = daysUntil(dateText)
  if (days === 0) {
    return 'Today'
  }
  if (days === -1) {
    return 'Yesterday'
  }
  return formatDate(dateText)
}

// A Date as local text like '2026-10-07T09:15:00', the format used in the data
export function toLocalText(date) {
  const copy = new Date(date)
  copy.setMinutes(copy.getMinutes() - copy.getTimezoneOffset())
  return copy.toISOString().slice(0, 19)
}

// Show minutes like 95 as '1 hr 35 min'
export function formatMinutes(totalMinutes) {
  const minutes = Math.abs(totalMinutes)
  if (minutes < 60) {
    return minutes + ' min'
  }
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? hours + ' hr' : hours + ' hr ' + rest + ' min'
}
