const routes = [
  { path: 'M-40 720 C 220 600, 380 820, 620 660 S 1000 420, 1480 520', duration: '16s' },
  { path: 'M-40 170 C 260 260, 420 70, 700 200 S 1120 360, 1480 130', duration: '19s' },
  { path: 'M280 960 C 420 720, 760 780, 900 520 S 1180 250, 1300 -60', duration: '14s' },
]

const pins = [
  { x: 620, y: 660 },
  { x: 700, y: 200 },
  { x: 900, y: 520 },
  { x: 1180, y: 330 },
]

// Shared backdrop for the auth pages: drifting brand glows, a dot grid and trucks moving along routes
function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[34rem] w-[34rem] animate-drift rounded-full bg-burgundy/20 blur-3xl dark:bg-burgundy/25"></div>
      <div className="absolute -right-40 -bottom-48 h-[38rem] w-[38rem] animate-drift rounded-full bg-amber-400/20 blur-3xl [animation-delay:-6s] dark:bg-amber-500/10"></div>
      <div className="absolute top-1/3 left-1/2 h-[26rem] w-[26rem] animate-drift rounded-full bg-rose-400/10 blur-3xl [animation-delay:-11s] dark:bg-violet-500/10"></div>

      <div className="absolute inset-0 bg-[radial-gradient(var(--color-line)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_80%)]"></div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
        {routes.map(function (route) {
          return (
            <g key={route.path}>
              <path d={route.path} fill="none" strokeWidth="2" className="stroke-burgundy/10" />
              <path d={route.path} fill="none" strokeWidth="2" strokeDasharray="6 10" strokeLinecap="round" className="animate-dash stroke-burgundy/30" />
              <g>
                <animateMotion dur={route.duration} repeatCount="indefinite" rotate="auto" path={route.path} />
                <circle r="12" className="fill-amber-400/25" />
                <rect x="-8" y="-5" width="16" height="10" rx="3" className="fill-burgundy" />
                <rect x="4" y="-4" width="5" height="8" rx="1.5" className="fill-amber-400" />
              </g>
            </g>
          )
        })}
        {pins.map(function (pin) {
          return (
            <g key={pin.x + '-' + pin.y} transform={'translate(' + pin.x + ' ' + pin.y + ')'}>
              <circle r="14" className="origin-center animate-ping-soft fill-burgundy/15 [transform-box:fill-box]" />
              <circle r="5" className="fill-burgundy" />
              <circle r="2" className="fill-surface" />
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default AuthBackground
