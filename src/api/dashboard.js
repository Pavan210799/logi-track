import { apiGet } from './api.js'
import { loadDb } from './db.js'

// Call the API, then return the saved data
export async function getDashboardData() {
  await apiGet()
  const db = loadDb()

  return {
    vehicles: db.vehicles,
    drivers: db.drivers,
    shipments: db.shipments,
    maintenance: db.maintenance,
    notifications: db.notifications,
    activities: db.activities,
    fleetActivityLog: db.fleetActivityLog,
    previousWeek: db.previousWeek,
  }
}
