import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  BookOpen, 
  Shield, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Loader2,
  MoreVertical,
  Edit2,
  X,
  History
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import StudentForm from '../../components/admin/StudentForm'

const StudentDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    fetchStudentDetail()
  }, [id])

  const fetchStudentDetail = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          enrollments:student_class_enrollments(
            enrollment_date,
            class:classes(*)
          ),
          parent_links:parent_student_links(
            relationship_type,
            parent:profiles!parent_profile_id(*)
          ),
          attendance:attendance_records(
            attendance_date,
            status,
            remarks,
            marked_by:profiles!marked_by_profile_id(full_name)
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setStudent(data)
    } catch (err) {
      console.error('Error fetching student details:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      const { error } = await supabase
        .from('students')
        .update(formData)
        .eq('id', id)

      if (error) throw error
      setIsEditModalOpen(false)
      fetchStudentDetail()
    } catch (err) {
      alert('Error updating student: ' + err.message)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this student record? This action cannot be undone.')) return
    
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/admin/students')
    } catch (err) {
      alert('Error deleting student: ' + err.message)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
          <p className="text-slate-500 font-bold tracking-tight">Loading student profile...</p>
        </div>
      </AdminLayout>
    )
  }

  if (error || !student) {
    return (
      <AdminLayout>
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center">
          <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Student Not Found</h2>
          <p className="text-slate-500 mb-8">{error || "The student record you're looking for doesn't exist or has been removed."}</p>
          <Link to="/admin/students" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all">
            <ArrowLeft className="w-5 h-5" />
            Back to Directory
          </Link>
        </div>
      </AdminLayout>
    )
  }

  const attendanceStats = {
    total: student.attendance?.length || 0,
    present: student.attendance?.filter(a => a.status === 'present').length || 0,
    late: student.attendance?.filter(a => a.status === 'late').length || 0,
    absent: student.attendance?.filter(a => a.status === 'absent').length || 0,
  }
  
  const attendanceRate = attendanceStats.total > 0 
    ? Math.round(((attendanceStats.present + attendanceStats.late) / attendanceStats.total) * 100) 
    : 0

  const joinedDate = new Date(student.created_at).toLocaleDateString()

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link to="/admin/students" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold text-xs uppercase tracking-widest transition-colors mb-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Students
            </Link>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-indigo-100">
                {student.first_name[0]}
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  {student.first_name} {student.last_name}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {student.admission_no}
                  </span>
                  {student.is_active ? (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full ring-1 ring-emerald-500/10">
                      <CheckCircle2 className="w-3 h-3" />
                      Active Student
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full ring-1 ring-rose-500/10">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => setIsEditModalOpen(true)}
               className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
               title="Edit Profile"
             >
               <Edit2 className="w-5 h-5" />
             </button>
             <div className="relative group">
                <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
                  Actions
                  <MoreVertical className="w-4 h-4" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden hidden group-hover:block z-10 animate-in fade-in zoom-in-95 duration-200">
                   <button 
                     onClick={() => setIsEditModalOpen(true)}
                     className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                   >
                     <Edit2 className="w-4 h-4" /> Edit Profile
                   </button>
                   <button 
                     onClick={handleDelete}
                     className="w-full px-4 py-3 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 border-t border-slate-50"
                   >
                     <XCircle className="w-4 h-4" /> Delete Student
                   </button>
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Personal info & Stats */}
          <div className="lg:col-span-1 space-y-8">
            {/* Quick Stats Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/20">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Attendance Summary</h3>
              <div className="flex items-end justify-between mb-2">
                <p className="text-4xl font-black text-slate-900">{attendanceRate}%</p>
                <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  attendanceRate >= 85 ? 'text-emerald-600 bg-emerald-50' : 
                  attendanceRate >= 70 ? 'text-amber-600 bg-amber-50' : 'text-rose-600 bg-rose-50'
                }`}>
                  {attendanceRate >= 85 ? 'Excellent' : attendanceRate >= 70 ? 'Average' : 'Critical'}
                </div>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 flex">
                <div className="h-full bg-emerald-500" style={{ width: `${(attendanceStats.present / attendanceStats.total) * 100 || 0}%` }}></div>
                <div className="h-full bg-amber-400" style={{ width: `${(attendanceStats.late / attendanceStats.total) * 100 || 0}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Present</p>
                  <p className="text-lg font-bold text-slate-900">{attendanceStats.present}</p>
                </div>
                <div className="text-center border-x border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Late</p>
                  <p className="text-lg font-bold text-slate-900">{attendanceStats.late}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Absent</p>
                  <p className="text-lg font-bold text-slate-900">{attendanceStats.absent}</p>
                </div>
              </div>
            </div>

            {/* Personal Details Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/20">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Personal Details</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Date of Birth</p>
                    <p className="text-sm font-bold text-slate-900">{student.date_of_birth || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Gender</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">{student.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Admission Date</p>
                    <p className="text-sm font-bold text-slate-900">{joinedDate}</p>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-50">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Notes</p>
                   <p className="text-sm text-slate-600 leading-relaxed italic">
                     {student.parent_notes || 'No specific notes recorded for this student.'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Enrollment, Parents, Attendance Log */}
          <div className="lg:col-span-2 space-y-8">
            {/* Class Enrollment & Parents Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Enrollment */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Class Enrollments</h3>
                  <BookOpen className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="space-y-4">
                  {student.enrollments?.length > 0 ? (
                    student.enrollments.map((enr, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-900">{enr.class.name}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase">{enr.class.academic_year}</p>
                        </div>
                        <span className="text-[10px] font-black text-indigo-600 bg-white px-2 py-1 rounded-lg border border-slate-100">ACTIVE</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4 italic">No active enrollments found.</p>
                  )}
                </div>
              </div>

              {/* Parents */}
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/10">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Linked Parents</h3>
                  <Shield className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="space-y-4">
                  {student.parent_links?.length > 0 ? (
                    student.parent_links.map((link, i) => (
                      <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900">{link.parent.full_name}</p>
                          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter bg-white px-2 py-1 rounded-lg border border-slate-100">
                            {link.relationship_type || 'Guardian'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-300" />
                            {link.parent.phone || 'No phone'}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5 text-slate-300" />
                            {link.parent.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400 text-center py-4 italic">No parents linked yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance Log Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/10 overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Attendance Log</h3>
                 <Clock className="w-4 h-4 text-slate-300" />
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50">
                     <tr>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Date</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Status</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Marked By</th>
                       <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase">Remarks</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {student.attendance?.length > 0 ? (
                       student.attendance
                         .sort((a, b) => new Date(b.attendance_date) - new Date(a.attendance_date))
                         .slice(0, 10)
                         .map((record, i) => (
                         <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="px-8 py-4 text-sm font-bold text-slate-700">
                             {new Date(record.attendance_date).toLocaleDateString()}
                           </td>
                           <td className="px-8 py-4">
                             <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               record.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                               record.status === 'late' ? 'bg-amber-50 text-amber-600' :
                               'bg-rose-50 text-rose-600'
                             }`}>
                               {record.status}
                             </span>
                           </td>
                           <td className="px-8 py-4 text-xs text-slate-500 italic">
                             {record.marked_by?.full_name || 'System'}
                           </td>
                           <td className="px-8 py-4 text-xs text-slate-400">
                             {record.remarks || '--'}
                           </td>
                         </tr>
                       ))
                     ) : (
                       <tr>
                         <td colSpan="4" className="px-8 py-12 text-center text-slate-400 italic text-sm">
                           No attendance records found for this student.
                         </td>
                       </tr>
                     )}
                   </tbody>
                 </table>
               </div>
               <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
                 <button 
                   onClick={() => alert("Full detailed attendance history view coming soon in Phase 2!")}
                   className="flex items-center gap-2 mx-auto text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                 >
                   <History className="w-4 h-4" />
                   View Full Attendance History
                 </button>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Edit Student Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <StudentForm 
                initialData={student}
                onSubmit={handleUpdate}
                onCancel={() => setIsEditModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

export default StudentDetailPage
