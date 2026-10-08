import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, LogOut, Mail, ShieldCheck } from 'lucide-react'
import { logout } from '../../api/auth.js'
import { useSession } from '../../hooks/useSession.js'
import { initialsOf } from '../../utils/authValidation.js'

// Signed-in user pill in the header; opens a small menu with a logout button
function UserMenu() {
  const session = useSession()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(
    function () {
      if (!open) {
        return
      }
      function handleClick(event) {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setOpen(false)
        }
      }
      function handleKey(event) {
        if (event.key === 'Escape') {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleKey)
      return function () {
        document.removeEventListener('mousedown', handleClick)
        document.removeEventListener('keydown', handleKey)
      }
    },
    [open],
  )

  if (!session) {
    return null
  }

  const initials = initialsOf(session.name)

  function handleLogout() {
    navigate('/login', { replace: true })
    logout()
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={function () {
          setOpen(!open)
        }}
        aria-haspopup="menu"
        aria-expanded={open}
        className={
          'group flex cursor-pointer items-center gap-2.5 rounded-full border bg-surface p-1 transition duration-200 hover:border-burgundy/25 hover:shadow-md sm:pr-3 ' +
          (open ? 'border-burgundy/40 shadow-md' : 'border-line')
        }
      >
        <span className="grid h-9.5 w-9.5 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy-light text-xs font-bold text-white">
          {initials}
        </span>
        <span className="hidden max-w-36 text-left sm:block">
          <span className="block truncate text-sm font-bold">{session.name}</span>
          <span className="block truncate text-xs text-gray-500">{session.role}</span>
        </span>
        <ChevronDown size={16} className={'hidden text-gray-400 transition-transform duration-300 sm:block ' + (open ? 'rotate-180' : '')} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-13 right-0 w-[min(17rem,calc(100vw-2rem))] origin-top-right animate-scale-in rounded-2xl border border-line bg-surface p-2 shadow-premium-hover"
        >
          <div className="flex items-center gap-3 rounded-xl bg-linear-to-br from-sand to-surface p-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy-light text-sm font-bold text-white shadow-glow">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{session.name}</p>
              <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                <Mail size={12} className="shrink-0" />
                <span className="truncate">{session.email}</span>
              </p>
            </div>
          </div>
          <p className="mx-3 mt-2 mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[0.7rem] font-semibold text-emerald-700 ring-1 ring-emerald-100">
            <ShieldCheck size={13} />
            {session.role}
          </p>
          <div className="my-1.5 h-px bg-line"></div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            Log out
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
