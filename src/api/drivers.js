import { apiDelete, apiGet, apiPost, apiPut } from './api.js'
import { addActivity, linkDriverAndVehicle, loadDb, nextId, nowText, saveDb, syncTripStatus } from './db.js'

// Everything the Drivers page needs
export async function getDriverPageData() {
  await apiGet()
  const db = loadDb()

  return {
    drivers: db.drivers,
    vehicles: db.vehicles,
    shipments: db.shipments,
    locations: db.locations,
  }
}

export async function addDriver(driverData) {
  await apiPost(driverData)
  const db = loadDb()

  // New drivers start with no deliveries yet
  const driver = {
    id: nextId(db.drivers),
    ...driverData,
    joinedDate: nowText().slice(0, 10),
    rating: 0,
    totalDeliveries: 0,
    onTimeRate: 0,
  }

  db.drivers.push(driver)
  linkDriverAndVehicle(db, driver.id, driver.assignedVehicleId)
  syncTripStatus(db)
  addActivity(db, 'driver_added', driver.name + ' joined as a driver', 'driver', driver.id)

  saveDb(db)
}

export async function updateDriver(driverId, driverData) {
  await apiPut(driverData)
  const db = loadDb()

  const driver = db.drivers.find(function (item) {
    return item.id === driverId
  })

  // Copy the new values onto the saved driver
  Object.assign(driver, driverData)
  linkDriverAndVehicle(db, driver.id, driver.assignedVehicleId)
  syncTripStatus(db)
  addActivity(db, 'driver_updated', driver.name + ' profile updated', 'driver', driver.id)

  saveDb(db)
}

export async function deleteDriver(driverId) {
  const db = loadDb()
  const driver = db.drivers.find(function (item) {
    return item.id === driverId
  })

  if (driver.status === 'on_trip') {
    throw new Error(driver.name + ' is on a trip. Finish the shipment before removing this driver.')
  }

  await apiDelete()

  linkDriverAndVehicle(db, driverId, null)

  db.drivers = db.drivers.filter(function (item) {
    return item.id !== driverId
  })
  db.notifications = db.notifications.filter(function (item) {
    return !(item.entityType === 'driver' && item.entityId === driverId)
  })

  // Pending shipments need a new driver
  db.shipments.forEach(function (shipment) {
    if (shipment.driverId === driverId && shipment.status === 'pending') {
      shipment.driverId = null
    }
  })

  syncTripStatus(db)
  addActivity(db, 'driver_removed', driver.name + ' removed from drivers', 'driver', driverId)

  saveDb(db)
}
