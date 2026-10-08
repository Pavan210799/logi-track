import { useState } from 'react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import FormField, { inputClass } from '../layout/FormField.jsx'
import { formatNumber, formatStatus } from '../../utils/format.js'

const emptyForm = {
  customerCompany: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  pickupLocationId: '',
  deliveryLocationId: '',
  priority: 'standard',
  weightKg: '',
  packages: '',
  pickupDate: '',
  scheduledDelivery: '',
  driverId: '',
  vehicleId: '',
}

const sectionTitle = 'text-[0.75rem] font-bold tracking-wide text-accent uppercase sm:col-span-2'

// Saved text like '2026-10-07T10:00:00' -> input text '2026-10-07T10:00'
function toInputTime(dateText) {
  return dateText ? dateText.slice(0, 16) : ''
}

function ShipmentForm({ shipment, drivers, vehicles, locations, saving, onSave, onClose }) {
  const isEditing = Boolean(shipment)
  const isActive = isEditing && (shipment.status === 'in_transit' || shipment.status === 'delayed')

  const [values, setValues] = useState(
    isEditing
      ? {
          ...shipment,
          driverId: shipment.driverId || '',
          vehicleId: shipment.vehicleId || '',
          pickupDate: toInputTime(shipment.pickupDate),
          scheduledDelivery: toInputTime(shipment.scheduledDelivery),
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState({})

  const hubs = locations.filter(function (place) {
    return place.type === 'hub'
  })
  const customerSites = locations.filter(function (place) {
    return place.type === 'customer'
  })

  // Off duty drivers and vehicles in the workshop can't take shipments
  const readyDrivers = drivers.filter(function (driver) {
    const isCurrent = isEditing && driver.id === shipment.driverId
    return driver.status !== 'off_duty' || isCurrent
  })
  const readyVehicles = vehicles.filter(function (vehicle) {
    const isCurrent = isEditing && vehicle.id === shipment.vehicleId
    return vehicle.status === 'available' || vehicle.status === 'on_trip' || isCurrent
  })

  function handleChange(event) {
    const name = event.target.name
    const value = event.target.value
    const newValues = { ...values, [name]: value }

    // Picking a driver also picks their own vehicle
    if (name === 'driverId' && value) {
      const driver = drivers.find(function (item) {
        return item.id === Number(value)
      })
      const ownVehicle = readyVehicles.find(function (item) {
        return item.id === driver.assignedVehicleId
      })
      if (ownVehicle) {
        newValues.vehicleId = ownVehicle.id
      }
    }

    setValues(newValues)
  }

  function validate() {
    const newErrors = {}
    const phoneDigits = values.customerPhone.replace(/\D/g, '')
    const weight = Number(values.weightKg)
    const packages = Number(values.packages)
    const vehicle = vehicles.find(function (item) {
      return item.id === Number(values.vehicleId)
    })

    if (!values.customerCompany.trim()) {
      newErrors.customerCompany = 'Company is required'
    }
    if (values.customerName.trim().length < 3) {
      newErrors.customerName = 'Enter the contact name'
    }
    if (phoneDigits.length !== 10 && !(phoneDigits.length === 12 && phoneDigits.startsWith('91'))) {
      newErrors.customerPhone = 'Enter a 10 digit phone number'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.customerEmail.trim())) {
      newErrors.customerEmail = 'Enter a valid email'
    }
    if (!values.pickupLocationId) {
      newErrors.pickupLocationId = 'Pick a pickup hub'
    }
    if (!values.deliveryLocationId) {
      newErrors.deliveryLocationId = 'Pick a delivery location'
    }
    if (!(weight > 0)) {
      newErrors.weightKg = 'Enter the weight in kg'
    } else if (vehicle && weight > vehicle.capacityKg) {
      newErrors.weightKg = 'Too heavy for ' + vehicle.registrationNumber + ' (max ' + formatNumber(vehicle.capacityKg) + ' kg)'
    }
    if (!Number.isInteger(packages) || packages < 1) {
      newErrors.packages = 'Enter 1 or more packages'
    }
    if (!values.pickupDate) {
      newErrors.pickupDate = 'Pick the pickup time'
    }
    if (!values.scheduledDelivery) {
      newErrors.scheduledDelivery = 'Pick the delivery time'
    } else if (values.pickupDate && values.scheduledDelivery <= values.pickupDate) {
      newErrors.scheduledDelivery = 'Must be after the pickup time'
    }
    if (isActive && !values.driverId) {
      newErrors.driverId = 'A shipment on the road needs a driver'
    }
    if (isActive && !values.vehicleId) {
      newErrors.vehicleId = 'A shipment on the road needs a vehicle'
    }

    return newErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const newErrors = validate()
    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return
    }

    onSave({
      customerCompany: values.customerCompany.trim(),
      customerName: values.customerName.trim(),
      customerPhone: values.customerPhone.trim(),
      customerEmail: values.customerEmail.trim().toLowerCase(),
      pickupLocationId: Number(values.pickupLocationId),
      deliveryLocationId: Number(values.deliveryLocationId),
      priority: values.priority,
      weightKg: Number(values.weightKg),
      packages: Number(values.packages),
      pickupDate: values.pickupDate + ':00',
      scheduledDelivery: values.scheduledDelivery + ':00',
      driverId: values.driverId ? Number(values.driverId) : null,
      vehicleId: values.vehicleId ? Number(values.vehicleId) : null,
    })
  }

  return (
    <Modal
      size="large"
      title={isEditing ? 'Edit shipment' : 'Create shipment'}
      subtitle={isEditing ? shipment.trackingNumber : 'A tracking number is created when you save'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="shipment-form" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create shipment'}
          </Button>
        </>
      }
    >
      <form id="shipment-form" noValidate onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <h3 className={sectionTitle}>Customer</h3>

        <FormField label="Company" error={errors.customerCompany}>
          <input
            name="customerCompany"
            value={values.customerCompany}
            onChange={handleChange}
            placeholder="Decathlon"
            className={inputClass}
          />
        </FormField>
        <FormField label="Contact name" error={errors.customerName}>
          <input
            name="customerName"
            value={values.customerName}
            onChange={handleChange}
            placeholder="Arvind Subramanian"
            className={inputClass}
          />
        </FormField>
        <FormField label="Phone" error={errors.customerPhone}>
          <input
            name="customerPhone"
            value={values.customerPhone}
            onChange={handleChange}
            placeholder="+91 90834 17412"
            className={inputClass}
          />
        </FormField>
        <FormField label="Email" error={errors.customerEmail}>
          <input
            type="email"
            name="customerEmail"
            value={values.customerEmail}
            onChange={handleChange}
            placeholder="name@company.com"
            className={inputClass}
          />
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Route and load</h3>

        <FormField label="Pickup hub" error={errors.pickupLocationId}>
          <select name="pickupLocationId" value={values.pickupLocationId} onChange={handleChange} className={inputClass}>
            <option value="">Select pickup hub</option>
            {hubs.map(function (place) {
              return (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              )
            })}
          </select>
        </FormField>
        <FormField label="Delivery location" error={errors.deliveryLocationId}>
          <select
            name="deliveryLocationId"
            value={values.deliveryLocationId}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select delivery location</option>
            {customerSites.map(function (place) {
              return (
                <option key={place.id} value={place.id}>
                  {place.name}
                </option>
              )
            })}
          </select>
        </FormField>
        <FormField label="Weight (kg)" error={errors.weightKg}>
          <input type="number" name="weightKg" value={values.weightKg} onChange={handleChange} placeholder="850" className={inputClass} />
        </FormField>
        <FormField label="Packages" error={errors.packages}>
          <input type="number" name="packages" value={values.packages} onChange={handleChange} placeholder="12" className={inputClass} />
        </FormField>
        <FormField label="Priority">
          <select name="priority" value={values.priority} onChange={handleChange} className={inputClass}>
            <option value="standard">Standard</option>
            <option value="express">Express</option>
            <option value="urgent">Urgent</option>
          </select>
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Schedule</h3>

        <FormField label="Pickup time" error={errors.pickupDate}>
          <input
            type="datetime-local"
            name="pickupDate"
            value={values.pickupDate}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>
        <FormField label="Deliver by" error={errors.scheduledDelivery}>
          <input
            type="datetime-local"
            name="scheduledDelivery"
            value={values.scheduledDelivery}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Driver and vehicle</h3>

        <FormField label="Driver" error={errors.driverId}>
          <select name="driverId" value={values.driverId} onChange={handleChange} className={inputClass}>
            <option value="">Assign later</option>
            {readyDrivers.map(function (driver) {
              return (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({formatStatus(driver.status)})
                </option>
              )
            })}
          </select>
        </FormField>
        <FormField label="Vehicle" error={errors.vehicleId}>
          <select name="vehicleId" value={values.vehicleId} onChange={handleChange} className={inputClass}>
            <option value="">Assign later</option>
            {readyVehicles.map(function (vehicle) {
              return (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber} · {formatNumber(vehicle.capacityKg)} kg ({formatStatus(vehicle.status)})
                </option>
              )
            })}
          </select>
        </FormField>
      </form>
    </Modal>
  )
}

export default ShipmentForm
