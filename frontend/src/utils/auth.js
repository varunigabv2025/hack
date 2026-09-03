// Demo/fake authentication helper.
//
// This is a frontend-only access gate for the hackathon build — there is no
// real backend authentication, no password storage, and no tokens. It simply
// flags a session as "logged in" so the router can gate the existing app.
//
// Remember me checked   -> flag lives in localStorage (persists across restarts)
// Remember me unchecked -> flag lives in sessionStorage (cleared when the tab/browser closes)

const FLAG_KEY = 'isLoggedIn'
const USER_KEY = 'demoUser'

export function isAuthenticated() {
  return localStorage.getItem(FLAG_KEY) === 'true' || sessionStorage.getItem(FLAG_KEY) === 'true'
}

export function getDemoUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * Log the demo user in.
 * @param {{ remember?: boolean, user?: { name: string, email: string } }} options
 */
export function login({ remember = false, user } = {}) {
  const store = remember ? localStorage : sessionStorage
  const other = remember ? sessionStorage : localStorage

  // Make sure there isn't a stale flag/user sitting in the other storage.
  other.removeItem(FLAG_KEY)
  other.removeItem(USER_KEY)

  store.setItem(FLAG_KEY, 'true')
  if (user) {
    store.setItem(USER_KEY, JSON.stringify(user))
  }
}

export function logout() {
  localStorage.removeItem(FLAG_KEY)
  sessionStorage.removeItem(FLAG_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(USER_KEY)
}
