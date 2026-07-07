"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

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

const inp: React.CSSProperties = {
  padding: "8px 10px", border: "1px solid var(--border)", borderRadius: "7px",
  fontSize: "13px", width: "100%", fontFamily: "inherit", color: "var(--text)",
  outline: "none", boxSizing: "border-box",
}

export default function AdminPerfoMetrePage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editId, setEditId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Partial<Entry>>({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState("")

  useEffect(() => { loadEntries() }, [])

  async function getToken(): Promise<string | null> {
    const { data: { session } } = await supabase.auth.getSession()
    return session?.access_token ?? null
  }

  async function loadEntries() {
    setLoading(true); setError("")
    try {
      const token = await getToken()
      if (!token) { router.replace("/auth/login"); return }
      const res = await fetch("/api/perfometre/admin", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const json = await res.json()
      if (res.status === 403) { router.replace("/auth/login"); return }
      if (!res.ok) { setError("Erreur : " + (json.error || res.status)); setLoading(false); return }
      setEntries(json.entries || [])
    } catch (err: any) {
      setError("Erreur de chargement : " + (err?.message || "inconnue"))
    }
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
    const token = await getToken()
    const res = await fetch("/api/perfometre/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ id, ...editData }),
    })
    setSaving(false)
    if (!res.ok) { const j = await res.json(); setMsg("Erreur : " + j.error); return }
    setMsg("Sauvegardé."); setEditId(null); loadEntries()
  }

  async function togglePublie(id: string, current: boolean) {
    const token = await getToken()
    await fetch("/api/perfometre/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ id, publie: !current }),
    })
    loadEntries()
  }

  async function deleteEntry(id: string) {
    if (!confirm("Supprimer cette entrée définitivement ?")) return
    const token = await getToken()
    await fetch(`/api/perfometre/admin?id=${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
    loadEntries()
  }

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Chargement...</div>
  if (error) return <div style={{ padding: "3rem", textAlign: "center", color: "#991B1B" }}>{error}</div>

  return (
    <main style={{ maxWidth: "980px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "2px" }}>Perf-o-mètre — Administration</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{entries.length} soumission{entries.length !== 1 ? "s" : ""}</p>
        </div>
        <a href="/admin/produits" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Admin</a>
      </div>

      {msg && <p style={{ padding: "10px 14px", background: "#F0FDF4", borderRadius: "8px", color: "#166534", fontSize: "13px", marginBottom: "1rem" }}>{msg}</p>}

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
        {/* En-tête */}
        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 55px 65px 65px 85px 85px 120px", gap: "8px", padding: "10px 16px", background: "#F9F9F9", borderBottom: "1px solid var(--border)" }}>
          {["Prénom / Nom", "Instagram", "Âge", "Début", "Fin", "Score", "Publié", "Actions"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</span>
          ))}
        </div>

        {entries.length === 0 && (
          <div style={{ padding: "2.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            Aucune soumission pour l'instant.
          </div>
        )}

        {entries.map((e) => (
          <div key={e.id}>
            {editId === e.id ? (
              /* Mode édition */
              <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", background: "#FFFBF5" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
                  {[
                    { label: "Prénom", key: "prenom", type: "text" },
                    { label: "Nom", key: "nom", type: "text" },
                    { label: "Instagram", key: "instagram", type: "text" },
                    { label: "Âge", key: "age", type: "number" },
                    { label: "Points début", key: "points_debut", type: "number" },
                    { label: "Points fin", key: "points_fin", type: "number" },
                  ].map(({ label, key, type }) => (
                    <div key={key}>
                      <label style={{ fontSize: "10px", color: "var(--text-muted)", display: "block", marginBottom: "3px" }}>{label}</label>
                      <input
                        style={inp}
                        type={type}
                        value={(editData as any)[key] ?? ""}
                        onChange={ev => setEditData(d => ({ ...d, [key]: type === "number" ? parseInt(ev.target.value) || "" : ev.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", cursor: "pointer" }}>
                    <input type="checkbox" checked={editData.publie ?? true} onChange={ev => setEditData(d => ({ ...d, publie: ev.target.checked }))} />
                    Publié dans le classement
                  </label>
                  <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
                    <button onClick={cancelEdit} style={{ padding: "7px 14px", borderRadius: "7px", border: "1px solid var(--border)", background: "#fff", fontSize: "12px", cursor: "pointer" }}>Annuler</button>
                    <button onClick={() => saveEdit(e.id)} disabled={saving} style={{ padding: "7px 14px", borderRadius: "7px", border: "none", background: "#D97757", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>
                      {saving ? "..." : "Sauvegarder"}
                    </button>
                  </div>
                </div>
                {e.age < 18 && (
                  <p style={{ fontSize: "11px", color: "#D97757", fontWeight: 700, marginTop: "8px" }}>
                    Mineur — vérifier autorisation parentale avant publication Instagram
                  </p>
                )}
                <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "6px" }}>
                  Token : <code style={{ fontFamily: "monospace", background: "#F3F4F6", padding: "2px 6px", borderRadius: "4px", fontSize: "9px" }}>{e.token}</code>
                </p>
              </div>
            ) : (
              /* Mode lecture */
              <div style={{
                display: "grid", gridTemplateColumns: "1.2fr 1fr 55px 65px 65px 85px 85px 120px",
                gap: "8px", padding: "12px 16px", borderBottom: "1px solid var(--border)",
                alignItems: "center",
                background: e.publie ? "transparent" : "#FAFAFA",
                opacity: e.publie ? 1 : 0.55,
              }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>
                    {e.prenom} {e.nom}
                    {e.age < 18 && <span title="Mineur" style={{ color: "#D97757", fontWeight: 800, marginLeft: "4px", fontSize: "11px" }}>*</span>}
                  </p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)" }}>{new Date(e.cree_le).toLocaleDateString("fr-FR")}</p>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{e.instagram ? "@" + e.instagram : "—"}</span>
                <span style={{ fontSize: "13px", textAlign: "center" }}>{e.age}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>{e.points_debut}</span>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>{e.points_fin}</span>
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
        * = mineur — vérifier l'autorisation parentale avant publication Instagram.
      </p>
    </main>
  )
}
