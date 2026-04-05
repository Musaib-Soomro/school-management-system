import { useState, useEffect } from 'react'
import { Plus, GraduationCap, Search, Filter, RefreshCw, AlertCircle, Users, BookOpen } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import ClassTable from '../../components/admin/ClassTable'
import ClassForm from '../../components/admin/ClassForm'
import ClassDetails from '../../components/admin/ClassDetails'

const ClassesPage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0) // Used to trigger re-fetch in ClassTable
  const [stats, setStats] = useState({ total: 0, active: 0, students: 0 })
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [refreshKey])

  const fetchStats = async () => {
    try {
      setLoadingStats(true)
      
      // 1. Total Classes
      const { count: totalCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
      
      // 2. Active Classes
      const { count: activeCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)
      
      // 3. Total Enrolled Students (Distinct)
      const { count: studentCount } = await supabase
        .from('student_class_enrollments')
        .select('student_id', { count: 'exact', head: true })
        .eq('is_active', true)

      setStats({
        total: totalCount || 0,
        active: activeCount || 0,
        students: studentCount || 0
      })
    } catch (err) {
      console.error('Error fetching class stats:', err)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const openAddForm = () => {
    setSelectedClass(null)
    setIsFormOpen(true)
  }

  const openEditForm = (item) => {
    setSelectedClass(item)
    setIsFormOpen(true)
  }

  const openViewDetails = (item) => {
    setSelectedClass(item)
    setIsDetailsOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    handleRefresh()
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <BookOpen className="w-4 h-4" />
              Academic Management
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Class Management</h1>
            <p className="text-slate-500 max-w-lg">
              Organize your academic structure, define sections, assign teachers, and manage student rosters.
            </p>
          </div>
          <button 
            onClick={openAddForm}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all active:translate-y-0"
          >
            <Plus className="w-5 h-5" />
            Create New Class
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${loadingStats ? 'bg-slate-100' : 'bg-indigo-50 text-indigo-600'}`}>
                {loadingStats ? '...' : stats.total} Total
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Classes</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? '—' : stats.total}</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                <RefreshCw className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${loadingStats ? 'bg-slate-100' : 'bg-emerald-50 text-emerald-600'}`}>
                {loadingStats ? '...' : Math.round((stats.active / stats.total) * 100 || 0)}% Active
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Active Classes</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? '—' : stats.active}</p>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-lg ${loadingStats ? 'bg-slate-100' : 'bg-amber-50 text-amber-600'}`}>
                Rostered
              </span>
            </div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Students Enrolled</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{loadingStats ? '—' : stats.students}</p>
          </div>
        </div>

        {/* Main Content: Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-bold text-slate-800">Class Directory</h2>
            <button 
              onClick={handleRefresh}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <ClassTable 
            key={refreshKey}
            onEdit={openEditForm}
            onView={openViewDetails}
          />
        </div>

        {/* Modals */}
        {isFormOpen && (
          <ClassForm 
            initialData={selectedClass}
            onClose={() => setIsFormOpen(false)}
            onSuccess={handleFormSuccess}
          />
        )}

        {isDetailsOpen && selectedClass && (
          <ClassDetails 
            classItem={selectedClass}
            onClose={() => setIsDetailsOpen(false)}
            onUpdate={handleRefresh}
          />
        )}
      </div>
    </AdminLayout>
  )
}

export default ClassesPage