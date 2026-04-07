import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "ttk-auth",
    storage: {
      getItem: (key: string) => {
        if (typeof window === "undefined") return null
        try {
          return window.localStorage.getItem(key)
        } catch {
          return getCookie(key)
        }
      },
      setItem: (key: string, value: string) => {
        if (typeof window === "undefined") return
        try {
          window.localStorage.setItem(key, value)
        } catch {
          setCookie(key, value)
        }
        setCookie(key, value)
      },
      removeItem: (key: string) => {
        if (typeof window === "undefined") return
        try {
          window.localStorage.removeItem(key)
        } catch {}
        deleteCookie(key)
      },
    },
  },
})

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(new RegExp("(^| )" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=2592000;SameSite=Lax`
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=;path=/;max-age=0`
}
