import { useLocation } from 'react-router-dom'
import { menuItems } from '../../data/menu.js'
import { mockDb } from '../../data/mockDb.js'
import Logo from './Logo.jsx'
import NotificationBell from './NotificationBell.jsx'
import ThemeToggle from './ThemeToggle.jsx'

function Header() {
  const location = useLocation()
  const user = mockDb.currentUser

  // Find the current page, or use Dashboard
  const currentPage =
    menuItems.find(function (item) {
      return item.path === location.pathname
    }) || menuItems[0]
  const PageIcon = currentPage.icon

  // Initials from the name, like 'PK'
  const initials = user.name
    .split(' ')
    .map(function (word) {
      return word[0]
    })
    .join('')

  return (
    <header className="relative z-30 flex shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 sm:px-5 md:px-6 md:py-4">
      <div className="flex min-w-0 items-center gap-3">
        <Logo className="h-10 w-10 sm:hidden" />
        <div key={currentPage.path} className="hidden h-10.5 w-10.5 shrink-0 animate-pop-in place-items-center rounded-xl border border-line bg-linear-to-br from-surface to-sand text-accent shadow-sm sm:grid">
          <PageIcon size={22} />
        </div>
        <div className="min-w-0">
          <h1 key={currentPage.path} className="animate-fade-in truncate text-base leading-tight font-bold sm:text-lg">{currentPage.title}</h1>
          <p className="mt-0.5 hidden truncate text-[0.82rem] text-gray-500 md:block">{currentPage.subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <ThemeToggle />
        <NotificationBell />
        <div className="flex cursor-default items-center gap-2.5 rounded-full border border-line bg-surface p-1 transition duration-200 hover:border-burgundy/25 hover:shadow-md sm:pr-3">
          <div className="grid h-9.5 w-9.5 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy-light text-xs font-bold text-white">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
