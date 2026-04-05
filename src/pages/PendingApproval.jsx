import { useAuth } from '../contexts/AuthContext'
import { Clock, LogOut, ShieldAlert } from 'lucide-react'

const PendingApproval = () => {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-10 border border-slate-100 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <Clock className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Account Pending</h1>
        
        <div className="space-y-4 text-slate-500 mb-10 leading-relaxed">
          <p>
            Welcome, <span className="font-bold text-slate-800">{profile?.full_name || 'New User'}</span>. 
            Your account has been successfully created.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p>
              For security reasons, an administrator must manually review and activate your account before you can access the system.
            </p>
          </div>
          <p className="text-sm italic">
            Please check back later or contact the school office.
          </p>
        </div>

        <button
          onClick={signOut}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-900/10"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default PendingApproval
