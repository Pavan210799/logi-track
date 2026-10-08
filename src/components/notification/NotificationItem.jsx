import { Link } from 'react-router-dom'
import { ArrowRight, Clock, Mail, MailOpen, Trash2 } from 'lucide-react'
import IconButton from '../layout/IconButton.jsx'
import { formatDateTime, timeAgo } from '../../utils/format.js'
import { linkFor, notificationTypes, otherNotificationType, severityStyles } from './notificationTypes.js'

// One notification row with read and delete buttons
function NotificationItem({ notification, busy, onToggleRead, onDelete }) {
  const type = notificationTypes[notification.type] || otherNotificationType
  const severity = severityStyles[notification.severity] || severityStyles.info
  const Icon = type.icon
  const link = linkFor(notification)
  const isUnread = !notification.read

  return (
    <li
      className={
        'group relative flex gap-3 px-4 py-4 transition-colors duration-200 hover:bg-burgundy/[0.025] sm:gap-4 sm:px-5 ' +
        (isUnread ? 'bg-surface-warm' : '')
      }
    >
      {isUnread && <span className={'absolute inset-y-3 left-0 w-1 rounded-r-full ' + type.accent}></span>}

      <div
        className={
          'grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 transition duration-300 group-hover:scale-110 group-hover:-rotate-6 sm:h-11 sm:w-11 ' +
          type.iconBox
        }
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className={'text-[0.9rem] ' + (isUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-700')}>
            {notification.title}
          </p>
          <span className={'rounded-md px-1.5 py-0.5 text-[0.62rem] font-bold uppercase ' + severity.chip}>{severity.label}</span>
          {isUnread && (
            <span className="inline-flex items-center gap-1 text-[0.68rem] font-bold text-accent">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-burgundy"></span>
              New
            </span>
          )}
        </div>
        <p className="mt-1 text-[0.84rem] leading-snug break-words text-gray-600">{notification.message}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.74rem] text-gray-400">
          <span className="inline-flex items-center gap-1" title={formatDateTime(notification.createdAt)}>
            <Clock size={12} />
            {timeAgo(notification.createdAt)} · {formatDateTime(notification.createdAt)}
          </span>
          {link && (
            <Link
              to={link.to}
              className="group/link inline-flex items-center gap-1 font-semibold text-accent transition hover:text-burgundy-light"
            >
              {link.label}
              <ArrowRight size={13} className="transition-transform duration-200 group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
        <IconButton
          label={isUnread ? 'Mark as read' : 'Mark as unread'}
          onClick={function () {
            if (!busy) {
              onToggleRead(notification)
            }
          }}
        >
          {isUnread ? <MailOpen size={16} /> : <Mail size={16} />}
        </IconButton>
        <IconButton
          label="Delete notification"
          danger
          onClick={function () {
            if (!busy) {
              onDelete(notification)
            }
          }}
        >
          <Trash2 size={16} />
        </IconButton>
      </div>
    </li>
  )
}

export default NotificationItem
