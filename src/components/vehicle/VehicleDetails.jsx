import { Fuel, History, Pencil, Truck, User, Wrench } from 'lucide-react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import StatusBadge from '../layout/StatusBadge.jsx'
import DetailSection from '../layout/DetailSection.jsx'
import InfoItem from '../layout/InfoItem.jsx'
import { formatDate, formatNumber, fuelBarColor } from '../../utils/format.js'

const listStyle = 'divide-y divide-line overflow-hidden rounded-xl border border-line'
const rowStyle = 'flex flex-col gap-1 px-3.5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3'

function VehicleDetails({ vehicle, drivers, shipments, maintenance, fuelLogs, locations, onEdit, onClose }) {
  const driver = drivers.find(function (item) {
    return item.id === vehicle.assignedDriverId
  })

  // Newest first
  const services = maintenance
    .filter(function (item) {
      return item.vehicleId === vehicle.id
    })
    .sort(function (a, b) {
      return b.date.localeCompare(a.date)
    })

  const fuelFills = fuelLogs
    .filter(function (item) {
      return item.vehicleId === vehicle.id
    })
    .sort(function (a, b) {
      return b.date.localeCompare(a.date)
    })

  const trips = shipments
    .filter(function (item) {
      return item.vehicleId === vehicle.id
    })
    .sort(function (a, b) {
      return b.createdAt.localeCompare(a.createdAt)
    })

  let serviceCost = 0
  services.forEach(function (item) {
    serviceCost = serviceCost + item.cost
  })

  let fuelCost = 0
  fuelFills.forEach(function (item) {
    fuelCost = fuelCost + item.totalCost
  })

  function cityOf(locationId) {
    const place = locations.find(function (item) {
      return item.id === locationId
    })
    return place ? place.city : 'Unknown'
  }

  return (
    <Modal
      size="large"
      title={vehicle.registrationNumber}
      subtitle={vehicle.make + ' ' + vehicle.model + ' · ' + vehicle.type}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <Pencil size={16} />
            Edit vehicle
          </Button>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-3 rounded-xl bg-sand p-3.5 sm:grid-cols-4">
        <InfoItem label="Status">
          <StatusBadge status={vehicle.status} />
        </InfoItem>
        <InfoItem label="Fuel level">
          <div className="flex items-center gap-2">
            <span>{vehicle.fuelLevel}%</span>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200">
              <div
                className={'h-full rounded-full ' + fuelBarColor(vehicle.fuelLevel)}
                style={{ width: vehicle.fuelLevel + '%' }}
              ></div>
            </div>
          </div>
        </InfoItem>
        <InfoItem label="Odometer">{formatNumber(vehicle.odometerKm)} km</InfoItem>
        <InfoItem label="Next service">{formatDate(vehicle.nextServiceDate)}</InfoItem>
      </div>

      <DetailSection title="Vehicle details" icon={<Truck size={15} />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <InfoItem label="Make">{vehicle.make}</InfoItem>
          <InfoItem label="Model">{vehicle.model}</InfoItem>
          <InfoItem label="Year">{vehicle.year}</InfoItem>
          <InfoItem label="Capacity">{formatNumber(vehicle.capacityKg)} kg</InfoItem>
          <InfoItem label="Fuel type">{vehicle.fuelType}</InfoItem>
          <InfoItem label="Last service">{formatDate(vehicle.lastServiceDate)}</InfoItem>
        </div>
      </DetailSection>

      <DetailSection title="Assigned driver" icon={<User size={15} />}>
        {driver ? (
          <div className="flex items-center gap-3 rounded-xl border border-line p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-burgundy to-burgundy-light text-sm font-bold text-white">
              {driver.name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{driver.name}</p>
              <p className="truncate text-xs text-gray-500">
                {driver.phone} · {driver.city}
              </p>
            </div>
            <StatusBadge status={driver.status} />
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-line p-3 text-sm text-gray-500">
            No driver assigned. Edit the vehicle to assign one.
          </p>
        )}
      </DetailSection>

      <DetailSection
        title="Maintenance"
        icon={<Wrench size={15} />}
        extra={services.length > 0 ? 'Total ₹' + formatNumber(serviceCost) : ''}
      >
        {services.length === 0 ? (
          <p className="text-sm text-gray-500">No maintenance records yet.</p>
        ) : (
          <ul className={listStyle}>
            {services.slice(0, 5).map(function (item) {
              return (
                <li key={item.id} className={rowStyle}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.type}</p>
                    <p className="truncate text-xs text-gray-500">
                      {item.garage} · {formatDate(item.date)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold">₹{formatNumber(item.cost)}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>

      <DetailSection
        title="Fuel log"
        icon={<Fuel size={15} />}
        extra={fuelFills.length > 0 ? 'Total ₹' + formatNumber(Math.round(fuelCost)) : ''}
      >
        {fuelFills.length === 0 ? (
          <p className="text-sm text-gray-500">No fuel records yet.</p>
        ) : (
          <ul className={listStyle}>
            {fuelFills.slice(0, 5).map(function (item) {
              return (
                <li key={item.id} className={rowStyle}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.liters} liters</p>
                    <p className="truncate text-xs text-gray-500">
                      {item.station} · {formatDate(item.date)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold">₹{formatNumber(Math.round(item.totalCost))}</span>
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>

      <DetailSection title="Trip history" icon={<History size={15} />} extra={trips.length + ' trips'}>
        {trips.length === 0 ? (
          <p className="text-sm text-gray-500">This vehicle has no trips yet.</p>
        ) : (
          <ul className={listStyle}>
            {trips.slice(0, 6).map(function (item) {
              return (
                <li key={item.id} className={rowStyle}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{item.trackingNumber}</p>
                    <p className="truncate text-xs text-gray-500">
                      {cityOf(item.pickupLocationId)} to {cityOf(item.deliveryLocationId)} · {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              )
            })}
          </ul>
        )}
      </DetailSection>
    </Modal>
  )
}

export default VehicleDetails
