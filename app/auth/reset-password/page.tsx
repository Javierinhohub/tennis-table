"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Supabase détecte automatiquement le token dans l'URL
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true)
    })
  }, [])

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }
    if (password.length < 6) { setError("Le mot de passe doit faire au moins 6 caractères."); return }
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) setError("Erreur : " + error.message)
    else setDone(true)
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }

  return (
    <main style={{ maxWidth: "400px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>
        <div style={{ textAlign: "center" as const, marginBottom: "1.5rem" }}>
          <svg width="40" height="40" viewBox="0 0 200 200" style={{ marginBottom: "10px" }}><rect width="200" height="200" rx="14" fill="#D97757"/><text x="100" y="148" textAnchor="middle" fontFamily="Poppins" fontWeight="700" fontSize="82" fill="#fff" letterSpacing="-3">TTK</text></svg>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Nouveau mot de passe</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Choisis un mot de passe sécurisé</p>
        </div>

        {done ? (
          <div style={{ textAlign: "center" as const }}>
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", borderRadius: "8px", padding: "14px", fontSize: "13px", marginBottom: "1rem" }}>
              ✅ Mot de passe mis à jour avec succès !
            </div>
            <Link href="/auth/login" style={{ color: "#D97757", fontWeight: 500, fontSize: "14px" }}>
              → Se connecter
            </Link>
          </div>
        ) : (
          <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
            {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", fontSize: "13px" }}>{error}</div>}
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Nouveau mot de passe</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="Minimum 6 caractères" />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Confirmer</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} placeholder="Répète le mot de passe" />
            </div>
            <button type="submit" disabled={loading}
              style={{ background: loading ? "#ccc" : "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", marginTop: "4px" }}>
              {loading ? "Mise à jour..." : "Mettre à jour"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
