import { apiDelete, apiGet, apiPost, apiPut } from './api.js'
import { addActivity, linkDriverAndVehicle, loadDb, nextId, saveDb, syncTripStatus } from './db.js'

// Everything the Vehicles page needs
export async function getVehiclePageData() {
  await apiGet()
  const db = loadDb()

  return {
    vehicles: db.vehicles,
    drivers: db.drivers,
    shipments: db.shipments,
    maintenance: db.maintenance,
    fuelLogs: db.fuelLogs,
    locations: db.locations,
  }
}

export async function addVehicle(vehicleData) {
  await apiPost(vehicleData)
  const db = loadDb()

  const vehicle = { id: nextId(db.vehicles), ...vehicleData }
  db.vehicles.push(vehicle)
  linkDriverAndVehicle(db, vehicle.assignedDriverId, vehicle.id)
  syncTripStatus(db)
  addActivity(db, 'vehicle_added', vehicle.registrationNumber + ' added to the fleet', 'vehicle', vehicle.id)

  saveDb(db)
}

export async function updateVehicle(vehicleId, vehicleData) {
  await apiPut(vehicleData)
  const db = loadDb()

  const vehicle = db.vehicles.find(function (item) {
    return item.id === vehicleId
  })

  // Copy the new values onto the saved vehicle
  Object.assign(vehicle, vehicleData)
  linkDriverAndVehicle(db, vehicle.assignedDriverId, vehicle.id)
  syncTripStatus(db)
  addActivity(db, 'vehicle_updated', vehicle.registrationNumber + ' details updated', 'vehicle', vehicle.id)

  saveDb(db)
}

export async function deleteVehicle(vehicleId) {
  const db = loadDb()
  const vehicle = db.vehicles.find(function (item) {
    return item.id === vehicleId
  })

  if (vehicle.status === 'on_trip') {
    throw new Error(vehicle.registrationNumber + ' is on a trip. Finish its shipment before removing it.')
  }

  await apiDelete()

  linkDriverAndVehicle(db, null, vehicleId)

  db.vehicles = db.vehicles.filter(function (item) {
    return item.id !== vehicleId
  })
  db.maintenance = db.maintenance.filter(function (item) {
    return item.vehicleId !== vehicleId
  })
  db.fuelLogs = db.fuelLogs.filter(function (item) {
    return item.vehicleId !== vehicleId
  })
  db.vehicleLocations = db.vehicleLocations.filter(function (item) {
    return item.vehicleId !== vehicleId
  })
  db.notifications = db.notifications.filter(function (item) {
    return !(item.entityType === 'vehicle' && item.entityId === vehicleId)
  })

  // Pending shipments need a new vehicle
  db.shipments.forEach(function (shipment) {
    if (shipment.vehicleId === vehicleId && shipment.status === 'pending') {
      shipment.vehicleId = null
    }
  })

  syncTripStatus(db)
  addActivity(db, 'vehicle_removed', vehicle.registrationNumber + ' removed from the fleet', 'vehicle', vehicleId)

  saveDb(db)
}
