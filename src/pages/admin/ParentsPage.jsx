import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Users, Mail, Phone, Loader2, Search, GraduationCap } from 'lucide-react'

const ParentsPage = () => {
  const [parents, setParents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchParents()
  }, [])

  const fetchParents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          links:parent_student_links(
            student:students(id, first_name, last_name, admission_no)
          )
        `)
        .eq('role', 'parent')
        .order('full_name', { ascending: true })
      
      if (error) throw error
      setParents(data)
    } catch (err) {
      console.error('Error fetching parents:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredParents = parents.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <Users className="w-4 h-4" />
              Community Management
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Parents Directory</h1>
            <p className="text-slate-500 max-w-lg">
              View and manage student guardians and their linked children.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search parents by name or email..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-xs font-bold text-slate-400 px-4">
            Total Parents: {parents.length}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-sm">
               <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
               <p className="text-slate-500 font-bold">Loading parents...</p>
            </div>
          ) : filteredParents.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
               <p className="text-slate-400 italic">No parents found matching your search.</p>
            </div>
          ) : (
            filteredParents.map((parent) => (
              <div key={parent.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all group overflow-hidden">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-emerald-100">
                      {parent.full_name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{parent.full_name}</h3>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Parent / Guardian</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Mail className="w-3.5 h-3.5 text-slate-300" />
                      <span className="truncate">{parent.email || 'No email provided'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Phone className="w-3.5 h-3.5 text-slate-300" />
                      <span>{parent.phone || 'No phone number'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Linked Children</span>
                       <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      {parent.links?.length > 0 ? (
                        parent.links.map((link, i) => (
                          <div key={i} className="flex flex-col p-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase border border-slate-100">
                            <span className="text-slate-900 font-bold leading-tight">{link.student.first_name} {link.student.last_name}</span>
                            <span className="text-slate-400 font-mono mt-0.5 tracking-tighter">{link.student.admission_no}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400 italic">No children linked yet</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 flex justify-end gap-2 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-all">
                   <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:bg-white px-3 py-1.5 rounded-lg transition-colors">
                     View Family Profile
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

export default ParentsPage
