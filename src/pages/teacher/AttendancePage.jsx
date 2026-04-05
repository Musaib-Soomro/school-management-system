import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import AttendanceRoster from '../../components/shared/AttendanceRoster'
import { Calendar as CalendarIcon, BookOpen, Clock, AlertCircle, RefreshCw, Loader2, Info } from 'lucide-react'
import { Link } from 'react-router-dom'

const TeacherAttendancePage = () => {
  const { profile } = useAuth()
  const [assignedClasses, setAssignedClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Restricted Date: Teachers can only mark for today
  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    fetchAssignedClasses()
  }, [])

  const fetchAssignedClasses = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('teacher_class_assignments')
        .select(`
          class:classes(id, name, academic_year, section)
        `)
        .eq('teacher_profile_id', profile.id)
      
      if (error) throw error
      
      const classes = data.map(d => d.class)
      setAssignedClasses(classes)
      if (classes.length > 0) setSelectedClassId(classes[0].id)
    } catch (err) {
      console.error('Error fetching assigned classes:', err)
      setError('Failed to load your assigned classes.')
    } finally {
      setLoading(false)
    }
  }

  const selectedClass = assignedClasses.find(c => c.id === selectedClassId)

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        
        {/* Page Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div className="space-y-1">
            <Link to="/teacher/dashboard" className="text-indigo-600 font-bold tracking-wider text-xs uppercase hover:underline">
              ← Back to Portal
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Daily Attendance</h1>
            <p className="text-slate-500 max-w-lg">
              Mark student presence for your assigned classes for today.
            </p>
          </div>
          
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Today's Date</p>
              <p className="font-bold text-slate-800 leading-none">{new Date().toLocaleDateString('en-US', { dateStyle: 'long' })}</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-500 font-bold tracking-tight">Fetching your classes...</p>
          </div>
        ) : assignedClasses.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 max-w-lg mx-auto">
            <div className="p-4 bg-slate-50 text-slate-300 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">No Classes Assigned</h2>
            <p className="text-slate-500 leading-relaxed text-sm mb-8">
              You are not currently assigned to manage any classes. Please contact the school administrator for assistance.
            </p>
            <Link to="/teacher/dashboard" className="inline-flex px-8 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8 pb-20">
            {/* Selection Area */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/20">
               <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                Marking for Class
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none outline-none shadow-inner text-lg"
                    value={selectedClassId}
                    onChange={(e) => setSelectedClassId(e.target.value)}
                  >
                    {assignedClasses.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.section ? `(${c.section})` : ''} - {c.academic_year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="px-5 py-4 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center gap-2 font-bold select-none border border-slate-100 italic text-sm">
                  <Clock className="w-4 h-4" />
                  Locked: {today}
                </div>
              </div>
            </div>

            {/* Warning for past/future */}
            <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4 text-amber-800 shadow-sm border-l-4 border-l-amber-400">
               <Info className="w-5 h-5 shrink-0 mt-0.5" />
               <div>
                  <p className="text-sm font-bold mb-1">Teacher Policy: Current Date Marking Only</p>
                  <p className="text-xs leading-relaxed opacity-80">
                    As a teacher, you can only record or update attendance for the **current date**. To request corrections for past dates, please contact the administrative office.
                  </p>
               </div>
            </div>

            {/* Roster Area */}
            {selectedClassId && (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/20">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">Today's Roster</h2>
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                  </div>
                </div>
                
                <AttendanceRoster 
                  key={`${selectedClassId}-${today}`}
                  classId={selectedClassId} 
                  date={today} 
                  disabled={false} // Teacher CAN mark for 'today'
                  onSaveSuccess={() => {}}
                />
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TeacherAttendancePage
