"use client"

import { useState, useMemo } from "react"

export default function BoisClient({ produits, marques }: { produits: any[], marques: any[] }) {
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")

  const resultats = useMemo(() => {
    if (!search && !marqueFilter) return produits
    const s = search.toLowerCase()
    return produits.filter(p => {
      const nomOk = !search || p.nom.toLowerCase().includes(s) || (p.marques?.nom || "").toLowerCase().includes(s)
      const marqueOk = !marqueFilter || p.marques?.id === marqueFilter
      return nomOk && marqueOk
    })
  }, [produits, search, marqueFilter])

  const inputStyle: React.CSSProperties = {
    flex: 2, minWidth: "200px", padding: "10px 14px", fontSize: "14px",
    border: "1px solid var(--border)", borderRadius: "8px",
    fontFamily: "Poppins, sans-serif", outline: "none", background: "#fff",
  }

  return (
    <>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
        <input type="text" placeholder="Rechercher un bois..." value={search}
          onChange={e => setSearch(e.target.value)} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} style={inputStyle} />
        <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: "160px" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
        {(search || marqueFilter) && (
          <button onClick={() => { setSearch(""); setMarqueFilter("") }}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>{resultats.length} résultat(s)</p>

      {resultats.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>
          Aucun bois trouvé.
        </div>
      )}

      {resultats.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["Nom", "Marque", "Plis", "Poids", "Composition"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultats.map((p: any, i: number) => (
                <tr key={p.id}
                  onClick={() => window.location.href = "/bois/" + p.slug}
                  style={{ borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "14px" }}>{p.nom}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.marques?.nom}</td>
                  <td style={{ padding: "12px 16px", textAlign: "center" as const }}>
                    {p.bois?.nb_plis ? <span style={{ background: "#FFF0EB", color: "#D97757", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, fontSize: "12px" }}>{p.bois.nb_plis} plis</span> : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" as const, fontSize: "13px", color: "var(--text-muted)" }}>
                    {p.bois?.poids_g ? p.bois.poids_g + "g" : "—"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "12px", color: "var(--text-muted)", maxWidth: "280px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {p.bois?.composition || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
