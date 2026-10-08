import { apiDelete, apiGet, apiPut } from './api.js'
import { loadDb, saveDb } from './db.js'

// Everything the Notifications page needs
export async function getNotificationData() {
  await apiGet()
  const db = loadDb()

  return {
    notifications: db.notifications,
  }
}

export async function setNotificationRead(notificationId, read) {
  await apiPut({ read: read })
  const db = loadDb()

  const notification = db.notifications.find(function (item) {
    return item.id === notificationId
  })
  notification.read = read

  saveDb(db)
}

export async function markAllNotificationsRead() {
  await apiPut({ read: true })
  const db = loadDb()

  db.notifications.forEach(function (item) {
    item.read = true
  })

  saveDb(db)
}

export async function deleteNotification(notificationId) {
  await apiDelete()
  const db = loadDb()

  db.notifications = db.notifications.filter(function (item) {
    return item.id !== notificationId
  })

  saveDb(db)
}
