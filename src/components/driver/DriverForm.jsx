import { useState } from 'react'
import Modal from '../layout/Modal.jsx'
import Button from '../layout/Button.jsx'
import FormField, { inputClass } from '../layout/FormField.jsx'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  city: '',
  licenseNumber: '',
  licenseExpiry: '',
  experienceYears: '',
  status: 'available',
  assignedVehicleId: '',
}

const sectionTitle = 'text-[0.75rem] font-bold tracking-wide text-accent uppercase sm:col-span-2'

function DriverForm({ driver, drivers, vehicles, saving, onSave, onClose }) {
  const isEditing = Boolean(driver)
  const isOnTrip = isEditing && driver.status === 'on_trip'

  const [values, setValues] = useState(
    isEditing ? { ...driver, assignedVehicleId: driver.assignedVehicleId || '' } : emptyForm,
  )
  const [errors, setErrors] = useState({})

  // Active vehicles without a driver, plus this driver's own vehicle
  const freeVehicles = vehicles.filter(function (vehicle) {
    const isFree = !vehicle.assignedDriverId || (isEditing && vehicle.assignedDriverId === driver.id)
    return isFree && vehicle.status !== 'inactive'
  })

  function handleChange(event) {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  function validate() {
    const newErrors = {}
    const email = values.email.trim().toLowerCase()
    const license = values.licenseNumber.trim().toUpperCase()
    const phoneDigits = values.phone.replace(/\D/g, '')
    const experience = Number(values.experienceYears)
    const today = new Date().toISOString().slice(0, 10)

    const emailTaken = drivers.some(function (item) {
      return item.email.toLowerCase() === email && item.id !== values.id
    })
    const licenseTaken = drivers.some(function (item) {
      return item.licenseNumber.toUpperCase() === license && item.id !== values.id
    })

    if (values.name.trim().length < 3) {
      newErrors.name = 'Enter the full name'
    }
    if (phoneDigits.length !== 10 && !(phoneDigits.length === 12 && phoneDigits.startsWith('91'))) {
      newErrors.phone = 'Enter a 10 digit phone number'
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Enter a valid email'
    } else if (emailTaken) {
      newErrors.email = 'Another driver uses this email'
    }
    if (!values.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (license.length < 8) {
      newErrors.licenseNumber = 'Enter the full license number'
    } else if (licenseTaken) {
      newErrors.licenseNumber = 'This license number already exists'
    }
    if (!values.licenseExpiry) {
      newErrors.licenseExpiry = 'Pick the expiry date'
    } else if (values.licenseExpiry < today) {
      newErrors.licenseExpiry = 'This license has already expired'
    }
    if (values.experienceYears === '' || experience < 0 || experience > 50) {
      newErrors.experienceYears = 'Enter 0 to 50 years'
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
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim().toLowerCase(),
      city: values.city.trim(),
      licenseNumber: values.licenseNumber.trim().toUpperCase(),
      licenseExpiry: values.licenseExpiry,
      experienceYears: Number(values.experienceYears),
      status: values.status,
      assignedVehicleId: values.assignedVehicleId ? Number(values.assignedVehicleId) : null,
    })
  }

  return (
    <Modal
      title={isEditing ? 'Edit driver' : 'Add driver'}
      subtitle={isEditing ? driver.name : 'Fill in the new driver profile'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form="driver-form" disabled={saving}>
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Add driver'}
          </Button>
        </>
      }
    >
      <form id="driver-form" noValidate onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <h3 className={sectionTitle}>Profile</h3>

        <FormField label="Full name" error={errors.name}>
          <input name="name" value={values.name} onChange={handleChange} placeholder="Ravi Kumar" className={inputClass} />
        </FormField>
        <FormField label="City" error={errors.city}>
          <input name="city" value={values.city} onChange={handleChange} placeholder="Bengaluru" className={inputClass} />
        </FormField>
        <FormField label="Phone" error={errors.phone}>
          <input name="phone" value={values.phone} onChange={handleChange} placeholder="+91 98450 12345" className={inputClass} />
        </FormField>
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="ravi@logitrack.in"
            className={inputClass}
          />
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>License and experience</h3>

        <FormField label="License number" error={errors.licenseNumber}>
          <input
            name="licenseNumber"
            value={values.licenseNumber}
            onChange={handleChange}
            placeholder="KA01-2020-1234567"
            className={inputClass}
          />
        </FormField>
        <FormField label="License expiry" error={errors.licenseExpiry}>
          <input type="date" name="licenseExpiry" value={values.licenseExpiry} onChange={handleChange} className={inputClass} />
        </FormField>
        <FormField label="Experience (years)" error={errors.experienceYears}>
          <input
            type="number"
            name="experienceYears"
            value={values.experienceYears}
            onChange={handleChange}
            placeholder="5"
            className={inputClass}
          />
        </FormField>

        <h3 className={sectionTitle + ' mt-2'}>Availability and vehicle</h3>

        <FormField label="Status">
          {isOnTrip ? (
            <select disabled value="on_trip" className={inputClass}>
              <option value="on_trip">On Trip (changes when the trip ends)</option>
            </select>
          ) : (
            <select
              name="status"
              value={values.status === 'off_duty' ? 'off_duty' : 'available'}
              onChange={handleChange}
              className={inputClass}
            >
              {/* Working drivers are Assigned when they have a vehicle, otherwise Available */}
              <option value="available">{values.assignedVehicleId ? 'Assigned' : 'Available'}</option>
              <option value="off_duty">Off Duty</option>
            </select>
          )}
        </FormField>
        <FormField label="Assigned vehicle">
          <select name="assignedVehicleId" value={values.assignedVehicleId} onChange={handleChange} className={inputClass}>
            <option value="">No vehicle</option>
            {freeVehicles.map(function (vehicle) {
              return (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.registrationNumber} ({vehicle.type})
                </option>
              )
            })}
          </select>
        </FormField>
      </form>
    </Modal>
  )
}

export default DriverForm
