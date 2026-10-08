import { useState } from 'react'
import { ChevronDown, Filter, SlidersHorizontal, X } from 'lucide-react'
import Button from './Button.jsx'
import SearchInput from './SearchInput.jsx'
import StatusTabs from './StatusTabs.jsx'

// Search, filters toggle, main action, filter panel, and status tabs for a list page
// The chosen filters only take effect when "Apply filters" is clicked
function ListToolbar({
  search,
  searchPlaceholder,
  onSearchChange,
  action,
  tabs,
  activeTab,
  onTabChange,
  filterCount,
  filterGrid,
  applying,
  onApplyFilters,
  onClearFilters,
  children,
}) {
  // Start open when a filter is already set, for example after a reload
  const [open, setOpen] = useState(filterCount > 0)

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface p-4 shadow-card sm:p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <SearchInput value={search} onChange={onSearchChange} placeholder={searchPlaceholder} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:w-96 lg:shrink-0">
          <button
            type="button"
            aria-expanded={open}
            onClick={function () {
              setOpen(!open)
            }}
            className={
              'group inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ' +
              (open || filterCount > 0
                ? 'border-burgundy/30 bg-burgundy/5 text-accent'
                : 'border-line bg-surface text-gray-700 hover:border-burgundy/40')
            }
          >
            <SlidersHorizontal size={16} className="transition-transform duration-300 group-hover:rotate-12" />
            Filters
            {filterCount > 0 && (
              <span className="grid h-5 min-w-5 animate-pop-in place-items-center rounded-full bg-burgundy px-1.5 text-[0.68rem] text-white">
                {filterCount}
              </span>
            )}
            <ChevronDown size={15} className={'transition-transform duration-300 ' + (open ? 'rotate-180' : '')} />
          </button>
          {action}
        </div>
      </div>

      {open && (
        <div className="flex animate-fade-down flex-col gap-3 rounded-xl border border-line bg-sand/70 p-3 sm:p-4">
          <div className={'grid grid-cols-1 gap-3 ' + (filterGrid || 'min-[440px]:grid-cols-2 lg:grid-cols-4')}>{children}</div>
          <div className="grid grid-cols-2 gap-3 border-t border-line pt-3 sm:flex sm:justify-end">
            <Button variant="secondary" onClick={onClearFilters} disabled={applying || filterCount === 0}>
              <X size={16} />
              Clear all
            </Button>
            <Button onClick={onApplyFilters} disabled={applying}>
              <Filter size={16} className={applying ? 'animate-pulse' : ''} />
              {applying ? 'Filtering...' : 'Apply filters'}
            </Button>
          </div>
        </div>
      )}

      <StatusTabs tabs={tabs} active={activeTab} onChange={onTabChange} />
    </div>
  )
}

export default ListToolbar
