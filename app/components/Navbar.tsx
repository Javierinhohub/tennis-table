"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useSession } from "@/app/components/SessionProvider"
import LanguageToggle from "@/app/components/LanguageToggle"
import { useT } from "@/lib/useT"

export default function Navbar() {
  const { user } = useSession()
  const t = useT()
  const [pseudo, setPseudo] = useState("")
  const [role, setRole] = useState("")
  const [open, setOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const userMenuRef = useRef<HTMLDivElement>(null)

  const CATEGORIES = [
    { href: "/", label: t("nav", "home"), icon: "⌂" },
    { href: "/revetements", label: t("nav", "rubbers"), icon: "R" },
    { href: "/bois", label: t("nav", "blades"), icon: "B" },
    { href: "/autre-materiel", label: t("nav", "otherGear"), icon: "+" },
    { href: "/joueurs", label: t("nav", "proPlayers"), icon: "J" },
    { href: "/articles", label: t("nav", "articles"), icon: "A" },
    { href: "/forum", label: t("nav", "forum"), icon: "F" },
    { href: "/a-propos", label: t("nav", "about"), icon: "?" },
    { href: "/contact", label: t("nav", "contact"), icon: "✉" },
  ]

  // Fermer les menus au changement de page
  useEffect(() => {
    setOpen(false)
    setUserMenuOpen(false)
  }, [pathname])

  // Fermer le menu utilisateur si clic en dehors
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [userMenuOpen])

  // Charger le pseudo, le rôle et les messages non lus quand user change
  useEffect(() => {
    if (user) {
      supabase
        .from("utilisateurs")
        .select("pseudo, role")
        .eq("id", user.id)
        .single()
        .then(({ data: profil }) => {
          setPseudo(profil?.pseudo || "")
          setRole(profil?.role || "")
        })
      fetchUnread(user.id)
    } else {
      setPseudo("")
      setRole("")
      setUnreadCount(0)
    }
  }, [user])

  async function fetchUnread(userId: string) {
    const { count } = await supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("lu", false)
      .neq("sender_id", userId)
      .in("conversation_id",
        (await supabase
          .from("conversations")
          .select("id")
          .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        ).data?.map((c: any) => c.id) || []
      )
    setUnreadCount(count || 0)
  }

  function handleLogout() {
    setPseudo("")
    setRole("")
    setOpen(false)
    setUserMenuOpen(false)
    supabase.auth.signOut()
    router.push("/")
  }

  return (
    <>
      {/* ── Bouton langue FR/EN ─────────────────────────────────────── */}
      <div style={{ position: "fixed", top: "12px", right: "62px", zIndex: 200 }}>
        <LanguageToggle />
      </div>

      {/* ── Avatar utilisateur en haut à droite ─────────────────────── */}
      <div ref={userMenuRef} style={{ position: "fixed", top: "12px", right: "12px", zIndex: 200 }}>
        {user ? (
          <button
            onClick={() => setUserMenuOpen(v => !v)}
            style={{
              width: "40px", height: "40px", borderRadius: "50%",
              background: "#D97757", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", fontWeight: 700, color: "#fff",
              boxShadow: "0 2px 8px rgba(217,119,87,0.35)",
              position: "relative", fontFamily: "Poppins, sans-serif",
            }}
            aria-label="Menu utilisateur"
          >
            {pseudo?.[0]?.toUpperCase() || "?"}
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: "-2px", right: "-2px",
                background: "#EF4444", color: "#fff", borderRadius: "50%",
                width: "16px", height: "16px", fontSize: "9px", fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid #fff",
              }}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        ) : (
          <Link href="/auth/login" style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "40px", height: "40px", borderRadius: "50%",
            background: "var(--bg)", border: "1px solid var(--border)",
            color: "var(--text-muted)", textDecoration: "none",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }} aria-label="Se connecter">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </Link>
        )}

        {/* Dropdown */}
        {userMenuOpen && user && (
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: "200px", overflow: "hidden", zIndex: 210,
          }}>
            {/* En-tête pseudo */}
            <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                {pseudo?.[0]?.toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", margin: 0 }}>{pseudo}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0 }}>{t("nav", "connected")}</p>
              </div>
            </div>

            {/* Liens */}
            <div style={{ padding: "6px" }}>
              <Link href="/messages" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", textDecoration: "none", color: "var(--text)", fontSize: "13px", fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <span style={{ width: "18px", textAlign: "center" as const, color: "var(--text-muted)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                </span>
                {t("nav", "messages")}
                {unreadCount > 0 && (
                  <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: "10px", padding: "1px 7px", fontSize: "10px", fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
              </Link>

              <Link href="/profil" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", textDecoration: "none", color: "var(--text)", fontSize: "13px", fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <span style={{ width: "18px", textAlign: "center" as const, color: "var(--text-muted)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </span>
                {t("nav", "settings")}
              </Link>

              {role === "admin" && (
                <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", textDecoration: "none", color: "#D97757", fontSize: "13px", fontWeight: 600 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#FFF0EB"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                  <span style={{ width: "18px", textAlign: "center" as const }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
                  </span>
                  {t("nav", "admin")}
                </Link>
              )}
            </div>

            {/* Déconnexion */}
            <div style={{ padding: "6px", borderTop: "1px solid var(--border)" }}>
              <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", padding: "9px 10px", borderRadius: "8px", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif", textAlign: "left" as const }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}>
                <span style={{ width: "18px", textAlign: "center" as const, color: "var(--text-muted)" }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  </span>
                {t("nav", "logout")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Hamburger en haut à gauche ──────────────────────────────── */}
      <div style={{ position: "fixed", top: "12px", left: "12px", zIndex: 200 }}>
        <button onClick={() => setOpen(!open)}
          style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#D97757", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px", boxShadow: "0 2px 8px rgba(217,119,87,0.35)", opacity: open ? 1 : 0.85 }}>
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

          {user && (
            <Link href="/messages"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", marginBottom: "2px", marginTop: "4px",
                background: pathname.startsWith("/messages") ? "#FFF0EB" : "transparent",
                color: pathname.startsWith("/messages") ? "#D97757" : "var(--text-muted)",
                fontWeight: pathname.startsWith("/messages") ? 600 : 400,
                fontSize: "14px",
              }}>
              <span style={{ position: "relative", width: "28px", height: "28px", borderRadius: "6px", background: pathname.startsWith("/messages") ? "#D97757" : "var(--bg)", color: pathname.startsWith("/messages") ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>
                💬
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "#EF4444", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", fontSize: "9px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff" }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {t("nav", "messages")}
              {unreadCount > 0 && (
                <span style={{ marginLeft: "auto", background: "#EF4444", color: "#fff", borderRadius: "10px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {role === "admin" && (
            <Link href="/admin"
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", textDecoration: "none", marginTop: "8px", background: "var(--accent-light)", color: "var(--accent)", fontWeight: 600, fontSize: "14px" }}>
              <span style={{ width: "28px", height: "28px", borderRadius: "6px", background: "var(--accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>⚙</span>
              {t("nav", "admin")}
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
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t("nav", "profile")}</p>
                </div>
              </a>
              <button onClick={handleLogout} style={{ width: "100%", background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                {t("nav", "logout")}
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <Link href="/auth/login" style={{ display: "block", textAlign: "center", color: "var(--text)", textDecoration: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 500, background: "var(--bg)" }}>
                {t("nav", "login")}
              </Link>
              <Link href="/auth/signup" style={{ display: "block", textAlign: "center", background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 700 }}>
                {t("nav", "signup")}
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
