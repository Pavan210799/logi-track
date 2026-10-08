import { NavLink } from 'react-router-dom'
import { menuItems } from '../../data/menu.js'
import Logo from './Logo.jsx'

// Phone: bottom tab bar, tablet: icon rail, desktop: full sidebar
function Sidebar() {
  return (
    <aside className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-white/10 bg-linear-to-b from-burgundy-mid to-burgundy-dark dark:border-white/5 dark:from-[#241019] dark:via-[#160d13] dark:to-[#0e090c] pb-[env(safe-area-inset-bottom)] text-white sm:top-0 sm:right-auto sm:h-dvh sm:w-20 sm:border-t-0 sm:border-r sm:px-3 sm:py-5 xl:w-63 xl:px-4">
      {/* Soft glow behind the logo */}
      <div className="pointer-events-none absolute -top-16 -left-10 hidden h-48 w-48 rounded-full bg-white/10 blur-3xl sm:block"></div>

      <div className="group relative mb-7 hidden items-center justify-center gap-3 sm:flex xl:justify-start xl:px-1.5">
        <Logo className="h-10.5 w-10.5 transition duration-500 group-hover:rotate-[-8deg] group-hover:scale-110" />
        <div className="hidden xl:block">
          <span className="block text-lg leading-tight font-bold">LogiTrack</span>
          <span className="block text-xs text-[#f3d5da]">Fleet Platform</span>
        </div>
      </div>

      <nav className="relative grid grid-cols-6 gap-1 p-1.5 sm:flex sm:flex-col sm:gap-1.5 sm:p-0">
        {menuItems.map(function (item) {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              title={item.label}
              className={function ({ isActive }) {
                const base =
                  'group relative flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl py-2 text-[0.65rem] transition duration-200 sm:py-3 xl:flex-row xl:justify-start xl:gap-2.5 xl:px-3 xl:py-2.75 xl:text-sm'
                return isActive
                  ? base + ' bg-white/15 font-semibold text-white shadow-inner shadow-white/5'
                  : base + ' text-[#f7ecee] hover:bg-white/10 xl:hover:translate-x-1'
              }}
            >
              {function ({ isActive }) {
                return (
                  <>
                    {/* Bar that marks the open page: on top for phones, on the left for bigger screens */}
                    {isActive && (
                      <span className="absolute top-0 left-1/2 h-0.75 w-6 -translate-x-1/2 animate-pop-in rounded-b-full bg-white dark:bg-[#f0899c] sm:top-1/2 sm:left-0 sm:h-6 sm:w-0.75 sm:translate-x-0 sm:-translate-y-1/2 sm:rounded-r-full sm:rounded-bl-none"></span>
                    )}
                    <Icon size={19} className="shrink-0 transition-transform duration-200 group-hover:scale-115" />
                    <span className="max-w-full truncate sm:hidden xl:inline">{item.shortLabel || item.label}</span>
                  </>
                )
              }}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar
