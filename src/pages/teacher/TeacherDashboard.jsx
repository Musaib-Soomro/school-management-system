import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { Calendar, BookOpen, Clock, Shield, Loader2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const TeacherDashboard = () => {
  const { profile, signOut } = useAuth()
  const [assignedClasses, setAssignedClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (profile) {
      fetchAssignedClasses()
    }
  }, [profile])

  const fetchAssignedClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('teacher_class_assignments')
        .select(`
          class:classes(id, name, academic_year, section)
        `)
        .eq('teacher_profile_id', profile.id)
      
      if (error) throw error
      setAssignedClasses(data.map(d => d.class))
    } catch (err) {
      console.error('Error fetching assigned classes:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        <header className="flex justify-between items-center px-1">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-1">
              <Shield className="w-4 h-4" />
              Teacher Portal
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, <span className="text-indigo-600">{profile?.full_name?.split(' ')[0]}</span></h1>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              to="/profile"
              className="px-5 py-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-sm font-bold text-indigo-700 hover:bg-indigo-100 transition-all hover:scale-95 shadow-sm"
            >
              My Profile
            </Link>
            <button 
              onClick={signOut}
              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all hover:scale-95 shadow-sm"
            >
              Sign Out
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Assigned Classes */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/20 border border-slate-100 flex flex-col h-full min-h-[300px]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 font-bold text-slate-800">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="uppercase tracking-widest text-xs">Assigned Classes</h3>
              </div>
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">
                {assignedClasses.length} Active
              </span>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-200" />
              </div>
            ) : assignedClasses.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                <Clock className="w-10 h-10 text-slate-200 mb-3" />
                <p className="text-sm text-slate-400 max-w-[200px]">No active classes assigned to you yet. Please contact the administrator.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {assignedClasses.map((cls) => (
                  <Link 
                    key={cls.id}
                    to="/teacher/attendance"
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 hover:bg-white hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all group"
                  >
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{cls.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                        {cls.academic_year} {cls.section ? `• Section ${cls.section}` : ''}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Attendance Shortcut */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 rounded-3xl shadow-xl shadow-indigo-200/30 text-white flex flex-col justify-between group h-full">
            <div className="mb-12">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 ring-1 ring-white/30 group-hover:scale-110 transition-transform duration-500">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black mb-2 tracking-tight uppercase">Daily Attendance</h3>
              <p className="text-indigo-100 text-sm leading-relaxed opacity-80">Access your student roster quickly to mark presence for today.</p>
            </div>
            <Link 
              to="/teacher/attendance"
              className="bg-white text-indigo-600 font-black px-6 py-4 rounded-2xl hover:bg-indigo-50 transition-all active:scale-95 text-center shadow-lg shadow-black/5"
            >
              Go to Attendance
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard
