import { Search } from 'lucide-react'

function SearchInput({ value, placeholder, onChange }) {
  return (
    <div className="group relative w-full">
      <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-accent" />
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={function (event) {
          onChange(event.target.value)
        }}
        className="h-10 w-full rounded-lg border border-line bg-surface pr-3 pl-9 text-sm transition outline-none hover:border-burgundy/30 focus:border-burgundy focus:shadow-sm focus:ring-4 focus:ring-burgundy/10"
      />
    </div>
  )
}

export default SearchInput
