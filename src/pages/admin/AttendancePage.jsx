import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import AttendanceRoster from '../../components/shared/AttendanceRoster'
import { Calendar as CalendarIcon, BookOpen, Clock, AlertCircle, RefreshCw, Layers, Loader2 } from 'lucide-react'

const AdminAttendancePage = () => {

  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)


  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('classes')
        .select('id, name, academic_year, section')
        .eq('is_active', true)
        .order('name')
      
      if (error) throw error
      setClasses(data)
      if (data.length > 0) setSelectedClassId(data[0].id)
    } catch (err) {
      console.error('Error fetching classes:', err)
      setError('Failed to load classes.')
    } finally {
      setLoading(false)
    }
  }

  const selectedClass = classes.find(c => c.id === selectedClassId)

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <CalendarIcon className="w-4 h-4" />
              Academic Records
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Attendance Marking</h1>
            <p className="text-slate-500 max-w-lg">
              Admins can mark or review attendance for any class on any date.
            </p>
          </div>
          
          <div className="flex items-center gap-3 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-100 ring-1 ring-slate-100">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-black uppercase tracking-tighter ring-1 ring-indigo-200">
              <Layers className="w-3.5 h-3.5" />
              Admin Mode
            </div>
          </div>
        </div>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <BookOpen className="w-4 h-4 text-slate-400 font-normal" />
              Select Class
            </label>
            <select
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer appearance-none outline-none shadow-inner"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              disabled={loading}
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.section ? `(${c.section})` : ''} - {c.academic_year}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2 px-1">
              <CalendarIcon className="w-4 h-4 text-slate-400 font-normal" />
              Select Date
            </label>
            <input
              type="date"
              className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer outline-none shadow-inner"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>

        {/* Roster Area */}
        {selectedClassId ? (
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                Attendance for {selectedClass?.name}
              </h2>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-lg">
                Records: {selectedDate}
              </div>
            </div>
            
            <AttendanceRoster 
              key={`${selectedClassId}-${selectedDate}`}
              classId={selectedClassId} 
              date={selectedDate} 
            />
          </div>
        ) : loading ? (
           <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
             <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
             <p className="text-slate-500 font-medium">Initializing...</p>
           </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Please select a class to view and mark attendance.</p>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminAttendancePage
