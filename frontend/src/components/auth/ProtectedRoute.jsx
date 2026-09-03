import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../../utils/auth'

// Gates the existing application behind the demo login. Unauthenticated
// visitors are bounced to /login; the originally requested path is kept so
// a future "redirect back after login" flow could use it if needed.
export default function ProtectedRoute({ children }) {
  const location = useLocation()

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
