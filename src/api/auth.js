import { apiPost } from './api.js'
import { mockDb } from '../data/mockDb.js'

// Demo only: accounts live in this browser's storage, there is no real auth server
const USERS_KEY = 'logitrack-users'
const SESSION_KEY = 'logitrack-session'
const SIGNUP_KEY = 'logitrack-last-signup'
export const AUTH_EVENT = 'logitrack-auth'

const demoAccount = { email: mockDb.currentUser.email, password: 'Admin@123' }

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms)
  })
}

// Every auth call takes a moment so the loading state is always visible
async function request(body) {
  await Promise.all([apiPost(body), wait(700)])
}

function loadUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY))
    if (Array.isArray(saved) && saved.length > 0) {
      return saved
    }
  } catch {
    // Broken saved data falls back to the demo account
  }
  return [{ ...mockDb.currentUser, password: demoAccount.password }]
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function findUser(users, email) {
  const cleanEmail = email.trim().toLowerCase()
  return users.find(function (user) {
    return user.email === cleanEmail
  })
}

function notify() {
  window.dispatchEvent(new Event(AUTH_EVENT))
}

// Raw session text; "remember me" keeps it in localStorage, otherwise only for this tab
export function readSession() {
  return localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
}

export async function login(email, password, remember) {
  const user = findUser(loadUsers(), email)
  if (!user || user.password !== password) {
    await wait(500)
    throw new Error('Incorrect email or password. Please try again.')
  }
  await request({ action: 'login', email: user.email })

  const session = JSON.stringify({ name: user.name, email: user.email, role: user.role, signedInAt: new Date().toISOString() })
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  ;(remember ? localStorage : sessionStorage).setItem(SESSION_KEY, session)
  notify()
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
  notify()
}

export async function signup(name, email, password) {
  const users = loadUsers()
  if (findUser(users, email)) {
    await wait(500)
    throw new Error('An account with this email already exists. Try signing in instead.')
  }
  await request({ action: 'signup', name: name, email: email })

  const user = { name: name.trim(), email: email.trim().toLowerCase(), role: 'Fleet Manager', password: password }
  saveUsers(users.concat(user))
  localStorage.setItem(SIGNUP_KEY, JSON.stringify({ name: user.name, email: user.email }))
}

// Name and email of the last account created, for the success page
export function readLastSignup() {
  try {
    return JSON.parse(localStorage.getItem(SIGNUP_KEY))
  } catch {
    return null
  }
}

export async function findAccount(email) {
  if (!findUser(loadUsers(), email)) {
    await wait(500)
    throw new Error('We could not find an account with that email.')
  }
  await request({ action: 'find-account', email: email })
}

export async function resetPassword(email, password) {
  const users = loadUsers()
  const user = findUser(users, email)
  if (!user) {
    throw new Error('We could not find an account with that email.')
  }
  await request({ action: 'reset-password', email: email })
  user.password = password
  saveUsers(users)
}
