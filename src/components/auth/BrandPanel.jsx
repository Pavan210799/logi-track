import { BellRing, MapPinned, Route, TrendingUp, Truck } from 'lucide-react'
import Logo from '../layout/Logo.jsx'

const features = [
  { icon: MapPinned, title: 'Live GPS tracking', text: 'Every truck on one map, refreshed in real time.' },
  { icon: Route, title: 'Smart dispatch', text: 'Assign drivers and vehicles in a couple of clicks.' },
  { icon: BellRing, title: 'Instant alerts', text: 'Delays, maintenance and licenses, flagged early.' },
]

// Left side of the auth pages on large screens
function BrandPanel() {
  return (
    <section className="relative hidden min-h-[38rem] flex-col overflow-hidden rounded-[2rem] bg-linear-to-br from-burgundy-light via-burgundy to-burgundy-dark p-10 text-white shadow-premium lg:flex dark:from-[#2b1221] dark:via-[#1c0e17] dark:to-[#110a0f] dark:ring-1 dark:ring-white/5">
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 animate-drift rounded-full bg-amber-300/20 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 animate-drift rounded-full bg-white/10 blur-3xl [animation-delay:-8s]"></div>
      <svg aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full opacity-40" viewBox="0 0 600 200" preserveAspectRatio="none">
        <path d="M-10 170 C 120 90, 220 200, 330 120 S 520 40, 610 90" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="6 10" className="animate-dash" />
      </svg>

      <div className="relative flex animate-fade-down items-center gap-3">
        <Logo className="h-11 w-11" />
        <div>
          <p className="text-lg leading-tight font-bold">LogiTrack</p>
          <p className="text-xs text-white/70">Fleet Platform</p>
        </div>
      </div>

      <div className="relative mt-12 animate-fade-up">
        <h2 className="text-4xl leading-[1.15] font-extrabold tracking-tight xl:text-[2.6rem]">
          Every shipment.
          <br />
          Every mile.
          <br />
          <span className="bg-linear-to-r from-amber-200 via-amber-300 to-orange-300 bg-clip-text text-transparent">One live view.</span>
        </h2>
        <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-white/75">
          Track vehicles, drivers and deliveries across India from a single, fast dashboard.
        </p>
      </div>

      <ul className="stagger relative mt-9 grid gap-4">
        {features.map(function (feature) {
          const Icon = feature.icon
          return (
            <li key={feature.title} className="group flex items-start gap-3.5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/10 ring-1 ring-white/15 transition duration-300 group-hover:scale-110 group-hover:bg-white/20">
                <Icon size={19} />
              </span>
              <div>
                <p className="text-sm font-bold">{feature.title}</p>
                <p className="text-[0.82rem] text-white/65">{feature.text}</p>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="relative mt-auto grid grid-cols-2 gap-3 pt-10">
        <div className="animate-float rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <TrendingUp size={14} className="text-emerald-300" />
            On-time rate
          </div>
          <p className="mt-1 text-2xl font-extrabold">98.2%</p>
        </div>
        <div className="animate-float rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-md [animation-delay:-3s]">
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-300"></span>
              <span className="relative h-2 w-2 rounded-full bg-emerald-300"></span>
            </span>
            Live now
          </div>
          <p className="mt-1 flex items-center gap-2 text-2xl font-extrabold">
            16 <Truck size={20} className="text-amber-300" />
          </p>
        </div>
      </div>
    </section>
  )
}

export default BrandPanel
