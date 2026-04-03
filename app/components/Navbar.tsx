"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  { href: "/", label: "Accueil" },
  { href: "/revetements", label: "Revêtements" },
  { href: "/bois", label: "Bois" },
  { href: "/balles", label: "Balles" },
  { href: "/colles", label: "Colles" },
  { href: "/chaussures", label: "Chaussures" },
  { href: "/forum", label: "Forum" },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState("")
  const [role, setRole] = useState("")
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profil } = await supabase.from("utilisateurs").select("pseudo, role").eq("id", data.user.id).single()
        setPseudo(profil?.pseudo || "")
        setRole(profil?.role || "")
      }
    })
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        const { data: profil } = await supabase.from("utilisateurs").select("pseudo, role").eq("id", session.user.id).single()
        setPseudo(profil?.pseudo || "")
        setRole(profil?.role || "")
      } else { setPseudo(""); setRole("") }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav style={{ background: "#D97757", borderBottom: "1px solid #C4694A", position: "sticky", top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: "60px" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="32" height="32" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" rx="14" fill="#1A56DB"/><text x="100" y="148" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="82" fill="#ffffff" letterSpacing="-3">TTK</text></svg>
            <span style={{ fontWeight: 700, fontSize: "16px", color: "#fff", letterSpacing: "-0.3px" }}>TT-Kip</span>
            <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.5px" }}>2026</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href} style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 500, padding: "6px 10px", borderRadius: "6px", transition: "background 0.15s, color 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "#fff" }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#fff" }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {role === "admin" && (
              <Link href="/admin" style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, padding: "6px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.2)" }}>
                Admin
              </Link>
            )}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <a href="/profil" style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", textDecoration: "none", fontWeight: 500 }}>{pseudo}</a>
                <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 500 }}>
                  Déconnexion
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "6px" }}>
                <Link href="/auth/login" style={{ color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 500, background: "rgba(255,255,255,0.1)" }}>
                  Connexion
                </Link>
                <Link href="/auth/signup" style={{ background: "#fff", color: "#D97757", textDecoration: "none", borderRadius: "8px", padding: "6px 12px", fontSize: "13px", fontWeight: 700 }}>
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}