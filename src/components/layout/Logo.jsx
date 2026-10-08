import { Truck } from 'lucide-react'

// Gold truck badge that stays visible on the burgundy sidebar, the white header and the dark theme
function Logo({ className = '' }) {
  return (
    <span
      role="img"
      aria-label="LogiTrack logo"
      className={
        'relative grid shrink-0 place-items-center overflow-hidden rounded-xl bg-linear-to-br from-amber-200 via-amber-400 to-orange-500 text-[#4f0d18] shadow-lg shadow-black/25 ring-1 ring-white/40 ' +
        className
      }
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-white/45 to-transparent"></span>
      <Truck className="relative h-[56%] w-[56%]" strokeWidth={2.4} />
    </span>
  )
}

export default Logo
