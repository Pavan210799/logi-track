import { useCallback, useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { addVehicle, deleteVehicle, getVehiclePageData, updateVehicle } from '../api/vehicles.js'
import Button from '../components/layout/Button.jsx'
import ConfirmDialog from '../components/layout/ConfirmDialog.jsx'
import Toast from '../components/layout/Toast.jsx'
import { EmptyState, ErrorState } from '../components/layout/PageStates.jsx'
import ToolbarSkeleton from '../components/layout/ToolbarSkeleton.jsx'
import Skeleton from '../components/layout/Skeleton.jsx'
import VehicleCardSkeleton from '../components/vehicle/VehicleCardSkeleton.jsx'
import VehicleCard from '../components/vehicle/VehicleCard.jsx'
import VehicleForm from '../components/vehicle/VehicleForm.jsx'
import VehicleDetails from '../components/vehicle/VehicleDetails.jsx'
import Pagination from '../components/layout/Pagination.jsx'
import ListToolbar from '../components/layout/ListToolbar.jsx'
import { FilterSelect } from '../components/layout/FilterSelect.jsx'
import { daysUntil, uniqueOptions } from '../utils/format.js'
import { stateOfPlate } from '../utils/geo.js'
import useCardsPerPage from '../hooks/useCardsPerPage.js'
import useListParams from '../hooks/useListParams.js'
import usePendingFilters from '../hooks/usePendingFilters.js'
import { scrollToTop } from '../utils/scroll.js'
import { skeletonTime, wait } from '../utils/wait.js'

const cardGrid = 'stagger grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

// Extra filters kept in the address bar
const filterNames = ['type', 'fuel', 'driver', 'state', 'service']

const serviceOptions = [
  { value: 'overdue', label: 'Service overdue' },
  { value: 'week', label: 'Due in 7 days' },
  { value: 'month', label: 'Due in 30 days' },
]

function Vehicles() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getParam, search, statusFilter, page, viewingId, editingId, isAdding, setParams } = useListParams()
  const [pageLoading, setPageLoading] = useState(false)
  const cardsPerPage = useCardsPerPage()
  const [deletingVehicle, setDeletingVehicle] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // The vehicle open in the edit form, if any
  const savedVehicles = data ? data.vehicles : []
  const editingVehicle = savedVehicles.find(function (item) {
    return item.id === editingId
  })
  const showForm = isAdding || Boolean(editingVehicle)

  const refreshData = useCallback(async function () {
    const result = await getVehiclePageData()
    setData(result)
  }, [])

  const {
    draft: filterDraft,
    setDraftFilter,
    applyFilters,
    clearAppliedFilters,
    filterLoading,
  } = usePendingFilters(filterNames, getParam, setParams, refreshData)

  // Get vehicle data when the page opens, and again on Try again
  useEffect(
    function () {
      async function firstLoad() {
        try {
          const minimumWait = wait(skeletonTime)
          const result = await getVehiclePageData()
          await minimumWait
          setData(result)
          setError('')
        } catch (err) {
          console.error(err)
          setError('Could not load vehicles.')
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

  function openEditForm(vehicle) {
    setParams({ edit: vehicle.id, add: null, view: null })
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
      cards.push(<VehicleCardSkeleton key={index} />)
    }
    return <div className={cardGrid}>{cards}</div>
  }

  function closeForm() {
    setParams({ add: null, edit: null })
  }

  async function handleSave(vehicleData) {
    setSaving(true)
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle.id, vehicleData)
        setToast({ type: 'success', message: vehicleData.registrationNumber + ' updated' })
      } else {
        await addVehicle(vehicleData)
        setToast({ type: 'success', message: vehicleData.registrationNumber + ' added to the fleet' })
        // Show the last page, where the new vehicle is
        setParams({ search: '', status: 'all', page: Math.ceil((data.vehicles.length + 1) / cardsPerPage) })
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
      await deleteVehicle(deletingVehicle.id)
      setToast({ type: 'success', message: deletingVehicle.registrationNumber + ' removed' })
      await refreshData()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
      setDeletingVehicle(null)
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

  const vehicles = data.vehicles

  function driverNameOf(vehicle) {
    const driver = data.drivers.find(function (item) {
      return item.id === vehicle.assignedDriverId
    })
    return driver ? driver.name : ''
  }

  const typeFilter = getParam('type')
  const fuelFilter = getParam('fuel')
  const driverFilter = getParam('driver')
  const stateFilter = getParam('state')
  const serviceFilter = getParam('service')
  const activeFilterCount = filterNames.filter(function (name) {
    return getParam(name)
  }).length

  const driverOptions = [{ value: 'none', label: 'No driver' }]
  data.drivers.forEach(function (driver) {
    if (driver.assignedVehicleId) {
      driverOptions.push({ value: String(driver.id), label: driver.name })
    }
  })

  function matchesFilters(vehicle) {
    if (typeFilter && vehicle.type !== typeFilter) {
      return false
    }
    if (fuelFilter && vehicle.fuelType !== fuelFilter) {
      return false
    }
    if (driverFilter === 'none' && vehicle.assignedDriverId) {
      return false
    }
    if (driverFilter && driverFilter !== 'none' && vehicle.assignedDriverId !== Number(driverFilter)) {
      return false
    }
    if (stateFilter && stateOfPlate(vehicle.registrationNumber) !== stateFilter) {
      return false
    }
    if (serviceFilter) {
      const days = daysUntil(vehicle.nextServiceDate)
      if (serviceFilter === 'overdue' && days >= 0) {
        return false
      }
      if (serviceFilter === 'week' && (days < 0 || days > 7)) {
        return false
      }
      if (serviceFilter === 'month' && (days < 0 || days > 30)) {
        return false
      }
    }
    return true
  }

  // Vehicles that match the search text and the applied filters
  const searchText = search.trim().toLowerCase()
  const matchingVehicles = vehicles.filter(function (vehicle) {
    const details = [vehicle.registrationNumber, vehicle.make, vehicle.model, vehicle.type, vehicle.fuelType, driverNameOf(vehicle)]
      .join(' ')
      .toLowerCase()
    return details.includes(searchText) && matchesFilters(vehicle)
  })

  function countByStatus(status) {
    return matchingVehicles.filter(function (vehicle) {
      return vehicle.status === status
    }).length
  }

  // Tab counts follow the search and filters, so they always add up to what can be shown
  const tabs = [
    { value: 'all', label: 'All', count: matchingVehicles.length },
    { value: 'on_trip', label: 'On Trip', count: countByStatus('on_trip') },
    { value: 'available', label: 'Available', count: countByStatus('available') },
    { value: 'maintenance', label: 'Maintenance', count: countByStatus('maintenance') },
    { value: 'inactive', label: 'Inactive', count: countByStatus('inactive') },
  ]

  const shownVehicles = matchingVehicles.filter(function (vehicle) {
    return statusFilter === 'all' || vehicle.status === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(shownVehicles.length / cardsPerPage))
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * cardsPerPage
  const pageVehicles = shownVehicles.slice(firstIndex, firstIndex + cardsPerPage)

  const viewingVehicle = vehicles.find(function (vehicle) {
    return vehicle.id === viewingId
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <ListToolbar
        search={search}
        searchPlaceholder="Search number, make, driver..."
        onSearchChange={changeSearch}
        action={
          <Button onClick={openAddForm}>
            <Plus size={17} />
            Add vehicle
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
          label="Vehicle type"
          value={filterDraft.type}
          allLabel="All types"
          options={uniqueOptions(vehicles.map(function (vehicle) {
            return vehicle.type
          }))}
          onChange={function (value) {
            setDraftFilter('type', value)
          }}
        />
        <FilterSelect
          label="Driver"
          value={filterDraft.driver}
          allLabel="Any driver"
          options={driverOptions}
          onChange={function (value) {
            setDraftFilter('driver', value)
          }}
        />
        <FilterSelect
          label="Location (state)"
          value={filterDraft.state}
          allLabel="All states"
          options={uniqueOptions(vehicles.map(function (vehicle) {
            return stateOfPlate(vehicle.registrationNumber)
          }))}
          onChange={function (value) {
            setDraftFilter('state', value)
          }}
        />
        <FilterSelect
          label="Next service date"
          value={filterDraft.service}
          allLabel="Any date"
          options={serviceOptions}
          onChange={function (value) {
            setDraftFilter('service', value)
          }}
        />
        <FilterSelect
          label="Fuel type"
          className="min-[440px]:col-span-2 lg:col-span-1"
          value={filterDraft.fuel}
          allLabel="All fuel types"
          options={uniqueOptions(vehicles.map(function (vehicle) {
            return vehicle.fuelType
          }))}
          onChange={function (value) {
            setDraftFilter('fuel', value)
          }}
        />
      </ListToolbar>

      {shownVehicles.length === 0 ? (
        <EmptyState title="No vehicles found" text="Try a different search or status, or add a new vehicle." />
      ) : (
        <>
          {pageLoading || filterLoading ? (
            renderSkeletonCards(pageVehicles.length || cardsPerPage)
          ) : (
            <div className={cardGrid}>
              {pageVehicles.map(function (vehicle) {
                return (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    driverName={driverNameOf(vehicle)}
                    onView={function () {
                      setParams({ view: vehicle.id })
                    }}
                    onEdit={function () {
                      openEditForm(vehicle)
                    }}
                    onDelete={function () {
                      setDeletingVehicle(vehicle)
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
        <VehicleForm
          vehicle={editingVehicle}
          vehicles={vehicles}
          drivers={data.drivers}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {viewingVehicle && (
        <VehicleDetails
          vehicle={viewingVehicle}
          drivers={data.drivers}
          shipments={data.shipments}
          maintenance={data.maintenance}
          fuelLogs={data.fuelLogs}
          locations={data.locations}
          onEdit={function () {
            openEditForm(viewingVehicle)
          }}
          onClose={function () {
            setParams({ view: null })
          }}
        />
      )}

      {deletingVehicle && (
        <ConfirmDialog
          title="Remove vehicle?"
          message={
            'Remove ' +
            deletingVehicle.registrationNumber +
            ' from the fleet? Its fuel and maintenance records will be removed too, and pending shipments using it will need a new vehicle.'
          }
          confirmLabel="Remove vehicle"
          busy={saving}
          onConfirm={handleDelete}
          onCancel={function () {
            setDeletingVehicle(null)
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

export default Vehicles
