// Columns on large screens, so every tab gets the same width
const tabColumns = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
}

// Two columns on small screens, one row of equal tabs on large screens
export function tabGridClass(count) {
  return 'grid grid-cols-2 gap-2 ' + (tabColumns[count] || 'lg:grid-cols-5')
}

// With an odd number of tabs, the first one spans both columns on small screens
export function firstTabSpan(index, count) {
  return index === 0 && count % 2 === 1 ? ' col-span-2 lg:col-span-1' : ''
}
