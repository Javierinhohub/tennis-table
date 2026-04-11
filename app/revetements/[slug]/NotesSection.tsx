"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import PolarChart, { PolarAxis } from "@/app/components/PolarChart"

// Caractéristiques selon type de revêtement
const CRITERES: Record<string, { key: string, label: string, color: string }[]> = {
  In: [
    { key: "vitesse", label: "Vitesse", color: "#1A56DB" },
    { key: "effet", label: "Effet / Spin", color: "#7C3AED" },
    { key: "controle", label: "Contrôle", color: "#0E7F4F" },
    { key: "durabilite", label: "Durabilité", color: "#D97757" },
    { key: "durete", label: "Dureté mousse", color: "#EF4444" },
    { key: "rejet", label: "Rejet", color: "#F59E0B" },
    { key: "qualite_prix", label: "Qualité / Prix", color: "#10B981" },
  ],
  Out: [
    { key: "vitesse", label: "Vitesse", color: "#1A56DB" },
    { key: "effet", label: "Effet / Spin", color: "#7C3AED" },
    { key: "controle", label: "Contrôle", color: "#0E7F4F" },
    { key: "gene", label: "Gêne", color: "#EF4444" },
    { key: "durabilite", label: "Durabilité", color: "#D97757" },
    { key: "qualite_prix", label: "Qualité / Prix", color: "#10B981" },
  ],
  Long: [
    { key: "vitesse", label: "Vitesse", color: "#1A56DB" },
    { key: "adherence", label: "Adhérence", color: "#7C3AED" },
    { key: "controle", label: "Contrôle", color: "#0E7F4F" },
    { key: "gene", label: "Gêne", color: "#EF4444" },
    { key: "inversion", label: "Inversion", color: "#F59E0B" },
    { key: "durabilite", label: "Durabilité", color: "#D97757" },
    { key: "qualite_prix", label: "Qualité / Prix", color: "#10B981" },
  ],
  Anti: [
    { key: "vitesse", label: "Vitesse", color: "#1A56DB" },
    { key: "controle", label: "Contrôle", color: "#0E7F4F" },
    { key: "gene", label: "Gêne", color: "#EF4444" },
    { key: "inversion", label: "Inversion", color: "#F59E0B" },
    { key: "durabilite", label: "Durabilité", color: "#D97757" },
    { key: "qualite_prix", label: "Qualité / Prix", color: "#10B981" },
  ],
}

// Mapping key -> champ DB (notes utilisateurs dans notes_revetements)
const KEY_TO_DB: Record<string, string> = {
  vitesse: "note_vitesse", effet: "note_effet", controle: "note_controle",
  durabilite: "note_durabilite", durete: "note_durete_mousse",
  rejet: "note_rejet", qualite_prix: "note_qualite_prix",
  adherence: "note_adherence", gene: "note_gene", inversion: "note_inversion",
}
// Mapping key -> champ DB (notes TT-Kip dans revetements)
const KEY_TO_TTK: Record<string, string> = {
  vitesse: "vitesse_note", effet: "effet_note", controle: "controle_note",
  durabilite: "note_ttk_durabilite", durete: "note_ttk_durete",
  rejet: "note_ttk_rejet", qualite_prix: "note_ttk_qualite_prix",
  adherence: "note_ttk_adherence", gene: "note_ttk_gene", inversion: "note_ttk_inversion",
}
// Mapping key -> champ DB (notes marque dans revetements)
const KEY_TO_MARQUE: Record<string, string> = {
  vitesse: "note_marque_vitesse", effet: "note_marque_spin", controle: "note_marque_controle",
  durete: "note_marque_durete", adherence: "note_marque_adherence",
  gene: "note_marque_gene", inversion: "note_marque_inversion",
  durabilite: "note_marque_durabilite", rejet: "note_marque_rejet",
  qualite_prix: "note_marque_qualite_prix",
}

function BarreComparative({ label, ttk, marque, users, color }: any) {
  if (!ttk && !marque && !users) return null
  return (
    <div style={{ marginBottom: "14px" }}>
      <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase" as const, letterSpacing: "0.3px", marginBottom: "6px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        {ttk && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#1A56DB", width: "46px", fontWeight: 600, flexShrink: 0 }}>TT-Kip</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "8px" }}>
              <div style={{ height: "100%", background: "#1A56DB", borderRadius: "4px", width: (ttk / 10 * 100) + "%", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1A56DB", width: "28px", textAlign: "right" as const }}>{ttk}</span>
          </div>
        )}
        {marque && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#D97757", width: "46px", fontWeight: 600, flexShrink: 0 }}>Marque</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "8px" }}>
              <div style={{ height: "100%", background: "#D97757", borderRadius: "4px", width: (marque / 10 * 100) + "%", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", width: "28px", textAlign: "right" as const }}>{marque}</span>
          </div>
        )}
        {users && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#0E7F4F", width: "46px", fontWeight: 600, flexShrink: 0 }}>Users</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "8px" }}>
              <div style={{ height: "100%", background: "#0E7F4F", borderRadius: "4px", width: (users / 10 * 100) + "%", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#0E7F4F", width: "28px", textAlign: "right" as const }}>{users}</span>
          </div>
        )}
      </div>
    </div>
  )
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

export default function NotesSection({ produitId, revetement, typeRev }: { produitId: string, revetement?: any, typeRev?: string }) {
  const type = typeRev || "In"
  const criteres = CRITERES[type] || CRITERES.In

  const [user, setUser] = useState<any>(null)
  const [maNote, setMaNote] = useState<any>(null)
  const [stats, setStats] = useState<any>({})
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hover, setHover] = useState(0)
  const [noteGlobale, setNoteGlobale] = useState(0)
  const [notesCriteres, setNotesCriteres] = useState<Record<string, string>>({})

  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]

  async function fetchData() {
    const { data } = await supabase.from("notes_revetements")
      .select("*").eq("produit_id", produitId)
    if (!data || data.length === 0) return
    const avg = (f: string) => {
      const vals = data.filter((d: any) => d[f]).map((d: any) => d[f])
      return vals.length ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10 : null
    }
    const s: Record<string, any> = { total: data.length }
    criteres.forEach(c => { s[c.key] = avg(KEY_TO_DB[c.key]) })
    s.globale = avg("note_globale")
    setStats(s)
  }

  async function fetchMaNote(userId: string) {
    const { data } = await supabase.from("notes_revetements").select("*").eq("produit_id", produitId).eq("user_id", userId).single()
    if (data) {
      setMaNote(data)
      setNoteGlobale(data.note_globale || 0)
      const nc: Record<string, string> = {}
      criteres.forEach(c => { if (data[KEY_TO_DB[c.key]]) nc[c.key] = String(data[KEY_TO_DB[c.key]]) })
      setNotesCriteres(nc)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!noteGlobale) return
    setLoading(true)
    const payload: any = { produit_id: produitId, user_id: user.id, note_globale: noteGlobale }
    criteres.forEach(c => { payload[KEY_TO_DB[c.key]] = notesCriteres[c.key] ? parseInt(notesCriteres[c.key]) : null })
    if (maNote) await supabase.from("notes_revetements").update(payload).eq("id", maNote.id)
    else await supabase.from("notes_revetements").insert(payload)
    setSaved(true); setShowForm(false)
    await fetchData(); await fetchMaNote(user.id)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  const hasStats = Object.values(stats).some(v => v)
  const hasMarque = criteres.some(c => KEY_TO_MARQUE[c.key] && revetement?.[KEY_TO_MARQUE[c.key]])
  const hasTTK = criteres.some(c => KEY_TO_TTK[c.key] && revetement?.[KEY_TO_TTK[c.key]])

  // Données pour le polar chart
  const polarAxes: PolarAxis[] = criteres.map(c => ({
    label: c.label.replace(" / ", "/").replace(" mousse", ""),
    ttk:    KEY_TO_TTK[c.key]    ? (revetement?.[KEY_TO_TTK[c.key]]    ?? null) : null,
    marque: KEY_TO_MARQUE[c.key] ? (revetement?.[KEY_TO_MARQUE[c.key]] ?? null) : null,
    users:  stats[c.key] ?? null,
  }))

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Caractéristiques & Notes</h2>
          <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontWeight: 600 }}>
            <span style={{ color: "#1A56DB" }}>■ TT-Kip</span>
            <span style={{ color: "#D97757" }}>■ Marque</span>
            <span style={{ color: "#0E7F4F" }}>■ Utilisateurs</span>
          </div>
        </div>
        {stats.globale && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#D97757", lineHeight: 1 }}>{stats.globale}</p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>{stats.total} note{stats.total > 1 ? "s" : ""} / 5</p>
          </div>
        )}
      </div>
      <div style={{ padding: "20px" }}>

        {/* ── Polar chart ── */}
        {(hasTTK || hasMarque || hasStats) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)" }}>
            <PolarChart axes={polarAxes} size={280} />
            <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "11px", fontWeight: 600 }}>
              {hasTTK    && <span style={{ color: "#1A56DB", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#1A56DB", borderRadius: "2px", display: "inline-block" }} />TT-Kip</span>}
              {hasMarque && <span style={{ color: "#D97757", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#D97757", borderRadius: "2px", display: "inline-block" }} />Marque</span>}
              {hasStats  && <span style={{ color: "#0E7F4F", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#0E7F4F", borderRadius: "2px", display: "inline-block" }} />Utilisateurs</span>}
            </div>
          </div>
        )}

        {(hasStats || hasMarque || hasTTK) && criteres.map(c => (
          <BarreComparative key={c.key} label={c.label} color={c.color}
            ttk={KEY_TO_TTK[c.key] ? revetement?.[KEY_TO_TTK[c.key]] || null : null}
            marque={KEY_TO_MARQUE[c.key] ? revetement?.[KEY_TO_MARQUE[c.key]] || null : null}
            users={stats[c.key]}
          />
        ))}
        {revetement?.commentaire_marque && (
          <div style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "8px", padding: "12px 14px", marginBottom: "14px", fontSize: "13px", color: "#92400E", lineHeight: 1.6, fontStyle: "italic" }}>
            {revetement.commentaire_marque}
          </div>
        )}
        {saved && <div style={{ background: "var(--success-light)", color: "var(--success)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>✅ Note enregistrée !</div>}
        {user ? (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
            {!showForm ? (
              <button onClick={() => setShowForm(true)}
                style={{ width: "100%", background: maNote ? "var(--bg)" : "#D97757", color: maNote ? "var(--text)" : "#fff", border: "1px solid " + (maNote ? "var(--border)" : "#D97757"), borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                {maNote ? "✏️ Modifier ma note" : "⭐ Noter ce revêtement"}
              </button>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "8px" }}>Note globale *</p>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "4px" }}>
                    {[1,2,3,4,5].map(i => (
                      <button key={i} type="button"
                        onClick={() => setNoteGlobale(i)}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover(0)}
                        style={{ background: "none", border: "none", cursor: "pointer", fontSize: "30px", transition: "transform 0.1s", transform: (hover || noteGlobale) >= i ? "scale(1.2)" : "scale(1)", color: (hover || noteGlobale) >= i ? COLORS[hover || noteGlobale] : "#D1D5DB" }}>
                        ★
                      </button>
                    ))}
                  </div>
                  {(hover > 0 || noteGlobale > 0) && <p style={{ textAlign: "center" as const, fontSize: "13px", fontWeight: 600, color: COLORS[hover || noteGlobale] }}>{LABELS[hover || noteGlobale]}</p>}
                </div>
                <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Critères — optionnels</p>
                  {criteres.map(c => (
                    <Slider key={c.key} label={c.label} color={c.color}
                      value={notesCriteres[c.key] || ""}
                      onChange={(v: string) => setNotesCriteres(prev => ({ ...prev, [c.key]: v }))}
                    />
                  ))}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Annuler</button>
                  <button type="submit" disabled={loading || noteGlobale === 0} style={{ flex: 2, background: noteGlobale === 0 ? "var(--border)" : "#D97757", color: noteGlobale === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: noteGlobale === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
                    {loading ? "Enregistrement..." : maNote ? "Mettre à jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "10px" }}>Connectez-vous pour noter ce revêtement</p>
            <Link href="/auth/login" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 600 }}>Se connecter</Link>
          </div>
        )}
      </div>
    </div>
  )
}