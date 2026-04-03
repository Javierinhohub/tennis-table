"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function validatePassword(password: string): string | null {
  if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères."
  if (!/[A-Z]/.test(password)) return "Le mot de passe doit contenir au moins une majuscule."
  if (!/[0-9]/.test(password)) return "Le mot de passe doit contenir au moins un chiffre."
  return null
}

function validatePseudo(pseudo: string): string | null {
  if (pseudo.length < 3) return "Le pseudo doit contenir au moins 3 caractères."
  if (pseudo.length > 20) return "Le pseudo ne peut pas dépasser 20 caractères."
  if (!/^[a-zA-Z0-9_-]+$/.test(pseudo)) return "Le pseudo ne peut contenir que des lettres, chiffres, - et _."
  return null
}

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setMessage("")

    const pseudoErr = validatePseudo(pseudo)
    if (pseudoErr) { setError(pseudoErr); return }

    if (!validateEmail(email)) { setError("Email invalide."); return }

    const passErr = validatePassword(password)
    if (passErr) { setError(passErr); return }

    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return }

    setLoading(true)

    const { data: existingPseudo } = await supabase
      .from("utilisateurs")
      .select("id")
      .eq("pseudo", pseudo)
      .single()

    if (existingPseudo) { setError("Ce pseudo est déjà utilisé."); setLoading(false); return }

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { pseudo } }
    })

    if (error) {
      setError(error.message === "User already registered" ? "Un compte existe déjà avec cet email." : error.message)
    } else {
      if (data.user) {
        await supabase.from("utilisateurs").insert({ id: data.user.id, pseudo, role: "user" })
      }
      setMessage("Compte créé ! Vérifiez votre email pour confirmer votre inscription.")
    }
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: "420px", margin: "0 auto", padding: "4rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Créer un compte</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "1.5rem" }}>Rejoignez la communauté TT-Kip</p>

        {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px", marginBottom: "1rem", fontSize: "13px", fontWeight: 500 }}>{message}</div>}
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "12px", marginBottom: "1rem", fontSize: "13px" }}>{error}</div>}

        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div><label style={labelStyle}>Pseudo</label><input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)} required style={inputStyle} placeholder="3-20 caractères, lettres et chiffres" /></div>
          <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="vous@exemple.fr" /></div>
          <div><label style={labelStyle}>Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="8 car. min, 1 majuscule, 1 chiffre" /></div>
          <div><label style={labelStyle}>Confirmer le mot de passe</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} placeholder="Répétez le mot de passe" /></div>
          <button type="submit" disabled={loading} style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1, fontFamily: "Poppins, sans-serif" }}>
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "1rem" }}>
          Déjà un compte ? <Link href="/auth/login" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Se connecter</Link>
        </p>
      </div>
    </main>
  )
}