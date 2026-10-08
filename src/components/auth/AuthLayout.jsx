import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useSession } from '../../hooks/useSession.js'
import AuthBackground from './AuthBackground.jsx'
import BrandPanel from './BrandPanel.jsx'
import Logo from '../layout/Logo.jsx'
import ThemeToggle from '../layout/ThemeToggle.jsx'

// Frame for login, signup and password pages; signed-in users go straight to the app
function AuthLayout() {
  const location = useLocation()
  const session = useSession()

  if (session) {
    return <Navigate to={(location.state && location.state.from) || '/'} replace />
  }

  return (
    <div className="relative min-h-dvh overflow-hidden bg-cream">
      <AuthBackground />

      <div className="absolute top-4 right-4 z-20 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-dvh w-full max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:px-10 lg:py-10">
        <BrandPanel />

        <div className="flex w-full flex-col items-center">
          <div className="mb-6 flex animate-fade-down items-center gap-3 lg:hidden">
            <Logo className="h-11 w-11" />
            <div>
              <p className="text-lg leading-tight font-bold">LogiTrack</p>
              <p className="text-xs text-gray-500">Fleet Platform</p>
            </div>
          </div>

          <main
            key={location.pathname}
            className="w-full max-w-md animate-scale-in rounded-3xl border border-line bg-surface/85 p-6 shadow-premium backdrop-blur-xl sm:p-8"
          >
            <Outlet />
          </main>

          <p className="mt-6 flex items-center gap-1.5 text-xs text-gray-500">
            <ShieldCheck size={14} className="text-emerald-600" />
            Secure fleet access · © 2026 LogiTrack
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
