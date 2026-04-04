"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  { href: "/", label: "Accueil" },
  { href: "/revetements", label: "Revêtements" },
  { href: "/bois", label: "Bois" },
  { href: "/autre-materiel", label: "Autre matériel" },
  { href: "/articles", label: "Articles & Tests" },
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
    setMenuOpen(false)
    router.push("/")
  }

  return (
    <>
      <nav style={{ background: "#D97757", position: "sticky", top: 0, zIndex: 100, borderBottom: "1px solid #C4694A" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", height: "56px" }}>

          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg width="28" height="28" viewBox="0 0 200 200"><rect width="200" height="200" rx="14" fill="rgba(255,255,255,0.25)"/><text x="100" y="148" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="82" fill="#ffffff" letterSpacing="-3">TTK</text></svg>
            <span style={{ fontWeight: 700, fontSize: "15px", color: "#fff", letterSpacing: "-0.3px" }}>TT-Kip</span>
            <span style={{ background: "rgba(255,255,255,0.25)", color: "#fff", fontSize: "10px", fontWeight: 600, padding: "2px 6px", borderRadius: "4px" }}>2026</span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "4px", flexWrap: "nowrap", overflow: "hidden" }} className="desktop-nav">
            {CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href}
                style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 500, padding: "6px 8px", borderRadius: "6px", whiteSpace: "nowrap" as const, transition: "background 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}
              >
                {cat.label}
              </Link>
            ))}
            {role === "admin" && (
              <Link href="/admin" style={{ color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600, padding: "6px 10px", borderRadius: "6px", background: "rgba(255,255,255,0.2)" }}>Admin</Link>
            )}
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginLeft: "8px" }}>
                <a href="/profil" style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", textDecoration: "none", fontWeight: 500 }}>{pseudo}</a>
                <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Déconnexion</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "6px", marginLeft: "8px" }}>
                <Link href="/auth/login" style={{ color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 500 }}>Connexion</Link>
                <Link href="/auth/signup" style={{ background: "#fff", color: "#D97757", textDecoration: "none", borderRadius: "8px", padding: "6px 10px", fontSize: "12px", fontWeight: 700 }}>Inscription</Link>
              </div>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="hamburger"
            style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "8px", padding: "8px", cursor: "pointer", display: "none", flexDirection: "column" as const, gap: "4px" }}>
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", borderRadius: "2px", opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
            <span style={{ display: "block", width: "20px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>

        {menuOpen && (
          <div style={{ background: "#C4694A", borderTop: "1px solid rgba(255,255,255,0.2)", padding: "0.5rem 1rem 1rem" }}>
            {CATEGORIES.map(cat => (
              <Link key={cat.href} href={cat.href} onClick={() => setMenuOpen(false)}
                style={{ display: "block", color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 500, padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                {cat.label}
              </Link>
            ))}
            {role === "admin" && (
              <Link href="/admin" onClick={() => setMenuOpen(false)} style={{ display: "block", color: "#fff", textDecoration: "none", fontSize: "15px", fontWeight: 600, padding: "10px 8px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                Administration
              </Link>
            )}
            <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {user ? (
                <>
                  <a href="/profil" onClick={() => setMenuOpen(false)} style={{ color: "rgba(255,255,255,0.9)", fontSize: "14px", textDecoration: "none", fontWeight: 500, padding: "4px 8px" }}>Mon profil ({pseudo})</a>
                  <button onClick={handleLogout} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif", textAlign: "left" as const }}>Déconnexion</button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ display: "block", color: "#fff", textDecoration: "none", border: "1px solid rgba(255,255,255,0.4)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontWeight: 500, textAlign: "center" as const }}>Connexion</Link>
                  <Link href="/auth/signup" onClick={() => setMenuOpen(false)} style={{ display: "block", background: "#fff", color: "#D97757", textDecoration: "none", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", fontWeight: 700, textAlign: "center" as const }}>Inscription</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}