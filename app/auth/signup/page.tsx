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

const REGIONS = ["Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Bretagne","Centre-Val de Loire","Corse","Grand Est","Hauts-de-France","Île-de-France","Normandie","Nouvelle-Aquitaine","Occitanie","Pays de la Loire","Provence-Alpes-Côte d'Azur","Guadeloupe","Martinique","Guyane","La Réunion","Mayotte","Autre"]

export default function SignUp() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [pseudo, setPseudo] = useState("")
  const [classement, setClassement] = useState("")
  const [region, setRegion] = useState("")
  const [club, setClub] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  function validateStep1() {
    const pseudoErr = validatePseudo(pseudo)
    if (pseudoErr) { setError(pseudoErr); return false }
    if (!validateEmail(email)) { setError("Email invalide."); return false }
    const passErr = validatePassword(password)
    if (passErr) { setError(passErr); return false }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return false }
    return true
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!validateStep1()) return
    const { data: existingPseudo } = await supabase.from("utilisateurs").select("id").eq("pseudo", pseudo).single()
    if (existingPseudo) { setError("Ce pseudo est déjà utilisé."); return }
    setStep(2)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { pseudo } }
    })

    if (error) {
      setError(error.message === "User already registered" ? "Un compte existe déjà avec cet email." : error.message)
      setLoading(false)
      return
    }

    if (data.user) {
      await supabase.from("utilisateurs").insert({
        id: data.user.id,
        pseudo,
        role: "user",
        classement: classement || null,
        region: region || null,
        club: club || null,
      })
    }
    setMessage("Compte créé ! Vérifiez votre email pour confirmer votre inscription.")
    setLoading(false)
  }

  return (
    <main style={{ maxWidth: "460px", margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem" }}>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "1.5rem" }}>
          {[1, 2].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: step >= s ? "#D97757" : "var(--border)", color: step >= s ? "#fff" : "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700 }}>{s}</div>
              <span style={{ fontSize: "12px", color: step >= s ? "#D97757" : "var(--text-muted)", fontWeight: step >= s ? 600 : 400 }}>{s === 1 ? "Compte" : "Profil"}</span>
              {s < 2 && <div style={{ width: "30px", height: "1px", background: step > s ? "#D97757" : "var(--border)" }} />}
            </div>
          ))}
        </div>

        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{step === 1 ? "Créer un compte" : "Votre profil"}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1.5rem" }}>{step === 1 ? "Rejoignez la communauté TT-Kip" : "Ces informations sont optionnelles"}</p>

        {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px", marginBottom: "1rem", fontSize: "13px", fontWeight: 500 }}>{message}</div>}
        {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "12px", marginBottom: "1rem", fontSize: "13px" }}>{error}</div>}

        {step === 1 && (
          <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={labelStyle}>Pseudo</label><input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)} required style={inputStyle} placeholder="3-20 caractères" /></div>
            <div><label style={labelStyle}>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} placeholder="vous@exemple.fr" /></div>
            <div><label style={labelStyle}>Mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} placeholder="8 car. min, 1 majuscule, 1 chiffre" /></div>
            <div><label style={labelStyle}>Confirmer le mot de passe</label><input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={inputStyle} placeholder="Répétez le mot de passe" /></div>
            <button type="submit" style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              Continuer
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div><label style={labelStyle}>Classement FFTT</label><input type="text" value={classement} onChange={e => setClassement(e.target.value)} style={inputStyle} placeholder="Ex: 500, N3..." /></div>
              <div><label style={labelStyle}>Club</label><input type="text" value={club} onChange={e => setClub(e.target.value)} style={inputStyle} placeholder="Nom de votre club" /></div>
            </div>
            <div>
              <label style={labelStyle}>Région</label>
              <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
                <option value="">Choisir votre région...</option>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ background: "var(--bg)", borderRadius: "8px", padding: "12px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5 }}>
              Vous pourrez renseigner votre bois et vos revêtements depuis votre profil après inscription.
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => setStep(1)} style={{ background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 500, cursor: "pointer", flex: 1, fontFamily: "Poppins, sans-serif" }}>
                Retour
              </button>
              <button type="submit" disabled={loading} style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", flex: 2, opacity: loading ? 0.7 : 1, fontFamily: "Poppins, sans-serif" }}>
                {loading ? "Création..." : "Créer mon compte"}
              </button>
            </div>
          </form>
        )}

        <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "1rem" }}>
          Déjà un compte ? <Link href="/auth/login" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Se connecter</Link>
        </p>
      </div>
    </main>
  )
}