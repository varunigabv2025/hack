/**
 * REAL AUTHENTICATION UTILITY
 * 
 * This implements real authentication with:
 * - Backend JWT authentication
 * - HTTP-only cookies
 * - Secure password handling
 * - User data isolation
 * 
 * Authentication state is verified with the backend on page load.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USER_DATA_KEY = 'user'

/**
 * Check if user is authenticated
 * Note: This is a client-side hint only. Real authentication is server-side.
 * @returns {boolean}
 */
export function isAuthenticated() {
  return localStorage.getItem(USER_DATA_KEY) !== null || sessionStorage.getItem(USER_DATA_KEY) !== null
}

/**
 * Get the currently authenticated user from local storage
 * Note: This is cached data. Use verifyAuth() to verify with backend.
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
 * Store user data locally
 * @param {{ user_id: string, name: string, email: string }} user
 * @param {boolean} remember - Whether to persist across browser sessions
 */
function storeUser(user, remember = false) {
  const storage = remember ? localStorage : sessionStorage
  const otherStorage = remember ? sessionStorage : localStorage
  
  // Clear any stale auth from the other storage
  otherStorage.removeItem(USER_DATA_KEY)
  
  // Store user data (NOT password)
  storage.setItem(USER_DATA_KEY, JSON.stringify(user))
  
  // CRITICAL: Clear old profile data to prevent identity mixing
  // This ensures the new user's identity from backend is not overridden
  localStorage.removeItem('re_profile')
}

/**
 * Clear authentication state
 */
function clearAuth() {
  localStorage.removeItem(USER_DATA_KEY)
  sessionStorage.removeItem(USER_DATA_KEY)
  // Also clear profile data to prevent identity issues on next login
  localStorage.removeItem('re_profile')
}

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @param {string} userData.name
 * @param {string} userData.email
 * @param {string} userData.password
 * @param {number} userData.age
 * @param {string} userData.occupation
 * @param {string} userData.state
 * @param {string} userData.language
 * @param {number} userData.monthly_expense
 * @param {boolean} remember - Remember user session
 * @returns {Promise<{ success: boolean, user: object }>}
 */
export async function register(userData, remember = false) {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify(userData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    // Store user data locally
    if (data.user) {
      storeUser(data.user, remember)
    }

    return data

  } catch (error) {
    console.error('Registration error:', error)
    throw error
  }
}

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @param {boolean} remember - Remember user session
 * @returns {Promise<{ success: boolean, user: object }>}
 */
export async function login(email, password, remember = false) {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({ email, password })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Login failed')
    }

    // Store user data locally
    if (data.user) {
      storeUser(data.user, remember)
    }

    return data

  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

/**
 * Logout user
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Include cookies
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Always clear local auth state
    clearAuth()
  }
}

/**
 * Verify authentication with backend
 * Checks if the user is actually authenticated on the server
 * @returns {Promise<{ authenticated: boolean, user: object | null }>}
 */
export async function verifyAuth() {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include' // Include cookies
    })

    if (!response.ok) {
      // Not authenticated
      clearAuth()
      return { authenticated: false, user: null }
    }

    const data = await response.json()

    // Update stored user data
    if (data.user) {
      const remember = localStorage.getItem(USER_DATA_KEY) !== null
      storeUser(data.user, remember)
    }

    return {
      authenticated: true,
      user: data.user
    }

  } catch (error) {
    console.error('Auth verification error:', error)
    clearAuth()
    return { authenticated: false, user: null }
  }
}
