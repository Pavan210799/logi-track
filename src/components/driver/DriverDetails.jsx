import { Award, History, Navigation, Pencil, Truck, User } from 'lucide-react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import StatusBadge from '../layout/StatusBadge.jsx'
import DetailSection from '../layout/DetailSection.jsx'
import InfoItem from '../layout/InfoItem.jsx'
import { formatDate, formatDateTime, formatNumber } from '../../utils/format.js'

const listStyle = 'divide-y divide-line overflow-hidden rounded-xl border border-line'
const rowStyle = 'flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3'

function DriverDetails({ driver, vehicles, shipments, locations, onEdit, onClose }) {
  const isNew = driver.totalDeliveries === 0

  const vehicle = vehicles.find(function (item) {
    return item.id === driver.assignedVehicleId
  })

  const driverShipments = shipments.filter(function (item) {
    return item.driverId === driver.id
  })

  const currentTrip = driverShipments.find(function (item) {
    return item.status === 'in_transit' || item.status === 'delayed'
  })

  // Newest delivery first
  const deliveries = driverShipments
    .filter(function (item) {
      return item.status === 'delivered'
    })
    .sort(function (a, b) {
      return b.deliveredAt.localeCompare(a.deliveredAt)
    })

  const pendingCount = driverShipments.filter(function (item) {
    return item.status === 'pending'
  }).length

  function cityOf(locationId) {
    const place = locations.find(function (item) {
      return item.id === locationId
    })
    return place ? place.city : 'Unknown'
  }

  const metrics = [
    { label: 'Rating', value: isNew ? 'New' : driver.rating + ' / 5' },
    { label: 'Total deliveries', value: formatNumber(driver.totalDeliveries) },
    { label: 'On-time rate', value: isNew ? '-' : driver.onTimeRate + '%' },
    { label: 'Pending jobs', value: pendingCount },
  ]

  return (
    <Modal
      size="large"
      title={driver.name}
      subtitle={driver.city + ' · Joined ' + formatDate(driver.joinedDate)}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil size={16} />
            Edit driver
          </Button>
        </>
      }
    >
      <DetailSection title="Performance" icon={<Award size={15} />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metrics.map(function (metric) {
            return (
              <div key={metric.label} className="rounded-xl bg-sand p-3 text-center">
                <p className="text-lg font-bold text-accent">{metric.value}</p>
                <p className="text-[0.7rem] font-semibold text-gray-500 uppercase">{metric.label}</p>
              </div>
            )
          })}
        </div>
        {!isNew && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs font-semibold text-gray-500">
              <span>On-time deliveries</span>
              <span>{driver.onTimeRate}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: driver.onTimeRate + '%' }}></div>
            </div>
          </div>
        )}
      </DetailSection>

      <DetailSection title="Profile" icon={<User size={15} />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoItem label="Status">
            <StatusBadge status={driver.status} />
          </InfoItem>
          <InfoItem label="Phone">{driver.phone}</InfoItem>
          <InfoItem label="Email">{driver.email}</InfoItem>
          <InfoItem label="License">{driver.licenseNumber}</InfoItem>
          <InfoItem label="License expiry">{formatDate(driver.licenseExpiry)}</InfoItem>
          <InfoItem label="Experience">{driver.experienceYears} years</InfoItem>
        </div>
      </DetailSection>

      <DetailSection title="Assigned vehicle" icon={<Truck size={15} />}>
        {vehicle ? (
          <div className="flex items-center gap-3 rounded-xl border border-line p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-burgundy-light to-burgundy text-white">
              <Truck size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{vehicle.registrationNumber}</p>
              <p className="truncate text-xs text-gray-500">
                {vehicle.make} {vehicle.model} · {vehicle.type}
              </p>
            </div>
            <StatusBadge status={vehicle.status} />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-3 text-sm text-gray-500">
            No vehicle assigned. Edit the driver to assign one.
          </p>
        )}
      </DetailSection>

      {currentTrip && (
        <DetailSection title="Current trip" icon={<Navigation size={15} />}>
          <div className="flex flex-col gap-2 rounded-xl border border-blue-100 bg-blue-50/50 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <p className="font-semibold">{currentTrip.trackingNumber}</p>
              <p className="truncate text-xs text-gray-500">
                {cityOf(currentTrip.pickupLocationId)} to {cityOf(currentTrip.deliveryLocationId)} · Due{' '}
                {formatDateTime(currentTrip.scheduledDelivery)}
              </p>
            </div>
            <StatusBadge status={currentTrip.status} />
          </div>
        </DetailSection>
      )}

      <DetailSection title="Delivery history" icon={<History size={15} />} extra={deliveries.length + ' in records'}>
        {deliveries.length === 0 ? (
          <p className="text-sm text-gray-500">No deliveries recorded yet.</p>
        ) : (
          <ul className={listStyle}>
            {deliveries.slice(0, 6).map(function (item) {
              const wasOnTime = item.deliveredAt <= item.scheduledDelivery
              return (
                <li key={item.id} className={rowStyle}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">
                      {item.trackingNumber} · {item.customerCompany}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {cityOf(item.pickupLocationId)} to {cityOf(item.deliveryLocationId)} ·{' '}
                      {formatDateTime(item.deliveredAt)}
                    </p>
                  </div>
                  <span
                    className={
                      'w-fit shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold ' +
                      (wasOnTime ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700')
                    }
                  >
                    {wasOnTime ? 'On time' : 'Late'}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>
    </Modal>
  )
}

export default DriverDetails
