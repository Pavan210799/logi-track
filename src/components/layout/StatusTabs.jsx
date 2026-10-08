import { firstTabSpan, tabGridClass } from './tabGrid.js'

// Equal-width filter buttons like 'All 25', 'On Trip 16'
function StatusTabs({ tabs, active, onChange }) {
  return (
    <div className={tabGridClass(tabs.length)}>
      {tabs.map(function (tab, index) {
        const isActive = tab.value === active
        return (
          <button
            key={tab.value}
            type="button"
            onClick={function () {
              onChange(tab.value)
            }}
            className={
              'inline-flex h-10 min-w-0 cursor-pointer items-center justify-center gap-2 rounded-xl border px-3 text-[0.8rem] font-semibold transition duration-200 hover:-translate-y-0.5 active:translate-y-0 ' +
              (isActive
                ? 'border-burgundy bg-linear-to-br from-burgundy-light to-burgundy text-white shadow-glow'
                : 'border-line bg-surface text-gray-600 hover:border-burgundy/40 hover:text-accent hover:shadow-sm') +
              firstTabSpan(index, tabs.length)
            }
          >
            <span className="truncate">{tab.label}</span>
            <span
              className={
                'shrink-0 rounded-full px-1.5 py-0.5 text-[0.68rem] ' + (isActive ? 'bg-white/20' : 'bg-sand-dark text-gray-500')
              }
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default StatusTabs
