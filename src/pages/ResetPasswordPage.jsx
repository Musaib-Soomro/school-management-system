import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Lock, Loader2, CheckCircle2 } from 'lucide-react'

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Supabase automatically logs in the user when they click the reset link.
    // If there's no session, they might have manually navigated here or the link expired.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setError("Invalid or expired reset link. Please request a new one.")
      }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError("Passwords do not match.")
    }
    if (password.length < 6) {
      return setError("Password must be at least 6 characters.")
    }

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      console.error('Error updating password:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 font-sans overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border border-white/20 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-700 ease-out">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-indigo-600 font-bold tracking-wider text-xs uppercase mb-2">
            <Shield className="w-4 h-4" />
            Security Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Create New Password</h1>
          <p className="text-slate-400 text-sm font-bold tracking-tight px-4">
            Pick a strong password that you haven't used before.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Password Updated</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Your password has been changed successfully. Redirecting you to login...
            </p>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-progress origin-left" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || error && error.includes("expired")}
              className="w-full relative group overflow-hidden rounded-2xl bg-slate-900 px-4 py-4 font-black text-white shadow-xl transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-xs"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Changing Password...' : 'Update Password'}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 transition-all group-hover:h-full" />
            </button>

            {error && error.includes("expired") && (
               <Link to="/forgot-password" title="Request new link" className="block text-center text-xs font-black text-indigo-600 uppercase tracking-widest mt-4 hover:underline transition-all">
                  Request another link
               </Link>
            )}
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPasswordPage
