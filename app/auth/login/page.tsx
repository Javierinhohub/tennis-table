"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError("Email ou mot de passe incorrect.")
      setLoading(false)
    } else {
      router.push("/")
      router.refresh()
    }
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const, transition: "border-color 0.15s" }

  return (
    <main style={{ maxWidth: "400px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <svg width="40" height="40" viewBox="0 0 200 200" style={{ marginBottom: "10px" }}><rect width="200" height="200" rx="14" fill="#D97757"/><text x="100" y="148" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="82" fill="#ffffff" letterSpacing="-3">TTK</text></svg>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Connexion</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Bon retour sur TT-Kip !</p>
        </div>
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem", fontSize: "13px" }}>{error}</div>}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus style={inputStyle} placeholder="vous@exemple.fr" />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Mot de passe</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="Votre mot de passe" />
          </div>
          <button type="submit" disabled={loading}
            style={{ background: loading ? "var(--border)" : "#D97757", color: loading ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", marginTop: "4px", transition: "background 0.15s" }}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "1rem" }}>
          Pas encore de compte ? <Link href="/auth/signup" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Créer un compte</Link>
        </p>
      </div>
    </main>
  )
}