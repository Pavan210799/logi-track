import { useState } from 'react'
import { Building2, Check, CheckCheck, History, MapPin, Package, Pencil, Play, RotateCcw, Timer, Truck } from 'lucide-react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import StatusBadge from '../layout/StatusBadge.jsx'
import DetailSection from '../layout/DetailSection.jsx'
import InfoItem from '../layout/InfoItem.jsx'
import { inputClass } from '../layout/FormField.jsx'
import { formatDateTime, formatNumber, formatStatus } from '../../utils/format.js'

const steps = [
  { status: 'created', label: 'Created' },
  { status: 'picked_up', label: 'Picked up' },
  { status: 'in_transit', label: 'In transit' },
  { status: 'delivered', label: 'Delivered' },
]

// Dot color for each history entry
const historyColors = {
  created: 'bg-slate-400',
  picked_up: 'bg-blue-500',
  in_transit: 'bg-sky-500',
  delayed: 'bg-red-500',
  delivered: 'bg-emerald-500',
}

function ShipmentDetails({ shipment, drivers, vehicles, locations, busy, onStatusChange, onEdit, onClose }) {
  const [showDelayForm, setShowDelayForm] = useState(false)
  const [delayNote, setDelayNote] = useState('')
  const [delayError, setDelayError] = useState('')

  const pickup = locations.find(function (item) {
    return item.id === shipment.pickupLocationId
  })
  const delivery = locations.find(function (item) {
    return item.id === shipment.deliveryLocationId
  })
  const driver = drivers.find(function (item) {
    return item.id === shipment.driverId
  })
  const vehicle = vehicles.find(function (item) {
    return item.id === shipment.vehicleId
  })

  const reachedStatuses = shipment.history.map(function (entry) {
    return entry.status
  })

  // Newest update first
  const historyNewestFirst = shipment.history.slice().reverse()

  function saveDelay() {
    if (delayNote.trim().length < 3) {
      setDelayError('Write a short reason for the delay')
      return
    }
    onStatusChange('delayed', delayNote.trim())
    setShowDelayForm(false)
    setDelayNote('')
    setDelayError('')
  }

  return (
    <Modal
      size="large"
      title={shipment.trackingNumber}
      subtitle={shipment.customerCompany + ' · Created ' + formatDateTime(shipment.createdAt)}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {shipment.status !== 'delivered' && (
            <Button variant="secondary" onClick={onEdit} disabled={busy}>
              <Pencil size={16} />
              Edit
            </Button>
          )}
          {shipment.status === 'pending' && (
            <Button
              variant="primary"
              disabled={busy}
              onClick={function () {
                onStatusChange('in_transit', '')
              }}
            >
              <Play size={16} />
              Start trip
            </Button>
          )}
          {shipment.status === 'in_transit' && (
            <Button
              variant="warning"
              disabled={busy}
              onClick={function () {
                setShowDelayForm(true)
              }}
            >
              <Timer size={16} />
              Mark delayed
            </Button>
          )}
          {shipment.status === 'delayed' && (
            <Button
              variant="secondary"
              disabled={busy}
              onClick={function () {
                onStatusChange('in_transit', '')
              }}
            >
              <RotateCcw size={16} />
              Back on schedule
            </Button>
          )}
          {(shipment.status === 'in_transit' || shipment.status === 'delayed') && (
            <Button
              variant="success"
              disabled={busy}
              onClick={function () {
                onStatusChange('delivered', '')
              }}
            >
              <CheckCheck size={16} />
              Mark delivered
            </Button>
          )}
        </>
      }
    >
      {showDelayForm && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
          <label className="text-sm font-semibold text-amber-800" htmlFor="delay-note">
            Why is this shipment delayed?
          </label>
          <input
            id="delay-note"
            value={delayNote}
            onChange={function (event) {
              setDelayNote(event.target.value)
            }}
            placeholder="Heavy traffic on NH 44"
            className={inputClass + ' mt-2'}
          />
          {delayError && <p className="mt-1 text-xs font-medium text-red-600">{delayError}</p>}
          <div className="mt-3 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={function () {
                setShowDelayForm(false)
                setDelayError('')
              }}
            >
              Cancel
            </Button>
            <Button variant="warning" onClick={saveDelay} disabled={busy}>
              Save delay
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-xl bg-sand p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <StatusBadge status={shipment.status} />
          <StatusBadge status={shipment.priority} />
        </div>
        <ol className="grid grid-cols-4 gap-2">
          {steps.map(function (step) {
            const isDone = reachedStatuses.includes(step.status)
            const isDelayedHere = step.status === 'in_transit' && shipment.status === 'delayed'
            let circleStyle = 'bg-surface text-gray-400 ring-1 ring-line'
            if (isDone) {
              circleStyle = 'bg-burgundy text-white'
            }
            if (isDelayedHere) {
              circleStyle = 'bg-red-600 text-white'
            }

            return (
              <li key={step.status} className="flex flex-col items-center gap-1.5 text-center">
                <span className={'h-1 w-full rounded-full ' + (isDone ? 'bg-burgundy' : 'bg-gray-200')}></span>
                <span className={'grid h-8 w-8 place-items-center rounded-full ' + circleStyle}>
                  {isDone ? <Check size={15} /> : <span className="h-2 w-2 rounded-full bg-current"></span>}
                </span>
                <span className="text-[0.7rem] leading-tight font-semibold text-gray-600">
                  {isDelayedHere ? 'Delayed' : step.label}
                </span>
              </li>
            )
          })}
        </ol>
      </div>

      <DetailSection title="Route" icon={<MapPin size={15} />} extra={shipment.distanceKm + ' km'}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-line p-3">
            <p className="text-[0.68rem] font-bold tracking-wide text-blue-600 uppercase">Pickup</p>
            <p className="mt-1 font-semibold">{pickup ? pickup.name : 'Unknown'}</p>
            <p className="text-xs text-gray-500">{pickup ? pickup.address + ', ' + pickup.city : ''}</p>
            <p className="mt-2 text-xs font-medium text-gray-600">{formatDateTime(shipment.pickupDate)}</p>
          </div>
          <div className="rounded-xl border border-line p-3">
            <p className="text-[0.68rem] font-bold tracking-wide text-emerald-600 uppercase">Delivery</p>
            <p className="mt-1 font-semibold">{delivery ? delivery.name : 'Unknown'}</p>
            <p className="text-xs text-gray-500">{delivery ? delivery.address + ', ' + delivery.city : ''}</p>
            <p className="mt-2 text-xs font-medium text-gray-600">
              {shipment.deliveredAt
                ? 'Delivered ' + formatDateTime(shipment.deliveredAt)
                : 'Due ' + formatDateTime(shipment.scheduledDelivery)}
            </p>
          </div>
        </div>
      </DetailSection>

      <DetailSection title="Customer" icon={<Building2 size={15} />}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoItem label="Company">{shipment.customerCompany}</InfoItem>
          <InfoItem label="Contact">{shipment.customerName}</InfoItem>
          <InfoItem label="Phone">{shipment.customerPhone}</InfoItem>
          <InfoItem label="Email">{shipment.customerEmail}</InfoItem>
        </div>
      </DetailSection>

      <DetailSection title="Load" icon={<Package size={15} />}>
        <div className="grid grid-cols-3 gap-3">
          <InfoItem label="Weight">{formatNumber(shipment.weightKg)} kg</InfoItem>
          <InfoItem label="Packages">{shipment.packages}</InfoItem>
          <InfoItem label="Priority">{formatStatus(shipment.priority)}</InfoItem>
        </div>
      </DetailSection>

      <DetailSection title="Driver and vehicle" icon={<Truck size={15} />}>
        {driver || vehicle ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line p-3">
              <p className="text-[0.68rem] font-semibold tracking-wide text-gray-400 uppercase">Driver</p>
              <p className="mt-0.5 font-semibold">{driver ? driver.name : 'Not assigned'}</p>
              <p className="text-xs text-gray-500">{driver ? driver.phone : 'Edit to assign a driver'}</p>
            </div>
            <div className="rounded-xl border border-line p-3">
              <p className="text-[0.68rem] font-semibold tracking-wide text-gray-400 uppercase">Vehicle</p>
              <p className="mt-0.5 font-semibold">{vehicle ? vehicle.registrationNumber : 'Not assigned'}</p>
              <p className="text-xs text-gray-500">
                {vehicle ? vehicle.make + ' ' + vehicle.model : 'Edit to assign a vehicle'}
              </p>
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-amber-800">
            No driver or vehicle yet. Edit the shipment to assign them before starting the trip.
          </p>
        )}
      </DetailSection>

      <DetailSection title="Tracking history" icon={<History size={15} />}>
        <ul className="flex flex-col gap-2">
          {historyNewestFirst.map(function (entry, index) {
            return (
              <li key={index} className="flex items-start gap-3 rounded-xl border border-line px-3 py-2.5">
                <span
                  className={'mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ' + (historyColors[entry.status] || 'bg-gray-400')}
                ></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-x-3">
                    <p className="text-sm font-semibold">{formatStatus(entry.status)}</p>
                    <p className="text-xs text-gray-400">{formatDateTime(entry.time)}</p>
                  </div>
                  {entry.note && <p className="text-xs text-gray-500">{entry.note}</p>}
                </div>
              </li>
            )
          })}
        </ul>
      </DetailSection>
    </Modal>
  )
}

export default ShipmentDetails
