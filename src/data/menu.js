import { Bell, LayoutDashboard, MapPin, Package, Truck, Users } from 'lucide-react'

// Sidebar links and page titles
export const menuItems = [
  {
    path: '/',
    label: 'Dashboard',
    title: 'Dashboard',
    subtitle: 'Fleet overview, shipment health, and recent activity',
    icon: LayoutDashboard,
  },
  {
    path: '/vehicles',
    label: 'Vehicles',
    title: 'Vehicle Management',
    subtitle: 'Add, edit, and track every vehicle in your fleet',
    icon: Truck,
  },
  {
    path: '/drivers',
    label: 'Drivers',
    title: 'Driver Management',
    subtitle: 'Driver profiles, availability, and performance',
    icon: Users,
  },
  {
    path: '/shipments',
    label: 'Shipments',
    title: 'Shipment Management',
    subtitle: 'Create, assign, and follow every shipment',
    icon: Package,
  },
  {
    path: '/tracking',
    label: 'Tracking',
    title: 'Live Tracking',
    subtitle: 'Vehicle locations, routes, and delivery estimates',
    icon: MapPin,
  },
  {
    path: '/notifications',
    label: 'Notifications',
    shortLabel: 'Alerts',
    title: 'Notifications & Alerts',
    subtitle: 'Delays, maintenance, deliveries, and driver updates',
    icon: Bell,
  },
]
