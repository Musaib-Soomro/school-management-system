import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail, Loader2, CheckCircle2 } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Check if account exists
      let userProfile = null;
      let checkError = null;
      
      try {
        const result = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email.trim())
          .maybeSingle();
        
        userProfile = result.data;
        checkError = result.error;
      } catch (dbError) {
        console.error('Database check failed:', dbError);
        // Fallback: If DB check fails entirely, let Supabase handle it.
      }
      
      // If the check succeeded but no user was found, it's a legitimate "Not Registered" case.
      if (!checkError && !userProfile) {
        throw new Error("We couldn't find an account associated with that email address. Please double-check and try again.");
      }

      // 2. Send reset link
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setSuccess(true)
    } catch (err) {
      console.error('Error requesting password reset:', err)
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
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:text-indigo-700 transition-colors mb-6 group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-2">Reset Password</h1>
          <p className="text-slate-400 text-sm font-bold tracking-tight">
            We'll send you an email with a link to reset your account password.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 rounded-3xl p-8 border border-emerald-100 text-center animate-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Check Your Email</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              We've sent a password reset link to <span className="font-bold text-slate-900">{email}</span>. Please check your inbox and spam folder.
            </p>
            <Link to="/login" className="block w-full py-4 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-1 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-2xl border border-slate-100 bg-slate-50 pl-12 pr-5 py-4 text-slate-800 placeholder-slate-300 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100 font-semibold"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden rounded-2xl bg-slate-900 px-4 py-4 font-black text-white shadow-xl transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30 active:scale-[0.98] disabled:opacity-50 mt-4 uppercase tracking-[0.2em] text-xs"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Sending Request...' : 'Send Reset Link'}
              </span>
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white/20 transition-all group-hover:h-full" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
