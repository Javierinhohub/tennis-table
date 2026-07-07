"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface Entry {
  id: string
  cree_le: string
  prenom: string
  nom: string
  instagram: string | null
  age: number
  points_debut: number
  points_fin: number
  score: number
  publie: boolean
  token: string
}

const TRANCHES = [
  { min: 1000, max: 1099, coeff: 1.10 }, { min: 1100, max: 1199, coeff: 1.20 },
  { min: 1200, max: 1299, coeff: 1.35 }, { min: 1300, max: 1399, coeff: 1.50 },
  { min: 1400, max: 1499, coeff: 1.70 }, { min: 1500, max: 1599, coeff: 1.95 },
  { min: 1600, max: 1699, coeff: 2.25 }, { min: 1700, max: 1799, coeff: 2.60 },
  { min: 1800, max: 1899, coeff: 3.00 }, { min: 1900, max: 1999, coeff: 3.50 },
  { min: 2000, max: Infinity, coeff: 4.20 },
]
function getCoeff(pts: number) { return TRANCHES.find(t => pts >= t.min && pts <= t.max)?.coeff ?? 1.10 }
function calcScore(start: number, end: number): number {
  let score = 0, current = start
  while (current < end) {
    const floor = Math.floor(current / 100) * 100
    const ceil = floor >= 2000 ? Infinity : floor + 100
    const pts = Math.min(ceil, end) - current
    score += pts * getCoeff(current)
    current = Math.min(ceil, end)
    if (ceil === Infinity) break
  }
  return Math.round(score * 10) / 10
}

const inp: React.CSSProperties = {
  padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "7px",
  fontSize: "13px", width: "100%", fontFamily: "inherit", color: "var(--text)",
  outline: "none", boxSizing: "border-box",
}

export default function AdminPerfoMetrePage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Entry>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  // Auth check
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { router.replace("/auth/connexion"); return }
      supabase.from("utilisateurs").select("role").eq("id", data.session.user.id).single()
        .then(({ data: u }) => {
          if (u?.role !== "admin") { router.replace("/"); return }
          loadEntries()
        })
    })
  }, [])

  async function loadEntries() {
    setLoading(true)
    const { data } = await supabase
      .from("perfometre_submissions")
      .select("*")
      .order("score", { ascending: false })
    setEntries(data || [])
    setLoading(false)
  }

  function startEdit(e: Entry) {
    setEditId(e.id)
    setEditData({ prenom: e.prenom, nom: e.nom, instagram: e.instagram || "", age: e.age, points_debut: e.points_debut, points_fin: e.points_fin, publie: e.publie })
    setMsg("")
  }

  function cancelEdit() { setEditId(null); setEditData({}) }

  async function saveEdit(id: string) {
    setSaving(true); setMsg("")
    const debut = Number(editData.points_debut)
    const fin   = Number(editData.points_fin)
    const score = calcScore(debut, fin)
    const { error } = await supabase.from("perfometre_submissions").update({
      prenom: editData.prenom, nom: editData.nom,
      instagram: editData.instagram || null,
      age: Number(editData.age),
      points_debut: debut, points_fin: fin, score,
      publie: editData.publie,
    }).eq("id", id)
    setSaving(false)
    if (error) { setMsg("Erreur : " + error.message); return }
    setMsg("Sauvegardé."); setEditId(null); loadEntries()
  }

  async function togglePublie(id: string, current: boolean) {
    await supabase.from("perfometre_submissions").update({ publie: !current }).eq("id", id)
    loadEntries()
  }

  async function deleteEntry(id: string) {
    if (!confirm("Supprimer cette entrée ?")) return
    await supabase.from("perfometre_submissions").delete().eq("id", id)
    loadEntries()
  }

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Chargement...</div>

  return (
    <main style={{ maxWidth: "960px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>Perf-o-mètre — Administration</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{entries.length} soumission{entries.length > 1 ? "s" : ""}</p>
        </div>
        <a href="/admin/produits" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Admin</a>
      </div>

      {msg && <p style={{ padding: "10px 14px", background: "#F0FDF4", borderRadius: "8px", color: "#166534", fontSize: "13px", marginBottom: "1rem" }}>{msg}</p>}

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
        {/* En-tête tableau */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 60px 60px 60px 80px 80px 110px", gap: "8px", padding: "10px 16px", background: "#F9F9F9", borderBottom: "1px solid var(--border)" }}>
          {["Prénom / Nom", "Instagram", "Âge", "Début", "Fin", "Score", "Publié", "Actions"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</span>
          ))}
        </div>

        {entries.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>Aucune soumission.</div>
        )}

        {entries.map((e) => (
          <div key={e.id}>
            {editId === e.id ? (
              /* ── Mode édition ── */
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "#FFFBF5" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Prénom</label><input style={inp} value={editData.prenom || ""} onChange={e2 => setEditData(d => ({ ...d, prenom: e2.target.value }))} /></div>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Nom</label><input style={inp} value={editData.nom || ""} onChange={e2 => setEditData(d => ({ ...d, nom: e2.target.value }))} /></div>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Instagram</label><input style={inp} value={editData.instagram || ""} onChange={e2 => setEditData(d => ({ ...d, instagram: e2.target.value }))} /></div>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Âge</label><input style={inp} type="number" value={editData.age || ""} onChange={e2 => setEditData(d => ({ ...d, age: parseInt(e2.target.value) }))} /></div>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Points début</label><input style={inp} type="number" value={editData.points_debut || ""} onChange={e2 => setEditData(d => ({ ...d, points_debut: parseInt(e2.target.value) }))} /></div>
                  <div><label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>Points fin</label><input style={inp} type="number" value={editData.points_fin || ""} onChange={e2 => setEditData(d => ({ ...d, points_fin: parseInt(e2.target.value) }))} /></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                    <input type="checkbox" checked={editData.publie ?? true} onChange={e2 => setEditData(d => ({ ...d, publie: e2.target.checked }))} />
                    Publié dans le classement
                  </label>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    <button onClick={cancelEdit} style={{ padding: "7px 14px", borderRadius: "7px", border: "1px solid var(--border)", background: "#fff", fontSize: "12px", cursor: "pointer" }}>Annuler</button>
                    <button onClick={() => saveEdit(e.id)} disabled={saving} style={{ padding: "7px 14px", borderRadius: "7px", border: "none", background: "#D97757", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                      {saving ? "..." : "Sauvegarder"}
                    </button>
                  </div>
                </div>
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "8px" }}>
                  Token : <code style={{ fontFamily: "monospace", background: "#F3F4F6", padding: "2px 6px", borderRadius: "4px" }}>{e.token}</code>
                  {e.age < 18 && <span style={{ marginLeft: "12px", color: "#D97757", fontWeight: 700 }}>Mineur — vérifier autorisation parentale avant publication Instagram</span>}
                </p>
              </div>
            ) : (
              /* ── Mode lecture ── */
              <div style={{
                display: "grid", gridTemplateColumns: "1fr 1fr 60px 60px 60px 80px 80px 110px",
                gap: "8px", padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                alignItems: "center",
                background: !e.publie ? "#FAFAFA" : "transparent",
                opacity: e.publie ? 1 : 0.6,
              }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{e.prenom} {e.nom}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>{new Date(e.cree_le).toLocaleDateString("fr-FR")}</p>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{e.instagram ? "@" + e.instagram : "—"}</span>
                <span style={{ fontSize: "13px", textAlign: "center" }}>
                  {e.age}
                  {e.age < 18 && <span title="Mineur" style={{ color: "#D97757", fontWeight: 700, marginLeft: "2px" }}>*</span>}
                </span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>{e.points_debut}</span>
                <span style={{ fontSize: "13px", color: "var(--text-muted)", textAlign: "center" }}>{e.points_fin}</span>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#D97757", textAlign: "center" }}>{e.score}</span>
                <div style={{ textAlign: "center" }}>
                  <button onClick={() => togglePublie(e.id, e.publie)} style={{
                    padding: "4px 10px", borderRadius: "20px", border: "none", cursor: "pointer", fontSize: "11px", fontWeight: 700,
                    background: e.publie ? "#DCFCE7" : "#FEE2E2",
                    color: e.publie ? "#166534" : "#991B1B",
                  }}>
                    {e.publie ? "Publié" : "Masqué"}
                  </button>
                </div>
                <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                  <button onClick={() => startEdit(e)} style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid var(--border)", background: "#fff", fontSize: "11px", cursor: "pointer" }}>Éditer</button>
                  <button onClick={() => deleteEntry(e.id)} style={{ padding: "5px 10px", borderRadius: "6px", border: "none", background: "#FEE2E2", color: "#991B1B", fontSize: "11px", cursor: "pointer" }}>Suppr.</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1rem" }}>
        * = mineur, vérifier autorisation parentale avant publication sur Instagram.
      </p>
    </main>
  )
}
