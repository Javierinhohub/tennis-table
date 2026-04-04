"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]

export default function NoteModal({ produit, onClose }: { produit: any, onClose: () => void }) {
  const [user, setUser] = useState<any>(null)
  const [hover, setHover] = useState(0)
  const [noteGlobale, setNoteGlobale] = useState(0)
  const [noteVitesse, setNoteVitesse] = useState("")
  const [noteEffet, setNoteEffet] = useState("")
  const [noteControle, setNoteControle] = useState("")
  const [noteDurabilite, setNoteDurabilite] = useState("")
  const [noteDurete, setNoteDurete] = useState("")
  const [noteRejet, setNoteRejet] = useState("")
  const [noteQP, setNoteQP] = useState("")
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [maNote, setMaNote] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchMaNote(data.user.id)
    })
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  async function fetchMaNote(userId: string) {
    const { data } = await supabase.from("notes_revetements").select("*").eq("produit_id", produit.id).eq("user_id", userId).single()
    if (data) {
      setMaNote(data)
      setNoteGlobale(data.note_globale || 0)
      setNoteVitesse(data.note_vitesse ? String(data.note_vitesse) : "")
      setNoteEffet(data.note_effet ? String(data.note_effet) : "")
      setNoteControle(data.note_controle ? String(data.note_controle) : "")
      setNoteDurabilite(data.note_durabilite ? String(data.note_durabilite) : "")
      setNoteDurete(data.note_durete_mousse ? String(data.note_durete_mousse) : "")
      setNoteRejet(data.note_rejet ? String(data.note_rejet) : "")
      setNoteQP(data.note_qualite_prix ? String(data.note_qualite_prix) : "")
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!noteGlobale) return
    setLoading(true)
    const payload = {
      produit_id: produit.id, user_id: user.id,
      note_globale: noteGlobale,
      note_vitesse: noteVitesse ? parseInt(noteVitesse) : null,
      note_effet: noteEffet ? parseInt(noteEffet) : null,
      note_controle: noteControle ? parseInt(noteControle) : null,
      note_durabilite: noteDurabilite ? parseInt(noteDurabilite) : null,
      note_durete_mousse: noteDurete ? parseInt(noteDurete) : null,
      note_rejet: noteRejet ? parseInt(noteRejet) : null,
      note_qualite_prix: noteQP ? parseInt(noteQP) : null,
    }
    if (maNote) {
      await supabase.from("notes_revetements").update(payload).eq("id", maNote.id)
    } else {
      await supabase.from("notes_revetements").insert(payload)
    }
    setLoading(false)
    setSaved(true)
    setTimeout(() => onClose(), 1500)
  }

  function Slider({ label, value, onChange, color }: any) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>{label}</span>
          <span style={{ fontSize: "12px", fontWeight: 700, color: value ? color : "var(--text-muted)" }}>{value ? value + "/10" : "—"}</span>
        </div>
        <input type="range" min="1" max="10" value={value || "5"}
          onChange={e => onChange(e.target.value)}
          onClick={() => { if (!value) onChange("5") }}
          style={{ width: "100%", accentColor: color, cursor: "pointer", height: "4px" }} />
      </div>
    )
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{ background: "#fff", borderRadius: "14px", width: "100%", maxWidth: "460px", maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

        <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#fff", zIndex: 1 }}>
          <div>
            <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "2px" }}>{produit.nom}</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{produit.marques?.nom} · {maNote ? "Modifier ma note" : "Noter ce revêtement"}</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--bg)", border: "none", borderRadius: "8px", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {saved ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>✅</div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "var(--success)" }}>Note enregistrée !</p>
          </div>
        ) : !user ? (
          <div style={{ padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Connectez-vous pour noter ce revêtement</p>
            <a href="/auth/login" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600 }}>Se connecter</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>

            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "10px" }}>Note globale *</p>
              <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "6px" }}>
                {[1,2,3,4,5].map(i => (
                  <button key={i} type="button"
                    onClick={() => setNoteGlobale(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: "36px", padding: "2px", transition: "transform 0.1s", transform: (hover || noteGlobale) >= i ? "scale(1.2)" : "scale(1)", color: (hover || noteGlobale) >= i ? COLORS[hover || noteGlobale] : "#D1D5DB" }}>
                    ★
                  </button>
                ))}
              </div>
              {(hover > 0 || noteGlobale > 0) && (
                <p style={{ textAlign: "center", fontSize: "14px", fontWeight: 600, color: COLORS[hover || noteGlobale] }}>{LABELS[hover || noteGlobale]}</p>
              )}
            </div>

            <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Critères détaillés — optionnels</p>
              <Slider label="Vitesse" value={noteVitesse} onChange={setNoteVitesse} color="#1A56DB" />
              <Slider label="Effet / Spin" value={noteEffet} onChange={setNoteEffet} color="#7C3AED" />
              <Slider label="Contrôle" value={noteControle} onChange={setNoteControle} color="#0E7F4F" />
              <Slider label="Durabilité" value={noteDurabilite} onChange={setNoteDurabilite} color="#D97757" />
              <Slider label="Dureté mousse" value={noteDurete} onChange={setNoteDurete} color="#EF4444" />
              <Slider label="Rejet" value={noteRejet} onChange={setNoteRejet} color="#F59E0B" />
              <Slider label="Qualité / Prix" value={noteQP} onChange={setNoteQP} color="#10B981" />
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={onClose} style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Annuler</button>
              <button type="submit" disabled={loading || noteGlobale === 0}
                style={{ flex: 2, background: noteGlobale === 0 ? "var(--border)" : "#D97757", color: noteGlobale === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: noteGlobale === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", transition: "background 0.15s" }}>
                {loading ? "Enregistrement..." : maNote ? "Mettre à jour" : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}