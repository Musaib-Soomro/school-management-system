import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // ─── Auth state listener ──────────────────────────────────────────────────
  // ONLY synchronous state updates here. Never call supabase.from() inside
  // onAuthStateChange — the Supabase client is mid-session-transition when
  // the callback fires. Any DB call made here queues behind the in-progress
  // token refresh, hanging forever on cross-tab TOKEN_REFRESHED events.
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          setProfile(null)
          setLoading(false)
        }
        // When session.user exists, the profile useEffect below takes over.
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (uid) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error.message)
      setProfile(null)
    } else {
      setProfile(data)
    }
    setLoading(false)
  }

  // ─── Profile fetch ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return
    fetchProfile(user.id)
  }, [user?.id])

  const value = {
    user,
    profile,
    loading,
    signOut: () => supabase.auth.signOut(),
    refreshProfile: () => user?.id && fetchProfile(user.id)
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
