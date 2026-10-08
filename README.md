# LogiTrack

Logistics and fleet tracking platform built with React, Tailwind CSS, React Router, and mock data.

## Run the app

```bash
cd logi-track
npm install
npm run dev
```

Open the URL shown in the terminal (usually http://localhost:5173).

Changes you make (add, edit, delete) are saved in the browser's localStorage, so they stay after a reload. To start again from the mock data, run `localStorage.removeItem('logitrack-data')` in the browser console and reload.

While a page loads, or when you switch to another page number, skeleton blocks in the same shape as the cards and tables are shown until the API call finishes.

Driver status: **Available** means free to be given a vehicle, **Assigned** means the driver has a vehicle, **On Trip** is set by active shipments, and **Off Duty** is set by hand. Picking a driver for a vehicle moves them from Available to Assigned on every page.

Pages are reload safe: the page number, search, status tab, filters, and any open details or form are kept in the address bar (for example `/vehicles?page=2&status=available&fuel=Diesel`).

## Search and filters

Every list page has a search box, status tabs, and a **Filters** panel. Pick filters in the panel, then click **Apply filters** (skeleton loading first, then the filtered list). **Clear filters** resets them the same way.

- **Vehicles** — type, fuel, driver (or no driver), state (from the number plate), next service date
- **Drivers** — city, vehicle (with, without, or a specific one), license expiry, joined date range
- **Shipments** — driver, vehicle, city (pickup or delivery), priority, delivery date range
- **Tracking** — location, driver, on time or running late, priority
- **Notifications** — read or unread, severity, date range

## Tracking

The Tracking page shows every vehicle on the road on an OpenStreetMap map (Leaflet). Click a truck or a trip card to see its route: the travelled part, the part left, the pickup and delivery points, trip progress, and the estimated arrival compared with the scheduled time. The estimate is the last GPS update plus the km left at the current speed. Vehicles without an active shipment have no GPS position.

## Notifications and alerts

The Alerts page and the bell in the header show four kinds of notifications: delayed shipments, vehicle maintenance, delivery updates, and driver status changes. New ones are created automatically when data changes, for example when a shipment starts moving, a vehicle goes into maintenance, or a driver goes off duty. Each notification can be marked read or unread, deleted, or opened to see the shipment, vehicle, or driver.

## Project structure

- `src/data/mockDb.js` — all mock data (vehicles, drivers, shipments, locations, and more)
- `src/data/menu.js` — sidebar links and page titles
- `src/api/` — API calls; each call sends a request and, only on success, reads or changes the data
  - `db.js` — loads and saves data in localStorage (starts from `mockDb.js`) and keeps drivers, vehicles, and shipments in sync
  - `dashboard.js`, `vehicles.js`, `drivers.js`, `shipments.js`, `tracking.js`, `notifications.js` — one file per page
- `src/utils/format.js` — small helpers for dates, numbers, and status text
- `src/utils/geo.js` — road distance between two points, and the state from a number plate
- `src/utils/trip.js` — builds the trips shown on the Tracking page (progress, km left, estimated arrival)
- `src/utils/scroll.js` — scrolls the main content area back to the top (only that area scrolls, never the whole window)
- `src/hooks/useCardsPerPage.js` — cards per page: 5 on phones, 6 on tablets, 8 on desktops
- `src/hooks/useListParams.js` — keeps page, search, status tab, and open item in the address bar so a reload keeps them
- `src/utils/wait.js` — keeps skeletons on screen for a short minimum time
- `src/components/layout/` — sidebar, header, page layout, and shared parts like Modal, Button, Pagination, NumberPlate, StatusBadge, and Toast
  - `Skeleton.jsx` and `ToolbarSkeleton.jsx` — shimmering blocks shown while data loads
  - `ListToolbar.jsx` — search, Filters, main button, filter panel, and status tabs used by every list page
  - `FilterSelect.jsx` — the dropdowns and date pickers inside the filter panel
  - `NotificationBell.jsx` — bell with the unread count and the latest alerts
- `src/components/dashboard/` — dashboard cards, charts, lists, and the loading skeleton
- `src/components/vehicle/`, `src/components/driver/`, `src/components/shipment/` — cards, tables, forms, detail views, and loading skeletons for each page
- `src/components/tracking/` — the map, trip cards, and trip details
- `src/components/notification/` — notification rows, types, and the loading skeleton
- `src/pages/` — one file per page (Dashboard, Vehicles, Drivers, Shipments, Tracking, Notifications)
- `src/App.jsx` — routes that connect all pages
- `src/index.css` — Tailwind import, brand colors, shadows, and animations (turned off when the system asks for reduced motion)
