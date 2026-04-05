import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../contexts/AuthContext'
import { 
  GraduationCap, 
  Info, 
  User, 
  Loader2, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Link } from 'react-router-dom'

const AttendanceCalendar = ({ attendance }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const today = new Date()
  
  const getStatus = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const record = attendance.find(a => a.attendance_date === dateStr)
    
    // Don't mark future days
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    if (checkDate > today) return 'future'
    
    return record?.status || 'none'
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
           <CalendarIcon className="w-5 h-5 text-indigo-600" />
           <h3 className="font-black text-slate-900 uppercase tracking-tight text-sm">
             {months[currentDate.getMonth()]} {currentDate.getFullYear()}
           </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <span key={d} className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {Array(firstDayOfMonth).fill(0).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const status = getStatus(day)
          return (
            <div 
              key={day} 
              className={`
                aspect-square rounded-xl flex items-center justify-center text-[11px] font-bold transition-all relative group
                ${status === 'present' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10' : 
                  status === 'absent' ? 'bg-rose-50 text-rose-600 ring-1 ring-rose-500/10 shadow-sm shadow-rose-100' : 
                  status === 'late' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-500/10' : 
                  status === 'future' ? 'text-slate-200' :
                  'bg-slate-50 text-slate-400'}
              `}
            >
              {day}
              {status === 'absent' && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-sm" />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 flex items-center gap-4 justify-center border-t border-slate-50 pt-4">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-rose-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Late</span>
        </div>
      </div>
    </div>
  )
}

const ParentDashboard = () => {
  const { profile, signOut } = useAuth()
  const [linkedStudents, setLinkedStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeStudentId, setActiveStudentId] = useState(null)

  useEffect(() => {
    if (profile) {
      fetchLinkedStudents()
    }
  }, [profile])

  const fetchLinkedStudents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('parent_student_links')
        .select(`
          student:students (
            id,
            first_name,
            last_name,
            admission_no,
            enrollments:student_class_enrollments(
              class:classes(id, name, academic_year)
            ),
            attendance:attendance_records(
              attendance_date,
              status,
              class:classes(id, name)
            )
          )
        `)
        .eq('parent_profile_id', profile.id)
      
      if (error) throw error
      
      const validStudents = data
        .map(link => {
          if (!link.student) return null;
          
          const attendance = link.student.attendance || [];
          const totalDays = attendance.length;
          const presentDays = attendance.filter(a => a.status === 'present' || a.status === 'late').length;
          const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

          // Process class-wise records
          const classBreakdown = {}
          attendance.forEach(rec => {
            const className = rec.class?.name || 'General'
            if (!classBreakdown[className]) {
              classBreakdown[className] = { total: 0, present: 0 }
            }
            classBreakdown[className].total++
            if (rec.status === 'present' || rec.status === 'late') {
              classBreakdown[className].present++
            }
          })

          const classStats = Object.keys(classBreakdown).map(name => ({
            name,
            rate: Math.round((classBreakdown[name].present / classBreakdown[name].total) * 100)
          }))
          
          return {
            ...link.student,
            attendanceRate,
            classStats,
            records: attendance
          };
        })
        .filter(student => student !== null)
      
      setLinkedStudents(validStudents)
      if (validStudents.length > 0) setActiveStudentId(validStudents[0].id)
    } catch (err) {
      console.error('Error fetching linked students:', err)
    } finally {
      setLoading(false)
    }
  }

  const activeStudent = linkedStudents.find(s => s.id === activeStudentId)
  
  const overallAttendance = linkedStudents.length > 0 
    ? Math.round(linkedStudents.reduce((acc, s) => acc + (s.attendanceRate || 0), 0) / linkedStudents.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
        
        {/* Modern Premium Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100 transition-colors duration-500" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-widest text-[10px] uppercase mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              School Management System
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Parent Portal</h1>
            <p className="text-slate-400 mt-2 font-medium">Assalaamu Alaikum, <span className="text-slate-900 font-bold underline decoration-indigo-200 decoration-4 underline-offset-4">{profile?.full_name}</span></p>
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <Link to="/profile" className="flex items-center gap-2 px-6 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white transition-all hover:shadow-lg active:scale-95 group">
              <User className="w-4 h-4 group-hover:text-indigo-600 transition-colors" />
              My Profile
            </Link>
            <button onClick={signOut} className="flex items-center gap-2 px-6 py-3 bg-slate-900 rounded-2xl text-sm font-bold text-white hover:bg-slate-800 transition-all hover:shadow-xl hover:shadow-slate-200 active:scale-95">
              Sign Out
            </button>
          </div>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl">
             <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Synchronizing your data...</p>
          </div>
        ) : linkedStudents.length === 0 ? (
          <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-xl text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No Students Linked</h3>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">We couldn't find any student profiles linked to your account. Please contact the school office to verify your credentials.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Student Selector & Quick Stats */}
            <div className="lg:col-span-4 space-y-8">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-500" />
                  Your Linked Children
                </h3>
                <div className="space-y-4">
                  {linkedStudents.map(student => (
                    <button 
                      key={student.id}
                      onClick={() => setActiveStudentId(student.id)}
                      className={`
                        w-full p-6 rounded-3xl transition-all text-left border-2 flex flex-col
                        ${activeStudentId === student.id 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-200' 
                          : 'bg-slate-50 border-transparent text-slate-600 hover:bg-white hover:border-slate-100 shadow-sm'}
                      `}
                    >
                      <span className="font-black text-lg leading-tight uppercase tracking-tight">{student.first_name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${activeStudentId === student.id ? 'opacity-70' : 'text-slate-400'}`}>
                        {student.admission_no}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white relative overflow-hidden group">
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700" />
                <h3 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-2">Aggregate Performance</h3>
                <div className="text-5xl font-black mb-1 leading-none">{overallAttendance}%</div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Attendance Rate</p>
              </div>
            </div>

            {/* Right Column: Calendar & Class Breakdown */}
            <div className="lg:col-span-8 space-y-8 animate-in slide-in-from-right-8 duration-700">
               {activeStudent && (
                 <>
                   {/* Alerts Section (Recent Absences) */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <AttendanceCalendar attendance={activeStudent.records} />
                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                             <TrendingUp className="w-4 h-4 text-emerald-500" />
                             Class Breakdown
                           </h3>
                           <div className="space-y-4">
                             {activeStudent.classStats.length > 0 ? activeStudent.classStats.map((stat, i) => (
                               <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:bg-white transition-all">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-slate-900 text-sm">{stat.name}</span>
                                    <span className={`text-xs font-black ${stat.rate >= 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{stat.rate}%</span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                    <div className={`h-full transition-all duration-1000 ${stat.rate >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${stat.rate}%` }} />
                                  </div>
                               </div>
                             )) : (
                               <p className="text-xs text-slate-400 italic">No attendance marked per class yet.</p>
                             )}
                           </div>
                        </div>

                        {/* Recent Absence Warning */}
                        {activeStudent.records.filter(r => r.status === 'absent').length > 0 && (
                          <div className="bg-rose-50 p-6 rounded-[2rem] border border-rose-100 flex items-start gap-4">
                            <div className="p-2 bg-rose-500 rounded-xl text-white shadow-lg shadow-rose-200">
                              <AlertCircle className="w-4 h-4" />
                            </div>
                            <div>
                               <h4 className="font-black text-rose-900 text-xs uppercase tracking-tight">Recent Absence Detected</h4>
                               <p className="text-xs text-rose-700/70 mt-1 font-medium leading-relaxed">
                                 {activeStudent.first_name} was marked absent on {new Date(activeStudent.records.find(r => r.status === 'absent').attendance_date).toLocaleDateString()}. Please provide a reason via internal notes if required.
                               </p>
                            </div>
                          </div>
                        )}
                      </div>
                   </div>

                   {/* Information Footer */}
                   <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center gap-6">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 flex-shrink-0">
                        <Info className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-slate-500 leading-relaxed">
                         To link additional children to your account or dispute an attendance record, please provide the school office with your account email address and the child's admission number. Official records update every 24 hours.
                      </p>
                   </div>
                 </>
               )}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default ParentDashboard
