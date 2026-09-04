/**
 * DEMO AUTHENTICATION UTILITY
 * 
 * IMPORTANT: This is DEMO authentication for the hackathon build.
 * - NO real password validation
 * - NO secure token management
 * - NO production-grade security
 * 
 * This simply gates the application behind a login screen and manages
 * the demo user session (U001 - Rajesh Kumar).
 * 
 * For production, replace this with proper authentication:
 * - JWT tokens
 * - Secure password hashing
 * - HTTP-only cookies
 * - CSRF protection
 * - Session management
 */

const AUTH_FLAG_KEY = 'isLoggedIn'
const USER_DATA_KEY = 'demoUser'

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export function isAuthenticated() {
  return (
    localStorage.getItem(AUTH_FLAG_KEY) === 'true' ||
    sessionStorage.getItem(AUTH_FLAG_KEY) === 'true'
  )
}

/**
 * Get the currently authenticated user
 * @returns {{ user_id: string, name: string, email: string } | null}
 */
export function getCurrentUser() {
  const userJson = localStorage.getItem(USER_DATA_KEY) || sessionStorage.getItem(USER_DATA_KEY)
  
  if (!userJson) {
    return null
  }
  
  try {
    return JSON.parse(userJson)
  } catch (error) {
    console.error('Failed to parse user data:', error)
    return null
  }
}

/**
 * Get the authenticated user's ID
 * @returns {string | null}
 */
export function getUserId() {
  const user = getCurrentUser()
  return user?.user_id || null
}

/**
 * Get the authenticated user's name
 * @returns {string | null}
 */
export function getUserName() {
  const user = getCurrentUser()
  return user?.name || null
}

/**
 * Perform demo login
 * @param {{ remember?: boolean, user: { user_id: string, name: string, email: string } }} options
 */
export function login({ remember = false, user }) {
  if (!user || !user.user_id) {
    throw new Error('Invalid user data: user_id is required')
  }
  
  // Choose storage based on "remember me"
  const storage = remember ? localStorage : sessionStorage
  const otherStorage = remember ? sessionStorage : localStorage
  
  // Clear any stale auth from the other storage
  otherStorage.removeItem(AUTH_FLAG_KEY)
  otherStorage.removeItem(USER_DATA_KEY)
  
  // Store authentication
  storage.setItem(AUTH_FLAG_KEY, 'true')
  storage.setItem(USER_DATA_KEY, JSON.stringify(user))
}

/**
 * Logout the current user
 */
export function logout() {
  // Clear from both storages
  localStorage.removeItem(AUTH_FLAG_KEY)
  localStorage.removeItem(USER_DATA_KEY)
  sessionStorage.removeItem(AUTH_FLAG_KEY)
  sessionStorage.removeItem(USER_DATA_KEY)
}

/**
 * Demo user credentials for U001 (existing seeded user)
 * This is the ONLY demo user. Do NOT use U001 for new real users.
 */
export const DEMO_USER = {
  user_id: 'U001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@demo.resilience.app'
}

/**
 * Perform demo login as U001 (existing seeded user)
 * @param {boolean} remember - Whether to remember the session
 */
export function loginAsDemo(remember = true) {
  login({
    remember,
    user: DEMO_USER
  })
}
