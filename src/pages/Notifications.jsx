import { useCallback, useEffect, useState } from 'react'
import { Bell, CheckCheck, Siren } from 'lucide-react'
import {
  deleteNotification,
  getNotificationData,
  markAllNotificationsRead,
  setNotificationRead,
} from '../api/notifications.js'
import Button from '../components/layout/Button.jsx'
import Toast from '../components/layout/Toast.jsx'
import Pagination from '../components/layout/Pagination.jsx'
import ListToolbar from '../components/layout/ListToolbar.jsx'
import { FilterDate, FilterSelect } from '../components/layout/FilterSelect.jsx'
import { EmptyState, ErrorState } from '../components/layout/PageStates.jsx'
import ToolbarSkeleton from '../components/layout/ToolbarSkeleton.jsx'
import Skeleton from '../components/layout/Skeleton.jsx'
import NotificationItem from '../components/notification/NotificationItem.jsx'
import NotificationSkeleton from '../components/notification/NotificationSkeleton.jsx'
import { notificationTypes } from '../components/notification/notificationTypes.js'
import useListParams from '../hooks/useListParams.js'
import usePendingFilters from '../hooks/usePendingFilters.js'
import { dayLabel } from '../utils/format.js'
import { scrollToTop } from '../utils/scroll.js'
import { skeletonTime, wait } from '../utils/wait.js'

const pageSize = 10

// Extra filters kept in the address bar
const filterNames = ['read', 'severity', 'from', 'to']

const readOptions = [
  { value: 'unread', label: 'Unread only' },
  { value: 'read', label: 'Read only' },
]

const severityOptions = [
  { value: 'danger', label: 'Urgent' },
  { value: 'warning', label: 'Warning' },
  { value: 'success', label: 'Success' },
  { value: 'info', label: 'Info' },
]

// Gradient for each summary card
const summaryStyles = {
  all: 'from-burgundy-light to-burgundy-dark',
  shipment_delayed: 'from-red-500 to-red-700',
  maintenance_due: 'from-amber-400 to-amber-600',
  delivery_update: 'from-emerald-400 to-emerald-600',
  driver_status: 'from-violet-500 to-violet-700',
  urgent: 'from-rose-500 to-pink-700',
}

const summaryGrid = 'stagger grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 min-[87.5rem]:grid-cols-6'

function Notifications() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pageLoading, setPageLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [toast, setToast] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const { getParam, search, statusFilter, page, setParams } = useListParams()

  const refreshData = useCallback(async function () {
    const result = await getNotificationData()
    setData(result)
  }, [])

  const {
    draft: filterDraft,
    setDraftFilter,
    applyFilters,
    clearAppliedFilters,
    filterLoading,
  } = usePendingFilters(filterNames, getParam, setParams, refreshData)

  // Get notifications when the page opens, and again on Try again
  useEffect(
    function () {
      async function firstLoad() {
        try {
          const minimumWait = wait(skeletonTime)
          const result = await getNotificationData()
          await minimumWait
          setData(result)
          setError('')
        } catch (err) {
          console.error(err)
          setError('Could not load notifications.')
        } finally {
          setLoading(false)
        }
      }

      firstLoad()
    },
    [retryCount],
  )

  function changeSearch(text) {
    setParams({ search: text, page: 1 })
  }

  function changeStatusFilter(type) {
    setParams({ status: type, page: 1 })
  }

  // Urgent summary card toggles severity in the address bar
  function changeFilter(name, value) {
    setParams({ [name]: value, page: 1 })
  }

  async function handleApplyFilters() {
    try {
      await applyFilters()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Could not apply filters. Please try again.' })
    }
  }

  async function handleClearFilters() {
    try {
      await clearAppliedFilters()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Could not clear filters. Please try again.' })
    }
  }

  // Get the data again for the new page, with skeleton rows while it loads
  async function changePage(number) {
    setParams({ page: number })
    scrollToTop(true)
    setPageLoading(true)
    try {
      const minimumWait = wait(skeletonTime)
      await refreshData()
      await minimumWait
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Could not load this page. Please try again.' })
    } finally {
      setPageLoading(false)
    }
  }

  // Runs one change, then reloads the list and shows a message
  async function runAction(action, message) {
    setBusy(true)
    try {
      await action()
      await refreshData()
      setToast({ type: 'success', message: message })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.message })
    } finally {
      setBusy(false)
    }
  }

  function handleToggleRead(notification) {
    runAction(
      function () {
        return setNotificationRead(notification.id, !notification.read)
      },
      notification.read ? 'Marked as unread' : 'Marked as read',
    )
  }

  function handleMarkAll() {
    runAction(markAllNotificationsRead, 'All notifications marked as read')
  }

  function handleDelete(notification) {
    runAction(function () {
      return deleteNotification(notification.id)
    }, 'Notification deleted')
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className={summaryGrid}>
          {[1, 2, 3, 4, 5, 6].map(function (number) {
            return <Skeleton key={number} className="h-25.5 rounded-2xl" />
          })}
        </div>
        <ToolbarSkeleton tabCount={5} />
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card">
          <NotificationSkeleton rows={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <ErrorState
        text={error}
        onRetry={function () {
          setLoading(true)
          setRetryCount(retryCount + 1)
        }}
      />
    )
  }

  const notifications = data.notifications
  const unreadCount = notifications.filter(function (item) {
    return !item.read
  }).length

  function countOfType(type, onlyUnread) {
    return notifications.filter(function (item) {
      return item.type === type && (!onlyUnread || !item.read)
    }).length
  }

  const typeNames = Object.keys(notificationTypes)

  const readFilter = getParam('read')
  const severityFilter = getParam('severity')

  const urgentItems = notifications.filter(function (item) {
    return item.severity === 'danger'
  })
  const urgentUnread = urgentItems.filter(function (item) {
    return !item.read
  }).length

  // Each card filters the list: by type, or by urgent severity for the last one
  const summaryCards = [
    {
      value: 'all',
      label: 'Unread',
      icon: Bell,
      unread: unreadCount,
      total: notifications.length,
      // Summary only — no selected ring (default "all" would always look active)
      isActive: false,
      onClick: function () {
        changeStatusFilter('all')
      },
    },
  ]
  typeNames.forEach(function (type) {
    summaryCards.push({
      value: type,
      label: notificationTypes[type].label,
      icon: notificationTypes[type].icon,
      unread: countOfType(type, true),
      total: countOfType(type, false),
      isActive: statusFilter === type,
      onClick: function () {
        changeStatusFilter(type)
      },
    })
  })
  summaryCards.push({
    value: 'urgent',
    label: 'Urgent',
    icon: Siren,
    unread: urgentUnread,
    total: urgentItems.length,
    isActive: severityFilter === 'danger',
    onClick: function () {
      changeFilter('severity', severityFilter === 'danger' ? null : 'danger')
    },
  })

  const dateFrom = getParam('from')
  const dateTo = getParam('to')
  const activeFilterCount = filterNames.filter(function (name) {
    return getParam(name)
  }).length

  function matchesFilters(item) {
    const day = item.createdAt.slice(0, 10)
    if (readFilter === 'unread' && item.read) {
      return false
    }
    if (readFilter === 'read' && !item.read) {
      return false
    }
    if (severityFilter && item.severity !== severityFilter) {
      return false
    }
    if (dateFrom && day < dateFrom) {
      return false
    }
    if (dateTo && day > dateTo) {
      return false
    }
    return true
  }

  // Notifications that match the search text and the applied filters, newest first
  const searchText = search.trim().toLowerCase()
  const matchingNotifications = notifications
    .filter(function (item) {
      const details = (item.title + ' ' + item.message).toLowerCase()
      return details.includes(searchText) && matchesFilters(item)
    })
    .sort(function (a, b) {
      return b.createdAt.localeCompare(a.createdAt)
    })

  // Tab counts follow the search and filters, so they always add up to what can be shown
  const tabs = [{ value: 'all', label: 'All', count: matchingNotifications.length }]
  typeNames.forEach(function (type) {
    const count = matchingNotifications.filter(function (item) {
      return item.type === type
    }).length
    tabs.push({ value: type, label: notificationTypes[type].label, count: count })
  })

  const shownNotifications = matchingNotifications.filter(function (item) {
    return statusFilter === 'all' || item.type === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(shownNotifications.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * pageSize
  const pageNotifications = shownNotifications.slice(firstIndex, firstIndex + pageSize)

  // Group the rows of this page by day, like 'Today' and 'Oct 5, 2026'
  const dayGroups = []
  pageNotifications.forEach(function (item) {
    const label = dayLabel(item.createdAt)
    const lastGroup = dayGroups[dayGroups.length - 1]
    if (lastGroup && lastGroup.label === label) {
      lastGroup.items.push(item)
    } else {
      dayGroups.push({ label: label, items: [item] })
    }
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className={summaryGrid}>
        {summaryCards.map(function (card) {
          const Icon = card.icon
          return (
            <button
              key={card.value}
              type="button"
              aria-pressed={card.isActive}
              onClick={card.onClick}
              className={
                'group relative cursor-pointer overflow-hidden rounded-2xl bg-linear-to-br p-4 text-left text-white shadow-premium transition duration-300 hover:-translate-y-1 hover:shadow-premium-hover ' +
                summaryStyles[card.value] +
                (card.isActive ? ' ring-4 ring-burgundy/20' : '')
              }
            >
              <span className="pointer-events-none absolute -right-6 -bottom-8 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150"></span>
              <div className="relative flex items-center justify-between gap-2">
                <p className="text-[0.78rem] font-semibold text-white/85">{card.label}</p>
                <Icon size={18} className="shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12" />
              </div>
              <p className="relative mt-2 text-2xl leading-none font-extrabold">{card.unread}</p>
              <p className="relative mt-1.5 text-[0.72rem] text-white/80">unread of {card.total}</p>
            </button>
          )
        })}
      </div>

      <ListToolbar
        search={search}
        searchPlaceholder="Search alerts..."
        onSearchChange={changeSearch}
        action={
          <Button variant="secondary" onClick={handleMarkAll} disabled={busy || unreadCount === 0}>
            <CheckCheck size={17} />
            Mark all as read
          </Button>
        }
        tabs={tabs}
        activeTab={statusFilter}
        onTabChange={changeStatusFilter}
        filterCount={activeFilterCount}
        applying={filterLoading}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      >
        <FilterSelect
          label="Read status"
          value={filterDraft.read}
          allLabel="Read and unread"
          options={readOptions}
          onChange={function (value) {
            setDraftFilter('read', value)
          }}
        />
        <FilterSelect
          label="Severity"
          value={filterDraft.severity}
          allLabel="All severities"
          options={severityOptions}
          onChange={function (value) {
            setDraftFilter('severity', value)
          }}
        />
        <div className="grid grid-cols-2 gap-2 min-[440px]:col-span-2">
          <FilterDate
            label="From"
            value={filterDraft.from}
            max={filterDraft.to}
            onChange={function (value) {
              setDraftFilter('from', value)
            }}
          />
          <FilterDate
            label="To"
            value={filterDraft.to}
            min={filterDraft.from}
            onChange={function (value) {
              setDraftFilter('to', value)
            }}
          />
        </div>
      </ListToolbar>

      {shownNotifications.length === 0 ? (
        <EmptyState title="No notifications found" text="Try a different search, type, or filter." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card">
          {pageLoading || filterLoading ? (
            <NotificationSkeleton rows={pageNotifications.length || pageSize} />
          ) : (
            dayGroups.map(function (group) {
              return (
                <section key={group.label}>
                  <h3 className="border-b border-line bg-sand px-4 py-2 text-[0.7rem] font-bold tracking-wide text-gray-500 uppercase sm:px-5">
                    {group.label}
                  </h3>
                  <ul className="stagger divide-y divide-line border-b border-line">
                    {group.items.map(function (item) {
                      return (
                        <NotificationItem
                          key={item.id}
                          notification={item}
                          busy={busy}
                          onToggleRead={handleToggleRead}
                          onDelete={handleDelete}
                        />
                      )
                    })}
                  </ul>
                </section>
              )
            })
          )}

          <div className="px-4 py-3">
            <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} />
          </div>
        </div>
      )}

      {toast && (
        <Toast
          toast={toast}
          onClose={function () {
            setToast(null)
          }}
        />
      )}
    </div>
  )
}

export default Notifications
