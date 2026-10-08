import StatCard from './StatCard.jsx'

function FleetCards({ vehicles, drivers, shipments, maintenance, previousWeek }) {
  const vehiclesOnTrip = vehicles.filter(function (vehicle) {
    return vehicle.status === 'on_trip'
  })

  const vehiclesInMaintenance = vehicles.filter(function (vehicle) {
    return vehicle.status === 'maintenance'
  })

  const driversOnTrip = drivers.filter(function (driver) {
    return driver.status === 'on_trip'
  })

  const activeShipments = shipments.filter(function (shipment) {
    return shipment.status === 'in_transit' || shipment.status === 'delayed'
  })

  const urgentShipments = activeShipments.filter(function (shipment) {
    return shipment.priority === 'urgent'
  })

  const scheduledServices = maintenance.filter(function (service) {
    return service.status === 'scheduled'
  })

  return (
    <>
      <StatCard
        label="Total Vehicles"
        value={vehicles.length}
        lastWeek={previousWeek.totalVehicles}
        tone="orange"
        icon="vehicles"
        note={vehiclesOnTrip.length + ' on the road now'}
      />
      <StatCard
        label="Total Drivers"
        value={drivers.length}
        lastWeek={previousWeek.totalDrivers}
        tone="purple"
        icon="drivers"
        note={driversOnTrip.length + ' on duty right now'}
      />
      <StatCard
        label="Active Shipments"
        value={activeShipments.length}
        lastWeek={previousWeek.activeShipments}
        tone="blue"
        icon="shipments"
        note={urgentShipments.length + ' urgent priority'}
      />
      <StatCard
        label="In Maintenance"
        value={vehiclesInMaintenance.length}
        lastWeek={previousWeek.inMaintenance}
        tone="amber"
        icon="maintenance"
        note={scheduledServices.length + ' services scheduled'}
      />
    </>
  )
}

export default FleetCards
