"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function Etoiles({ note, onChange, readonly = false }: { note: number, onChange?: (n: number) => void, readonly?: boolean }) {
  const [hover, setHover] = useState(0)
  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]

  if (readonly) return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ fontSize: "16px", color: i <= note ? "#F59E0B" : "#E5E7EB" }}>★</span>
      ))}
    </div>
  )

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} type="button"
            onClick={() => onChange && onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", fontSize: "32px", transition: "transform 0.1s", transform: (hover || note) >= i ? "scale(1.15)" : "scale(1)",
              color: (hover || note) >= i ? (COLORS[hover || note]) : "#D1D5DB"
            }}>
            ★
          </button>
        ))}
      </div>
      {(hover > 0 || note > 0) && (
        <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS[hover || note], marginBottom: "4px" }}>
          {LABELS[hover || note]}
        </p>
      )}
    </div>
  )
}

export default function AvisSection({ produitId }: { produitId: string }) {
  const [avis, setAvis] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [note, setNote] = useState(0)
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")
  const [styleJeu, setStyleJeu] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [moyenneNote, setMoyenneNote] = useState(0)

  useEffect(() => {
    fetchAvis()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchAvis() {
    const { data } = await supabase
      .from("avis")
      .select("*, utilisateurs(pseudo)")
      .eq("produit_id", produitId)
      .eq("valide", true)
      .order("cree_le", { ascending: false })
    setAvis(data || [])
    if (data && data.length > 0) {
      setMoyenneNote(Math.round(data.reduce((s, a) => s + a.note, 0) / data.length * 10) / 10)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (note === 0) { setError("Veuillez sélectionner une note."); return }
    if (contenu.length < 20) { setError("L'avis doit contenir au moins 20 caractères."); return }
    setLoading(true)
    const { error: err } = await supabase.from("avis").insert({
      produit_id: produitId, user_id: user.id,
      note, titre, contenu, style_jeu: styleJeu, valide: false
    })
    if (err) {
      setError(err.message.includes("un_avis_par_produit") ? "Vous avez déjà soumis un avis pour ce revêtement." : "Une erreur est survenue.")
    } else {
      setMessage("✅ Votre avis a été soumis et sera visible après modération.")
      setTitre(""); setContenu(""); setStyleJeu(""); setNote(0); setShowForm(false)
    }
    setLoading(false)
  }

  const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const, transition: "border-color 0.15s" }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const STYLES_JEU = ["Attaquant", "Défenseur", "Tout-jeu", "Débutant", "Intermédiaire", "Avancé"]

  return (
    <div style={{ marginTop: "2rem" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>
            Avis ({avis.length})
          </h2>
          {avis.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#D97757" }}>{moyenneNote}</span>
              <div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{ fontSize: "14px", color: i <= Math.round(moyenneNote) ? "#F59E0B" : "#E5E7EB" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{avis.length} avis</p>
              </div>
            </div>
          )}
        </div>
        {user && !showForm && (
          <button onClick={() => setShowForm(true)}
            style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Laisser un avis
          </button>
        )}
      </div>

      {message && (
        <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "10px", padding: "14px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>
          {message}
        </div>
      )}

      {showForm && user && (
        <div style={{ background: "#fff", border: "2px solid #D97757", borderRadius: "12px", padding: "24px", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px", color: "var(--text)" }}>Votre avis</h3>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Note *</label>
              <Etoiles note={note} onChange={setNote} />
            </div>
            <div>
              <label style={labelStyle}>Titre de votre avis</label>
              <input type="text" value={titre} onChange={e => setTitre(e.target.value)} style={inputStyle} placeholder="Ex: Excellent revêtement pour l'attaque" />
            </div>
            <div>
              <label style={labelStyle}>Votre avis * <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(20 caractères min.)</span></label>
              <textarea value={contenu} onChange={e => setContenu(e.target.value)} required rows={4}
                style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
                placeholder="Décrivez votre expérience avec ce revêtement, votre niveau, le type de jeu..." />
              <p style={{ fontSize: "11px", color: contenu.length < 20 ? "var(--text-muted)" : "var(--success)", marginTop: "4px", textAlign: "right" as const }}>{contenu.length} / 20 min.</p>
            </div>
            <div>
              <label style={labelStyle}>Votre style de jeu</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
                {STYLES_JEU.map(s => (
                  <button key={s} type="button" onClick={() => setStyleJeu(styleJeu === s ? "" : s)}
                    style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid " + (styleJeu === s ? "#D97757" : "var(--border)"), background: styleJeu === s ? "#FFF0EB" : "#fff", color: styleJeu === s ? "#D97757" : "var(--text-muted)", fontSize: "13px", fontWeight: styleJeu === s ? 600 : 400, cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.15s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => { setShowForm(false); setError("") }}
                style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Annuler
              </button>
              <button type="submit" disabled={loading || note === 0}
                style={{ flex: 2, background: note === 0 ? "var(--border)" : "#D97757", color: note === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: note === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif", transition: "background 0.15s" }}>
                {loading ? "Envoi..." : "Publier mon avis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!user && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", textAlign: "center", marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "12px", fontSize: "14px" }}>Connectez-vous pour laisser un avis</p>
          <Link href="/auth/login" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600 }}>
            Se connecter
          </Link>
        </div>
      )}

      {avis.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun avis pour le moment. Soyez le premier !
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {avis.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {a.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{a.utilisateurs?.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div style={{ display: "flex", flex: "column", alignItems: "flex-end", gap: "4px" }}>
                <Etoiles note={a.note} readonly />
                {a.style_jeu && <span style={{ fontSize: "11px", background: "#FFF0EB", color: "#D97757", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{a.style_jeu}</span>}
              </div>
            </div>
            {a.titre && <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "6px" }}>{a.titre}</p>}
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6 }}>{a.contenu}</p>
          </div>
        ))}
      </div>
    </div>
  )
}