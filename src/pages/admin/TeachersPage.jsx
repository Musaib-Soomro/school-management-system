import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Users, Mail, Phone, Loader2, Search, BookOpen } from 'lucide-react'

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          assignments:teacher_class_assignments(
            class:classes(id, name, academic_year)
          )
        `)
        .eq('role', 'teacher')
        .order('full_name', { ascending: true })
      
      if (error) throw error
      setTeachers(data)
    } catch (err) {
      console.error('Error fetching teachers:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(t => 
    t.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <Users className="w-4 h-4" />
              Faculty Management
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Teachers Directory</h1>
            <p className="text-slate-500 max-w-lg">
              View and manage school teaching staff and their class assignments.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search teachers by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-bold text-slate-400 px-4">
            Total Teachers: {teachers.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
               <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
               <p className="text-slate-500 font-bold">Loading faculty...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-slate-400 italic">No teachers found matching your search.</p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-indigo-100">
                      {teacher.full_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{teacher.full_name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Faculty Member</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      <span className="truncate">{teacher.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-300" />
                      <span>{teacher.phone || 'No phone number'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignments</span>
                       <BookOpen className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {teacher.assignments?.length > 0 ? (
                        teacher.assignments.map((asgn, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase border border-slate-100">
                            {asgn.class.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No classes assigned yet</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 flex justify-end gap-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                   <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-white px-3 py-1.5 rounded-lg transition-colors">
                     View Details
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

export default TeachersPage
