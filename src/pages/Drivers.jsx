import { useCallback, useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { addDriver, deleteDriver, getDriverPageData, updateDriver } from '../api/drivers.js'
import Button from '../components/layout/Button.jsx'
import ConfirmDialog from '../components/layout/ConfirmDialog.jsx'
import Toast from '../components/layout/Toast.jsx'
import { EmptyState, ErrorState } from '../components/layout/PageStates.jsx'
import ToolbarSkeleton from '../components/layout/ToolbarSkeleton.jsx'
import Skeleton from '../components/layout/Skeleton.jsx'
import DriverCardSkeleton from '../components/driver/DriverCardSkeleton.jsx'
import DriverCard from '../components/driver/DriverCard.jsx'
import DriverForm from '../components/driver/DriverForm.jsx'
import DriverDetails from '../components/driver/DriverDetails.jsx'
import Pagination from '../components/layout/Pagination.jsx'
import ListToolbar from '../components/layout/ListToolbar.jsx'
import { FilterDate, FilterSelect } from '../components/layout/FilterSelect.jsx'
import { daysUntil, uniqueOptions } from '../utils/format.js'
import useCardsPerPage from '../hooks/useCardsPerPage.js'
import useListParams from '../hooks/useListParams.js'
import usePendingFilters from '../hooks/usePendingFilters.js'
import { scrollToTop } from '../utils/scroll.js'
import { skeletonTime, wait } from '../utils/wait.js'

const cardGrid = 'stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

// Extra filters kept in the address bar
const filterNames = ['city', 'vehicle', 'license', 'joinedFrom', 'joinedTo']

const licenseOptions = [
  { value: 'expired', label: 'Expired' },
  { value: 'soon', label: 'Expires in 90 days' },
  { value: 'valid', label: 'Valid for 90+ days' },
]

function Drivers() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getParam, search, statusFilter, page, viewingId, editingId, isAdding, setParams } = useListParams()
  const [pageLoading, setPageLoading] = useState(false)
  const cardsPerPage = useCardsPerPage()
  const [deletingDriver, setDeletingDriver] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // The driver open in the edit form, if any
  const savedDrivers = data ? data.drivers : []
  const editingDriver = savedDrivers.find(function (item) {
    return item.id === editingId
  })
  const showForm = isAdding || Boolean(editingDriver)

  const refreshData = useCallback(async function () {
    const result = await getDriverPageData()
    setData(result)
  }, [])

  const {
    draft: filterDraft,
    setDraftFilter,
    applyFilters,
    clearAppliedFilters,
    filterLoading,
  } = usePendingFilters(filterNames, getParam, setParams, refreshData)

  // Get driver data when the page opens, and again on Try again
  useEffect(
    function () {
      async function firstLoad() {
        try {
          const minimumWait = wait(skeletonTime)
          const result = await getDriverPageData()
          await minimumWait
          setData(result)
          setError('')
        } catch (err) {
          console.error(err)
          setError('Could not load drivers.')
        } finally {
          setLoading(false)
        }
      }

      firstLoad()
    },
    [retryCount],
  )

  function openAddForm() {
    setParams({ add: 'true', edit: null, view: null })
  }

  function openEditForm(driver) {
    setParams({ edit: driver.id, add: null, view: null })
  }

  // Go back to page 1 when the search or filter changes
  function changeSearch(text) {
    setParams({ search: text, page: 1 })
  }

  function changeStatusFilter(status) {
    setParams({ status: status, page: 1 })
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

  // Get the data again for the new page, with skeleton cards while it loads
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

  function renderSkeletonCards(count) {
    const cards = []
    for (let index = 0; index < count; index++) {
      cards.push(<DriverCardSkeleton key={index} />)
    }
    return <div className={cardGrid}>{cards}</div>
  }

  function closeForm() {
    setParams({ add: null, edit: null })
  }

  async function handleSave(driverData) {
    setSaving(true)
    try {
      if (editingDriver) {
        await updateDriver(editingDriver.id, driverData)
        setToast({ type: 'success', message: driverData.name + ' updated' })
      } else {
        await addDriver(driverData)
        setToast({ type: 'success', message: driverData.name + ' added as a driver' })
        // Show the last page, where the new driver is
        setParams({ search: '', status: 'all', page: Math.ceil((data.drivers.length + 1) / cardsPerPage) })
      }
      closeForm()
      await refreshData()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deleteDriver(deletingDriver.id)
      setToast({ type: 'success', message: deletingDriver.name + ' removed' })
      await refreshData()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
      setDeletingDriver(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <ToolbarSkeleton tabCount={5} />
        {renderSkeletonCards(cardsPerPage)}
        <Skeleton className="h-15 rounded-2xl" />
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

  const drivers = data.drivers

  function vehicleNumberOf(driver) {
    const vehicle = data.vehicles.find(function (item) {
      return item.id === driver.assignedVehicleId
    })
    return vehicle ? vehicle.registrationNumber : ''
  }

  const cityFilter = getParam('city')
  const vehicleFilter = getParam('vehicle')
  const licenseFilter = getParam('license')
  const joinedFrom = getParam('joinedFrom')
  const joinedTo = getParam('joinedTo')
  const activeFilterCount = filterNames.filter(function (name) {
    return getParam(name)
  }).length

  const vehicleOptions = [
    { value: 'with', label: 'Has a vehicle' },
    { value: 'without', label: 'No vehicle' },
  ]
  data.vehicles.forEach(function (vehicle) {
    if (vehicle.assignedDriverId) {
      vehicleOptions.push({ value: String(vehicle.id), label: vehicle.registrationNumber })
    }
  })

  function matchesFilters(driver) {
    if (cityFilter && driver.city !== cityFilter) {
      return false
    }
    if (vehicleFilter === 'with' && !driver.assignedVehicleId) {
      return false
    }
    if (vehicleFilter === 'without' && driver.assignedVehicleId) {
      return false
    }
    if (Number(vehicleFilter) && driver.assignedVehicleId !== Number(vehicleFilter)) {
      return false
    }
    if (licenseFilter) {
      const days = daysUntil(driver.licenseExpiry)
      if (licenseFilter === 'expired' && days >= 0) {
        return false
      }
      if (licenseFilter === 'soon' && (days < 0 || days > 90)) {
        return false
      }
      if (licenseFilter === 'valid' && days <= 90) {
        return false
      }
    }
    if (joinedFrom && driver.joinedDate < joinedFrom) {
      return false
    }
    if (joinedTo && driver.joinedDate > joinedTo) {
      return false
    }
    return true
  }

  // Drivers that match the search text and the applied filters
  const searchText = search.trim().toLowerCase()
  const matchingDrivers = drivers.filter(function (driver) {
    const details = [driver.name, driver.city, driver.phone, driver.email, driver.licenseNumber, vehicleNumberOf(driver)]
      .join(' ')
      .toLowerCase()
    return details.includes(searchText) && matchesFilters(driver)
  })

  function countByStatus(status) {
    return matchingDrivers.filter(function (driver) {
      return driver.status === status
    }).length
  }

  // Tab counts follow the search and filters, so they always add up to what can be shown
  const tabs = [
    { value: 'all', label: 'All', count: matchingDrivers.length },
    { value: 'on_trip', label: 'On Trip', count: countByStatus('on_trip') },
    { value: 'available', label: 'Available', count: countByStatus('available') },
    { value: 'assigned', label: 'Assigned', count: countByStatus('assigned') },
    { value: 'off_duty', label: 'Off Duty', count: countByStatus('off_duty') },
  ]

  const shownDrivers = matchingDrivers.filter(function (driver) {
    return statusFilter === 'all' || driver.status === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(shownDrivers.length / cardsPerPage))
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * cardsPerPage
  const pageDrivers = shownDrivers.slice(firstIndex, firstIndex + cardsPerPage)

  const viewingDriver = drivers.find(function (driver) {
    return driver.id === viewingId
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <ListToolbar
        search={search}
        searchPlaceholder="Search name, city, vehicle..."
        onSearchChange={changeSearch}
        action={
          <Button onClick={openAddForm}>
            <UserPlus size={17} />
            Add driver
          </Button>
        }
        tabs={tabs}
        activeTab={statusFilter}
        onTabChange={changeStatusFilter}
        filterCount={activeFilterCount}
        filterGrid="min-[440px]:grid-cols-2 lg:grid-cols-5"
        applying={filterLoading}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      >
        <FilterSelect
          label="Location (city)"
          value={filterDraft.city}
          allLabel="All cities"
          options={uniqueOptions(drivers.map(function (driver) {
            return driver.city
          }))}
          onChange={function (value) {
            setDraftFilter('city', value)
          }}
        />
        <FilterSelect
          label="Vehicle"
          value={filterDraft.vehicle}
          allLabel="Any vehicle"
          options={vehicleOptions}
          onChange={function (value) {
            setDraftFilter('vehicle', value)
          }}
        />
        <div className="grid grid-cols-2 gap-2 min-[440px]:col-span-2">
          <FilterDate
            label="Joined from"
            value={filterDraft.joinedFrom}
            max={filterDraft.joinedTo}
            onChange={function (value) {
              setDraftFilter('joinedFrom', value)
            }}
          />
          <FilterDate
            label="Joined to"
            value={filterDraft.joinedTo}
            min={filterDraft.joinedFrom}
            onChange={function (value) {
              setDraftFilter('joinedTo', value)
            }}
          />
        </div>
        <FilterSelect
          label="License"
          className="min-[440px]:col-span-2 lg:col-span-1"
          value={filterDraft.license}
          allLabel="Any expiry"
          options={licenseOptions}
          onChange={function (value) {
            setDraftFilter('license', value)
          }}
        />
      </ListToolbar>

      {shownDrivers.length === 0 ? (
        <EmptyState title="No drivers found" text="Try a different search or status, or add a new driver." />
      ) : (
        <>
          {pageLoading || filterLoading ? (
            renderSkeletonCards(pageDrivers.length || cardsPerPage)
          ) : (
            <div className={cardGrid}>
              {pageDrivers.map(function (driver) {
                return (
                  <DriverCard
                    key={driver.id}
                    driver={driver}
                    vehicleNumber={vehicleNumberOf(driver)}
                    onView={function () {
                      setParams({ view: driver.id })
                    }}
                    onEdit={function () {
                      openEditForm(driver)
                    }}
                    onDelete={function () {
                      setDeletingDriver(driver)
                    }}
                  />
                )
              })}
            </div>
          )}

          <div className="rounded-2xl border border-line-soft bg-surface px-4 py-3 shadow-card">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={changePage}
            />
          </div>
        </>
      )}

      {showForm && (
        <DriverForm
          driver={editingDriver}
          drivers={drivers}
          vehicles={data.vehicles}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {viewingDriver && (
        <DriverDetails
          driver={viewingDriver}
          vehicles={data.vehicles}
          shipments={data.shipments}
          locations={data.locations}
          onEdit={function () {
            openEditForm(viewingDriver)
          }}
          onClose={function () {
            setParams({ view: null })
          }}
        />
      )}

      {deletingDriver && (
        <ConfirmDialog
          title="Remove driver?"
          message={
            'Remove ' +
            deletingDriver.name +
            '? Their vehicle will be unassigned, and pending shipments assigned to them will need a new driver.'
          }
          confirmLabel="Remove driver"
          busy={saving}
          onConfirm={handleDelete}
          onCancel={function () {
            setDeletingDriver(null)
          }}
        />
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

export default Drivers
