"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function Page() {
  const [tous, setTous] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: produits }, { data: marquesData }] = await Promise.all([
      supabase.from("produits").select("id, nom, slug, marques(id, nom), balles(etoiles, materiau, couleur, diametre_mm, poids_g, certification, pack_quantite)").eq("actif", true).order("nom").limit(2000),
      supabase.from("marques").select("id, nom").order("nom")
    ])
    setTous(produits || [])
    setMarques(marquesData || [])
    setLoading(false)
  }

  const getHref = (slug: string) => "/" + "balles/" + slug

  const resultats = tous.filter(p => {
    const s = search.toLowerCase()
    const nomOk = !search || p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))
    const marqueOk = !marqueFilter || (p.marques && p.marques.id === marqueFilter)
    return nomOk && marqueOk
  })

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Balles</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{tous.length} produits disponibles</p>
      </div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 2, minWidth: "200px" }} />
        <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)} style={{ flex: 1, minWidth: "160px" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
        {(search || marqueFilter) && (
          <button onClick={() => { setSearch(""); setMarqueFilter("") }} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Réinitialiser</button>
        )}
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>{resultats.length} résultat(s)</p>
      {loading && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Chargement...</div>}
      {!loading && resultats.length === 0 && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>Aucun produit trouvé.</div>}
      {!loading && resultats.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nom</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
              </tr>
            </thead>
            <tbody>
              {resultats.map((p, i) => (
                <tr key={p.id}
                  onClick={() => window.location.href = getHref(p.slug)}
                  style={{ borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{p.nom}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "14px" }}>{p.marques?.nom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}