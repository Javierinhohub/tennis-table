"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { usePathname } from "next/navigation"

// ── Composant étoiles ─────────────────────────────────────────────────────────
function Etoiles({
  note, onChange, readonly = false,
}: { note: number; onChange?: (n: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0)
  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]

  if (readonly)
    return (
      <div style={{ display: "flex", gap: "2px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} style={{ fontSize: "16px", color: i <= note ? "#F59E0B" : "#E5E7EB" }}>★</span>
        ))}
      </div>
    )

  return (
    <div>
      <div style={{ display: "flex", gap: "6px", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i} type="button"
            onClick={() => onChange && onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "2px", fontSize: "32px", transition: "transform 0.1s",
              transform: (hover || note) >= i ? "scale(1.15)" : "scale(1)",
              color: (hover || note) >= i ? COLORS[hover || note] : "#D1D5DB",
            }}
          >★</button>
        ))}
      </div>
      {(hover > 0 || note > 0) && (
        <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS[hover || note] }}>
          {LABELS[hover || note]}
        </p>
      )}
    </div>
  )
}

// ── Slider pour critères détaillés ────────────────────────────────────────────
// Utilise number | null pour éviter le bug React range input + string vide
function SliderNote({ label, value, onChange, color = "#D97757" }: {
  label: string
  value: number | null
  onChange: (v: number) => void
  color?: string
}) {
  // Valeur affichée : 1 (min) si pas encore touchée, pour indiquer qu'il faut glisser
  const displayValue = value ?? 1

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
          {label}
        </label>
        <span style={{ fontSize: "12px", fontWeight: 700, color: value !== null ? color : "var(--text-muted)" }}>
          {value !== null ? `${value}/10` : "—"}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={displayValue}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: "4px" }}
      />
    </div>
  )
}

const STYLES_JEU = ["Attaquant", "Défenseur", "Tout-jeu", "Débutant", "Intermédiaire", "Avancé"]

const inputStyle: React.CSSProperties = {
  background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px",
  padding: "10px 14px", fontSize: "14px", width: "100%",
  fontFamily: "Poppins, sans-serif", outline: "none",
  color: "var(--text)", boxSizing: "border-box",
}
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: 600,
  color: "var(--text-muted)", marginBottom: "6px",
  textTransform: "uppercase", letterSpacing: "0.4px",
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function AvisSectionBois({ produitId }: { produitId: string }) {
  const pathname = usePathname()
  const [avis, setAvis] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [mode, setMode] = useState<"" | "note" | "avis">("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  // Formulaire avis écrit
  const [note, setNote] = useState(0)
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")
  const [styleJeu, setStyleJeu] = useState("")

  // Formulaire note rapide — critères bois (number | null évite le bug slider)
  const [noteRapide, setNoteRapide] = useState(0)
  const [noteVitesse, setNoteVitesse] = useState<number | null>(null)
  const [noteControle, setNoteControle] = useState<number | null>(null)
  const [noteFlexibilite, setNoteFlexibilite] = useState<number | null>(null)
  const [noteDurete, setNoteDurete] = useState<number | null>(null)
  const [noteQP, setNoteQP] = useState<number | null>(null)

  const moyenneNote =
    avis.length > 0
      ? (avis.reduce((s, a) => s + a.note, 0) / avis.length).toFixed(1)
      : "0"

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) =>
      setUser(session?.user || null)
    )
    fetchAvis()
    return () => subscription.unsubscribe()
  }, [])

  async function fetchAvis() {
    const { data } = await supabase
      .from("avis")
      .select("*")
      .eq("produit_id", produitId)
      .eq("valide", true)
      .order("cree_le", { ascending: false })

    if (!data || data.length === 0) { setAvis([]); return }

    // Récupère pseudo + classement séparément pour éviter les problèmes de join PostgREST
    const userIds = [...new Set(data.map((a: any) => a.user_id))]
    const { data: users } = await supabase
      .from("utilisateurs")
      .select("id, pseudo, classement")
      .in("id", userIds)

    const userMap = Object.fromEntries((users || []).map((u: any) => [u.id, u]))
    setAvis(data.map((a: any) => ({ ...a, utilisateurs: userMap[a.user_id] || null })))
  }

  // ── Soumission avis écrit ─────────────────────────────────────────────────
  async function handleAvisSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (note === 0) { setError("Veuillez sélectionner une note globale."); return }
    if (contenu.length < 20) { setError("L'avis doit contenir au moins 20 caractères."); return }
    setLoading(true)
    try {
      const { error: err } = await supabase.from("avis").insert({
        produit_id: produitId, user_id: user.id,
        note, titre, contenu, style_jeu: styleJeu,
      })
      if (err) {
        if (err.code === "23505") {
          setError("Vous avez déjà soumis un avis pour ce bois.")
        } else {
          setError("Erreur : " + err.message)
        }
      } else {
        setMessage("Votre avis a été soumis et sera visible après modération.")
        setNote(0); setTitre(""); setContenu(""); setStyleJeu(""); setMode("")
      }
    } catch (ex: any) {
      setError("Une erreur est survenue : " + (ex?.message || String(ex)))
    } finally {
      setLoading(false)
    }
  }

  // ── Soumission note rapide ────────────────────────────────────────────────
  async function handleNoteSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!noteRapide || noteRapide < 1) { setError("Veuillez sélectionner une note globale (étoiles)."); return }
    setLoading(true)
    try {
      const payload: Record<string, any> = {
        produit_id: produitId,
        user_id: user.id,
        note_globale: noteRapide ?? 0,
        note_vitesse: noteVitesse,
        note_controle: noteControle,
        note_flexibilite: noteFlexibilite,
        note_durete: noteDurete,
        note_qualite_prix: noteQP,
      }
      const { error: err } = await supabase
        .from("notes_bois")
        .upsert(payload, { onConflict: "produit_id,user_id" })
      if (err) {
        setError("Erreur lors de l'enregistrement : " + err.message)
      } else {
        setMessage("Votre note a été enregistrée !")
        setNoteRapide(0)
        setNoteVitesse(null); setNoteControle(null)
        setNoteFlexibilite(null); setNoteDurete(null); setNoteQP(null)
        setMode("")
        // Rafraîchit le graphique radar
        window.dispatchEvent(new Event("notes_bois_updated"))
      }
    } catch (ex: any) {
      setError("Une erreur est survenue : " + (ex?.message || String(ex)))
    } finally {
      setLoading(false)
    }
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div style={{ marginTop: "2rem" }}>

      {/* En-tête + résumé notes */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Avis ({avis.length})</h2>
          {avis.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "22px", fontWeight: 800, color: "#D97757" }}>{moyenneNote}</span>
              <div>
                <div style={{ display: "flex", gap: "2px" }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span key={i} style={{ fontSize: "14px", color: i <= Math.round(parseFloat(moyenneNote)) ? "#F59E0B" : "#E5E7EB" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{avis.length} avis</p>
              </div>
            </div>
          )}
        </div>

        {user && mode === "" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => { setMode("note"); setError(""); setMessage("") }}
              style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              Noter
            </button>
            <button onClick={() => { setMode("avis"); setError(""); setMessage("") }}
              style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              Laisser un avis
            </button>
          </div>
        )}
      </div>

      {/* Message de confirmation */}
      {message && (
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", borderRadius: "10px", padding: "14px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>
          {message}
        </div>
      )}

      {/* ── FORMULAIRE NOTE RAPIDE ─────────────────────────────────────── */}
      {mode === "note" && user && (
        <div style={{ background: "#fff", border: "2px solid #D97757", borderRadius: "12px", padding: "24px", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Votre note</h3>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleNoteSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

            {/* Étoiles obligatoires */}
            <div>
              <label style={labelStyle}>Note globale *</label>
              <Etoiles note={noteRapide} onChange={setNoteRapide} />
            </div>

            {/* Critères détaillés */}
            <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                Critères détaillés — glissez pour noter (optionnel)
              </p>
              <SliderNote label="Vitesse"          value={noteVitesse}      onChange={setNoteVitesse}      color="#1A56DB" />
              <SliderNote label="Contrôle"         value={noteControle}     onChange={setNoteControle}     color="#0E7F4F" />
              <SliderNote label="Flexibilité"      value={noteFlexibilite}  onChange={setNoteFlexibilite}  color="#D97757" />
              <SliderNote label="Dureté"           value={noteDurete}       onChange={setNoteDurete}       color="#7C3AED" />
              <SliderNote label="Qualité / Prix"   value={noteQP}           onChange={setNoteQP}           color="#10B981" />
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-4px" }}>
                Glissez un curseur pour l'activer. Les critères non touchés ne seront pas enregistrés.
              </p>
            </div>

            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => { setMode(""); setError("") }}
                style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Annuler
              </button>
              <button type="submit" disabled={loading || !noteRapide || noteRapide < 1}
                style={{ flex: 2, background: (!noteRapide || noteRapide < 1) ? "var(--border)" : "#D97757", color: (!noteRapide || noteRapide < 1) ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: (!noteRapide || noteRapide < 1) ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
                {loading ? "Enregistrement..." : "Enregistrer ma note"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── FORMULAIRE AVIS ÉCRIT ──────────────────────────────────────── */}
      {mode === "avis" && user && (
        <div style={{ background: "#fff", border: "2px solid #D97757", borderRadius: "12px", padding: "24px", marginBottom: "1.5rem" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "20px" }}>Votre avis</h3>
          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px", fontSize: "13px" }}>
              {error}
            </div>
          )}
          <form onSubmit={handleAvisSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Note globale *</label>
              <Etoiles note={note} onChange={setNote} />
            </div>
            <div>
              <label style={labelStyle}>Titre</label>
              <input type="text" value={titre} onChange={(e) => setTitre(e.target.value)}
                style={inputStyle} placeholder="Ex: Excellent bois pour le topspin" />
            </div>
            <div>
              <label style={labelStyle}>
                Votre avis *{" "}
                <span style={{ color: "var(--text-muted)", fontWeight: 400, textTransform: "none" }}>(20 car. min.)</span>
              </label>
              <textarea value={contenu} onChange={(e) => setContenu(e.target.value)}
                required rows={5}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                placeholder="Décrivez votre expérience avec ce bois (sensations, vitesse, contrôle, combinaisons conseillées...)" />
              <p style={{ fontSize: "11px", color: contenu.length < 20 ? "var(--text-muted)" : "#16A34A", marginTop: "4px", textAlign: "right" }}>
                {contenu.length} / 20 min.
              </p>
            </div>
            <div>
              <label style={labelStyle}>Style de jeu</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {STYLES_JEU.map((s) => (
                  <button key={s} type="button" onClick={() => setStyleJeu(styleJeu === s ? "" : s)}
                    style={{ padding: "7px 14px", borderRadius: "20px", border: "1px solid " + (styleJeu === s ? "#D97757" : "var(--border)"), background: styleJeu === s ? "#FFF0EB" : "#fff", color: styleJeu === s ? "#D97757" : "var(--text-muted)", fontSize: "13px", fontWeight: styleJeu === s ? 600 : 400, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="button" onClick={() => { setMode(""); setError("") }}
                style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Annuler
              </button>
              <button type="submit" disabled={loading || note === 0}
                style={{ flex: 2, background: note === 0 ? "var(--border)" : "#D97757", color: note === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: note === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
                {loading ? "Envoi..." : "Publier mon avis"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Non connecté */}
      {!user && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", textAlign: "center", marginBottom: "1.5rem" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "12px", fontSize: "14px" }}>
            Connectez-vous pour noter ou laisser un avis
          </p>
          <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`} style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600 }}>
            Se connecter
          </Link>
        </div>
      )}

      {/* Aucun avis */}
      {avis.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun avis pour le moment. Soyez le premier !
        </div>
      )}

      {/* Liste des avis */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {avis.map((a) => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {a.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{a.utilisateurs?.pseudo}</p>
                    {a.utilisateurs?.classement && (
                      <span style={{ fontSize: "11px", fontWeight: 600, background: "var(--bg)", color: "var(--accent)", border: "1px solid var(--border)", borderRadius: "4px", padding: "1px 6px" }}>
                        {a.utilisateurs.classement} pts
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {new Date(a.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                <Etoiles note={a.note} readonly />
                {a.style_jeu && (
                  <span style={{ fontSize: "11px", background: "#FFF0EB", color: "#D97757", padding: "2px 8px", borderRadius: "10px", fontWeight: 600 }}>
                    {a.style_jeu}
                  </span>
                )}
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
