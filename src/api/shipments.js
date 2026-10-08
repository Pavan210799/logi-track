import { apiDelete, apiGet, apiPost, apiPut } from './api.js'
import { addActivity, addNotification, loadDb, nextId, nowText, saveDb, syncTripStatus } from './db.js'
import { getDistanceKm } from '../utils/geo.js'

function findById(list, id) {
  return list.find(function (item) {
    return item.id === id
  })
}

// Driver and vehicle must be free before a shipment goes on the road
function checkReadyForTrip(db, shipment) {
  if (!shipment.driverId || !shipment.vehicleId) {
    throw new Error('Assign a driver and a vehicle before starting the trip.')
  }

  const driver = findById(db.drivers, shipment.driverId)
  const vehicle = findById(db.vehicles, shipment.vehicleId)

  if (driver.status === 'off_duty') {
    throw new Error(driver.name + ' is off duty.')
  }
  if (vehicle.status === 'maintenance' || vehicle.status === 'inactive') {
    throw new Error(vehicle.registrationNumber + ' is in maintenance or inactive.')
  }

  const busyShipment = db.shipments.find(function (item) {
    const isActive = item.status === 'in_transit' || item.status === 'delayed'
    const sameDriverOrVehicle = item.driverId === shipment.driverId || item.vehicleId === shipment.vehicleId
    return item.id !== shipment.id && isActive && sameDriverOrVehicle
  })

  if (busyShipment) {
    throw new Error('The driver or vehicle is already on ' + busyShipment.trackingNumber + '.')
  }
}

// Delay alerts are done once the shipment is moving again or delivered
function markDelayAlertsRead(db, shipmentId) {
  db.notifications.forEach(function (item) {
    if (item.type === 'shipment_delayed' && item.entityId === shipmentId) {
      item.read = true
    }
  })
}

// Everything the Shipments page needs
export async function getShipmentPageData() {
  await apiGet()
  const db = loadDb()

  return {
    shipments: db.shipments,
    drivers: db.drivers,
    vehicles: db.vehicles,
    locations: db.locations,
  }
}

export async function addShipment(shipmentData) {
  await apiPost(shipmentData)
  const db = loadDb()

  const id = nextId(db.shipments)
  const time = nowText()
  const pickup = findById(db.locations, shipmentData.pickupLocationId)
  const delivery = findById(db.locations, shipmentData.deliveryLocationId)

  const shipment = {
    id: id,
    trackingNumber: 'SHP-' + time.slice(0, 4) + '-' + (1000 + id),
    status: 'pending',
    ...shipmentData,
    distanceKm: getDistanceKm(pickup, delivery),
    createdAt: time,
    deliveredAt: null,
    history: [{ status: 'created', time: time }],
  }

  db.shipments.push(shipment)
  addActivity(
    db,
    'shipment_created',
    'New shipment ' + shipment.trackingNumber + ' created for ' + shipment.customerCompany,
    'shipment',
    id,
  )

  saveDb(db)
}

export async function updateShipment(shipmentId, shipmentData) {
  const db = loadDb()
  const shipment = findById(db.shipments, shipmentId)
  const isActive = shipment.status === 'in_transit' || shipment.status === 'delayed'

  // A shipment on the road must keep a free driver and vehicle
  if (isActive) {
    checkReadyForTrip(db, { ...shipment, ...shipmentData })
  }

  await apiPut(shipmentData)

  const oldDriverId = shipment.driverId
  Object.assign(shipment, shipmentData)

  const pickup = findById(db.locations, shipment.pickupLocationId)
  const delivery = findById(db.locations, shipment.deliveryLocationId)
  shipment.distanceKm = getDistanceKm(pickup, delivery)

  // Live location follows the shipment's vehicle
  db.vehicleLocations.forEach(function (item) {
    if (item.shipmentId === shipmentId) {
      item.vehicleId = shipment.vehicleId
    }
  })

  syncTripStatus(db)

  if (shipment.driverId && shipment.driverId !== oldDriverId) {
    const driver = findById(db.drivers, shipment.driverId)
    addActivity(db, 'driver_assigned', driver.name + ' assigned to ' + shipment.trackingNumber, 'shipment', shipmentId)
  } else {
    addActivity(db, 'shipment_updated', shipment.trackingNumber + ' details updated', 'shipment', shipmentId)
  }

  saveDb(db)
}

export async function updateShipmentStatus(shipmentId, newStatus, note) {
  const db = loadDb()
  const shipment = findById(db.shipments, shipmentId)
  const oldStatus = shipment.status

  if (oldStatus === 'pending' && newStatus === 'in_transit') {
    checkReadyForTrip(db, shipment)
  }

  await apiPut({ status: newStatus, note: note })

  const time = nowText()
  const pickup = findById(db.locations, shipment.pickupLocationId)
  const delivery = findById(db.locations, shipment.deliveryLocationId)

  if (oldStatus === 'pending' && newStatus === 'in_transit') {
    shipment.pickupDate = time
    shipment.history.push({ status: 'picked_up', time: time })
    shipment.history.push({ status: 'in_transit', time: time })

    // Start tracking the vehicle at the pickup point
    db.vehicleLocations.push({
      vehicleId: shipment.vehicleId,
      shipmentId: shipment.id,
      latitude: pickup.latitude,
      longitude: pickup.longitude,
      speedKmh: 0,
      heading: 0,
      updatedAt: time,
    })

    addActivity(db, 'shipment_picked_up', shipment.trackingNumber + ' picked up from ' + pickup.name, 'shipment', shipmentId)
    addNotification(
      db,
      'delivery_update',
      'info',
      'Shipment on the way',
      shipment.trackingNumber + ' left ' + pickup.name + ' for ' + delivery.name + '.',
      'shipment',
      shipmentId,
    )
  }

  if (oldStatus === 'delayed' && newStatus === 'in_transit') {
    shipment.history.push({ status: 'in_transit', time: time, note: 'Back on schedule' })
    markDelayAlertsRead(db, shipmentId)
    addActivity(db, 'shipment_updated', shipment.trackingNumber + ' is back on schedule', 'shipment', shipmentId)
    addNotification(
      db,
      'delivery_update',
      'success',
      'Back on schedule',
      shipment.trackingNumber + ' to ' + delivery.name + ' is moving again.',
      'shipment',
      shipmentId,
    )
  }

  if (newStatus === 'delayed') {
    shipment.history.push({ status: 'delayed', time: time, note: note })
    addNotification(
      db,
      'shipment_delayed',
      'danger',
      'Shipment delayed',
      shipment.trackingNumber + ' to ' + delivery.name + ' is delayed. ' + note + '.',
      'shipment',
      shipmentId,
    )
    addActivity(db, 'shipment_delayed', shipment.trackingNumber + ' marked delayed: ' + note, 'shipment', shipmentId)
  }

  if (newStatus === 'delivered') {
    shipment.deliveredAt = time
    shipment.history.push({ status: 'delivered', time: time })

    // Add this delivery to the driver's totals and on-time rate
    const driver = findById(db.drivers, shipment.driverId)
    if (driver) {
      const wasOnTime = time <= shipment.scheduledDelivery
      const onTimeCount = Math.round((driver.onTimeRate / 100) * driver.totalDeliveries) + (wasOnTime ? 1 : 0)
      driver.totalDeliveries = driver.totalDeliveries + 1
      driver.onTimeRate = Math.round((onTimeCount / driver.totalDeliveries) * 100)
    }

    db.vehicleLocations = db.vehicleLocations.filter(function (item) {
      return item.shipmentId !== shipmentId
    })

    markDelayAlertsRead(db, shipmentId)
    addNotification(
      db,
      'delivery_update',
      'success',
      'Shipment delivered',
      shipment.trackingNumber + ' delivered to ' + shipment.customerCompany + '.',
      'shipment',
      shipmentId,
    )
    addActivity(
      db,
      'shipment_delivered',
      shipment.trackingNumber + ' delivered to ' + shipment.customerCompany,
      'shipment',
      shipmentId,
    )
  }

  shipment.status = newStatus
  syncTripStatus(db)

  saveDb(db)
}

export async function deleteShipment(shipmentId) {
  await apiDelete()
  const db = loadDb()

  const shipment = findById(db.shipments, shipmentId)

  db.shipments = db.shipments.filter(function (item) {
    return item.id !== shipmentId
  })
  db.notifications = db.notifications.filter(function (item) {
    return !(item.entityType === 'shipment' && item.entityId === shipmentId)
  })
  db.vehicleLocations = db.vehicleLocations.filter(function (item) {
    return item.shipmentId !== shipmentId
  })

  // Free the driver and vehicle if this shipment was on the road
  syncTripStatus(db)
  addActivity(db, 'shipment_removed', shipment.trackingNumber + ' was removed', 'shipment', shipmentId)

  saveDb(db)
}
