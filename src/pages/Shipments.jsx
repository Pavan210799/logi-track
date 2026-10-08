import { useCallback, useEffect, useState } from 'react'
import { PackagePlus } from 'lucide-react'
import {
  addShipment,
  deleteShipment,
  getShipmentPageData,
  updateShipment,
  updateShipmentStatus,
} from '../api/shipments.js'
import Button from '../components/layout/Button.jsx'
import ConfirmDialog from '../components/layout/ConfirmDialog.jsx'
import Toast from '../components/layout/Toast.jsx'
import { EmptyState, ErrorState } from '../components/layout/PageStates.jsx'
import ToolbarSkeleton from '../components/layout/ToolbarSkeleton.jsx'
import Skeleton from '../components/layout/Skeleton.jsx'
import ShipmentTableSkeleton from '../components/shipment/ShipmentTableSkeleton.jsx'
import ShipmentTable from '../components/shipment/ShipmentTable.jsx'
import ShipmentForm from '../components/shipment/ShipmentForm.jsx'
import ShipmentDetails from '../components/shipment/ShipmentDetails.jsx'
import Pagination from '../components/layout/Pagination.jsx'
import ListToolbar from '../components/layout/ListToolbar.jsx'
import { FilterDate, FilterSelect } from '../components/layout/FilterSelect.jsx'
import { uniqueOptions } from '../utils/format.js'
import useListParams from '../hooks/useListParams.js'
import usePendingFilters from '../hooks/usePendingFilters.js'
import { scrollToTop } from '../utils/scroll.js'
import { skeletonTime, wait } from '../utils/wait.js'
import { formatStatus } from '../utils/format.js'

const pageSize = 10

// Extra filters kept in the address bar
const filterNames = ['driver', 'vehicle', 'city', 'priority', 'from', 'to']

const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'express', label: 'Express' },
  { value: 'standard', label: 'Standard' },
]

function Shipments() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { getParam, search, statusFilter, page, viewingId, editingId, isAdding, setParams } = useListParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [deletingShipment, setDeletingShipment] = useState(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState(null)
  const [retryCount, setRetryCount] = useState(0)

  // The shipment open in the edit form, if any
  const savedShipments = data ? data.shipments : []
  const editingShipment = savedShipments.find(function (item) {
    return item.id === editingId
  })
  const showForm = isAdding || Boolean(editingShipment)

  const refreshData = useCallback(async function () {
    const result = await getShipmentPageData()
    setData(result)
  }, [])

  const {
    draft: filterDraft,
    setDraftFilter,
    applyFilters,
    clearAppliedFilters,
    filterLoading,
  } = usePendingFilters(filterNames, getParam, setParams, refreshData)

  // Get shipment data when the page opens, and again on Try again
  useEffect(
    function () {
      async function firstLoad() {
        try {
          const minimumWait = wait(skeletonTime)
          const result = await getShipmentPageData()
          await minimumWait
          setData(result)
          setError('')
        } catch (err) {
          console.error(err)
          setError('Could not load shipments.')
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

  function openEditForm(shipment) {
    setParams({ edit: shipment.id, add: null, view: null })
  }

  function closeForm() {
    setParams({ add: null, edit: null })
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

  async function handleSave(shipmentData) {
    setSaving(true)
    try {
      if (editingShipment) {
        await updateShipment(editingShipment.id, shipmentData)
        setToast({ type: 'success', message: editingShipment.trackingNumber + ' updated' })
      } else {
        await addShipment(shipmentData)
        setToast({ type: 'success', message: 'Shipment created for ' + shipmentData.customerCompany })
        setParams({ status: 'all', page: 1 })
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

  async function handleStatusChange(newStatus, note) {
    setSaving(true)
    try {
      await updateShipmentStatus(viewingId, newStatus, note)
      setToast({ type: 'success', message: 'Status changed to ' + formatStatus(newStatus) })
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
      await deleteShipment(deletingShipment.id)
      setToast({ type: 'success', message: deletingShipment.trackingNumber + ' deleted' })
      await refreshData()
    } catch (err) {
      console.error(err)
      setToast({ type: 'error', message: err.message })
    } finally {
      setSaving(false)
      setDeletingShipment(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <ToolbarSkeleton tabCount={5} />
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card">
          <ShipmentTableSkeleton rows={pageSize} />
          <div className="flex justify-center border-t border-line px-4 py-3">
            <Skeleton className="h-9 w-72 max-w-full" />
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

  const shipments = data.shipments

  function countByStatus(status) {
    return matchingShipments.filter(function (shipment) {
      return shipment.status === status
    }).length
  }

  function cityOf(locationId) {
    const place = data.locations.find(function (item) {
      return item.id === locationId
    })
    return place ? place.city : ''
  }

  function driverNameOf(driverId) {
    const driver = data.drivers.find(function (item) {
      return item.id === driverId
    })
    return driver ? driver.name : ''
  }

  function vehicleNumberOf(vehicleId) {
    const vehicle = data.vehicles.find(function (item) {
      return item.id === vehicleId
    })
    return vehicle ? vehicle.registrationNumber : ''
  }

  const driverFilter = getParam('driver')
  const vehicleFilter = getParam('vehicle')
  const cityFilter = getParam('city')
  const priorityFilter = getParam('priority')
  const dateFrom = getParam('from')
  const dateTo = getParam('to')
  const activeFilterCount = filterNames.filter(function (name) {
    return getParam(name)
  }).length

  const driverOptions = data.drivers.map(function (driver) {
    return { value: String(driver.id), label: driver.name }
  })
  const vehicleOptions = data.vehicles.map(function (vehicle) {
    return { value: String(vehicle.id), label: vehicle.registrationNumber }
  })
  const cityOptions = uniqueOptions(data.locations.map(function (place) {
    return place.city
  }))

  function matchesFilters(shipment) {
    const deliveryDate = shipment.scheduledDelivery.slice(0, 10)
    if (driverFilter && shipment.driverId !== Number(driverFilter)) {
      return false
    }
    if (vehicleFilter && shipment.vehicleId !== Number(vehicleFilter)) {
      return false
    }
    if (cityFilter && cityOf(shipment.pickupLocationId) !== cityFilter && cityOf(shipment.deliveryLocationId) !== cityFilter) {
      return false
    }
    if (priorityFilter && shipment.priority !== priorityFilter) {
      return false
    }
    if (dateFrom && deliveryDate < dateFrom) {
      return false
    }
    if (dateTo && deliveryDate > dateTo) {
      return false
    }
    return true
  }

  // Shipments that match the search text and the applied filters, newest first
  const searchText = search.trim().toLowerCase()
  const matchingShipments = shipments
    .filter(function (shipment) {
      const details = [
        shipment.trackingNumber,
        shipment.customerCompany,
        shipment.customerName,
        cityOf(shipment.pickupLocationId),
        cityOf(shipment.deliveryLocationId),
        driverNameOf(shipment.driverId),
        vehicleNumberOf(shipment.vehicleId),
      ]
        .join(' ')
        .toLowerCase()
      return details.includes(searchText) && matchesFilters(shipment)
    })
    .sort(function (a, b) {
      return b.createdAt.localeCompare(a.createdAt)
    })

  // Tab counts follow the search and filters, so they always add up to what can be shown
  const tabs = [
    { value: 'all', label: 'All', count: matchingShipments.length },
    { value: 'pending', label: 'Pending', count: countByStatus('pending') },
    { value: 'in_transit', label: 'In Transit', count: countByStatus('in_transit') },
    { value: 'delayed', label: 'Delayed', count: countByStatus('delayed') },
    { value: 'delivered', label: 'Delivered', count: countByStatus('delivered') },
  ]

  const shownShipments = matchingShipments.filter(function (shipment) {
    return statusFilter === 'all' || shipment.status === statusFilter
  })

  const totalPages = Math.max(1, Math.ceil(shownShipments.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const firstIndex = (currentPage - 1) * pageSize
  const pageShipments = shownShipments.slice(firstIndex, firstIndex + pageSize)

  const viewingShipment = shipments.find(function (shipment) {
    return shipment.id === viewingId
  })

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5">
      <ListToolbar
        search={search}
        searchPlaceholder="Search ID, customer, driver, vehicle..."
        onSearchChange={changeSearch}
        action={
          <Button onClick={openAddForm}>
            <PackagePlus size={17} />
            Create shipment
          </Button>
        }
        tabs={tabs}
        activeTab={statusFilter}
        onTabChange={changeStatusFilter}
        filterCount={activeFilterCount}
        filterGrid="min-[440px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
        applying={filterLoading}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      >
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
          label="Vehicle"
          value={filterDraft.vehicle}
          allLabel="All vehicles"
          options={vehicleOptions}
          onChange={function (value) {
            setDraftFilter('vehicle', value)
          }}
        />
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
          label="Priority"
          value={filterDraft.priority}
          allLabel="All priorities"
          options={priorityOptions}
          onChange={function (value) {
            setDraftFilter('priority', value)
          }}
        />
        <div className="grid grid-cols-2 gap-2 min-[440px]:col-span-2">
          <FilterDate
            label="Delivery from"
            value={filterDraft.from}
            max={filterDraft.to}
            onChange={function (value) {
              setDraftFilter('from', value)
            }}
          />
          <FilterDate
            label="Delivery to"
            value={filterDraft.to}
            min={filterDraft.from}
            onChange={function (value) {
              setDraftFilter('to', value)
            }}
          />
        </div>
      </ListToolbar>

      {shownShipments.length === 0 ? (
        <EmptyState title="No shipments found" text="Try a different search or status, or create a new shipment." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line-soft bg-surface shadow-card">
          {pageLoading || filterLoading ? (
            <ShipmentTableSkeleton rows={pageShipments.length || pageSize} />
          ) : (
            <ShipmentTable
              shipments={pageShipments}
              drivers={data.drivers}
              vehicles={data.vehicles}
              locations={data.locations}
              onView={function (shipment) {
                setParams({ view: shipment.id })
              }}
              onEdit={openEditForm}
              onDelete={setDeletingShipment}
            />
          )}

          <div className="border-t border-line px-4 py-3">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onChange={changePage}
            />
          </div>
        </div>
      )}

      {showForm && (
        <ShipmentForm
          shipment={editingShipment}
          drivers={data.drivers}
          vehicles={data.vehicles}
          locations={data.locations}
          saving={saving}
          onSave={handleSave}
          onClose={closeForm}
        />
      )}

      {viewingShipment && (
        <ShipmentDetails
          shipment={viewingShipment}
          drivers={data.drivers}
          vehicles={data.vehicles}
          locations={data.locations}
          busy={saving}
          onStatusChange={handleStatusChange}
          onEdit={function () {
            openEditForm(viewingShipment)
          }}
          onClose={function () {
            setParams({ view: null })
          }}
        />
      )}

      {deletingShipment && (
        <ConfirmDialog
          title="Delete shipment?"
          message={
            'Delete ' +
            deletingShipment.trackingNumber +
            ' for ' +
            deletingShipment.customerCompany +
            '? If it is on the road, its driver and vehicle become available again.'
          }
          confirmLabel="Delete shipment"
          busy={saving}
          onConfirm={handleDelete}
          onCancel={function () {
            setDeletingShipment(null)
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

export default Shipments
