"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import ComparaisonModal from "@/app/components/ComparaisonModal"

const STYLE_LABELS: Record<string, string> = {
  "OFF+":  "Offensif++",
  "OFF":   "Offensif",
  "OFF-":  "Offensif-",
  "ALL+":  "Polyvalent+",
  "ALL":   "Polyvalent",
  "ALL-":  "Polyvalent-",
  "DEF+":  "Défensif+",
  "DEF":   "Défensif",
  "DEF-":  "Défensif-",
}
const STYLE_ORDER = ["OFF+", "OFF", "OFF-", "ALL+", "ALL", "ALL-", "DEF+", "DEF", "DEF-"]
const PAGE_SIZE = 50

export default function BoisClient({
  initialProduits,
  initialTotal,
  toutesMarques,
  avisCount,
  notesCount,
}: {
  initialProduits: any[]
  initialTotal: number
  toutesMarques: { id: string; nom: string }[]
  avisCount: Record<string, number>
  notesCount: Record<string, number>
}) {
  const [produits, setProduits] = useState(initialProduits)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(0)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [styleFilter, setStyleFilter] = useState("")
  const [loading, setLoading] = useState(false)
  const [selection, setSelection] = useState<any[]>([])
  const [showComparaison, setShowComparaison] = useState(false)

  const isFiltered = !!(search || marqueFilter || styleFilter || page > 0)

  // Debounce recherche
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(0) }, 350)
    return () => clearTimeout(timer)
  }, [searchInput])

  // Fetch serveur à chaque changement de filtre / page
  useEffect(() => {
    if (!isFiltered) {
      setProduits(initialProduits)
      setTotal(initialTotal)
      return
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, marqueFilter, styleFilter])

  async function fetchData() {
    setLoading(true)
    const from = page * PAGE_SIZE
    let query = supabase
      .from("produits")
      .select(
        "id, nom, slug, marques(id, nom), bois!inner(nb_plis, poids_g, epaisseur_mm, style, composition)",
        { count: "exact" }
      )
      .eq("actif", true)
      .order("nom")
      .range(from, from + PAGE_SIZE - 1)

    if (search)       query = query.ilike("nom", "%" + search + "%")
    if (marqueFilter) query = query.eq("marque_id", marqueFilter)
    if (styleFilter)  query = (query as any).eq("bois.style", styleFilter)

    const { data, count } = await query
    setProduits(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  const reset = () => {
    setSearchInput(""); setSearch(""); setMarqueFilter(""); setStyleFilter(""); setPage(0)
    setProduits(initialProduits); setTotal(initialTotal)
  }

  const toggleSelection = (p: any) => {
    setSelection(prev => {
      if (prev.find(s => s.id === p.id)) return prev.filter(s => s.id !== p.id)
      if (prev.length >= 3) return prev
      return [...prev, p]
    })
  }

  const hasFilter = !!(searchInput || marqueFilter || styleFilter)
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)",
    borderRadius: "8px", fontFamily: "Poppins, sans-serif", outline: "none",
    background: "#fff", color: "var(--text)",
  }

  return (
    <>
      {/* Bouton comparer */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
        <button
          onClick={() => selection.length >= 2 && setShowComparaison(true)}
          disabled={selection.length < 2}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: selection.length >= 2 ? "#D97757" : "var(--bg)",
            color: selection.length >= 2 ? "#fff" : "var(--text-muted)",
            border: `1.5px solid ${selection.length >= 2 ? "#D97757" : "var(--border)"}`,
            borderRadius: "10px", padding: "10px 18px", fontSize: "14px", fontWeight: 600,
            cursor: selection.length >= 2 ? "pointer" : "not-allowed",
            fontFamily: "Poppins, sans-serif", transition: "all 0.15s",
          }}
        >
          <span>Comparer</span>
          <span style={{
            background: selection.length >= 2 ? "rgba(255,255,255,0.25)" : "var(--border)",
            borderRadius: "20px", padding: "1px 8px", fontSize: "12px", fontWeight: 700,
          }}>{selection.length}/3</span>
        </button>
      </div>

      {/* Barre de filtres */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" as const }}>
        <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
          <input
            type="text"
            placeholder="Rechercher un bois..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            style={{ ...inputStyle, width: "100%", paddingRight: searchInput ? "36px" : "14px", boxSizing: "border-box" as const }}
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); setSearch(""); setPage(0) }}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#aaa",
                fontSize: "14px", padding: "2px", lineHeight: 1,
              }}
            >✕</button>
          )}
        </div>

        <select
          value={marqueFilter}
          onChange={e => { setMarqueFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "160px" }}
        >
          <option value="">Toutes les marques</option>
          {toutesMarques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>

        <select
          value={styleFilter}
          onChange={e => { setStyleFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "150px" }}
        >
          <option value="">Tous les styles</option>
          {STYLE_ORDER.map(s => (
            <option key={s} value={s}>{STYLE_LABELS[s]}</option>
          ))}
        </select>

        {hasFilter && (
          <button
            onClick={reset}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading
          ? "Recherche en cours..."
          : `${produits.length} résultat${produits.length > 1 ? "s" : ""} sur ${total.toLocaleString("fr-FR")}`}
      </p>

      {loading && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Chargement...
        </div>
      )}

      {!loading && produits.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>
          Aucun bois trouvé.
          {hasFilter && (
            <button onClick={reset} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#D97757", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              ← Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {!loading && produits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                <th style={{ padding: "10px 12px", width: "44px" }} />
                {["Nom", "Marque", "Style", "Plis", "Prix", "Notes", "Avis"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {produits.map((p: any, i: number) => (
                <tr
                  key={p.id}
                  onClick={() => window.location.href = "/bois/" + p.slug}
                  style={{ borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "8px 12px" }} onClick={e => { e.stopPropagation(); toggleSelection(p) }}>
                    <div style={{
                      width: "20px", height: "20px", borderRadius: "6px", border: "2px solid",
                      borderColor: selection.find(s => s.id === p.id) ? "#D97757" : "var(--border)",
                      background: selection.find(s => s.id === p.id) ? "#D97757" : "#fff",
                      cursor: !selection.find(s => s.id === p.id) && selection.length >= 3 ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.1s",
                    }}>
                      {selection.find(s => s.id === p.id) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "14px" }}>
                    {highlightMatch(p.nom, searchInput)}
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>
                    {p.marques?.nom}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.bois?.style && (
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px",
                        background: p.bois.style.startsWith("OFF") ? "#FFF0EB"
                          : p.bois.style.startsWith("DEF") ? "#F0FDF4" : "#EBF5FF",
                        color: p.bois.style.startsWith("OFF") ? "#D97757"
                          : p.bois.style.startsWith("DEF") ? "#0E7F4F" : "#1A56DB",
                      }}>
                        {STYLE_LABELS[p.bois.style] || p.bois.style}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" as const }}>
                    {p.bois?.nb_plis
                      ? <span style={{ background: "#F5F0FF", color: "#7C3AED", padding: "2px 8px", borderRadius: "10px", fontWeight: 600, fontSize: "12px" }}>{p.bois.nb_plis} plis</span>
                      : <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>—</span>}
                  </td>
                  <td style={{ padding: "12px 16px", textAlign: "center" as const, fontSize: "13px", fontWeight: p.bois?.prix ? 600 : 400, color: p.bois?.prix ? "var(--text)" : "var(--text-muted)" }}>
                    {p.bois?.prix ? p.bois.prix + " €" : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {notesCount[p.id] > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A56DB", background: "#EBF5FF", padding: "2px 8px", borderRadius: "10px" }}>
                        {notesCount[p.id]} note{notesCount[p.id] > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {avisCount[p.id] > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#D97757", background: "#FFF0EB", padding: "2px 8px", borderRadius: "10px" }}>
                        {avisCount[p.id]} avis
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginTop: "1.5rem", flexWrap: "wrap" as const }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page === 0 ? "var(--bg)" : "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif", color: page === 0 ? "var(--text-muted)" : "var(--text)" }}
          >
            ← Précédent
          </button>
          <span style={{ padding: "8px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
            Page {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page >= totalPages - 1 ? "var(--bg)" : "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif", color: page >= totalPages - 1 ? "var(--text-muted)" : "var(--text)" }}
          >
            Suivant →
          </button>
        </div>
      )}

      {showComparaison && selection.length >= 2 && (
        <ComparaisonModal
          produits={selection}
          type="bois"
          onClose={() => setShowComparaison(false)}
        />
      )}

      {/* Barre flottante sélection */}
      {selection.length > 0 && !showComparaison && (
        <div style={{
          position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
          background: "#1F2937", color: "#fff", borderRadius: "14px",
          padding: "12px 20px", display: "flex", alignItems: "center", gap: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)", zIndex: 500, whiteSpace: "nowrap",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {selection.map((p, i) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: "5px",
                background: "rgba(255,255,255,0.1)", borderRadius: "6px", padding: "4px 10px",
                borderLeft: `3px solid ${["#D97757","#1A56DB","#0E7F4F"][i]}`,
              }}>
                <span style={{ fontSize: "12px", fontWeight: 600 }}>{p.nom}</span>
                <button onClick={() => toggleSelection(p)} style={{
                  background: "none", border: "none", color: "#9CA3AF", cursor: "pointer",
                  fontSize: "12px", padding: "0 2px", lineHeight: 1,
                }}>✕</button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowComparaison(true)}
            disabled={selection.length < 2}
            style={{
              background: selection.length >= 2 ? "#D97757" : "#6B7280",
              color: "#fff", border: "none", borderRadius: "8px",
              padding: "8px 18px", fontSize: "13px", fontWeight: 700,
              cursor: selection.length >= 2 ? "pointer" : "not-allowed",
              fontFamily: "Poppins, sans-serif",
            }}
          >
            {selection.length < 2 ? "Sélectionner 2 min." : "Comparer"}
          </button>
        </div>
      )}
    </>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: "#D97757" }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </>
  )
}
