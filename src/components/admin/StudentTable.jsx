import { Search, Edit2, Trash2, UserPlus, FileText, CheckCircle, XCircle, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const StudentTable = ({ students, loading, onEdit, onDelete, onSearch, searchTerm }) => {
  if (loading) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-lg w-full max-w-sm"></div>
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 border-b border-slate-100 last:border-0"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Table Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name or admission number..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Admission No</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Parent/Guardian</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.length > 0 ? (
                students.map((student) => {
                  // Format classes
                  const enrollmentList = student.enrollments || []
                  const classesDisplay = enrollmentList.length > 0 
                    ? enrollmentList.map(e => e.class.name).join(', ')
                    : 'N/A'
                  
                  // Format parents
                  const parentList = student.parent_links || []
                  const primaryParent = parentList[0]?.parent?.full_name
                  const parentDisplay = parentList.length > 1 
                    ? `${primaryParent} (+${parentList.length - 1})`
                    : primaryParent || 'Not linked'

                  return (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                          {student.admission_no}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {student.first_name?.[0] || 'S'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 leading-tight">
                              {student.first_name} {student.last_name || ''}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              {student.is_active ? (
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active"></span>
                              ) : (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" title="Inactive"></span>
                              )}
                              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                                {student.gender || 'Not specified'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700">{classesDisplay}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-slate-700">{parentDisplay}</span>
                        </div>
                      </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/students/${student.id}`}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => onEdit(student)}
                          className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(student.id)}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-slate-100 rounded-full">
                        <FileText className="w-8 h-8 text-slate-400" />
                      </div>
                      <div className="text-slate-500 max-w-xs mx-auto">
                        <p className="font-semibold text-slate-900">No students found</p>
                        <p className="text-sm">Try adjusting your search terms or add a new student to get started.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default StudentTable
