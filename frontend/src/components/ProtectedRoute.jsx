import { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated, verifyAuth } from '../utils/auth'

/**
 * ProtectedRoute Component
 * 
 * Guards routes that require authentication.
 * Verifies authentication with backend on mount.
 * Unauthenticated users are redirected to /login.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()
  const [checking, setChecking] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  
  useEffect(() => {
    async function checkAuth() {
      // Quick client-side check first
      if (!isAuthenticated()) {
        setChecking(false)
        setAuthenticated(false)
        return
      }
      
      // Verify with backend
      try {
        const { authenticated: isAuth } = await verifyAuth()
        setAuthenticated(isAuth)
      } catch (error) {
        console.error('Auth verification failed:', error)
        setAuthenticated(false)
      } finally {
        setChecking(false)
      }
    }
    
    checkAuth()
  }, [])
  
  // Show loading state while checking authentication
  if (checking) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-animated-gradient">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-burgundy border-t-transparent" />
      </div>
    )
  }
  
  // Redirect to login if not authenticated
  if (!authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  
  // User is authenticated, render the protected content
  return children
}
