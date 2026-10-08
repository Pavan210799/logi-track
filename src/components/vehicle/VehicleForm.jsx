import { useState } from 'react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import FormField, { inputClass } from '../layout/FormField.jsx'

const vehicleTypes = ['Heavy Truck', 'Medium Truck', 'Light Truck', 'Mini Truck', 'Pickup Van']
const fuelTypes = ['Diesel', 'Petrol', 'CNG', 'Electric']

const emptyForm = {
  registrationNumber: '',
  make: '',
  model: '',
  year: '',
  type: 'Heavy Truck',
  capacityKg: '',
  fuelType: 'Diesel',
  status: 'available',
  assignedDriverId: '',
  odometerKm: '0',
  fuelLevel: '100',
  lastServiceDate: '',
  nextServiceDate: '',
}

const sectionTitle = 'text-[0.75rem] font-bold tracking-wide text-accent uppercase sm:col-span-2'

function VehicleForm({ vehicle, vehicles, drivers, saving, onSave, onClose }) {
  const isEditing = Boolean(vehicle)
  const isOnTrip = isEditing && vehicle.status === 'on_trip'

  const [values, setValues] = useState(
    isEditing ? { ...vehicle, assignedDriverId: vehicle.assignedDriverId || '' } : emptyForm,
  )
  const [errors, setErrors] = useState({})

  // Available drivers (free, not off duty), plus this vehicle's own driver
  const freeDrivers = drivers.filter(function (driver) {
    const isOwnDriver = isEditing && driver.assignedVehicleId === vehicle.id
    return (driver.status === 'available' && !driver.assignedVehicleId) || isOwnDriver
  })
  const availableCount = freeDrivers.filter(function (driver) {
    return driver.status === 'available'
  }).length
  const driverHint =
    availableCount === 0
      ? 'No drivers are available right now'
      : availableCount + (availableCount === 1 ? ' driver' : ' drivers') + ' available'

  function handleChange(event) {
    const name = event.target.name
    let value = event.target.value
    if (name === 'registrationNumber') {
      value = value.toUpperCase()
    }
    setValues({ ...values, [name]: value })
  }

  function validate() {
    const newErrors = {}
    const registration = values.registrationNumber.trim()
    const thisYear = new Date().getFullYear()
    const year = Number(values.year)
    const fuel = Number(values.fuelLevel)

    const isDuplicate = vehicles.some(function (item) {
      return item.registrationNumber === registration && item.id !== values.id
    })

    if (!/^[A-Z]{2}-\d{2}-[A-Z]{1,3}-\d{4}$/.test(registration)) {
      newErrors.registrationNumber = 'Use a format like KA-01-AB-1234'
    } else if (isDuplicate) {
      newErrors.registrationNumber = 'This registration number already exists'
    }
    if (!values.make.trim()) {
      newErrors.make = 'Make is required'
    }
    if (!values.model.trim()) {
      newErrors.model = 'Model is required'
    }
    if (!year || year < 2000 || year > thisYear + 1) {
      newErrors.year = 'Enter a year from 2000 to ' + (thisYear + 1)
    }
    if (!(Number(values.capacityKg) > 0)) {
      newErrors.capacityKg = 'Enter the capacity in kg'
    }
    if (values.odometerKm === '' || Number(values.odometerKm) < 0) {
      newErrors.odometerKm = 'Enter 0 or more'
    }
    if (values.fuelLevel === '' || fuel < 0 || fuel > 100) {
      newErrors.fuelLevel = 'Enter a value from 0 to 100'
    }
    if (!values.lastServiceDate) {
      newErrors.lastServiceDate = 'Pick the last service date'
    }
    if (!values.nextServiceDate) {
      newErrors.nextServiceDate = 'Pick the next service date'
    } else if (values.lastServiceDate && values.nextServiceDate <= values.lastServiceDate) {
      newErrors.nextServiceDate = 'Must be after the last service'
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
      registrationNumber: values.registrationNumber.trim(),
      make: values.make.trim(),
      model: values.model.trim(),
      year: Number(values.year),
      type: values.type,
      capacityKg: Number(values.capacityKg),
      fuelType: values.fuelType,
      status: values.status,
      assignedDriverId: values.assignedDriverId ? Number(values.assignedDriverId) : null,
      odometerKm: Number(values.odometerKm),
      fuelLevel: Number(values.fuelLevel),
      lastServiceDate: values.lastServiceDate,
      nextServiceDate: values.nextServiceDate,
    })
  }

  return (
    <Modal
      title={isEditing ? 'Edit vehicle' : 'Add vehicle'}
      subtitle={isEditing ? vehicle.registrationNumber : 'Fill in the details of the new vehicle'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="vehicle-form" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add vehicle'}
          </Button>
        </>
      }
    >
      <form id="vehicle-form" noValidate onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <h3 className={sectionTitle}>Vehicle details</h3>

        <FormField label="Registration number" error={errors.registrationNumber}>
          <input
            name="registrationNumber"
            value={values.registrationNumber}
            onChange={handleChange}
            placeholder="KA-01-AB-1234"
            className={inputClass}
          />
        </FormField>
        <FormField label="Vehicle type">
          <select name="type" value={values.type} onChange={handleChange} className={inputClass}>
            {vehicleTypes.map(function (type) {
              return (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            })}
          </select>
        </FormField>
        <FormField label="Make" error={errors.make}>
          <input name="make" value={values.make} onChange={handleChange} placeholder="Tata" className={inputClass} />
        </FormField>
        <FormField label="Model" error={errors.model}>
          <input name="model" value={values.model} onChange={handleChange} placeholder="Prima 4028.S" className={inputClass} />
        </FormField>
        <FormField label="Year" error={errors.year}>
          <input type="number" name="year" value={values.year} onChange={handleChange} placeholder="2024" className={inputClass} />
        </FormField>
        <FormField label="Capacity (kg)" error={errors.capacityKg}>
          <input
            type="number"
            name="capacityKg"
            value={values.capacityKg}
            onChange={handleChange}
            placeholder="10000"
            className={inputClass}
          />
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Assignment and status</h3>

        <FormField label="Status">
          {isOnTrip ? (
            <select disabled value="on_trip" className={inputClass}>
              <option value="on_trip">On Trip (changes when the trip ends)</option>
            </select>
          ) : (
            <select name="status" value={values.status} onChange={handleChange} className={inputClass}>
              <option value="available">Available</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          )}
        </FormField>
        <FormField label="Assigned driver" hint={driverHint}>
          <select name="assignedDriverId" value={values.assignedDriverId} onChange={handleChange} className={inputClass}>
            <option value="">Not assigned</option>
            {freeDrivers.map(function (driver) {
              return (
                <option key={driver.id} value={driver.id}>
                  {driver.name} ({driver.city}){driver.status === 'available' ? '' : ' · current driver'}
                </option>
              )
            })}
          </select>
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Fuel and service</h3>

        <FormField label="Fuel type">
          <select name="fuelType" value={values.fuelType} onChange={handleChange} className={inputClass}>
            {fuelTypes.map(function (fuel) {
              return (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              )
            })}
          </select>
        </FormField>
        <FormField label="Fuel level (%)" error={errors.fuelLevel}>
          <input type="number" name="fuelLevel" value={values.fuelLevel} onChange={handleChange} className={inputClass} />
        </FormField>
        <FormField label="Odometer (km)" error={errors.odometerKm}>
          <input type="number" name="odometerKm" value={values.odometerKm} onChange={handleChange} className={inputClass} />
        </FormField>
        <FormField label="Last service" error={errors.lastServiceDate}>
          <input
            type="date"
            name="lastServiceDate"
            value={values.lastServiceDate}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>
        <FormField label="Next service" error={errors.nextServiceDate}>
          <input
            type="date"
            name="nextServiceDate"
            value={values.nextServiceDate}
            onChange={handleChange}
            className={inputClass}
          />
        </FormField>
      </form>
    </Modal>
  )
}

export default VehicleForm
