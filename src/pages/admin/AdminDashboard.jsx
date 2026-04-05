import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  BookOpen,
  CreditCard,
  Calendar,
  ArrowRight,
  GraduationCap,
  TrendingUp,
  AlertCircle,
  UserCheck,
  Shield,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AdminLayout from '../../components/layouts/AdminLayout'

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const StatCard = ({ title, value, icon: Icon, accent, subtext, loading, to }) => {
  const content = (
    <div className={`group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${to ? 'cursor-pointer' : ''}`}>
      {/* Left accent bar */}
      <div className={`absolute left-0 inset-y-0 w-1 ${accent.bar}`} />

      <div className="pl-6 pr-5 py-5 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.12em] mb-2">{title}</p>
          <p className={`text-4xl font-black tracking-tight ${loading ? 'text-slate-200 animate-pulse' : 'text-slate-900'}`}>
            {loading ? '—' : value}
          </p>
          {subtext && (
            <p className="mt-1.5 text-xs text-slate-400 font-medium">{subtext}</p>
          )}
        </div>
        <div className={`shrink-0 p-3 rounded-xl ${accent.bg}`}>
          <Icon className={`w-5 h-5 ${accent.icon}`} />
        </div>
      </div>

      {to && (
        <div className={`px-6 py-2.5 border-t border-slate-50 flex items-center justify-between ${accent.subtle}`}>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${accent.icon}`}>View details</span>
          <ArrowRight className={`w-3.5 h-3.5 ${accent.icon} transition-transform group-hover:translate-x-1`} />
        </div>
      )}
    </div>
  )
  return to ? <Link to={to}>{content}</Link> : content
}

const QuickAction = ({ to, icon: Icon, label, description, accent }) => (
  <Link
    to={to}
    className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all duration-200"
  >
    <div className={`shrink-0 p-3 rounded-xl ${accent} transition-colors`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
    </div>
    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
  </Link>
)

const AdminDashboard = () => {
  const { profile } = useAuth()
  const [stats, setStats] = useState({ students: 0, classes: 0, unpaidFees: 0, teachers: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)

      const [
        { count: studentCount },
        { count: classCount },
        { count: unpaidCount },
        { count: teacherCount },
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('classes').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('fee_records').select('*', { count: 'exact', head: true }).neq('status', 'paid'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher').eq('is_active', true),
      ])

      setStats({
        students: studentCount || 0,
        classes: classCount || 0,
        unpaidFees: unpaidCount || 0,
        teachers: teacherCount || 0,
      })
    } catch (err) {
      console.error('Error loading stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Admin'

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* ── Greeting Header ── */}
        <div className="relative bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl px-8 py-8 overflow-hidden shadow-xl shadow-indigo-100">
          {/* Subtle geometric texture */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dash-geo" width="60" height="60" patternUnits="userSpaceOnUse">
                <polygon points="30,2 37,23 58,30 37,37 30,58 23,37 2,30 23,23"
                  fill="none" stroke="white" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dash-geo)" />
          </svg>

          {/* Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                <span className="text-indigo-200 text-xs font-bold tracking-widest uppercase">Live Dashboard</span>
              </div>
              <h1 className="font-display text-4xl font-semibold text-white leading-tight">
                Good day, {firstName}.
              </h1>
              <p className="text-indigo-200/70 text-sm mt-1">{today}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/15 rounded-xl backdrop-blur-sm">
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span className="text-white text-sm font-bold">Islamic School</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Active Students"
            value={stats.students}
            icon={Users}
            accent={{ bar: 'bg-indigo-500', bg: 'bg-indigo-50', icon: 'text-indigo-600', subtle: 'bg-indigo-50/50' }}
            subtext="Currently enrolled"
            loading={loading}
            to="/admin/students"
          />
          <StatCard
            title="Active Classes"
            value={stats.classes}
            icon={BookOpen}
            accent={{ bar: 'bg-emerald-500', bg: 'bg-emerald-50', icon: 'text-emerald-600', subtle: 'bg-emerald-50/50' }}
            subtext="All academic levels"
            loading={loading}
            to="/admin/classes"
          />
          <StatCard
            title="Unpaid Fees"
            value={stats.unpaidFees}
            icon={CreditCard}
            accent={{ bar: 'bg-rose-500', bg: 'bg-rose-50', icon: 'text-rose-600', subtle: 'bg-rose-50/50' }}
            subtext="Overdue or partial"
            loading={loading}
            to="/admin/fees"
          />
          <StatCard
            title="Teaching Staff"
            value={stats.teachers}
            icon={UserCheck}
            accent={{ bar: 'bg-amber-500', bg: 'bg-amber-50', icon: 'text-amber-600', subtle: 'bg-amber-50/50' }}
            subtext="Active teachers"
            loading={loading}
            to="/admin/teachers"
          />
        </div>

        {/* ── Bottom Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Quick Actions — 2 cols */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Actions</h2>
            <div className="space-y-3">
              <QuickAction
                to="/admin/students"
                icon={Users}
                label="Student Directory"
                description="Enroll and manage students"
                accent="bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
              />
              <QuickAction
                to="/admin/classes"
                icon={BookOpen}
                label="Class Management"
                description="Configure classes and sections"
                accent="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
              />
              <QuickAction
                to="/admin/fees"
                icon={CreditCard}
                label="Fee Management"
                description="Record and track fee payments"
                accent="bg-rose-50 text-rose-600 group-hover:bg-rose-100"
              />
              <QuickAction
                to="/admin/attendance"
                icon={Calendar}
                label="Attendance Records"
                description="View and manage daily attendance"
                accent="bg-amber-50 text-amber-600 group-hover:bg-amber-100"
              />
              <QuickAction
                to="/admin/approvals"
                icon={Shield}
                label="Approval Queue"
                description="Review pending profile changes"
                accent="bg-violet-50 text-violet-600 group-hover:bg-violet-100"
              />
            </div>
          </div>

          {/* System Status — 3 cols */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">System Status</h2>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              {/* Status items */}
              {[
                {
                  icon: TrendingUp,
                  label: 'Fee Collection',
                  detail: `${stats.unpaidFees} record${stats.unpaidFees !== 1 ? 's' : ''} pending`,
                  status: stats.unpaidFees > 0 ? 'amber' : 'green',
                  statusText: stats.unpaidFees > 0 ? 'Attention needed' : 'All clear',
                },
                {
                  icon: Users,
                  label: 'Student Roster',
                  detail: `${stats.students} active enrollments`,
                  status: 'green',
                  statusText: 'Up to date',
                },
                {
                  icon: BookOpen,
                  label: 'Class Setup',
                  detail: `${stats.classes} class${stats.classes !== 1 ? 'es' : ''} configured`,
                  status: stats.classes > 0 ? 'green' : 'amber',
                  statusText: stats.classes > 0 ? 'Configured' : 'Setup needed',
                },
                {
                  icon: UserCheck,
                  label: 'Teaching Staff',
                  detail: `${stats.teachers} active teacher${stats.teachers !== 1 ? 's' : ''}`,
                  status: stats.teachers > 0 ? 'green' : 'amber',
                  statusText: stats.teachers > 0 ? 'Active' : 'None assigned',
                },
              ].map((item, i) => (
                <div
                  key={item.label}
                  className={`flex items-center justify-between px-6 py-4 ${i !== 0 ? 'border-t border-slate-50' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg">
                      <item.icon className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{loading ? '—' : item.detail}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'green' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                    <span className={`text-xs font-bold ${item.status === 'green' ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {loading ? '—' : item.statusText}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Info note */}
            <div className="flex items-start gap-3 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-600 leading-relaxed">
                <span className="font-bold">Getting started?</span> Enroll students, create classes,
                assign teachers, then begin recording attendance and fees.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
