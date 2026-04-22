"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const NIVEAU_COLORS: Record<string, { bg: string; color: string }> = {
  loisir:       { bg: "#F0FDF4", color: "#0E7F4F" },
  club:         { bg: "#EBF5FF", color: "#1A56DB" },
  compétition:  { bg: "#FFF0EB", color: "#D97757" },
}

export default function TablesPage() {
  const [tables, setTables] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [typeFilter, setTypeFilter] = useState("")   // '' | 'intérieur' | 'extérieur'
  const [niveauFilter, setNiveauFilter] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [marques, setMarques] = useState<string[]>([])

  useEffect(() => { fetchAll() }, [search, typeFilter, niveauFilter, marqueFilter])

  // Debounce de la recherche texte
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 350)
    return () => clearTimeout(t)
  }, [searchInput])

  async function fetchAll() {
    setLoading(true)
    let q = supabase
      .from("tables_tt")
      .select("id, marque, nom, type, niveau", { count: "exact" })
      .eq("actif", true)
      .order("marque")
      .order("nom")
      .limit(500)

    if (search) q = q.or(`nom.ilike.%${search}%,marque.ilike.%${search}%`)
    if (typeFilter) q = q.eq("type", typeFilter)
    if (niveauFilter) q = q.eq("niveau", niveauFilter)
    if (marqueFilter) q = q.eq("marque", marqueFilter)

    const { data, count } = await q
    setTables(data || [])
    setTotal(count || 0)

    // Marques distinctes
    if (!marques.length) {
      const { data: all } = await supabase
        .from("tables_tt")
        .select("marque")
        .eq("actif", true)
        .order("marque")
      if (all) {
        const uniq = [...new Set(all.map((r: any) => r.marque))]
        setMarques(uniq)
      }
    }
    setLoading(false)
  }

  const reset = () => {
    setSearchInput(""); setSearch(""); setTypeFilter(""); setNiveauFilter(""); setMarqueFilter("")
  }
  const hasFilter = !!(searchInput || typeFilter || niveauFilter || marqueFilter)

  const inp: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", outline: "none",
    color: "var(--text)", fontFamily: "Poppins, sans-serif",
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Tables de tennis de table</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          {loading ? "Chargement..." : `${total} table${total > 1 ? "s" : ""} référencée${total > 1 ? "s" : ""}`}
        </p>
      </div>

      {/* Filtres */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {/* Recherche */}
        <div style={{ flex: 2, minWidth: "200px" }}>
          <input type="text" placeholder="Rechercher une table..." value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            autoComplete="off"
            style={{ ...inp, width: "100%", boxSizing: "border-box" }} />
        </div>

        {/* Type intérieur/extérieur */}
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "160px" }}>
          <option value="">Intérieur & Extérieur</option>
          <option value="intérieur">Intérieur</option>
          <option value="extérieur">Extérieur</option>
        </select>

        {/* Niveau */}
        <select value={niveauFilter} onChange={e => setNiveauFilter(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "150px" }}>
          <option value="">Tous les niveaux</option>
          <option value="loisir">Loisir</option>
          <option value="club">Club</option>
          <option value="compétition">Compétition</option>
        </select>

        {/* Marque */}
        <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "160px" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        {hasFilter && (
          <button onClick={reset}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Réinitialiser
          </button>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Chargement...
        </div>
      )}

      {!loading && tables.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucune table trouvée.
          {hasFilter && (
            <button onClick={reset} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#D97757", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {!loading && tables.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["Marque", "Modèle", "Type", "Niveau"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tables.map((t, i) => {
                const nc = NIVEAU_COLORS[t.niveau] || NIVEAU_COLORS.loisir
                return (
                  <tr key={t.id}
                    style={{ borderBottom: i < tables.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "14px", color: "#D97757" }}>{t.marque}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{t.nom}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "10px",
                        background: t.type === "intérieur" ? "#F5F0FF" : "#FFF0EB",
                        color: t.type === "intérieur" ? "#7C3AED" : "#D97757",
                      }}>
                        {t.type === "intérieur" ? "Intérieur" : "Extérieur"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "10px", background: nc.bg, color: nc.color }}>
                        {t.niveau.charAt(0).toUpperCase() + t.niveau.slice(1)}
                      </span>
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
