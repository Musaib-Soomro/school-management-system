import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Edit2, Trash2, Eye, MoreVertical, Search, Filter } from 'lucide-react'

const ClassTable = ({ onEdit, onView }) => {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      setLoading(true)
      // Fetch classes and count students/assignments
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher_assignments:teacher_class_assignments(
            teacher:profiles(full_name)
          ),
          enrollments:student_class_enrollments(count)
        `)
        .order('name', { ascending: true })

      if (error) throw error
      setClasses(data)
    } catch (err) {
      console.error('Error fetching classes:', err)
      setError('Failed to load classes')
    } finally {
      setLoading(false)
    }
  }

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.academic_year.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search classes..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Class Name</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Academic Year</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Section</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Lead Teacher</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-center">Students</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredClasses.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                  No classes found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredClasses.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-900">{item.name}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{item.academic_year}</td>
                  <td className="px-6 py-4 text-slate-600">{item.section || '—'}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      {item.teacher_assignments?.[0]?.teacher?.full_name ? (
                        <span className="text-slate-900 font-medium">{item.teacher_assignments[0].teacher.full_name}</span>
                      ) : (
                        <span className="text-slate-400 italic font-normal text-xs">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {item.enrollments?.[0]?.count || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.is_active 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {item.is_active ? 'Active' : 'Archived'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onView(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(item)}
                        className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                        title="Edit Class"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Archive Class"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ClassTable
