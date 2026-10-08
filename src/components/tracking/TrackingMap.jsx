import { useEffect } from 'react'
import { MapContainer, Marker, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Maximize2 } from 'lucide-react'

const southIndia = [12.6, 78.2]

// Small white icons drawn inside the map markers
const truckSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>'
const packageSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.7 4.7a2 2 0 0 0 2 0L20.7 7"/></svg>'
const flagSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.3 2q2 0 3.1-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.5"/></svg>'

// Pulsing truck, blue when moving and red when delayed
function truckIcon(trip, isSelected) {
  const isDelayed = trip.shipment.status === 'delayed'
  const color = isDelayed ? 'bg-red-600' : 'bg-blue-600'
  const pulse = isDelayed ? 'bg-red-500/40' : 'bg-blue-500/40'
  const size = isSelected ? 44 : 34
  const ring = isSelected ? ' ring-4 ring-amber-300' : ''

  return L.divIcon({
    className: '',
    html:
      '<div class="relative grid h-full w-full place-items-center">' +
      '<span class="absolute inset-0 animate-ping rounded-full ' + pulse + '"></span>' +
      '<span class="relative grid h-full w-full place-items-center rounded-full border-2 border-white text-white shadow-lg transition ' + color + ring + '">' +
      truckSvg +
      '</span></div>',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  })
}

// Pin for the pickup (green) or delivery (burgundy) point
function pointIcon(isPickup) {
  const color = isPickup ? 'bg-emerald-600' : 'bg-burgundy'
  return L.divIcon({
    className: '',
    html:
      '<div class="flex animate-pop-in flex-col items-center">' +
      '<span class="grid h-8 w-8 place-items-center rounded-full border-2 border-white text-white shadow-lg ' + color + '">' +
      (isPickup ? packageSvg : flagSvg) +
      '</span><span class="-mt-1.5 h-3 w-3 rotate-45 border-r-2 border-b-2 border-white ' + color + '"></span></div>',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
  })
}

const hubIcon = L.divIcon({
  className: '',
  html: '<span class="block h-3.5 w-3.5 rounded-[4px] border-2 border-white bg-slate-700 shadow-md"></span>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
})

function pointOf(place) {
  return [place.latitude, place.longitude]
}

// Moves the map smoothly to show the given points
function MapFocus({ focusKey }) {
  const map = useMap()

  useEffect(
    function () {
      const points = JSON.parse(focusKey)
      if (points.length === 1) {
        map.flyTo(points[0], 11, { duration: 0.8 })
      } else if (points.length > 1) {
        map.flyToBounds(points, { padding: [48, 48], maxZoom: 11, duration: 0.8 })
      }
    },
    [map, focusKey],
  )

  return null
}

function TrackingMap({ trips, hubs, selectedTrip, onSelect, onShowAll }) {
  // Selected trip: its route; otherwise every vehicle on the map
  let focusPoints = trips.map(function (trip) {
    return pointOf(trip.position)
  })
  if (selectedTrip) {
    focusPoints = [pointOf(selectedTrip.pickup), pointOf(selectedTrip.position), pointOf(selectedTrip.delivery)]
  }

  return (
    // isolate keeps the map layers below the header, menus, and pop-ups
    <div className="relative isolate h-full w-full overflow-hidden">
      <MapContainer center={southIndia} zoom={7} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapFocus focusKey={JSON.stringify(focusPoints)} />

        {hubs.map(function (hub) {
          return (
            <Marker key={'hub-' + hub.id} position={pointOf(hub)} icon={hubIcon}>
              <Tooltip direction="top" offset={[0, -6]}>
                {hub.name}
              </Tooltip>
            </Marker>
          )
        })}

        {/* Faint route of every trip, or the full route of the selected one */}
        {trips.map(function (trip) {
          const isSelected = selectedTrip && selectedTrip.shipment.id === trip.shipment.id
          if (selectedTrip && !isSelected) {
            return null
          }
          const isDelayed = trip.shipment.status === 'delayed'
          return (
            <Polyline
              key={'left-' + trip.shipment.id}
              positions={[pointOf(trip.position), pointOf(trip.delivery)]}
              pathOptions={{
                color: isDelayed ? '#dc2626' : '#2563eb',
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 0.9 : 0.35,
                dashArray: '8 10',
              }}
            />
          )
        })}
        {selectedTrip && (
          <Polyline
            positions={[pointOf(selectedTrip.pickup), pointOf(selectedTrip.position)]}
            pathOptions={{ color: '#6b1220', weight: 5, opacity: 0.9 }}
          />
        )}
        {selectedTrip && (
          <Marker position={pointOf(selectedTrip.pickup)} icon={pointIcon(true)}>
            <Tooltip direction="top" offset={[0, -36]}>
              Pickup: {selectedTrip.pickup.name}
            </Tooltip>
          </Marker>
        )}
        {selectedTrip && (
          <Marker position={pointOf(selectedTrip.delivery)} icon={pointIcon(false)}>
            <Tooltip direction="top" offset={[0, -36]}>
              Delivery: {selectedTrip.delivery.name}
            </Tooltip>
          </Marker>
        )}

        {trips.map(function (trip) {
          const isSelected = selectedTrip && selectedTrip.shipment.id === trip.shipment.id
          return (
            <Marker
              key={'truck-' + trip.shipment.id}
              position={pointOf(trip.position)}
              icon={truckIcon(trip, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
              eventHandlers={{
                click: function () {
                  onSelect(trip.shipment.id)
                },
              }}
            >
              <Tooltip direction="top" offset={[0, -18]}>
                <strong>{trip.vehicle ? trip.vehicle.registrationNumber : trip.shipment.trackingNumber}</strong>
                <br />
                {trip.driver ? trip.driver.name : 'No driver'} · {trip.position.speedKmh} km/h
              </Tooltip>
            </Marker>
          )
        })}
      </MapContainer>

      {selectedTrip && (
        <button
          type="button"
          onClick={onShowAll}
          className="absolute top-3 right-3 z-[500] inline-flex animate-fade-down cursor-pointer items-center gap-1.5 rounded-lg bg-surface px-3 py-2 text-xs font-semibold text-gray-700 shadow-lg transition hover:-translate-y-0.5 hover:text-accent"
        >
          <Maximize2 size={14} />
          Show all vehicles
        </button>
      )}

      <div className="absolute bottom-7 left-3 z-[500] flex max-w-[calc(100%-1.5rem)] flex-wrap gap-x-3 gap-y-1 rounded-lg bg-surface/95 px-3 py-2 text-[0.68rem] font-semibold text-gray-600 shadow-md backdrop-blur">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>In transit
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-600"></span>Delayed
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-600"></span>Pickup
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-burgundy"></span>Delivery
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-slate-700"></span>Hub
        </span>
      </div>
    </div>
  )
}

export default TrackingMap
