import { useCallback, useEffect, useRef, useState } from 'react'
import { CircleCheck, Navigation, RefreshCw, TriangleAlert, Truck } from 'lucide-react'
import { getTrackingData } from '../api/tracking.js'
import Button from '../components/layout/Button.jsx'
import Toast from '../components/layout/Toast.jsx'
import ListToolbar from '../components/layout/ListToolbar.jsx'
import { FilterSelect } from '../components/layout/FilterSelect.jsx'
import { EmptyState, ErrorState } from '../components/layout/PageStates.jsx'
import ToolbarSkeleton from '../components/layout/ToolbarSkeleton.jsx'
import Skeleton from '../components/layout/Skeleton.jsx'
import TrackingMap from '../components/tracking/TrackingMap.jsx'
import TripCard from '../components/tracking/TripCard.jsx'
import TripDetails from '../components/tracking/TripDetails.jsx'
import useListParams from '../hooks/useListParams.js'
import usePendingFilters from '../hooks/usePendingFilters.js'
import { uniqueOptions } from '../utils/format.js'
import { buildTrips } from '../utils/trip.js'
import { skeletonTime, wait } from '../utils/wait.js'

// Extra filters kept in the address bar
const filterNames = ['city', 'driver', 'eta', 'priority']

const etaOptions = [
  { value: 'on_time', label: 'Arriving on time' },
  { value: 'late', label: 'Running late' },
]

const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'express', label: 'Express' },
  { value: 'standard', label: 'Standard' },
]

const statGrid = 'stagger grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'
const mapHeight = 'h-[55dvh] min-h-80 max-h-130 lg:h-150 lg:max-h-none'

function Tracking() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState(null)
  const [retryCount, setRetryCount] = useState(0)
  const mapRef = useRef(null)
  const { getParam, search, statusFilter, viewingId, setParams } = useListParams()

  const reloadTrackingData = useCallback(async function () {
    const result = await getTrackingData()
    setData(result)
  }, [])

  const {
    draft: filterDraft,
    setDraftFilter,
    applyFilters,
    clearAppliedFilters,
    filterLoading,
  } = usePendingFilters(filterNames, getParam, setParams, reloadTrackingData, { resetPage: false })

  // Get tracking data when the page opens, and again on Try again
  useEffect(
    function () {
      async function firstLoad() {
        try {
          const minimumWait = wait(skeletonTime)
          const result = await getTrackingData()
          await minimumWait
          setData(result)
          setError('')
        } catch (err) {
          console.error(err)
          setError('Could not load live tracking.')
        } finally {
          setLoading(false)
        }
      }

      firstLoad()
    },
    [retryCount],
  )

  async function refreshData() {
    setRefreshing(true)
    try {
      const minimumWait = wait(600)
      const result = await getTrackingData()
      await minimumWait
      setData(result)
      setToast({ type: 'success', message: 'Locations updated' })
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: 'Could not update locations. Please try again.' })
    } finally {
      setRefreshing(false)
    }
  }

  // Bring the map into view so the chosen vehicle can be seen
  function selectTrip(shipmentId) {
    setParams({ view: shipmentId })
    if (mapRef.current) {
      mapRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  function showAll() {
    setParams({ view: null })
  }

  function changeSearch(text) {
    setParams({ search: text })
  }

  function changeStatusFilter(status) {
    setParams({ status: status })
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

  function renderMapSkeleton() {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className={'rounded-2xl ' + mapHeight} />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-34 rounded-xl" />
          <Skeleton className="h-34 rounded-xl" />
          <Skeleton className="h-34 rounded-xl" />
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <div className={statGrid}>
          {[1, 2, 3, 4].map(function (number) {
            return <Skeleton key={number} className="h-36.5 rounded-2xl" />
          })}
        </div>
        <ToolbarSkeleton tabCount={3} />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <Skeleton className={'rounded-2xl ' + mapHeight} />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-34 rounded-xl" />
            <Skeleton className="h-34 rounded-xl" />
            <Skeleton className="h-34 rounded-xl" />
          </div>
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

  const trips = buildTrips(data)
  const hubs = data.locations.filter(function (place) {
    return place.type === 'hub'
  })

  const delayedCount = trips.filter(function (trip) {
    return trip.shipment.status === 'delayed'
  }).length
  const onTimeCount = trips.filter(function (trip) {
    return trip.lateMinutes <= 0
  }).length

  // Share of the total, used for the small bar on each card
  function percentOf(value, total) {
    return total > 0 ? Math.round((value / total) * 100) : 0
  }

  const stats = [
    {
      label: 'On the road',
      value: trips.length,
      note: 'of ' + data.vehicles.length + ' vehicles',
      percent: percentOf(trips.length, data.vehicles.length),
      icon: Truck,
      style: 'from-burgundy-light to-burgundy',
      chip: 'bg-burgundy/10 text-accent',
    },
    {
      label: 'In transit',
      value: trips.length - delayedCount,
      note: 'moving to plan',
      percent: percentOf(trips.length - delayedCount, trips.length),
      icon: Navigation,
      style: 'from-blue-500 to-indigo-600',
      chip: 'bg-blue-50 text-blue-700',
    },
    {
      label: 'Delayed',
      value: delayedCount,
      note: 'need attention',
      percent: percentOf(delayedCount, trips.length),
      icon: TriangleAlert,
      style: 'from-red-500 to-red-700',
      chip: 'bg-red-50 text-red-700',
    },
    {
      label: 'On time',
      value: onTimeCount,
      note: 'arriving on schedule',
      percent: percentOf(onTimeCount, trips.length),
      icon: CircleCheck,
      style: 'from-emerald-400 to-teal-600',
      chip: 'bg-emerald-50 text-emerald-700',
    },
  ]

  const cityFilter = getParam('city')
  const driverFilter = getParam('driver')
  const etaFilter = getParam('eta')
  const priorityFilter = getParam('priority')
  const activeFilterCount = filterNames.filter(function (name) {
    return getParam(name)
  }).length

  const cityOptions = uniqueOptions(
    trips.map(function (trip) {
      return trip.pickup.city
    }).concat(
      trips.map(function (trip) {
        return trip.delivery.city
      }),
    ),
  )
  const driverOptions = []
  trips.forEach(function (trip) {
    if (trip.driver) {
      driverOptions.push({ value: String(trip.driver.id), label: trip.driver.name })
    }
  })

  function matchesFilters(trip) {
    if (cityFilter && trip.pickup.city !== cityFilter && trip.delivery.city !== cityFilter) {
      return false
    }
    if (driverFilter && (!trip.driver || trip.driver.id !== Number(driverFilter))) {
      return false
    }
    if (etaFilter === 'late' && trip.lateMinutes <= 0) {
      return false
    }
    if (etaFilter === 'on_time' && trip.lateMinutes > 0) {
      return false
    }
    if (priorityFilter && trip.shipment.priority !== priorityFilter) {
      return false
    }
    return true
  }

  // Trips that match the search text (shipment, vehicle, driver, cities) and the applied filters
  const searchText = search.trim().toLowerCase()
  const matchingTrips = trips.filter(function (trip) {
    const details = [
      trip.shipment.trackingNumber,
      trip.shipment.customerCompany,
      trip.vehicle ? trip.vehicle.registrationNumber : '',
      trip.driver ? trip.driver.name : '',
      trip.pickup.city,
      trip.delivery.city,
    ]
      .join(' ')
      .toLowerCase()
    return details.includes(searchText) && matchesFilters(trip)
  })

  const matchingDelayed = matchingTrips.filter(function (trip) {
    return trip.shipment.status === 'delayed'
  }).length

  // Tab counts follow the search and filters, so they always add up to what can be shown
  const tabs = [
    { value: 'all', label: 'All trips', count: matchingTrips.length },
    { value: 'in_transit', label: 'In Transit', count: matchingTrips.length - matchingDelayed },
    { value: 'delayed', label: 'Delayed', count: matchingDelayed },
  ]

  const shownTrips = matchingTrips.filter(function (trip) {
    return statusFilter === 'all' || trip.shipment.status === statusFilter
  })

  const selectedTrip = trips.find(function (trip) {
    return trip.shipment.id === viewingId
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <div className={statGrid}>
        {stats.map(function (stat) {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-line-soft bg-surface p-4 shadow-premium transition duration-300 hover:-translate-y-1 hover:shadow-premium-hover"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[0.8rem] font-semibold text-gray-500">{stat.label}</p>
                <span
                  className={
                    'grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br text-white shadow-lg transition duration-300 group-hover:scale-110 group-hover:-rotate-6 ' +
                    stat.style
                  }
                >
                  <Icon size={18} />
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-[1.65rem] leading-none font-extrabold text-gray-900">{stat.value}</p>
                <span className={'rounded-full px-2 py-0.5 text-[0.68rem] font-bold ' + stat.chip}>{stat.percent}%</span>
              </div>
              <p className="mt-1.5 truncate text-[0.72rem] text-gray-500">{stat.note}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className={'h-full rounded-full bg-linear-to-r transition-all duration-700 ' + stat.style}
                  style={{ width: stat.percent + '%' }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

      <ListToolbar
        search={search}
        searchPlaceholder="Search shipment, vehicle, driver, city..."
        onSearchChange={changeSearch}
        action={
          <Button variant="secondary" onClick={refreshData} disabled={refreshing}>
            <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Updating...' : 'Refresh locations'}
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
          label="Location (pickup or delivery)"
          value={filterDraft.city}
          allLabel="All cities"
          options={cityOptions}
          onChange={function (value) {
            setDraftFilter('city', value)
          }}
        />
        <FilterSelect
          label="Driver"
          value={filterDraft.driver}
          allLabel="All drivers"
          options={driverOptions}
          onChange={function (value) {
            setDraftFilter('driver', value)
          }}
        />
        <FilterSelect
          label="Estimated arrival"
          value={filterDraft.eta}
          allLabel="Any arrival"
          options={etaOptions}
          onChange={function (value) {
            setDraftFilter('eta', value)
          }}
        />
        <FilterSelect
          label="Priority"
          value={filterDraft.priority}
          allLabel="All priorities"
          options={priorityOptions}
          onChange={function (value) {
            setDraftFilter('priority', value)
          }}
        />
      </ListToolbar>

      {filterLoading ? (
        renderMapSkeleton()
      ) : (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div
          ref={mapRef}
          className={'scroll-mt-4 overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card ' + mapHeight}
        >
          <TrackingMap
            trips={shownTrips}
            hubs={hubs}
            selectedTrip={selectedTrip}
            onSelect={selectTrip}
            onShowAll={showAll}
          />
        </div>

        {/* Side panel: scrolls by itself next to the map on big screens */}
        <div className="flex min-w-0 flex-col gap-3 lg:h-150 lg:overflow-y-auto lg:pr-1">
          {selectedTrip && <TripDetails key={selectedTrip.shipment.id} trip={selectedTrip} onClose={showAll} />}

          <div className="flex items-center justify-between gap-2 px-1">
            <p className="text-[0.78rem] font-bold tracking-wide text-accent uppercase">Active trips</p>
            <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-[0.7rem] font-bold text-accent">{shownTrips.length}</span>
          </div>

          {shownTrips.length === 0 ? (
            <EmptyState title="No trips found" text="Try a different search, status, or filter." />
          ) : (
            <div className="stagger flex flex-col gap-2.5">
              {shownTrips.map(function (trip) {
                return (
                  <TripCard
                    key={trip.shipment.id}
                    trip={trip}
                    isSelected={Boolean(selectedTrip) && selectedTrip.shipment.id === trip.shipment.id}
                    onSelect={selectTrip}
                  />
                )
              })}
            </div>
          )}
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

export default Tracking
