import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  CreditCard,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Shield,
  Clock,
  Key,
  UserCheck,
  UserCog,
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState(0)
  const { signOut, profile } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPendingApprovalsCount()
  }, [])

  const fetchPendingApprovalsCount = async () => {
    try {
      const { count } = await supabase
        .from('profile_update_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')
      setPendingApprovalsCount(count || 0)
    } catch (err) {
      console.error('Error fetching pending count:', err)
    }
  }

  const navigation = [
    { name: 'Dashboard',       href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students',        href: '/admin/students',  icon: Users },
    { name: 'Teachers',        href: '/admin/teachers',  icon: UserCheck },
    { name: 'Parents',         href: '/admin/parents',   icon: UserCog },
    { name: 'Classes',         href: '/admin/classes',   icon: BookOpen },
    { name: 'Attendance',      href: '/admin/attendance',icon: Calendar },
    { name: 'Fees',            href: '/admin/fees',      icon: CreditCard },
    { name: 'User Management', href: '/admin/users',     icon: Key },
    { name: 'Approvals',       href: '/admin/approvals', icon: Clock, badge: pendingApprovalsCount },
  ]

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const initials = profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'A'

  const roleLabel = {
    admin: 'Administrator',
    super_admin: 'Super Admin',
    teacher: 'Teacher',
    parent: 'Parent',
  }[profile?.role] || profile?.role || 'Admin'

  return (
    <div className="flex h-screen bg-slate-50 font-sans">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white border-r border-slate-100
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="flex items-center justify-center w-9 h-9 bg-indigo-600 rounded-xl shadow-md shadow-indigo-100 shrink-0">
            <GraduationCap className="w-4.5 h-4.5 text-white w-[18px] h-[18px]" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-slate-900 text-sm tracking-tight">Islamic School</p>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Management System</p>
          </div>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Main Menu</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/admin/dashboard' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold
                  transition-all duration-150 group
                  ${isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}
                `}
              >
                {/* Active left bar */}
                {isActive && (
                  <div className="absolute left-0 inset-y-[6px] w-[3px] bg-indigo-600 rounded-full" />
                )}
                <item.icon className={`w-4.5 h-4.5 w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                <span className="flex-1 truncate">{item.name}</span>
                {item.badge > 0 && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full min-w-[20px] text-center shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-100 p-4 space-y-1">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl">
            {/* Avatar */}
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-md shadow-indigo-100 shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-[11px] text-slate-400 font-medium">{roleLabel}</p>
            </div>
          </div>
          <Link
            to="/profile"
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-bold text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-700 transition-colors uppercase tracking-wider"
          >
            <Shield className="w-3.5 h-3.5" />
            View Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-xs font-bold text-red-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors uppercase tracking-wider"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">

        {/* Topbar */}
        <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-slate-100 shrink-0">
          <button
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors lg:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb hint */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="font-bold text-slate-600">
              {navigation.find(n => location.pathname.startsWith(n.href) && n.href !== '/admin/dashboard')?.name
                || (location.pathname === '/admin/dashboard' ? 'Dashboard' : '')}
            </span>
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            {pendingApprovalsCount > 0 && (
              <Link
                to="/admin/approvals"
                className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-100 transition-colors"
              >
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                {pendingApprovalsCount} pending
              </Link>
            )}
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center text-white text-[11px] font-black shadow-sm">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
