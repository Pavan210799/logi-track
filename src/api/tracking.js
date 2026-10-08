import { apiGet } from './api.js'
import { loadDb } from './db.js'

// Everything the Tracking page needs
export async function getTrackingData() {
  await apiGet()
  const db = loadDb()

  return {
    shipments: db.shipments,
    vehicles: db.vehicles,
    drivers: db.drivers,
    locations: db.locations,
    vehicleLocations: db.vehicleLocations,
  }
}
