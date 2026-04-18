"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { usePathname } from "next/navigation"
import PolarChart, { PolarAxis } from "@/app/components/PolarChart"

const CRITERES = [
  { key: "vitesse",      label: "Vitesse",       dbKey: "note_vitesse",      ttkKey: "note_vitesse",      color: "#1A56DB" },
  { key: "controle",     label: "Contrôle",      dbKey: "note_controle",     ttkKey: "note_controle",     color: "#0E7F4F" },
  { key: "flexibilite",  label: "Flexibilité",   dbKey: "note_flexibilite",  ttkKey: "note_flexibilite",  color: "#D97757" },
  { key: "durete",       label: "Dureté",         dbKey: "note_durete",       ttkKey: "note_durete",       color: "#7C3AED" },
  { key: "qualite_prix", label: "Qualité / Prix", dbKey: "note_qualite_prix", ttkKey: "note_qualite_prix", color: "#10B981" },
]

function BarreComparative({ label, ttk, users }: { label: string; ttk: number | null; users: number | null }) {
  if (!ttk && !users) return null
  return (
    <div style={{ marginBottom: "14px" }}>
      <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text)", textTransform: "uppercase" as const, letterSpacing: "0.3px", marginBottom: "6px" }}>{label}</p>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "4px" }}>
        {ttk != null && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "10px", color: "#1A56DB", width: "46px", fontWeight: 600, flexShrink: 0 }}>TT-Kip</span>
            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "8px" }}>
              <div style={{ height: "100%", background: "#1A56DB", borderRadius: "4px", width: (ttk / 10 * 100) + "%", transition: "width 0.5s" }} />
            </div>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1A56DB", width: "28px", textAlign: "right" as const }}>{ttk}</span>
          </div>
        )}
        {users != null && (
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

function SliderNote({ label, value, onChange, color = "#D97757" }: {
  label: string; value: string; onChange: (v: string) => void; color?: string
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
        <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>{label}</span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: value ? color : "var(--text-muted)" }}>{value ? value + "/10" : "—"}</span>
      </div>
      <input type="range" min="1" max="10" value={value || "1"}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", accentColor: color, cursor: "pointer", height: "4px" }} />
    </div>
  )
}

function Etoiles({ note, onChange }: { note: number; onChange?: (n: number) => void }) {
  const [hover, setHover] = useState(0)
  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]
  return (
    <div>
      <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "4px" }}>
        {[1, 2, 3, 4, 5].map(i => (
          <button key={i} type="button"
            onClick={() => onChange && onChange(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "30px", transition: "transform 0.1s", transform: (hover || note) >= i ? "scale(1.2)" : "scale(1)", color: (hover || note) >= i ? COLORS[hover || note] : "#D1D5DB" }}>
            ★
          </button>
        ))}
      </div>
      {(hover > 0 || note > 0) && (
        <p style={{ textAlign: "center" as const, fontSize: "13px", fontWeight: 600, color: COLORS[hover || note] }}>{LABELS[hover || note]}</p>
      )}
    </div>
  )
}

export default function NotesSectionBois({ produitId, bois }: { produitId: string; bois?: any }) {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [maNote, setMaNote] = useState<any>(null)
  const [stats, setStats] = useState<any>({})
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [noteGlobale, setNoteGlobale] = useState(0)
  const [notesCriteres, setNotesCriteres] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchData()
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) fetchMaNote(u.id)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      if (u) fetchMaNote(u.id)
    })
    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function fetchData() {
    const { data } = await supabase.from("notes_bois").select("*").eq("produit_id", produitId)
    if (!data || data.length === 0) return
    const avg = (f: string) => {
      const vals = data.filter((d: any) => d[f] != null).map((d: any) => d[f])
      return vals.length ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10 : null
    }
    const s: Record<string, any> = { total: data.length }
    CRITERES.forEach(c => { s[c.key] = avg(c.dbKey) })
    s.globale = avg("note_globale")
    setStats(s)
  }

  async function fetchMaNote(userId: string) {
    const { data } = await supabase.from("notes_bois").select("*").eq("produit_id", produitId).eq("user_id", userId).single()
    if (data) {
      setMaNote(data)
      setNoteGlobale(data.note_globale || 0)
      const nc: Record<string, string> = {}
      CRITERES.forEach(c => { if (data[c.dbKey] != null) nc[c.key] = String(data[c.dbKey]) })
      setNotesCriteres(nc)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!noteGlobale || noteGlobale < 1) return
    setLoading(true)
    try {
      const payload: any = { produit_id: produitId, user_id: user.id, note_globale: noteGlobale }
      CRITERES.forEach(c => { payload[c.dbKey] = notesCriteres[c.key] ? parseInt(notesCriteres[c.key]) : null })
      const { error: err } = await supabase.from("notes_bois").upsert(payload, { onConflict: "produit_id,user_id" })
      if (err) {
        console.error("notes_bois error:", err.message)
      } else {
        setSaved(true); setShowForm(false)
        await fetchData(); await fetchMaNote(user.id)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (ex: any) {
      console.error("handleSubmit exception:", ex)
    } finally {
      setLoading(false)
    }
  }

  const hasStats = CRITERES.some(c => stats[c.key] != null)
  const hasTTK   = CRITERES.some(c => bois?.[c.ttkKey] != null)

  const polarAxes: PolarAxis[] = CRITERES.map(c => ({
    label: c.label.replace(" / ", "/"),
    ttk:   bois?.[c.ttkKey]  ?? null,
    users: stats[c.key]      ?? null,
  }))

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>
      {/* En-tête */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>Caractéristiques & Notes</h2>
          <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontWeight: 600 }}>
            <span style={{ color: "#1A56DB" }}>■ TT-Kip</span>
            <span style={{ color: "#0E7F4F" }}>■ Utilisateurs</span>
          </div>
        </div>
        {stats.globale != null && (
          <div style={{ textAlign: "center" as const }}>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#D97757", lineHeight: 1 }}>{stats.globale}</p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>{stats.total} note{stats.total > 1 ? "s" : ""} / 5</p>
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        {/* Polar chart */}
        {(hasTTK || hasStats) && (
          <div style={{ marginBottom: "20px", paddingBottom: "20px", borderBottom: "1px solid var(--border)", textAlign: "center" as const }}>
            <div style={{ display: "inline-flex", flexDirection: "column" as const, alignItems: "center" }}>
              <PolarChart axes={polarAxes} size={300} showMarque={false} />
              <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "11px", fontWeight: 600 }}>
                {hasTTK   && <span style={{ color: "#1A56DB", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#1A56DB", borderRadius: "2px", display: "inline-block" }} />TT-Kip</span>}
                {hasStats && <span style={{ color: "#0E7F4F", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#0E7F4F", borderRadius: "2px", display: "inline-block" }} />Utilisateurs</span>}
              </div>
            </div>
          </div>
        )}

        {/* Barres comparatives */}
        {(hasStats || hasTTK) && CRITERES.map(c => (
          <BarreComparative key={c.key} label={c.label}
            ttk={bois?.[c.ttkKey] ?? null}
            users={stats[c.key] ?? null}
          />
        ))}

        {/* Message confirmation */}
        {saved && (
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", color: "#065F46", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", fontWeight: 500, marginBottom: "12px" }}>
            Note enregistrée !
          </div>
        )}

        {/* Formulaire / bouton noter */}
        <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
          {user ? (
            !showForm ? (
              <button onClick={() => setShowForm(true)}
                style={{ width: "100%", background: maNote ? "var(--bg)" : "#D97757", color: maNote ? "var(--text)" : "#fff", border: "1px solid " + (maNote ? "var(--border)" : "#D97757"), borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                {maNote ? "Modifier ma note" : "Noter ce bois"}
              </button>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" as const, gap: "16px" }}>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "8px" }}>Note globale *</p>
                  <Etoiles note={noteGlobale} onChange={setNoteGlobale} />
                </div>
                <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Critères — optionnels</p>
                  {CRITERES.map(c => (
                    <SliderNote key={c.key} label={c.label} color={c.color}
                      value={notesCriteres[c.key] || ""}
                      onChange={(v: string) => setNotesCriteres(prev => ({ ...prev, [c.key]: v }))}
                    />
                  ))}
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "-4px" }}>Glissez un curseur pour l'activer. Les critères non touchés ne seront pas enregistrés.</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" onClick={() => setShowForm(false)}
                    style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={loading || !noteGlobale || noteGlobale < 1}
                    style={{ flex: 2, background: (!noteGlobale || noteGlobale < 1) ? "var(--border)" : "#D97757", color: (!noteGlobale || noteGlobale < 1) ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: (!noteGlobale || noteGlobale < 1) ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
                    {loading ? "Enregistrement..." : maNote ? "Mettre à jour" : "Enregistrer"}
                  </button>
                </div>
              </form>
            )
          ) : (
            <div style={{ textAlign: "center" as const }}>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "10px" }}>Connectez-vous pour noter ce bois</p>
              <Link href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px 18px", fontSize: "13px", fontWeight: 600 }}>
                Se connecter
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
