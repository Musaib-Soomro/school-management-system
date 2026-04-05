import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Check, X, Clock, Save, Loader2, AlertCircle, Info } from 'lucide-react'

const AttendanceRoster = ({ classId, date, disabled = false, onSaveSuccess }) => {
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({}) // { studentId: status }
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (classId && date) {
      fetchRosterAndAttendance()
    }
  }, [classId, date])

  const fetchRosterAndAttendance = async () => {
    try {
      setLoading(true)
      setError(null)

      // 1. Fetch students enrolled in the class
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('student_class_enrollments')
        .select(`
          student:students(id, first_name, last_name, admission_no)
        `)
        .eq('class_id', classId)
        .eq('is_active', true)

      if (enrollmentError) throw enrollmentError
      // Filter out any enrollments where the student data might be null due to RLS
      const roster = enrollmentData.map(e => e.student).filter(s => s !== null)
      setStudents(roster)

      // 2. Fetch existing attendance for this class and date
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance_records')
        .select('student_id, status')
        .eq('class_id', classId)
        .eq('attendance_date', date)

      if (attendanceError) throw attendanceError

      // Initialize attendance state
      const initialAttendance = {}
      attendanceData.forEach(record => {
        initialAttendance[record.student_id] = record.status
      })
      
      // For students not already marked, default to null (unmarked)
      setAttendance(initialAttendance)
    } catch (err) {
      console.error('Error fetching attendance roster:', err)
      setError('Failed to load student roster.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (studentId, status) => {
    if (disabled) return
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const markAllPresent = () => {
    if (disabled) return
    const allPresent = {}
    students.forEach(s => {
      allPresent[s.id] = 'present'
    })
    setAttendance(allPresent)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError(null)

      const { data: { user } } = await supabase.auth.getUser()
      const records = students.map(s => ({
        student_id: s.id,
        class_id: classId,
        attendance_date: date,
        status: attendance[s.id] || 'absent',
        marked_by_profile_id: user?.id
      }))

      // Filter out records where status is still null/unmarked if we want to enforce it
      const unmarkedCount = students.length - Object.keys(attendance).length
      if (unmarkedCount > 0) {
        if (!confirm(`${unmarkedCount} students are unmarked. They will be recorded as 'absent' by default. Continue?`)) {
          setSaving(false)
          return
        }
      }

      const cleanRecords = records.map(r => ({
        ...r,
        status: r.status || 'absent'
      }))

      const { error: saveError } = await supabase
        .from('attendance_records')
        .upsert(cleanRecords, { onConflict: 'student_id, class_id, attendance_date' })

      if (saveError) throw saveError
      
      if (onSaveSuccess) onSaveSuccess()
      alert('Attendance saved successfully!')
    } catch (err) {
      console.error('Error saving attendance:', err)
      setError('Failed to save attendance. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
        <p className="text-slate-500 font-medium">Loading roster...</p>
      </div>
    )
  }

  if (students.length === 0) {
    return (
      <div className="p-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
        <Info className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">No Students Enrolled</h3>
        <p className="text-slate-500 max-w-xs mx-auto mt-2">
          This class does not have any active student enrollments yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Student Roster</h3>
          <p className="text-sm text-slate-500">
            {Object.keys(attendance).length} / {students.length} students marked
          </p>
        </div>
        <button
          onClick={markAllPresent}
          disabled={disabled || saving}
          className="px-4 py-2 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-50"
        >
          Mark All Present
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-center">Attendance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900 leading-none mb-1">{s.first_name} {s.last_name}</p>
                      <p className="text-xs font-mono text-slate-500 uppercase tracking-tight">{s.admission_no}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                       <button
                        onClick={() => handleStatusChange(s.id, 'present')}
                        disabled={disabled || saving}
                        className={`
                          flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl border transition-all
                          ${attendance[s.id] === 'present' 
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-600'}
                        `}
                      >
                        <Check className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">P</span>
                      </button>
                      
                       <button
                        onClick={() => handleStatusChange(s.id, 'absent')}
                        disabled={disabled || saving}
                        className={`
                          flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl border transition-all
                          ${attendance[s.id] === 'absent' 
                            ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-rose-200 hover:text-rose-600'}
                        `}
                      >
                        <X className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">A</span>
                      </button>

                       <button
                        onClick={() => handleStatusChange(s.id, 'late')}
                        disabled={disabled || saving}
                        className={`
                          flex flex-col items-center gap-1 w-14 py-2.5 rounded-2xl border transition-all
                          ${attendance[s.id] === 'late' 
                            ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-100' 
                            : 'bg-white text-slate-400 border-slate-100 hover:border-amber-200 hover:text-amber-600'}
                        `}
                      >
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase">L</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={handleSave}
          disabled={disabled || saving}
          className={`
            w-full py-4 rounded-2xl shadow-xl font-bold flex items-center justify-center gap-2 transition-all
            ${disabled || saving 
              ? 'bg-slate-100 text-slate-400' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200 active:scale-95'}
          `}
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? 'Saving Attendance...' : 'Save Attendance Records'}
        </button>
        {disabled && (
          <p className="text-center text-xs text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            Teachers can only mark attendance for the current date.
          </p>
        )}
      </div>
    </div>
  )
}

export default AttendanceRoster
