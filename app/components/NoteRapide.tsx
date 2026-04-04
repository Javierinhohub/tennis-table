"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function NoteRapide({ produitId, user }: { produitId: string, user: any }) {
  const [hover, setHover] = useState(0)
  const [note, setNote] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [open, setOpen] = useState(false)

  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]

  async function soumettre(n: number) {
    if (!user) { window.location.href = "/auth/login"; return }
    setNote(n)
    setLoading(true)
    setError("")
    const { error: err } = await supabase.from("avis").insert({
      produit_id: produitId,
      user_id: user.id,
      note: n,
      titre: "",
      contenu: "Note rapide.",
      valide: false
    })
    setLoading(false)
    if (err) {
      if (err.message.includes("un_avis_par_produit")) {
        setError("Déjà noté")
      } else {
        setError("Erreur")
      }
    } else {
      setDone(true)
    }
    setTimeout(() => setOpen(false), 1500)
  }

  if (done) return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: "14px", color: i <= note ? "#F59E0B" : "#E5E7EB" }}>★</span>)}
    </div>
  )

  if (error) return <span style={{ fontSize: "11px", color: "#EF4444", fontWeight: 500 }}>{error}</span>

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: open ? "#FFF0EB" : "var(--bg)", border: "1px solid " + (open ? "#D97757" : "var(--border)"), borderRadius: "6px", padding: "4px 10px", fontSize: "12px", fontWeight: 500, color: open ? "#D97757" : "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif", whiteSpace: "nowrap" as const }}>
        ★ Noter
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.1)", minWidth: "220px" }}
          onClick={e => e.stopPropagation()}
        >
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "10px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Votre note globale</p>
          <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
            {[1,2,3,4,5].map(i => (
              <button key={i} type="button"
                onClick={() => soumettre(i)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                disabled={loading}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "28px", padding: "2px", transition: "transform 0.1s", transform: (hover || note) >= i ? "scale(1.2)" : "scale(1)", color: (hover || note) >= i ? COLORS[hover || note] : "#D1D5DB" }}>
                ★
              </button>
            ))}
          </div>
          {hover > 0 && <p style={{ fontSize: "12px", fontWeight: 600, color: COLORS[hover], textAlign: "center" as const }}>{LABELS[hover]}</p>}
          <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", textAlign: "center" as const }}>
            Pour un avis détaillé, <a href={"/revetements/"} style={{ color: "#D97757", textDecoration: "none" }}>ouvrez la fiche</a>
          </p>
          {loading && <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" as const, marginTop: "6px" }}>Envoi...</p>}
        </div>
      )}
    </div>
  )
}