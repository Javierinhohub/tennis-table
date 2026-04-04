"use client"

import { useEffect, useState } from "react"
import NoteRapide from "@/app/components/NoteRapide"
import { supabase } from "@/lib/supabase"

const TYPE_LABELS: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
}
const PAGE_SIZE = 50

export default function RevatementsClient({ initialProduits, initialTotal, marques }: {
  initialProduits: any[], initialTotal: number, marques: any[]
}) {
  const [produits, setProduits] = useState(initialProduits)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const isFiltered = search || typeFilter || marqueFilter || page > 0

  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(0) }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => {
    if (!isFiltered) {
      setProduits(initialProduits)
      setTotal(initialTotal)
      return
    }
    fetchData()
  }, [page, search, typeFilter, marqueFilter])

  async function fetchData() {
    setLoading(true)
    const from = page * PAGE_SIZE
    let query = supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements(numero_larc, type_revetement, couleurs_dispo)", { count: "exact" })
      .eq("actif", true)
      .not("revetements", "is", null)
      .order("nom")
      .range(from, from + PAGE_SIZE - 1)

    if (search) {
      const marqueMatch = marques.find(m => m.nom.toLowerCase().includes(search.toLowerCase()))
      if (marqueMatch) query = query.eq("marque_id", marqueMatch.id)
      else query = query.ilike("nom", "%" + search + "%")
    }
    if (marqueFilter) query = query.eq("marque_id", marqueFilter)

    const { data, count } = await query
    setProduits(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const getHref = (slug: string) => "/revetements/" + slug

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Revêtements autorisés</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{total} revêtements homologués — Liste LARC 2026</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input type="text" placeholder="Rechercher par nom ou marque..." value={searchInput} onChange={e => setSearchInput(e.target.value)}
          style={{ flex: 2, minWidth: "180px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif" }} />
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
          style={{ flex: 1, minWidth: "140px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif" }}>
          <option value="">Tous les types</option>
          <option value="In">Backside</option>
          <option value="Out">Picots courts</option>
          <option value="Long">Picots longs</option>
          <option value="Anti">Anti-spin</option>
        </select>
        <select value={marqueFilter} onChange={e => { setMarqueFilter(e.target.value); setPage(0) }}
          style={{ flex: 1, minWidth: "140px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
        {(searchInput || typeFilter || marqueFilter) && (
          <button onClick={() => { setSearchInput(""); setSearch(""); setTypeFilter(""); setMarqueFilter(""); setPage(0) }}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading ? "Chargement..." : total + " résultat" + (total !== 1 ? "s" : "") + " — page " + (page + 1) + " / " + (totalPages || 1)}
      </p>

      {!loading && produits.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>Aucun revêtement trouvé.</div>
      )}

      {produits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", opacity: loading ? 0.6 : 1, transition: "opacity 0.15s" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Revêtement</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Code LARC</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Couleurs</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Statut</th>
                {user && <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Noter</th>}
              </tr>
            </thead>
            <tbody>
              {produits.map((p, i) => {
                const rev = p.revetements
                const marque = p.marques
                return (
                  <tr key={p.id}
                    onClick={() => window.location.href = getHref(p.slug)}
                    style={{ borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "11px 16px", fontWeight: 500, fontSize: "14px" }}>{p.nom}</td>
                    <td style={{ padding: "11px 16px", color: "var(--text-muted)", fontSize: "14px" }}>{marque?.nom}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, padding: "3px 8px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent)" }}>{TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement}</span>
                    </td>
                    <td style={{ padding: "11px 16px", color: "var(--text-muted)", fontSize: "13px", fontFamily: "monospace" }}>{rev?.numero_larc}</td>
                    <td style={{ padding: "11px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{rev?.couleurs_dispo}</td>
                    <td style={{ padding: "11px 16px" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", background: "var(--success-light)", color: "var(--success)", letterSpacing: "0.3px" }}>APPROUVE</span>
                    </td>
                    {user && (
                      <td style={{ padding: "11px 16px" }} onClick={e => e.stopPropagation()}>
                        <NoteRapide produitId={p.id} user={user} />
                      </td>
                    )}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "6px", marginTop: "1.5rem", flexWrap: "wrap" }}>
          <button onClick={() => setPage(0)} disabled={page === 0} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.4 : 1, fontFamily: "Poppins, sans-serif" }}>«</button>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: page === 0 ? "default" : "pointer", opacity: page === 0 ? 0.4 : 1, fontFamily: "Poppins, sans-serif" }}>Précédent</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = Math.max(0, Math.min(totalPages - 5, page - 2)) + i
            return (
              <button key={p} onClick={() => setPage(p)}
                style={{ background: p === page ? "#D97757" : "var(--bg)", color: p === page ? "#fff" : "var(--text)", border: "1px solid " + (p === page ? "#D97757" : "var(--border)"), borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontWeight: p === page ? 600 : 400 }}>
                {p + 1}
              </button>
            )
          })}
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 14px", fontSize: "13px", cursor: page >= totalPages - 1 ? "default" : "pointer", opacity: page >= totalPages - 1 ? 0.4 : 1, fontFamily: "Poppins, sans-serif" }}>Suivant</button>
          <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px 12px", fontSize: "13px", cursor: page >= totalPages - 1 ? "default" : "pointer", opacity: page >= totalPages - 1 ? 0.4 : 1, fontFamily: "Poppins, sans-serif" }}>»</button>
        </div>
      )}
    </main>
  )
}