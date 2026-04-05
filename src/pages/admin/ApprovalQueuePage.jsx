import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import AdminLayout from '../../components/layouts/AdminLayout'
import { useAuth } from '../../contexts/AuthContext'
import { Clock, CheckCircle2, XCircle, User, Phone, Loader2, Shield, AlertCircle, Trash2 } from 'lucide-react'

const ApprovalQueuePage = () => {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState(null)
  const { profile: currentUser } = useAuth()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profile_update_requests')
        .select(`
          *,
          profile:profiles!profile_id(id, full_name, role, phone)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setRequests(data)
    } catch (err) {
      console.error('Error fetching requests:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (request) => {
    try {
      // Permission Check
      if (currentUser.role === 'admin' && request.profile.role === 'admin') {
        return alert("Standard Admins cannot approve other Admins' profile changes. Contact a Super Admin.")
      }

      setProcessingId(request.id)
      const { error } = await supabase.rpc('approve_profile_update', { 
        request_id: request.id, 
        reviewer_id: currentUser.id 
      })

      if (error) throw error
      
      setRequests(requests.filter(r => r.id !== request.id))
      alert('Profile update approved successfully!')
    } catch (err) {
      console.error('Error approving request:', err)
      alert('Failed to approve request: ' + err.message)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (requestId, reason = 'Rejected by administrator') => {
    try {
      setProcessingId(requestId)
      const { error } = await supabase
        .from('profile_update_requests')
        .update({ 
          status: 'rejected', 
          reviewed_by: currentUser.id, 
          reviewed_at: new Date(),
          rejection_reason: reason 
        })
        .eq('id', requestId)

      if (error) throw error
      
      setRequests(requests.filter(r => r.id !== requestId))
    } catch (err) {
      console.error('Error rejecting request:', err)
      alert('Failed to reject request: ' + err.message)
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase">
              <Shield className="w-4 h-4" />
              Administrative Governance
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Approval Queue</h1>
            <p className="text-slate-500 max-w-lg">
              Review and approve personal detail changes submitted by staff and parents.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <p className="text-slate-500 font-bold tracking-tight">Fetching pending requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 max-w-lg mx-auto">
            <div className="p-4 bg-emerald-50 text-emerald-300 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">All Caught Up!</h2>
            <p className="text-slate-500 leading-relaxed text-sm mb-8">
              There are no pending profile update requests to review at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/10 overflow-hidden group hover:border-indigo-200 transition-all">
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  {/* User Column */}
                  <div className="md:w-1/3 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl font-black text-slate-400">
                        {request.profile.full_name[0]}
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Requester</p>
                        <p className="font-bold text-slate-900">{request.profile.full_name}</p>
                        <p className="text-xs text-indigo-600 font-black uppercase tracking-tighter">{request.profile.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2">
                       <Clock className="w-3.5 h-3.5" />
                       Submitted: {new Date(request.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Changes Column */}
                  <div className="flex-1 space-y-4">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Proposed Changes</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name Change */}
                      {request.requested_changes.full_name !== request.profile.full_name && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 text-indigo-600 mb-2">
                             <User className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Full Name</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 line-through truncate">{request.profile.full_name}</p>
                            <p className="text-sm font-bold text-slate-900 truncate">→ {request.requested_changes.full_name}</p>
                          </div>
                        </div>
                      )}

                      {/* Phone Change */}
                      {request.requested_changes.phone !== request.profile.phone && (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <div className="flex items-center gap-2 text-indigo-600 mb-2">
                             <Phone className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Phone Number</span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 line-through truncate">{request.profile.phone || 'N/A'}</p>
                            <p className="text-sm font-bold text-slate-900 truncate">→ {request.requested_changes.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Column */}
                  <div className="md:w-1/4 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={processingId === request.id}
                      className="w-full py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-50 active:scale-95"
                    >
                      {processingId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processingId === request.id}
                      className="w-full py-3 bg-slate-100 text-slate-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 border border-transparent"
                    >
                      {processingId === request.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default ApprovalQueuePage
