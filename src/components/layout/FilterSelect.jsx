import { inputClass } from './FormField.jsx'

const labelClass = 'text-[0.68rem] font-bold tracking-wide text-gray-500 uppercase'

// Highlighted border when a filter is in use
function filterInputClass(value) {
  return inputClass + ' cursor-pointer ' + (value ? 'border-burgundy/50 bg-burgundy/[0.03] font-semibold text-accent' : '')
}

// Dropdown filter, the first option clears it
export function FilterSelect({ label, value, allLabel, options, onChange, className }) {
  return (
    <label className={'flex min-w-0 flex-col gap-1 ' + (className || '')}>
      <span className={labelClass}>{label}</span>
      <select
        value={value}
        onChange={function (event) {
          onChange(event.target.value)
        }}
        className={filterInputClass(value)}
      >
        <option value="">{allLabel}</option>
        {options.map(function (option) {
          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )
        })}
      </select>
    </label>
  )
}

// Date filter, like 'From' or 'To'
export function FilterDate({ label, value, min, max, onChange }) {
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className={labelClass}>{label}</span>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={function (event) {
          onChange(event.target.value)
        }}
        className={filterInputClass(value)}
      />
    </label>
  )
}
