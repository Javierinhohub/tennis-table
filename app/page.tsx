"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const TYPE_LABELS: Record<string, string> = {
  In: "Inversé", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
}

export default function Home() {
  const [tous, setTous] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: produits }, { data: marquesData }] = await Promise.all([
      supabase.from("produits").select("id, nom, slug, marques(id, nom), revetements(numero_larc, type_revetement, couleurs_dispo)").eq("actif", true).order("nom").limit(2000),
      supabase.from("marques").select("id, nom").order("nom")
    ])
    setTous(produits || [])
    setMarques(marquesData || [])
    setLoading(false)
  }

  const getHref = (slug: string) => "/revetements/" + slug

  const resultats = tous.filter(p => {
    const s = search.toLowerCase()
    const nomOk = !search || p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))
    const typeOk = !typeFilter || (p.revetements && p.revetements.type_revetement === typeFilter)
    const marqueOk = !marqueFilter || (p.marques && p.marques.id === marqueFilter)
    return nomOk && typeOk && marqueOk
  })

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text)", marginBottom: "4px" }}>Revêtements autorisés</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{tous.length} revêtements homologués — Liste LARC 2026</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Rechercher par nom de revêtement..." value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 2, minWidth: "200px" }} />
        <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{ paddingRight: "32px" }}>
            <option value="">Tous les types</option>
            <option value="In">Inversé</option>
            <option value="Out">Picots courts</option>
            <option value="Long">Picots longs</option>
            <option value="Anti">Anti-spin</option>
          </select>
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)", fontSize: "12px" }}>▼</span>
        </div>
        <div style={{ position: "relative", flex: 1, minWidth: "160px" }}>
          <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)} style={{ paddingRight: "32px" }}>
            <option value="">Toutes les marques</option>
            {marques.map(m => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </select>
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)", fontSize: "12px" }}>▼</span>
        </div>
        {(search || typeFilter || marqueFilter) && (
          <button onClick={() => { setSearch(""); setTypeFilter(""); setMarqueFilter("") }} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>
            Réinitialiser
          </button>
        )}
      </div>

      <div style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {resultats.length} résultat{resultats.length !== 1 ? "s" : ""}
      </div>

      {loading && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Chargement...</div>}
      {!loading && resultats.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>
          Aucun revêtement trouvé pour cette recherche.
        </div>
      )}
      {!loading && resultats.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Revêtement</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Code LARC</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Couleurs</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {resultats.map((p, i) => {
                const rev = p.revetements
                const marque = p.marques
                return (
                  <tr key={p.id}
                    onClick={() => window.location.href = getHref(p.slug)}
                    style={{ borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 500, color: "var(--text)", fontSize: "14px" }}>{p.nom}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "14px" }}>{marque?.nom}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 8px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent)" }}>{TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px", fontFamily: "monospace" }}>{rev?.numero_larc}</td>
                    <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{rev?.couleurs_dispo}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", background: "var(--success-light)", color: "var(--success)", letterSpacing: "0.3px" }}>APPROUVE</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}