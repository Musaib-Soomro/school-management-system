import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!user) {
    // User is not logged in, redirect to login page
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Handle inactive users (pending approval)
  if (profile && !profile.is_active) {
    // Prevent redirect loop if already on /pending
    if (location.pathname === '/pending') {
      return children
    }
    return <Navigate to="/pending" replace />
  }

  // Handle active users trying to access /pending manually
  if (profile?.is_active && location.pathname === '/pending') {
    return <Navigate to="/dashboard" replace />
  }

  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    // User role is not authorized for this specific route
    // Redirect to their own dashboard or login
    const dashboardMap = {
      super_admin: '/admin/dashboard',
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      parent: '/parent/dashboard',
      guest: '/pending',
    }
    return <Navigate to={dashboardMap[profile?.role] || '/pending'} replace />
  }

  return children
}

export default ProtectedRoute
