"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/app/components/SessionProvider"

const CATEGORIES = [
  { href: "/", label: "Accueil", icon: "⌂" },
  { href: "/revetements", label: "Revêtements", icon: "R" },
  { href: "/bois", label: "Bois", icon: "B" },
  { href: "/autre-materiel", label: "Autre matériel", icon: "+" },
  { href: "/joueurs", label: "Joueurs pro", icon: "J" },
  { href: "/articles", label: "Articles & Tests", icon: "A" },
  { href: "/forum", label: "Forum", icon: "F" },
  { href: "/a-propos", label: "À propos", icon: "?" },
  { href: "/contact", label: "Contact", icon: "✉" },
]

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState("")
  const [role, setRole] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setOpen(false)
  }, [pathname])

const { user } = useSession()

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

  function handleLogout() {
    setUser(null)
    setPseudo("")
    setRole("")
    setOpen(false)
    supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      <div style={{ position: "fixed", top: "16px", left: "16px", zIndex: 200 }}>
        <button onClick={() => setOpen(!open)}
          style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#D97757", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px", boxShadow: "0 2px 12px rgba(217,119,87,0.4)" }}>
          <span style={{ display: "block", width: "18px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s, opacity 0.2s", transform: open ? "rotate(45deg) translate(5px, 5px)" : "none" }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#fff", borderRadius: "2px", transition: "opacity 0.2s", opacity: open ? 0 : 1 }} />
          <span style={{ display: "block", width: "18px", height: "2px", background: "#fff", borderRadius: "2px", transition: "transform 0.2s", transform: open ? "rotate(-45deg) translate(5px, -5px)" : "none" }} />
        </button>
      </div>

      {open && (
        <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 150 }} />
      )}

      <div style={{
        position: "fixed", top: 0, left: 0, height: "100vh", width: "260px",
        background: "#fff", borderRight: "1px solid var(--border)",
        zIndex: 160, transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
        boxShadow: open ? "4px 0 20px rgba(0,0,0,0.1)" : "none"
      }}>

        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="32" height="32" viewBox="0 0 200 200"><rect width="200" height="200" rx="14" fill="#D97757"/><text x="100" y="148" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="82" fill="#ffffff" letterSpacing="-3">TTK</text></svg>
          <div>
            <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)", letterSpacing: "-0.3px", lineHeight: 1.2 }}>TT-Kip</p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 500 }}>LARC 2026</p>
          </div>
        </div>

        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {CATEGORIES.map(cat => {
            const isActive = pathname === cat.href || (cat.href !== "/" && pathname.startsWith(cat.href))
            return (
              <Link key={cat.href} href={cat.href}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", marginBottom: "2px",
                  background: isActive ? "#FFF0EB" : "transparent",
                  color: isActive ? "#D97757" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: "14px",
                  transition: "background 0.15s, color 0.15s"
                }}>
                <span style={{ width: "28px", height: "28px", borderRadius: "6px", background: isActive ? "#D97757" : "var(--bg)", color: isActive ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                  {cat.icon}
                </span>
                {cat.label}
              </Link>
            )
          })}

          {role === "admin" && (
            <Link href="/admin"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", marginTop: "8px", background: "var(--accent-light)", color: "var(--accent)", fontWeight: 600, fontSize: "14px" }}>
              <span style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>⚙</span>
              Administration
            </Link>
          )}
        </nav>

        <div style={{ padding: "16px", borderTop: "1px solid var(--border)" }}>
          {user ? (
            <div>
              <a href="/profil" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", marginBottom: "8px", background: "var(--bg)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {pseudo?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Mon profil</p>
                </div>
              </a>
              <button onClick={handleLogout} style={{ width: "100%", background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Déconnexion
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/auth/login" style={{ display: "block", textAlign: "center", color: "var(--text)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 500, background: "var(--bg)" }}>
                Connexion
              </Link>
              <Link href="/auth/signup" style={{ display: "block", textAlign: "center", background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 700 }}>
                Inscription
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}