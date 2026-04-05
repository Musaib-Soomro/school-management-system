import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { User, Phone, Mail, Save, Loader2, AlertCircle, CheckCircle2, ArrowLeft, Clock, Shield } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const ProfilePage = () => {
  const { profile, refreshProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || ''
  })
  const [message, setMessage] = useState(null)
  const [pendingRequest, setPendingRequest] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || ''
      })
      fetchPendingRequest()
    }
  }, [profile])

  const fetchPendingRequest = async () => {
    try {
      const { data, error } = await supabase
        .from('profile_update_requests')
        .select('*')
        .eq('profile_id', profile.id)
        .eq('status', 'pending')
        .maybeSingle()
      
      if (error) throw error
      setPendingRequest(data)
    } catch (err) {
      console.error('Error fetching pending request:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const isSuperAdmin = profile.role === 'super_admin'

      if (isSuperAdmin) {
        // Direct update for Super Admin
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            updated_at: new Date()
          })
          .eq('id', profile.id)
        
        if (error) throw error
        
        // Refresh the global auth state to show changes immediately
        if (refreshProfile) await refreshProfile()
        
        setMessage({ type: 'success', text: 'Profile updated successfully!' })
      } else {
        // Submit request for approval
        const { error } = await supabase
          .from('profile_update_requests')
          .insert({
            profile_id: profile.id,
            requested_changes: formData,
            status: 'pending'
          })
        
        if (error) throw error
        setPendingRequest({ requested_changes: formData })
        setMessage({ type: 'success', text: 'Your update request has been submitted for approval.' })
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setMessage({ type: 'error', text: 'Failed to process update: ' + err.message })
    } finally {
      setLoading(false)
    }
  }

  const getDashboardLink = () => {
    if (profile?.role === 'super_admin' || profile?.role === 'admin') return '/admin/dashboard'
    if (profile?.role === 'teacher') return '/teacher/dashboard'
    if (profile?.role === 'parent') return '/parent/dashboard'
    return '/dashboard'
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 font-sans">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <header className="flex items-center justify-between">
          <div>
            <Link 
              to={getDashboardLink()} 
              className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-widest hover:underline mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Your Profile</h1>
          </div>
          <div className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
            profile?.role === 'super_admin' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
            profile?.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
            'bg-indigo-50 text-indigo-700 border border-indigo-100'
          }`}>
            <Shield className="w-4 h-4" />
            {profile?.role?.replace('_', ' ')}
          </div>
        </header>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative">
             <div className="absolute -bottom-12 left-10">
                <div className="w-24 h-24 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl font-black text-indigo-600 border-4 border-white">
                  {profile?.full_name?.[0]}
                </div>
             </div>
          </div>
          
          <div className="pt-16 pb-10 px-10">
            {pendingRequest && (
              <div className="mb-8 p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-start gap-4 text-amber-800 animate-in zoom-in-95 duration-500">
                <Clock className="w-6 h-6 shrink-0 mt-1" />
                <div className="space-y-2">
                  <p className="font-bold">Update Request Pending</p>
                  <p className="text-sm opacity-80 leading-relaxed">
                    You have a pending request to change your details to:
                    <br />
                    <span className="font-bold">{pendingRequest.requested_changes.full_name}</span> 
                    {pendingRequest.requested_changes.phone && ` • ${pendingRequest.requested_changes.phone}`}
                  </p>
                  <p className="text-xs italic opacity-60">An administrator will review this shortly.</p>
                </div>
              </div>
            )}

            {message && (
              <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <p className="text-sm font-bold">{message.text}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={loading || (pendingRequest && profile.role !== 'super_admin')}
                      className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold disabled:opacity-50"
                      placeholder="Your Full Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address (Primary Login)</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="email"
                        readOnly
                        value={profile?.email || ''}
                        className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-400 font-semibold cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                      <input
                        type="text"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={loading || (pendingRequest && profile.role !== 'super_admin')}
                        className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold disabled:opacity-50"
                        placeholder="e.g. +1 234 567 890"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || (pendingRequest && profile.role !== 'super_admin')}
                  className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {profile?.role === 'super_admin' ? 'Update Profile' : 'Request Update'}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Shield className="w-20 h-20" />
           </div>
           <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Security Settings</h3>
           <p className="text-slate-400 text-sm mb-6 max-w-md">
             Want to change your login password? You can request a password reset email to update it securely.
           </p>
           <button 
             onClick={() => navigate('/forgot-password')}
             className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-white/10"
           >
             Change Password
           </button>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
