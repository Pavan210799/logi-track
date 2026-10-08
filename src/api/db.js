import { mockDb } from '../data/mockDb.js'
import { daysUntil, formatDate } from '../utils/format.js'

const STORAGE_KEY = 'logitrack-data'

// Raise this when mockDb changes shape, so old saved data is replaced once
const DATA_VERSION = 2

// Saved data from localStorage, or a fresh copy of mockDb
export function loadDb() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    const db = JSON.parse(saved)
    if (db.version === DATA_VERSION) {
      return db
    }
  }
  const freshDb = JSON.parse(JSON.stringify(mockDb))
  freshDb.version = DATA_VERSION
  return freshDb
}

export function saveDb(db) {
  addStatusAlerts(loadDb(), db)
  db.version = DATA_VERSION
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))

  // Lets the header bell and other parts know the data changed
  window.dispatchEvent(new Event('logitrack-change'))
}

// Next free id in a list
export function nextId(list) {
  let maxId = 0
  list.forEach(function (item) {
    if (item.id > maxId) {
      maxId = item.id
    }
  })
  return maxId + 1
}

// Current local time as text like '2026-10-07T09:15:00'
export function nowText() {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 19)
}

// New items go first, so the list stays newest first
export function addActivity(db, type, message, entityType, entityId) {
  db.activities.unshift({
    id: nextId(db.activities),
    type: type,
    message: message,
    entityType: entityType,
    entityId: entityId,
    createdAt: nowText(),
  })
}

export function addNotification(db, type, severity, title, message, entityType, entityId) {
  db.notifications.unshift({
    id: nextId(db.notifications),
    type: type,
    title: title,
    message: message,
    severity: severity,
    entityType: entityType,
    entityId: entityId,
    read: false,
    createdAt: nowText(),
  })
}

// Pair a driver with a vehicle and clear their old pairs
export function linkDriverAndVehicle(db, driverId, vehicleId) {
  db.drivers.forEach(function (driver) {
    if (driver.assignedVehicleId === vehicleId || driver.id === driverId) {
      driver.assignedVehicleId = null
    }
  })

  db.vehicles.forEach(function (vehicle) {
    if (vehicle.assignedDriverId === driverId || vehicle.id === vehicleId) {
      vehicle.assignedDriverId = null
    }
  })

  const driver = db.drivers.find(function (item) {
    return item.id === driverId
  })
  const vehicle = db.vehicles.find(function (item) {
    return item.id === vehicleId
  })

  if (driver && vehicle) {
    driver.assignedVehicleId = vehicle.id
    vehicle.assignedDriverId = driver.id
  }
}

// Drivers and vehicles on an active shipment are on_trip
// Other drivers are assigned when they have a vehicle and available when they don't (off duty stays off duty)
export function syncTripStatus(db) {
  const activeShipments = db.shipments.filter(function (shipment) {
    return shipment.status === 'in_transit' || shipment.status === 'delayed'
  })

  db.drivers.forEach(function (driver) {
    const isOnTrip = activeShipments.some(function (shipment) {
      return shipment.driverId === driver.id
    })
    if (isOnTrip) {
      driver.status = 'on_trip'
    } else if (driver.status !== 'off_duty') {
      driver.status = driver.assignedVehicleId ? 'assigned' : 'available'
    }
  })

  db.vehicles.forEach(function (vehicle) {
    const isOnTrip = activeShipments.some(function (shipment) {
      return shipment.vehicleId === vehicle.id
    })
    if (isOnTrip) {
      vehicle.status = 'on_trip'
    } else if (vehicle.status === 'on_trip') {
      vehicle.status = 'available'
    }
  })
}

const driverAlerts = {
  on_trip: { title: 'Driver on a trip', text: ' started a trip.' },
  assigned: { title: 'Driver assigned', text: ' was given a vehicle.' },
  available: { title: 'Driver available', text: ' is available for new assignments.' },
  off_duty: { title: 'Driver off duty', text: ' is now off duty.' },
}

// Compares the old and new data and adds a notification for every status change
function addStatusAlerts(oldDb, db) {
  db.drivers.forEach(function (driver) {
    const oldDriver = oldDb.drivers.find(function (item) {
      return item.id === driver.id
    })
    const alert = driverAlerts[driver.status]
    if (oldDriver && oldDriver.status !== driver.status && alert) {
      addNotification(db, 'driver_status', 'info', alert.title, driver.name + alert.text, 'driver', driver.id)
    }
  })

  db.vehicles.forEach(function (vehicle) {
    const oldVehicle = oldDb.vehicles.find(function (item) {
      return item.id === vehicle.id
    })
    const plate = vehicle.registrationNumber

    if (oldVehicle && oldVehicle.status !== vehicle.status && vehicle.status === 'maintenance') {
      addNotification(db, 'maintenance_due', 'warning', 'Vehicle in workshop', plate + ' was sent for maintenance.', 'vehicle', vehicle.id)
    }
    if (oldVehicle && oldVehicle.status === 'maintenance' && vehicle.status !== 'maintenance') {
      addNotification(db, 'maintenance_due', 'success', 'Back in service', plate + ' is back from maintenance.', 'vehicle', vehicle.id)
    }

    // New or changed service date that is due within 3 days
    const serviceChanged = !oldVehicle || oldVehicle.nextServiceDate !== vehicle.nextServiceDate
    if (serviceChanged && daysUntil(vehicle.nextServiceDate) <= 3) {
      addNotification(
        db,
        'maintenance_due',
        'warning',
        'Maintenance due',
        plate + ' is due for service on ' + formatDate(vehicle.nextServiceDate) + '.',
        'vehicle',
        vehicle.id,
      )
    }
  })
}
