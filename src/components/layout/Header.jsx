import { useLocation } from 'react-router-dom'
import { menuItems } from '../../data/menu.js'
import Logo from './Logo.jsx'
import NotificationBell from './NotificationBell.jsx'
import ThemeToggle from './ThemeToggle.jsx'
import UserMenu from './UserMenu.jsx'

function Header() {
  const location = useLocation()

  // Find the current page, or use Dashboard
  const currentPage =
    menuItems.find(function (item) {
      return item.path === location.pathname
    }) || menuItems[0]
  const PageIcon = currentPage.icon

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
        <UserMenu />
      </div>
    </header>
  )
}

export default Header
