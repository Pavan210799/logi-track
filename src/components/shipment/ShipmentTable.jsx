import { ArrowRight, Eye, Pencil, Trash2 } from 'lucide-react'
import StatusBadge from '../layout/StatusBadge.jsx'
import IconButton from '../layout/IconButton.jsx'
import { formatDateTime, formatStatus } from '../../utils/format.js'

function RouteText({ from, to }) {
  return (
    <span className="flex items-center gap-1.5">
      {from}
      <ArrowRight size={13} className="shrink-0 text-gray-400" />
      {to}
    </span>
  )
}

const priorityColors = {
  urgent: 'text-red-600',
  express: 'text-amber-600',
  standard: 'text-gray-400',
}

function ShipmentTable({ shipments, drivers, vehicles, locations, onView, onEdit, onDelete }) {
  function cityOf(locationId) {
    const place = locations.find(function (item) {
      return item.id === locationId
    })
    return place ? place.city : 'Unknown'
  }

  function driverNameOf(driverId) {
    const driver = drivers.find(function (item) {
      return item.id === driverId
    })
    return driver ? driver.name : ''
  }

  function vehicleNumberOf(vehicleId) {
    const vehicle = vehicles.find(function (item) {
      return item.id === vehicleId
    })
    return vehicle ? vehicle.registrationNumber : ''
  }

  return (
    <table className="w-full text-left text-sm">
      <thead className="border-b border-line bg-sand text-[0.7rem] font-bold tracking-wide text-gray-500 uppercase">
        <tr>
          <th className="px-4 py-3">Shipment</th>
          <th className="hidden px-4 py-3 md:table-cell">Route</th>
          <th className="hidden px-4 py-3 xl:table-cell">Driver and vehicle</th>
          <th className="hidden px-4 py-3 lg:table-cell">Delivery</th>
          <th className="hidden px-4 py-3 sm:table-cell">Status</th>
          <th className="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="stagger divide-y divide-line">
        {shipments.map(function (shipment) {
          const driverName = driverNameOf(shipment.driverId)
          const fromCity = cityOf(shipment.pickupLocationId)
          const toCity = cityOf(shipment.deliveryLocationId)

          return (
            <tr key={shipment.id} className="align-middle transition-colors duration-200 hover:bg-burgundy/[0.03]">
              <td className="px-4 py-3">
                <div className="flex flex-wrap items-center gap-x-2">
                  <button
                    type="button"
                    onClick={function () {
                      onView(shipment)
                    }}
                    className="cursor-pointer font-bold text-gray-900 hover:text-accent"
                  >
                    {shipment.trackingNumber}
                  </button>
                  <span className={'text-[0.68rem] font-bold uppercase ' + priorityColors[shipment.priority]}>
                    {formatStatus(shipment.priority)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{shipment.customerCompany}</p>
                <div className="mt-1 text-xs text-gray-500 md:hidden">
                  <RouteText from={fromCity} to={toCity} />
                </div>
                <div className="mt-1.5 sm:hidden">
                  <StatusBadge status={shipment.status} />
                </div>
              </td>
              <td className="hidden px-4 py-3 text-gray-700 md:table-cell">
                <RouteText from={fromCity} to={toCity} />
                <p className="text-xs text-gray-400">{shipment.distanceKm} km</p>
              </td>
              <td className="hidden px-4 py-3 xl:table-cell">
                {driverName ? (
                  <>
                    <p className="font-medium text-gray-700">{driverName}</p>
                    <p className="text-xs text-gray-500">{vehicleNumberOf(shipment.vehicleId)}</p>
                  </>
                ) : (
                  <span className="text-xs font-semibold text-amber-600">Not assigned</span>
                )}
              </td>
              <td className="hidden px-4 py-3 lg:table-cell">
                {shipment.status === 'delivered' ? (
                  <>
                    <p className="font-medium text-gray-700">{formatDateTime(shipment.deliveredAt)}</p>
                    <p className="text-xs text-gray-400">Delivered</p>
                  </>
                ) : (
                  <>
                    <p className="font-medium text-gray-700">{formatDateTime(shipment.scheduledDelivery)}</p>
                    <p className="text-xs text-gray-400">Due</p>
                  </>
                )}
              </td>
              <td className="hidden px-4 py-3 sm:table-cell">
                <StatusBadge status={shipment.status} />
              </td>
              <td className="px-3 py-3">
                <div className="flex justify-end">
                  <IconButton
                    label="View details"
                    onClick={function () {
                      onView(shipment)
                    }}
                  >
                    <Eye size={17} />
                  </IconButton>
                  {shipment.status !== 'delivered' && (
                    <IconButton
                      label="Edit shipment"
                      onClick={function () {
                        onEdit(shipment)
                      }}
                    >
                      <Pencil size={16} />
                    </IconButton>
                  )}
                  <IconButton
                    label="Delete shipment"
                    danger
                    onClick={function () {
                      onDelete(shipment)
                    }}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </div>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export default ShipmentTable
