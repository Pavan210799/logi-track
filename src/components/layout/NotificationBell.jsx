import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Bell, BellOff } from 'lucide-react'
import { loadDb } from '../../api/db.js'
import { timeAgo } from '../../utils/format.js'
import { linkFor, notificationTypes, otherNotificationType } from '../notification/notificationTypes.js'

// Newest unread notifications from the saved data
function getUnread() {
  return loadDb()
    .notifications.filter(function (item) {
      return !item.read
    })
    .sort(function (a, b) {
      return b.createdAt.localeCompare(a.createdAt)
    })
}

// Bell with the unread count, and a small list that opens on click
function NotificationBell() {
  const [unread, setUnread] = useState(getUnread)
  const [open, setOpen] = useState(false)
  const boxRef = useRef(null)

  // Update the count whenever data is saved, here or in another tab
  useEffect(function () {
    function update() {
      setUnread(getUnread())
    }
    window.addEventListener('logitrack-change', update)
    window.addEventListener('storage', update)
    return function () {
      window.removeEventListener('logitrack-change', update)
      window.removeEventListener('storage', update)
    }
  }, [])

  // Close the list when clicking anywhere else
  useEffect(
    function () {
      function handleClick(event) {
        if (boxRef.current && !boxRef.current.contains(event.target)) {
          setOpen(false)
        }
      }
      if (open) {
        document.addEventListener('mousedown', handleClick)
      }
      return function () {
        document.removeEventListener('mousedown', handleClick)
      }
    },
    [open],
  )

  function close() {
    setOpen(false)
  }

  const latest = unread.slice(0, 5)

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={'Notifications, ' + unread.length + ' unread'}
        aria-expanded={open}
        onClick={function () {
          setOpen(!open)
        }}
        className={
          'group relative grid h-10 w-10 cursor-pointer place-items-center rounded-xl border bg-surface transition duration-200 hover:-translate-y-0.5 hover:border-burgundy/30 hover:text-accent hover:shadow-md ' +
          (open ? 'border-burgundy/40 text-accent shadow-md' : 'border-line')
        }
      >
        <Bell size={18} className="origin-top transition-transform group-hover:animate-[bell-ring_0.6s_ease-in-out]" />
        {unread.length > 0 && (
          <span className="absolute -top-1.5 -right-1.5 grid h-5 min-w-5 animate-pop-in place-items-center rounded-full bg-red-600 px-1 text-[0.65rem] font-bold text-white ring-2 ring-surface">
            {unread.length > 99 ? '99+' : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-x-3 top-17 z-50 animate-fade-down overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl sm:absolute sm:inset-x-auto sm:top-12 sm:right-0 sm:w-88">
          <div className="flex items-center justify-between gap-2 border-b border-line bg-linear-to-r from-burgundy-dark to-burgundy px-4 py-3 text-white">
            <p className="text-sm font-bold">Notifications</p>
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-[0.7rem] font-bold">{unread.length} unread</span>
          </div>

          {latest.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-gray-500">
              <BellOff size={22} className="text-gray-400" />
              You are all caught up
            </div>
          ) : (
            <ul className="stagger max-h-[min(20rem,calc(100dvh-15rem))] divide-y divide-line overflow-y-auto">
              {latest.map(function (item) {
                const type = notificationTypes[item.type] || otherNotificationType
                const Icon = type.icon
                const link = linkFor(item)
                return (
                  <li key={item.id}>
                    <Link
                      to={link ? link.to : '/notifications'}
                      onClick={close}
                      className="flex gap-3 px-4 py-3 transition-colors hover:bg-sand"
                    >
                      <span className={'grid h-9 w-9 shrink-0 place-items-center rounded-lg ring-1 ' + type.iconBox}>
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.82rem] font-bold text-gray-900">{item.title}</span>
                        <span className="line-clamp-2 text-[0.76rem] leading-snug text-gray-500">{item.message}</span>
                        <span className="mt-0.5 block text-[0.68rem] text-gray-400">{timeAgo(item.createdAt)}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}

          <Link
            to="/notifications"
            onClick={close}
            className="group flex items-center justify-center gap-1.5 border-t border-line bg-sand px-4 py-3 text-sm font-semibold text-accent transition hover:bg-sand-dark"
          >
            View all notifications
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
