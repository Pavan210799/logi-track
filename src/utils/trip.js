import { getDistanceKm } from './geo.js'
import { toLocalText } from './format.js'

// Speed used for the estimate when a vehicle is standing still, in km/h
const defaultSpeedKmh = 40

function findById(list, id) {
  return list.find(function (item) {
    return item.id === id
  })
}

// One trip for every vehicle on the road, with progress and estimated arrival
export function buildTrips(data) {
  const trips = []

  data.vehicleLocations.forEach(function (position) {
    const shipment = findById(data.shipments, position.shipmentId)
    if (!shipment || (shipment.status !== 'in_transit' && shipment.status !== 'delayed')) {
      return
    }

    const pickup = findById(data.locations, shipment.pickupLocationId)
    const delivery = findById(data.locations, shipment.deliveryLocationId)
    const remainingKm = getDistanceKm(position, delivery)
    const totalKm = Math.max(shipment.distanceKm, remainingKm, 1)
    const speed = position.speedKmh > 0 ? position.speedKmh : defaultSpeedKmh

    // Last update time plus the time needed for the km left
    const hoursLeft = remainingKm / speed
    const etaDate = new Date(new Date(position.updatedAt).getTime() + hoursLeft * 60 * 60 * 1000)
    const lateMinutes = Math.round((etaDate - new Date(shipment.scheduledDelivery)) / (1000 * 60))

    trips.push({
      shipment: shipment,
      vehicle: findById(data.vehicles, shipment.vehicleId),
      driver: findById(data.drivers, shipment.driverId),
      pickup: pickup,
      delivery: delivery,
      position: position,
      remainingKm: remainingKm,
      doneKm: totalKm - remainingKm,
      progress: Math.round(((totalKm - remainingKm) / totalKm) * 100),
      eta: toLocalText(etaDate),
      lateMinutes: lateMinutes,
    })
  })

  return trips
}
