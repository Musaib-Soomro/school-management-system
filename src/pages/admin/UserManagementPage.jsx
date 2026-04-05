import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import { Users, UserCheck, UserX, Shield, Mail, Phone, Loader2, Search, Filter, MoreVertical, Clock, Trash2, AlertTriangle, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

const UserManagementPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('all') // all, pending, active, inactive
  const [updatingId, setUpdatingId] = useState(null)
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false)
  const [selectedParent, setSelectedParent] = useState(null)
  const [allStudents, setAllStudents] = useState([])
  const [linkingLoading, setLinkingLoading] = useState(false)
  const { profile: currentUser } = useAuth()

  useEffect(() => {
    fetchUsers()
    fetchStudents()
  }, [])

  const fetchStudents = async () => {
    const { data } = await supabase.from('students').select('id, first_name, last_name, admission_no').eq('is_active', true)
    setAllStudents(data || [])
  }

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          links:parent_student_links(student_id)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setUsers(data)
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSendPasswordReset = async (email) => {
     if (!window.confirm(`Send password reset link to ${email}?`)) return
     try {
       const { error } = await supabase.auth.resetPasswordForEmail(email, {
         redirectTo: `${window.location.origin}/reset-password`,
       })
       if (error) throw error
       alert('Reset link sent to user email!')
     } catch (err) {
       alert('Error: ' + err.message)
     }
  }

  const handleLinkStudent = async (studentId) => {
    try {
      setLinkingLoading(true)
      const { error } = await supabase
        .from('parent_student_links')
        .insert({
          parent_profile_id: selectedParent.id,
          student_id: studentId
        })
      
      if (error) throw error
      
      setUsers(users.map(u => {
        if (u.id === selectedParent.id) {
          return { ...u, links: [...(u.links || []), { student_id: studentId }] }
        }
        return u
      }))
      setSelectedParent(prev => ({ ...prev, links: [...(prev.links || []), { student_id: studentId }] }))
    } catch (err) {
      alert('Error linking student: ' + err.message)
    } finally {
      setLinkingLoading(false)
    }
  }

  const handleUnlinkStudent = async (studentId) => {
     try {
      setLinkingLoading(true)
      const { error } = await supabase
        .from('parent_student_links')
        .delete()
        .eq('parent_profile_id', selectedParent.id)
        .eq('student_id', studentId)
      
      if (error) throw error
      
      setUsers(users.map(u => {
        if (u.id === selectedParent.id) {
          return { ...u, links: u.links.filter(l => l.student_id !== studentId) }
        }
        return u
      }))
      setSelectedParent(prev => ({ ...prev, links: prev.links.filter(l => l.student_id !== studentId) }))
    } catch (err) {
      alert('Error unlinking student: ' + err.message)
    } finally {
      setLinkingLoading(false)
    }
  }

  const handleUpdateUser = async (id, updates) => {
    try {
      setUpdatingId(id)
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      setUsers(users.map(u => u.id === id ? { ...u, ...updates } : u))
    } catch (err) {
      console.error('Error updating user:', err)
      alert('Failed to update user: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDeleteUser = async (id, fullName) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY delete ${fullName}? This will remove their login and all associated data. This action cannot be undone.`)) {
      return
    }

    try {
      setUpdatingId(id)
      const { error } = await supabase.rpc('delete_user', { target_user_id: id })
      
      if (error) throw error
      
      setUsers(users.filter(u => u.id !== id))
    } catch (err) {
      console.error('Error deleting user:', err)
      alert('Failed to delete user: ' + err.message)
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.role?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filter === 'pending') return matchesSearch && !u.is_active
    if (filter === 'active') return matchesSearch && u.is_active
    if (filter === 'admin') return matchesSearch && u.role === 'admin'
    if (filter === 'teacher') return matchesSearch && u.role === 'teacher'
    if (filter === 'parent') return matchesSearch && u.role === 'parent'
    if (filter === 'guest') return matchesSearch && u.role === 'guest'
    if (filter === 'super_admin') return matchesSearch && u.role === 'super_admin'
    return matchesSearch
  })

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <Shield className="w-4 h-4" />
              System Administration
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
            <p className="text-slate-500 max-w-lg">
              Approve new registrations, assign system roles, and manage account access status.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or role..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {['all', 'pending', 'guest', 'teacher', 'parent', 'admin', 'super_admin'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  filter === f 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">System Role</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600" />
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic">
                      No users found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-inner ${
                            u.is_active ? 'bg-indigo-500' : 'bg-slate-300'
                          }`}>
                            {u.full_name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{u.full_name}</p>
                            <div className="flex items-center gap-2">
                               <p className="text-[10px] uppercase font-bold text-slate-400">ID: {u.id.substring(0, 8)}</p>
                               {u.role === 'parent' && (
                                 <span className="text-[10px] text-indigo-600 font-bold uppercase">
                                   • {u.links?.length || 0} Students linked
                                 </span>
                               )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all ${
                            u.role === 'super_admin' ? 'bg-rose-50 text-rose-700 ring-rose-100' :
                            u.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-100' :
                            u.role === 'teacher' ? 'bg-indigo-50 text-indigo-700 ring-indigo-100' :
                            'bg-slate-50 text-slate-700'
                          }`}
                          value={u.role}
                          onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                          disabled={updatingId === u.id}
                        >
                          <option value="super_admin">Super Admin</option>
                          <option value="admin">Admin</option>
                          <option value="teacher">Teacher</option>
                          <option value="parent">Parent</option>
                          <option value="guest">Guest (Pending Role)</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter ${
                          u.is_active 
                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100' 
                            : 'bg-rose-50 text-rose-700 ring-1 ring-rose-200 animate-pulse'
                        }`}>
                          {u.is_active ? (
                            <><UserCheck className="w-3.5 h-3.5" /> Active</>
                          ) : (
                            <><Clock className="w-3.5 h-3.5" /> Pending</>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {updatingId === u.id ? (
                          <Loader2 className="w-5 h-5 animate-spin ml-auto text-indigo-600" />
                        ) : (
                          <div className="flex items-center justify-end gap-2">
                             {u.role === 'parent' && (
                               <button
                                 onClick={() => { setSelectedParent(u); setIsLinkingModalOpen(true); }}
                                 className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                                 title="Link Students"
                               >
                                 <Users className="w-5 h-5" />
                               </button>
                             )}
                             <button
                               onClick={() => handleSendPasswordReset(u.email)}
                               className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                               title="Send Password Reset"
                             >
                               <Mail className="w-5 h-5" />
                             </button>
                            {!u.is_active ? (
                              <button
                                onClick={() => handleUpdateUser(u.id, { is_active: true })}
                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 active:scale-95"
                              >
                                Approve
                              </button>
                            ) : (
                              <>
                                {((currentUser?.role === 'super_admin' && u.role !== 'super_admin') || 
                                  (currentUser?.role === 'admin' && u.role !== 'admin' && u.role !== 'super_admin')) && (
                                  <button
                                    onClick={() => handleDeleteUser(u.id, u.full_name)}
                                    className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                    title="Permanently Delete User"
                                    disabled={u.id === currentUser?.id}
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Linking Modal */}
        {isLinkingModalOpen && selectedParent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Link Parent to Students</h2>
                   <button onClick={() => setIsLinkingModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                     <X className="w-6 h-6 text-slate-400" />
                   </button>
                </div>
                <p className="text-slate-500 text-sm font-bold tracking-tight">Managing links for: <span className="text-indigo-600">{selectedParent.full_name}</span></p>
              </div>

              <div className="p-8 max-h-[60vh] overflow-y-auto space-y-4">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">All Enrolled Students</p>
                {allStudents.length === 0 ? (
                  <p className="p-8 text-center text-slate-400 italic">No students found.</p>
                ) : (
                  <div className="space-y-2">
                    {allStudents.map(student => {
                      const isLinked = selectedParent.links?.some(l => l.student_id === student.id)
                      return (
                        <div key={student.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${isLinked ? 'bg-indigo-50 border-indigo-100 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-300'}`}>
                           <div>
                              <p className="font-bold text-slate-900 leading-none mb-1">{student.first_name} {student.last_name}</p>
                              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-tight">{student.admission_no}</p>
                           </div>
                           {isLinked ? (
                             <button
                               onClick={() => handleUnlinkStudent(student.id)}
                               disabled={linkingLoading}
                               className="px-4 py-2 bg-rose-50 text-rose-600 text-[10px] font-black uppercase rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                             >
                               Unlink
                             </button>
                           ) : (
                             <button
                               onClick={() => handleLinkStudent(student.id)}
                               disabled={linkingLoading}
                               className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-600 transition-all shadow-md"
                             >
                               Link
                             </button>
                           )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
              
              <div className="p-8 border-t border-slate-100 bg-slate-50/50">
                 <button
                   onClick={() => setIsLinkingModalOpen(false)}
                   className="w-full py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95 shadow-sm"
                 >
                   Done
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default UserManagementPage
