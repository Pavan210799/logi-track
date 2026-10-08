import { CircleAlert, Clock, IdCard, PackageCheck, Wrench } from 'lucide-react'

// Label, icon and colors for each type of notification
export const notificationTypes = {
  shipment_delayed: {
    label: 'Delays',
    icon: Clock,
    iconBox: 'bg-red-50 text-red-600 ring-red-100',
    accent: 'bg-red-500',
  },
  maintenance_due: {
    label: 'Maintenance',
    icon: Wrench,
    iconBox: 'bg-amber-50 text-amber-600 ring-amber-100',
    accent: 'bg-amber-500',
  },
  delivery_update: {
    label: 'Deliveries',
    icon: PackageCheck,
    iconBox: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    accent: 'bg-emerald-500',
  },
  driver_status: {
    label: 'Drivers',
    icon: IdCard,
    iconBox: 'bg-violet-50 text-violet-600 ring-violet-100',
    accent: 'bg-violet-500',
  },
}

// Used for any type not listed above
export const otherNotificationType = {
  label: 'Other',
  icon: CircleAlert,
  iconBox: 'bg-gray-50 text-gray-600 ring-gray-200',
  accent: 'bg-gray-400',
}

export const severityStyles = {
  danger: { label: 'Urgent', chip: 'bg-red-600 text-white' },
  warning: { label: 'Warning', chip: 'bg-amber-500 text-white' },
  success: { label: 'Success', chip: 'bg-emerald-600 text-white' },
  info: { label: 'Info', chip: 'bg-sky-600 text-white' },
}

// Page that shows the shipment, vehicle or driver of a notification
export function linkFor(notification) {
  if (notification.entityType === 'shipment') {
    return { to: '/shipments?view=' + notification.entityId, label: 'View shipment' }
  }
  if (notification.entityType === 'vehicle') {
    return { to: '/vehicles?view=' + notification.entityId, label: 'View vehicle' }
  }
  if (notification.entityType === 'driver') {
    return { to: '/drivers?view=' + notification.entityId, label: 'View driver' }
  }
  return null
}
