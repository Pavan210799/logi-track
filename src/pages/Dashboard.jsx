import { useEffect, useState } from 'react'
import { getDashboardData } from '../api/dashboard.js'
import FleetCards from '../components/dashboard/FleetCards.jsx'
import ShipmentCards from '../components/dashboard/ShipmentCards.jsx'
import DeliveryChart from '../components/dashboard/DeliveryChart.jsx'
import FleetChart from '../components/dashboard/FleetChart.jsx'
import AlertList from '../components/dashboard/AlertList.jsx'
import ActivityList from '../components/dashboard/ActivityList.jsx'
import DashboardSkeleton from '../components/dashboard/DashboardSkeleton.jsx'
import { skeletonTime, wait } from '../utils/wait.js'

const sectionTitle = 'text-[0.95rem] font-bold tracking-wide text-accent uppercase'
const fourColumns = 'stagger grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-4 xl:grid-cols-4'
const twoColumns = 'grid grid-cols-1 gap-4 lg:min-h-97.5 lg:grid-cols-2'
const wideAndNarrow = 'grid grid-cols-1 gap-4 lg:grid-cols-[65fr_35fr]'

function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  // Get dashboard data when the page opens
  useEffect(function () {
    async function loadData() {
      try {
        const minimumWait = wait(skeletonTime)
        const result = await getDashboardData()
        await minimumWait
        setData(result)
      } catch (err) {
        console.error(err)
        setError('Could not load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return <p className="rounded-2xl bg-surface p-6 text-red-600 shadow-card">{error}</p>
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-5.5">
      <section className="flex flex-col gap-3">
        <h2 className={sectionTitle}>Fleet Summary</h2>
        <div className={fourColumns}>
          <FleetCards
            vehicles={data.vehicles}
            drivers={data.drivers}
            shipments={data.shipments}
            maintenance={data.maintenance}
            previousWeek={data.previousWeek}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={sectionTitle}>Shipment Status</h2>
        <div className={fourColumns}>
          <ShipmentCards shipments={data.shipments} previousWeek={data.previousWeek} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={sectionTitle}>Performance</h2>
        <div className={twoColumns}>
          <DeliveryChart fleetActivityLog={data.fleetActivityLog} />
          <FleetChart fleetActivityLog={data.fleetActivityLog} totalVehicles={data.vehicles.length} />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className={sectionTitle}>Updates</h2>
        <div className={wideAndNarrow}>
          <AlertList notifications={data.notifications} />
          <ActivityList activities={data.activities} />
        </div>
      </section>
    </div>
  )
}

export default Dashboard
