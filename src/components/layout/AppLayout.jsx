import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Header from './Header.jsx'
import { scrollToTop } from '../../utils/scroll.js'

function AppLayout({ children }) {
  const location = useLocation()

  // Every page opens from the top
  useEffect(
    function () {
      scrollToTop()
    },
    [location.pathname],
  )

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
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
