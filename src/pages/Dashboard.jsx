import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Dashboard = () => {
  const { profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading) return

    if (!profile) {
      // No profile means unauthenticated or broken session — send to login
      navigate('/login', { replace: true })
      return
    }

    const dashboardMap = {
      super_admin: '/admin/dashboard',
      admin: '/admin/dashboard',
      teacher: '/teacher/dashboard',
      parent: '/parent/dashboard',
      guest: '/pending',
    }

    navigate(dashboardMap[profile.role] || '/pending', { replace: true })
  }, [profile, loading, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans">
      <div className="text-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto mb-6"></div>
        <h2 className="text-xl font-bold text-slate-800">Redirecting to your dashboard...</h2>
        <p className="text-slate-500 mt-2">Checking your credentials and school role</p>
      </div>
    </div>
  )
}

export default Dashboard
