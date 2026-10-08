import StatCard from './StatCard.jsx'

function ShipmentCards({ shipments, previousWeek }) {
  const delivered = shipments.filter(function (shipment) {
    return shipment.status === 'delivered'
  })

  // Delivered on or before the scheduled time
  const deliveredOnTime = delivered.filter(function (shipment) {
    return shipment.deliveredAt <= shipment.scheduledDelivery
  })
  const onTimePercent = Math.round((deliveredOnTime.length / delivered.length) * 100)

  const inTransit = shipments.filter(function (shipment) {
    return shipment.status === 'in_transit'
  })

  let totalKm = 0
  inTransit.forEach(function (shipment) {
    totalKm = totalKm + shipment.distanceKm
  })
  const averageKm = Math.round(totalKm / inTransit.length)

  const delayed = shipments.filter(function (shipment) {
    return shipment.status === 'delayed'
  })

  const delayedPriority = delayed.filter(function (shipment) {
    return shipment.priority === 'express' || shipment.priority === 'urgent'
  })

  const pending = shipments.filter(function (shipment) {
    return shipment.status === 'pending'
  })

  const pendingWithoutDriver = pending.filter(function (shipment) {
    return shipment.driverId === null
  })

  return (
    <>
      <StatCard
        label="Delivered"
        value={delivered.length}
        lastWeek={previousWeek.delivered}
        tone="green"
        icon="delivered"
        note={onTimePercent + '% delivered on time'}
      />
      <StatCard
        label="In Transit"
        value={inTransit.length}
        lastWeek={previousWeek.inTransit}
        tone="sky"
        icon="inTransit"
        note={'Avg route ' + averageKm + ' km'}
      />
      <StatCard
        label="Delayed"
        value={delayed.length}
        lastWeek={previousWeek.delayed}
        tone="red"
        icon="delayed"
        note={delayedPriority.length + ' express or urgent'}
      />
      <StatCard
        label="Pending"
        value={pending.length}
        lastWeek={previousWeek.pending}
        tone="slate"
        icon="pending"
        note={pendingWithoutDriver.length + ' not assigned yet'}
      />
    </>
  )
}

export default ShipmentCards
