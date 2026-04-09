"use client"

import { useEffect, useState, useMemo } from "react"
import NoteModal from "@/app/components/NoteModal"
import { supabase } from "@/lib/supabase"

const TYPE_LABELS: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
}
const ALL_TYPES = ["In", "Out", "Long", "Anti"]
const PAGE_SIZE = 50

export default function RevatementsClient({ initialProduits, initialTotal, produitsIndex }: {
  initialProduits: any[]
  initialTotal: number
  produitsIndex: any[]
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
  const [produitANoter, setProduitANoter] = useState<any>(null)

  const isFiltered = search || typeFilter || marqueFilter || page > 0

  // ── Calcul dynamique des filtres disponibles depuis l'index ──────────────

  // Marques disponibles selon le type sélectionné
  const marquesDisponibles = useMemo(() => {
    const subset = typeFilter
      ? produitsIndex.filter((p: any) => p.revetements?.type_revetement === typeFilter)
      : produitsIndex

    const map = new Map<string, any>()
    subset.forEach((p: any) => {
      const m = p.marques
      if (m && !map.has(m.id)) map.set(m.id, m)
    })
    return Array.from(map.values()).sort((a, b) => a.nom.localeCompare(b.nom))
  }, [produitsIndex, typeFilter])

  // Types disponibles selon la marque sélectionnée
  const typesDisponibles = useMemo(() => {
    const subset = marqueFilter
      ? produitsIndex.filter((p: any) => p.marque_id === marqueFilter)
      : produitsIndex

    const types = new Set<string>()
    subset.forEach((p: any) => {
      if (p.revetements?.type_revetement) types.add(p.revetements.type_revetement)
    })
    return ALL_TYPES.filter(t => types.has(t))
  }, [produitsIndex, marqueFilter])

  // Si le filtre actif n'est plus disponible → le réinitialiser automatiquement
  useEffect(() => {
    if (marqueFilter && !marquesDisponibles.find((m: any) => m.id === marqueFilter)) {
      setMarqueFilter("")
    }
  }, [marquesDisponibles])

  useEffect(() => {
    if (typeFilter && !typesDisponibles.includes(typeFilter)) {
      setTypeFilter("")
    }
  }, [typesDisponibles])

  // ── Debounce recherche ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(0) }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user || null))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Fetch ─────────────────────────────────────────────────────────────────
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

    if (search) query = query.ilike("nom", "%" + search + "%")
    if (marqueFilter) query = query.eq("marque_id", marqueFilter)

    const { data, count } = await query
    let results = data || []

    if (typeFilter) {
      results = results.filter((p: any) => p.revetements?.type_revetement === typeFilter)
    }

    setProduits(results)
    setTotal(count || 0)
    setLoading(false)
  }

  const reset = () => {
    setSearchInput(""); setSearch(""); setTypeFilter(""); setMarqueFilter(""); setPage(0)
    setProduits(initialProduits); setTotal(initialTotal)
  }

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)",
    borderRadius: "8px", fontFamily: "Poppins, sans-serif", outline: "none",
    background: "#fff", color: "var(--text)",
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Revêtements</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{total.toLocaleString("fr-FR")} revêtements LARC 2026</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
        {/* Recherche texte */}
        <input type="text" placeholder="Rechercher..." value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          style={{ ...inputStyle, flex: 2, minWidth: "200px" }} />

        {/* Filtre type — options filtrées selon la marque */}
        <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "140px" }}>
          <option value="">Tous les types</option>
          {typesDisponibles.map(t => (
            <option key={t} value={t}>{TYPE_LABELS[t]}</option>
          ))}
        </select>

        {/* Filtre marque — options filtrées selon le type */}
        <select value={marqueFilter} onChange={e => { setMarqueFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "160px" }}>
          <option value="">Toutes les marques</option>
          {marquesDisponibles.map((m: any) => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
        </select>

        {(searchInput || typeFilter || marqueFilter) && (
          <button onClick={reset}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading ? "Recherche..." : `${produits.length} résultat${produits.length > 1 ? "s" : ""} sur ${total.toLocaleString("fr-FR")}`}
      </p>

      {loading && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Chargement...
        </div>
      )}

      {!loading && produits.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Aucun revêtement trouvé.
        </div>
      )}

      {!loading && produits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["Nom", "Marque", "Type", "LARC"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
                {user && <th style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Note</th>}
              </tr>
            </thead>
            <tbody>
              {produits.map((p: any, i: number) => (
                <tr key={p.id}
                  onClick={() => window.location.href = "/revetements/" + p.slug}
                  style={{ borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{p.nom}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.marques?.nom}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.revetements?.type_revetement && (
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px",
                        background: p.revetements.type_revetement === "In" ? "#EBF5FF" : p.revetements.type_revetement === "Long" ? "#F0FDF4" : "#FFF7ED",
                        color: p.revetements.type_revetement === "In" ? "#1A56DB" : p.revetements.type_revetement === "Long" ? "#0E7F4F" : "#D97757"
                      }}>
                        {TYPE_LABELS[p.revetements.type_revetement]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.revetements?.numero_larc || "—"}</td>
                  {user && (
                    <td style={{ padding: "12px 16px" }} onClick={e => { e.stopPropagation(); setProduitANoter(p) }}>
                      <span style={{ fontSize: "12px", color: "#D97757", fontWeight: 500, cursor: "pointer" }}>⭐ Noter</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && !typeFilter && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.5rem", flexWrap: "wrap" as const }}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page === 0 ? "var(--bg)" : "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>
            ← Précédent
          </button>
          <span style={{ padding: "8px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
            Page {page + 1} / {totalPages}
          </span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page >= totalPages - 1 ? "var(--bg)" : "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}>
            Suivant →
          </button>
        </div>
      )}

      {produitANoter && user && (
        <NoteModal produit={produitANoter} userId={user.id} onClose={() => setProduitANoter(null)} />
      )}
    </main>
  )
}
