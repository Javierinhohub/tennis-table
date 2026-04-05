"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingGoogle, setLoadingGoogle] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { pseudo } }
    })
    if (error) { setError(error.message); setLoading(false) }
    else if (data.user) {
      await supabase.from("utilisateurs").upsert({ id: data.user.id, email, pseudo })
      setSuccess(true)
    }
  }

  async function handleGoogle() {
    setLoadingGoogle(true)
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth/callback" }
    })
  }

  const inputStyle = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "11px 14px", fontSize: "14px", width: "100%",
    fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)",
    boxSizing: "border-box" as const,
  }

  if (success) return (
    <main style={{ maxWidth: "400px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", textAlign: "center" as const }}>
        <p style={{ fontSize: "32px", marginBottom: "12px" }}>✅</p>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px" }}>Compte créé !</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "1.5rem" }}>Vérifiez votre email pour confirmer votre inscription.</p>
        <Link href="/auth/login" style={{ color: "#D97757", fontWeight: 500, textDecoration: "none" }}>Se connecter →</Link>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth: "400px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>
        <div style={{ textAlign: "center" as const, marginBottom: "1.5rem" }}>
          <svg width="40" height="40" viewBox="0 0 200 200" style={{ marginBottom: "10px" }}>
            <rect width="200" height="200" rx="14" fill="#D97757"/>
            <text x="100" y="148" textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="82" fill="#fff" letterSpacing="-3">TTK</text>
          </svg>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Créer un compte</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Rejoignez la communauté TT-Kip</p>
        </div>

        <button onClick={handleGoogle} disabled={loadingGoogle}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif", color: "var(--text)", marginBottom: "1.2rem" }}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {loadingGoogle ? "Connexion..." : "S'inscrire avec Google"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.2rem" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>ou</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border)" }} />
        </div>

        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Pseudo</label>
            <input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)} required style={inputStyle} placeholder="Votre pseudo" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="vous@exemple.fr" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} style={inputStyle} placeholder="6 caractères minimum" />
          </div>
          <button type="submit" disabled={loading}
            style={{ background: loading ? "#ccc" : "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", marginTop: "4px" }}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p style={{ textAlign: "center" as const, fontSize: "13px", color: "var(--text-muted)", marginTop: "1rem" }}>
          Déjà un compte ? <Link href="/auth/login" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Se connecter</Link>
        </p>
      </div>
    </main>
  )
}
