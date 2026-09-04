import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../utils/auth'

/**
 * ProtectedRoute Component
 * 
 * Guards routes that require authentication.
 * Unauthenticated users are redirected to /login with the original
 * destination saved in location state for potential future redirect-back flow.
 * 
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation()
  
  if (!isAuthenticated()) {
    // Redirect to login, preserving the attempted destination
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  
  // User is authenticated, render the protected content
  return children
}
