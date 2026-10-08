import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import { scrollToTop } from '../../utils/scroll.js'
import { useSession } from '../../hooks/useSession.js'

// App frame for signed-in users; everyone else goes to the login page first
function AppLayout() {
  const location = useLocation()
  const session = useSession()

  // Every page opens from the top
  useEffect(
    function () {
      scrollToTop()
    },
    [location.pathname],
  )

  if (!session) {
    const from = location.pathname === '/' ? undefined : location.pathname + location.search
    return <Navigate to="/login" replace state={from ? { from: from } : undefined} />
  }

  return (
    <div className="flex h-dvh overflow-hidden">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col sm:ml-20 xl:ml-63">
        <Header />
        {/* Only this area scrolls, and its scrollbar space is always kept so nothing shifts */}
        <main
          id="main-content"
          className="min-w-0 flex-1 overflow-y-auto px-4 pt-4 pb-24 [scrollbar-gutter:stable] sm:px-5 sm:pb-8 md:px-6 md:pt-5"
        >
          {/* A new key on each page replays the fade-in */}
          <div key={location.pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
