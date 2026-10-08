import { useSyncExternalStore } from 'react'
import { AUTH_EVENT, readSession } from '../api/auth.js'

function subscribe(callback) {
  window.addEventListener(AUTH_EVENT, callback)
  window.addEventListener('storage', callback)
  return function () {
    window.removeEventListener(AUTH_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

// Signed-in user ({ name, email, role }) or null, kept in sync across tabs
export function useSession() {
  const raw = useSyncExternalStore(subscribe, readSession)
  if (!raw) {
    return null
  }
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}
