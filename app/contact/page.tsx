"use client"

import { useState } from "react"

export default function ContactPage() {
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [sujet, setSujet] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("https://formspree.io/f/VOTRE_ID", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ nom, email, sujet, message }),
    })
    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setNom(""); setEmail(""); setSujet(""); setMessage("")
    } else {
      setError("Erreur lors de l'envoi. Réessayez dans quelques instants.")
    }
  }

  const input: React.CSSProperties = {
    width: "100%", padding: "10px 14px", fontSize: "14px",
    border: "1px solid var(--border)", borderRadius: "8px",
    fontFamily: "Poppins, sans-serif", background: "#fff",
    color: "var(--text)", outline: "none", boxSizing: "border-box",
  }

  if (success) return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ background: "#ECFDF5", border: "1px solid #10B981", borderRadius: "12px", padding: "2.5rem", textAlign: "center" }}>
        <p style={{ fontSize: "40px", marginBottom: "12px" }}>✅</p>
        <p style={{ fontWeight: 700, fontSize: "17px", color: "#065F46", marginBottom: "8px" }}>Message envoyé !</p>
        <p style={{ color: "#047857", fontSize: "14px", marginBottom: "1.5rem" }}>Nous vous répondrons dans les plus brefs délais.</p>
        <button onClick={() => setSuccess(false)} style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 22px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
          Envoyer un autre message
        </button>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Contact</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>
        Une question, une suggestion ou envie de contribuer ? Écrivez-nous !
      </p>
      <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Nom *</label>
            <input value={nom} onChange={e => setNom(e.target.value)} required placeholder="Votre nom" style={input} />
          </div>
          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Email *</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="votre@email.com" style={input} />
          </div>
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Sujet</label>
          <input value={sujet} onChange={e => setSujet(e.target.value)} placeholder="Objet de votre message" style={input} />
        </div>
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Message *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={6}
            placeholder="Votre message..."
            style={{ ...input, resize: "vertical", lineHeight: 1.6 }} />
        </div>
        {error && (
          <div style={{ background: "#FEF2F2", border: "1px solid #EF4444", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "#991B1B" }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading}
          style={{ background: loading ? "#ccc" : "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
          {loading ? "Envoi en cours..." : "Envoyer le message →"}
        </button>
      </form>
      <p style={{ marginTop: "1.2rem", fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>
        💬 Retrouvez-nous aussi sur le <a href="/forum" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>forum TT-Kip</a>
      </p>
    </main>
  )
}
