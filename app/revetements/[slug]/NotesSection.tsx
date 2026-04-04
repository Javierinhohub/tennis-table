"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

function Etoiles({ note, onChange, hover, onHover, size = 28 }: any) {
  const COLORS = ["", "#EF4444", "#F97316", "#EAB308", "#22C55E", "#16A34A"]
  const LABELS = ["", "Mauvais", "Passable", "Moyen", "Bien", "Excellent"]
  return (
    <div>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1,2,3,4,5].map(i => (
          <button key={i} type="button"
            onClick={() => onChange && onChange(i)}
            onMouseEnter={() => onHover && onHover(i)}
            onMouseLeave={() => onHover && onHover(0)}
            style={{ background: "none", border: "none", cursor: onChange ? "pointer" : "default", fontSize: size + "px", padding: "2px", transition: "transform 0.1s", transform: onChange && (hover || note) >= i ? "scale(1.2)" : "scale(1)", color: (hover || note) >= i ? COLORS[hover || note] : "#D1D5DB" }}>
            ★
          </button>
        ))}
      </div>
      {onChange && (hover > 0 || note > 0) && (
        <p style={{ fontSize: "13px", fontWeight: 600, color: COLORS[hover || note], marginTop: "4px" }}>{LABELS[hover || note]}</p>
      )}
    </div>
  )
}

function Slider({ label, value, onChange, color }: { label: string, value: string, onChange: (v: string) => void, color: string }) {
  const [active, setActive] = useState(false)
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.3px" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: active || value ? color : "var(--text-muted)" }}>{value ? value + "/10" : "—"}</span>
      </div>
      <input type="range" min="1" max="10" value={value || "5"}
        onChange={e => { setActive(true); onChange(e.target.value) }}
        onClick={() => { if (!value) onChange("5") }}
        style={{ width: "100%", accentColor: color, cursor: "pointer" }} />
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", color: "var(--text-muted)", marginTop: "1px" }}>
        <span>1</span><span>5</span><span>10</span>
      </div>
    </div>
  )
}

function BarreComparative({ label, ttk, marque, users }: { label: string, ttk?: number, marque?: number, users?: number }) {
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

export default function NotesSection({ produitId, revetement }: { produitId: string, revetement?: any }) {
  const [user, setUser] = useState<any>(null)
  const [maNote, setMaNote] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [hover, setHover] = useState(0)

  const [noteGlobale, setNoteGlobale] = useState(0)
  const [noteVitesse, setNoteVitesse] = useState("")
  const [noteEffet, setNoteEffet] = useState("")
  const [noteControle, setNoteControle] = useState("")
  const [noteDurabilite, setNoteDurabilite] = useState("")
  const [noteDurete, setNoteDurete] = useState("")
  const [noteRejet, setNoteRejet] = useState("")
  const [noteQP, setNoteQP] = useState("")

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchMaNote(data.user.id)
    })
  }, [])

  async function fetchData() {
    const { data } = await supabase
      .from("notes_revetements")
      .select("note_globale, note_vitesse, note_effet, note_controle, note_durabilite, note_durete_mousse, note_rejet, note_qualite_prix")
      .eq("produit_id", produitId)
    if (!data || data.length === 0) return
    const avg = (f: string) => {
      const vals = data.filter((d: any) => d[f]).map((d: any) => d[f])
      return vals.length ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10 : null
    }
    setStats({
      total: data.length,
      globale: avg("note_globale"),
      vitesse: avg("note_vitesse"), effet: avg("note_effet"), controle: avg("note_controle"),
      durabilite: avg("note_durabilite"), durete: avg("note_durete_mousse"),
      rejet: avg("note_rejet"), qualitePrix: avg("note_qualite_prix")
    })
  }

  async function fetchMaNote(userId: string) {
    const { data } = await supabase.from("notes_revetements").select("*").eq("produit_id", produitId).eq("user_id", userId).single()
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
    if (noteGlobale === 0) return
    setLoading(true)
    const payload = {
      produit_id: produitId, user_id: user.id,
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
    setSaved(true)
    setShowForm(false)
    await fetchData()
    await fetchMaNote(user.id)
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginBottom: "1.5rem" }}>

      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg)" }}>
        <div>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "2px" }}>Notes des utilisateurs</h2>
          <div style={{ display: "flex", gap: "12px", fontSize: "11px", fontWeight: 600 }}>
            <span style={{ color: "#1A56DB" }}>■ TT-Kip</span>
            <span style={{ color: "#D97757" }}>■ Marque</span>
            <span style={{ color: "#0E7F4F" }}>■ Utilisateurs</span>
          </div>
        </div>
        {stats && (
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "28px", fontWeight: 800, color: "#D97757", lineHeight: 1 }}>{stats.globale}</p>
            <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>{stats.total} note{stats.total > 1 ? "s" : ""} / 5</p>
          </div>
        )}
      </div>

      <div style={{ padding: "20px" }}>
        <BarreComparative label="Vitesse" ttk={revetement?.vitesse_note} marque={revetement?.note_marque_vitesse} users={stats?.vitesse} />
        <BarreComparative label="Effet / Spin" ttk={revetement?.effet_note} marque={revetement?.note_marque_spin} users={stats?.effet} />
        <BarreComparative label="Contrôle" ttk={revetement?.controle_note} marque={revetement?.note_marque_controle} users={stats?.controle} />
        <BarreComparative label="Durabilité" users={stats?.durabilite} />
        <BarreComparative label="Dureté mousse" marque={revetement?.note_marque_durete} users={stats?.durete} />
        <BarreComparative label="Rejet" users={stats?.rejet} />
        <BarreComparative label="Qualité / Prix" users={stats?.qualitePrix} />

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
                  <Etoiles note={noteGlobale} onChange={setNoteGlobale} hover={hover} onHover={setHover} size={32} />
                </div>
                <div style={{ background: "var(--bg)", borderRadius: "10px", padding: "14px", display: "flex", flexDirection: "column", gap: "14px" }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>Critères détaillés <span style={{ fontWeight: 400, textTransform: "none" as const }}>— optionnels</span></p>
                  <Slider label="Vitesse" value={noteVitesse} onChange={setNoteVitesse} color="#1A56DB" />
                  <Slider label="Effet / Spin" value={noteEffet} onChange={setNoteEffet} color="#7C3AED" />
                  <Slider label="Contrôle" value={noteControle} onChange={setNoteControle} color="#0E7F4F" />
                  <Slider label="Durabilité" value={noteDurabilite} onChange={setNoteDurabilite} color="#D97757" />
                  <Slider label="Dureté de la mousse" value={noteDurete} onChange={setNoteDurete} color="#EF4444" />
                  <Slider label="Rejet" value={noteRejet} onChange={setNoteRejet} color="#F59E0B" />
                  <Slider label="Rapport qualité / prix" value={noteQP} onChange={setNoteQP} color="#10B981" />
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Annuler</button>
                  <button type="submit" disabled={loading || noteGlobale === 0} style={{ flex: 2, background: noteGlobale === 0 ? "var(--border)" : "#D97757", color: noteGlobale === 0 ? "var(--text-muted)" : "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: noteGlobale === 0 ? "not-allowed" : "pointer", fontFamily: "Poppins, sans-serif" }}>
                    {loading ? "Enregistrement..." : maNote ? "Mettre à jour" : "Enregistrer ma note"}
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