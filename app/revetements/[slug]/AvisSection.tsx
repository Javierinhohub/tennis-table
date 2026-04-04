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
      {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: "16px", color: i <= note ? "#F59E0B" : "#E5E7EB" }}>★</span>)}
    </div>
  )
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} type="button" onClick={() => onChange && onChange(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", fontSize: "32px", transition: "transform 0.1s", transform: (hover || note) >= i ? "scale(1.15)" : "scale(1)", color: (hover || note) >= i ? COLORS[hover || note] : "#D1D5DB" }}>
            ★
          </button>
        ))}
      </div>
      {(hover > 0 || note > 0) && <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS[hover || note] }}>{LABELS[hover || note]}</p>}
    </div>
  )
}

function SliderNote({ label, value, onChange, color = "#D97757" }: { label: string, value: string, onChange: (v: string) => void, color?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>{label}</label>
        <span style={{ fontSize: "13px", fontWeight: 700, color: value ? color : "var(--text-muted)" }}>{value ? value + "/10" : "Non noté"}</span>
      </div>
      <input type="range" min="1" max="10" value={value || "5"} onChange={e => onChange(e.target.value)}
        onMouseDown={() => !value && onChange("5")}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: "4px" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
        <span>1</span><span>5</span><span>10</span>
      </div>
    </div>
  )
}

function BarreCaracteristique({ label, valueUser, valueMarque, valueTTK }: { label: string, valueUser?: number, valueMarque?: number, valueTTK?: number }) {
  if (!valueUser && !valueMarque && !valueTTK) return null
  return (
    <div style={{ marginBottom: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>{label}</span>
        <div style={{ display: "flex", gap: "8px", fontSize: "11px" }}>
          {valueTTK && <span style={{ color: "#1A56DB", fontWeight: 600 }}>TT-Kip: {valueTTK}/10</span>}
          {valueMarque && <span style={{ color: "#D97757", fontWeight: 600 }}>Marque: {valueMarque}/10</span>}
          {valueUser && <span style={{ color: "#0E7F4F", fontWeight: 600 }}>Users: {valueUser}/10</span>}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {valueTTK && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#1A56DB", width: "42px", fontWeight: 600 }}>TT-Kip</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "6px" }}>
              <div style={{ height: "100%", background: "#1A56DB", borderRadius: "4px", width: (valueTTK / 10 * 100) + "%" }} />
            </div>
          </div>
        )}
        {valueMarque && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#D97757", width: "42px", fontWeight: 600 }}>Marque</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "6px" }}>
              <div style={{ height: "100%", background: "#D97757", borderRadius: "4px", width: (valueMarque / 10 * 100) + "%" }} />
            </div>
          </div>
        )}
        {valueUser && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#0E7F4F", width: "42px", fontWeight: 600 }}>Users</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "6px" }}>
              <div style={{ height: "100%", background: "#0E7F4F", borderRadius: "4px", width: (valueUser / 10 * 100) + "%" }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { BarreCaracteristique }

export default function AvisSection({ produitId, revetement }: { produitId: string, revetement?: any }) {
  const [avis, setAvis] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [note, setNote] = useState(0)
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")
  const [styleJeu, setStyleJeu] = useState("")
  const [noteVitesse, setNoteVitesse] = useState("")
  const [noteEffet, setNoteEffet] = useState("")
  const [noteControle, setNoteControle] = useState("")
  const [noteDurabilite, setNoteDurabilite] = useState("")
  const [noteDurete, setNoteDurete] = useState("")
  const [noteRejet, setNoteRejet] = useState("")
  const [noteQP, setNoteQP] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [moyenneNote, setMoyenneNote] = useState(0)
  const [moyennes, setMoyennes] = useState<any>({})

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
      setMoyenneNote(Math.round(data.reduce((s: number, a: any) => s + a.note, 0) / data.length * 10) / 10)
      const avg = (field: string) => {
        const vals = data.filter((a: any) => a[field]).map((a: any) => a[field])
        return vals.length > 0 ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10 : null
      }
      setMoyennes({
        vitesse: avg("note_vitesse"), effet: avg("note_effet"), controle: avg("note_controle"),
        durabilite: avg("note_durabilite"), durete: avg("note_durete_mousse"),
        rejet: avg("note_rejet"), qualitePrix: avg("note_qualite_prix")
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (note === 0) { setError("Veuillez sélectionner une note globale."); return }
    if (contenu.length < 20) { setError("L'avis doit contenir au moins 20 caractères."); return }
    setLoading(true)
    const { error: err } = await supabase.from("avis").insert({
      produit_id: produitId, user_id: user.id, note, titre, contenu,
      style_jeu: styleJeu, valide: false,
      note_vitesse: noteVitesse ? parseInt(noteVitesse) : null,
      note_effet: noteEffet ? parseInt(noteEffet) : null,
      note_controle: noteControle ? parseInt(noteControle) : null,
      note_durabilite: noteDurabilite ? parseInt(noteDurabilite) : null,
      note_durete_mousse: noteDurete ? parseInt(noteDurete) : null,
      note_rejet: noteRejet ? parseInt(noteRejet) : null,
      note_qualite_prix: noteQP ? parseInt(noteQP) : null,
    })
    if (err) {
      setError(err.message.includes("un_avis_par_produit") ? "Vous avez déjà soumis un avis pour ce revêtement." : "Une erreur est survenue.")
    } else {
      setMessage("✅ Votre avis a été soumis et sera visible après modération.")
      setTitre(""); setContenu(""); setStyleJeu(""); setNote(0)
      setNoteVitesse(""); setNoteEffet(""); setNoteControle(""); setNoteDurabilite(""); setNoteDurete(""); setNoteRejet(""); setNoteQP("")
      setShowForm(false)
    }
    setLoading(false)
  }

  const inputStyle = { background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "6px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const STYLES_JEU = ["Attaquant", "Défenseur", "Tout-jeu", "Débutant", "Intermédiaire", "Avancé"]

  return (
    <div style={{ marginTop: "2rem" }}>



      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Avis ({avis.length})</h2>
          {avis.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#D97757" }}>{moyenneNote}</span>
              <div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ fontSize: "14px", color: i <= Math.round(moyenneNote) ? "#F59E0B" : "#E5E7EB" }}>★</span>)}
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{avis.length} avis</p>
              </div>
            </div>
          )}
        </div>
        {user && !showForm && <button onClick={() => setShowForm(true)} style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Laisser un avis</button>}
      </div>

      {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "10px", padding: "14px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>{message}</div>}

      {showForm && user && (
        <div style={{ background: "#fff", border: "2px solid #D97757", borderRadius: "12px", padding: "24px", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Votre avis</h3>
          {error && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Note globale *</label>
              <Etoiles note={note} onChange={setNote} />
            </div>
            <div>
              <label style={labelStyle}>Titre</label>
              <input type="text" value={titre} onChange={e => setTitre(e.target.value)} style={inputStyle} placeholder="Ex: Excellent pour le top spin" />
            </div>
            <div>
              <label style={labelStyle}>Votre avis * <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" as const }}>(20 car. min.)</span></label>
              <textarea value={contenu} onChange={e => setContenu(e.target.value)} required rows={4} style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }} placeholder="Décrivez votre expérience..." />
              <p style={{ fontSize: "11px", color: contenu.length < 20 ? "var(--text-muted)" : "var(--success)", marginTop: "4px", textAlign: "right" as const }}>{contenu.length} / 20 min.</p>
            </div>
            <div>
              <label style={{ ...labelStyle, marginBottom: "12px" }}>Notes détaillées <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" as const }}>(optionnel)</span></label>
              <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "16px" }}>
                <SliderNote label="Vitesse" value={noteVitesse} onChange={setNoteVitesse} color="#1A56DB" />
                <SliderNote label="Effet / Spin" value={noteEffet} onChange={setNoteEffet} color="#7C3AED" />
                <SliderNote label="Contrôle" value={noteControle} onChange={setNoteControle} color="#0E7F4F" />
                <SliderNote label="Durabilité" value={noteDurabilite} onChange={setNoteDurabilite} color="#D97757" />
                <SliderNote label="Dureté de la mousse" value={noteDurete} onChange={setNoteDurete} color="#EF4444" />
                <SliderNote label="Rejet" value={noteRejet} onChange={setNoteRejet} color="#F59E0B" />
                <SliderNote label="Rapport qualité / prix" value={noteQP} onChange={setNoteQP} color="#10B981" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Style de jeu</label>
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
              <button type="button" onClick={() => { setShowForm(false); setError("") }} style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Annuler</button>
              <button type="submit" disabled={loading || note === 0} style={{ flex: 2, background: note === 0 ? "var(--border)" : "#D97757", color: note === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: note === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
              {loading ? "Envoi..." : "Publier mon avis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {!user && <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", textAlign: "center", marginBottom: "1.5rem" }}><p style={{ color: "var(--text-muted)", marginBottom: "12px", fontSize: "14px" }}>Connectez-vous pour laisser un avis</p><Link href="/auth/login" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600 }}>Se connecter</Link></div>}

      {avis.length === 0 && <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>Aucun avis pour le moment. Soyez le premier !</div>}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {avis.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>{a.utilisateurs?.pseudo?.[0]?.toUpperCase()}</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{a.utilisateurs?.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <Etoiles note={a.note} readonly />
                {a.style_jeu && <span style={{ fontSize: "11px", background: "#FFF0EB", color: "#D97757", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>{a.style_jeu}</span>}
              </div>
            </div>
            {a.titre && <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "6px" }}>{a.titre}</p>}
            <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "10px" }}>{a.contenu}</p>
            {(a.note_vitesse || a.note_effet || a.note_controle || a.note_durabilite || a.note_durete_mousse || a.note_rejet || a.note_qualite_prix) && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginTop: "8px", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
                {a.note_vitesse && <span style={{ fontSize: "11px", background: "#EFF6FF", color: "#1A56DB", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Vitesse: {a.note_vitesse}/10</span>}
                {a.note_effet && <span style={{ fontSize: "11px", background: "#F5F3FF", color: "#7C3AED", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Effet: {a.note_effet}/10</span>}
                {a.note_controle && <span style={{ fontSize: "11px", background: "#F0FDF4", color: "#0E7F4F", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Contrôle: {a.note_controle}/10</span>}
                {a.note_durabilite && <span style={{ fontSize: "11px", background: "#FFF7ED", color: "#D97757", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Durabilité: {a.note_durabilite}/10</span>}
                {a.note_durete_mousse && <span style={{ fontSize: "11px", background: "#FEF2F2", color: "#EF4444", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Dureté: {a.note_durete_mousse}/10</span>}
                {a.note_rejet && <span style={{ fontSize: "11px", background: "#FFFBEB", color: "#F59E0B", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Rejet: {a.note_rejet}/10</span>}
                {a.note_qualite_prix && <span style={{ fontSize: "11px", background: "#F0FDF4", color: "#10B981", padding: "3px 8px", borderRadius: "6px", fontWeight: 600 }}>Q/P: {a.note_qualite_prix}/10</span>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}