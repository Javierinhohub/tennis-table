"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"

// ─── Contexte ─────────────────────────────────────────────────────────────────

interface SessionContextType {
  user: User | null
  session: Session | null
  loading: boolean
  refresh: () => Promise<void>
}

const SessionContext = createContext<SessionContextType>({
  user: null,
  session: null,
  loading: true,
  refresh: async () => {},
})

// ─── Hook public ─────────────────────────────────────────────────────────────

export function useSession() {
  return useContext(SessionContext)
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession()
    setSession(data.session)
    setUser(data.session?.user ?? null)
  }, [])

  useEffect(() => {
    // 1. Charger la session immédiatement au montage
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    // 2. Écouter tous les changements d'état auth (login, logout, refresh token, OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // 3. Resynchroniser quand l'onglet reprend le focus (cas du changement d'onglet)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        supabase.auth.getSession().then(({ data }) => {
          setSession(data.session)
          setUser(data.session?.user ?? null)
        })
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <SessionContext.Provider value={{ user, session, loading, refresh }}>
      {children}
    </SessionContext.Provider>
  )
}
