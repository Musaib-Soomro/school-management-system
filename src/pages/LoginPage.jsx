import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { GraduationCap, Users, Calendar, CreditCard, BookOpen, Eye, EyeOff } from 'lucide-react'

// Islamic 8-pointed star lattice — used as atmospheric background texture
const GeometricPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <defs>
      <pattern id="geo-lattice" width="80" height="80" patternUnits="userSpaceOnUse">
        {/* Outer 8-pointed star — kept very faint so text reads clearly */}
        <polygon
          points="40,4 48,32 76,40 48,48 40,76 32,48 4,40 32,32"
          fill="none" stroke="white" strokeWidth="0.6" opacity="0.12"
        />
        {/* Inner rotated square */}
        <rect
          x="29" y="29" width="22" height="22"
          fill="none" stroke="white" strokeWidth="0.5" opacity="0.09"
          transform="rotate(45 40 40)"
        />
        {/* Center dot */}
        <circle cx="40" cy="40" r="1.2" fill="white" opacity="0.06" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#geo-lattice)" />
  </svg>
)

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()
  const { user, profile, loading: authLoading } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  // Redirect already-authenticated users away from the login page.
  useEffect(() => {
    if (!authLoading && user) {
      if (profile && !profile.is_active) {
        navigate('/pending', { replace: true })
      } else if (profile && profile.is_active) {
        navigate(from === '/login' || from === '/pending' ? '/dashboard' : from, { replace: true })
      }
      // If profile is still null, we wait for it to load.
    }
  }, [authLoading, user, profile, from, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
      })
      if (error) {
        setError(error.message)
      } else {
        setSuccess('Account created! Please wait for administrator approval.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    }

    setLoading(false)
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-indigo-950">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
      </div>
    )
  }

  const pillars = [
    { icon: Users, label: 'Students' },
    { icon: BookOpen, label: 'Classes' },
    { icon: Calendar, label: 'Attendance' },
    { icon: CreditCard, label: 'Fees' },
  ]

  return (
    <div className="flex min-h-screen w-full font-sans">

      {/* ── Left Panel: Brand ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[58%] relative flex-col justify-between overflow-hidden bg-indigo-950 p-14">

        {/* Layered depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950" />
        <GeometricPattern />

        {/* Warm amber glow — bottom right */}
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-3xl pointer-events-none" />
        {/* Cool indigo glow — top left */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Top: Logotype ── */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/8 border border-white/15 backdrop-blur-sm">
            <GraduationCap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-white/90 font-bold text-sm tracking-[0.2em] uppercase">ISMS</p>
            <p className="text-white/55 text-[10px] tracking-widest uppercase">Islamic School</p>
          </div>
        </div>

        {/* ── Middle: Headline ── */}
        <div className="relative z-10 space-y-10">
          {/* Hadith quote — dark scrim behind for guaranteed contrast */}
          <div className="relative border-l border-amber-400/50 pl-6 space-y-2">
            <div className="absolute -inset-4 -inset-x-6 bg-indigo-950/40 rounded-2xl blur-sm -z-10" />
            <p className="font-display text-3xl text-amber-200/90 italic leading-relaxed">
              "طَلَبُ الْعِلْمِ فَرِيضَةٌ"
            </p>
            <p className="text-white/75 text-xs tracking-wider">
              Seeking knowledge is an obligation upon every Muslim.
            </p>
            <p className="text-white/50 text-[10px] tracking-widest uppercase">— Prophet Muhammad ﷺ</p>
          </div>

          {/* Main heading */}
          <div>
            <h1 className="font-display text-[3.5rem] leading-[1.1] text-white font-semibold">
              School<br />
              <span className="text-amber-300">Management</span><br />
              System
            </h1>
            <p className="mt-5 text-white/65 text-sm leading-relaxed max-w-sm">
              A complete administrative platform for managing students,
              attendance, fees, and daily school operations.
            </p>
          </div>
        </div>

        {/* ── Bottom: Feature pillars ── */}
        <div className="relative z-10">
          <div className="h-px bg-gradient-to-r from-white/0 via-white/10 to-white/0 mb-8" />
          <div className="grid grid-cols-4 gap-3">
            {pillars.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2.5 p-3.5 rounded-2xl bg-white/5 border border-white/8 backdrop-blur-sm"
              >
                <Icon className="w-4 h-4 text-amber-400" />
                <span className="text-white/75 text-[11px] font-medium tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel: Form ─────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-white p-8 lg:p-14">
        <div className="w-full max-w-[380px] space-y-8">

          {/* Mobile-only logo */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 tracking-wider uppercase text-sm">ISMS</span>
          </div>

          {/* Heading */}
          <div>
            <h2 className="font-display text-4xl font-semibold text-slate-900 leading-tight">
              {isSignUp ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              {isSignUp
                ? 'Register to request access to the system.'
                : 'Sign in to your school management portal.'}
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-sm text-emerald-700">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Abdullah Omar"
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-300 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@school.edu"
                className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-300 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-300 text-sm font-medium focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60 text-white font-bold text-sm tracking-wide rounded-xl shadow-lg shadow-indigo-100 transition-all duration-150"
            >
              {loading
                ? (isSignUp ? 'Creating account…' : 'Signing in…')
                : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {/* Toggle */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-sm">
            <span className="text-slate-400">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null) }}
              className="font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          <p className="text-center text-[11px] text-slate-300 tracking-wider uppercase select-none">
            Secured by Supabase Auth
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
