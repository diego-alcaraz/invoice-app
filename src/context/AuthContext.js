import React, { createContext, useContext, useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider ({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // On web, pick up OAuth tokens from URL hash after redirect
    if (Platform.OS === 'web' && window.location.hash) {
      const params = new URLSearchParams(window.location.hash.substring(1))
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      if (accessToken) {
        supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken }).then(({ data: { session: s } }) => {
          setSession(s)
          setUser(s?.user ?? null)
          if (s?.user) fetchProfile(s.user.id)
          setLoading(false)
          // Clean up the URL
          window.history.replaceState(null, '', window.location.pathname)
        })
        return
      }
    }

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) fetchProfile(s.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setUser(s?.user ?? null)
      if (s?.user) fetchProfile(s.user.id)
      else setProfile(null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (uid) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single()
    setProfile(data)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, fetchProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
