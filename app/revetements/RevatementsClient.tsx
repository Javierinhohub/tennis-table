"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import NoteModal from "@/app/components/NoteModal"
import ComparaisonModal from "@/app/components/ComparaisonModal"
import { supabase } from "@/lib/supabase"
import { useT } from "@/lib/useT"
import { useLocale } from "@/lib/useLocale"

const TYPE_LABELS_FR: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin"
}
const TYPE_LABELS_EN: Record<string, string> = {
  In: "Backside", Out: "Short pips", Mid: "Medium pips", Long: "Long pips", Anti: "Anti-spin"
}
const ALL_TYPES = ["In", "Out", "Mid", "Long", "Anti"]
const PAGE_SIZE = 50

export default function RevatementsClient({ initialProduits, initialTotal, produitsIndex, toutesMarques, avisCount, notesCount, videoCount }: {
  initialProduits: any[]
  initialTotal: number
  produitsIndex: any[]
  toutesMarques: { id: string; nom: string; nbRevs: number }[]
  avisCount: Record<string, number>
  notesCount: Record<string, number>
  videoCount: Record<string, number>
}) {
  const searchParams = useSearchParams()
  const t = useT()
  const locale = useLocale()
  const TYPE_LABELS = locale === "en" ? TYPE_LABELS_EN : TYPE_LABELS_FR

  const [produits, setProduits] = useState(initialProduits)
  const [total, setTotal] = useState(initialTotal)
  const [page, setPage] = useState(0)
  // Initialiser depuis ?q= (lien "Tout voir" de la page d'accueil)
  const [searchInput, setSearchInput] = useState(() => searchParams.get("q") || "")
  const [search, setSearch] = useState(() => searchParams.get("q") || "")
  const [typeFilter, setTypeFilter] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [loading, setLoading] = useState(() => !!(searchParams.get("q")))
  const [user, setUser] = useState<any>(null)
  const [produitANoter, setProduitANoter] = useState<any>(null)
  const [selection, setSelection] = useState<any[]>([])
  const [showComparaison, setShowComparaison] = useState(false)

  const toggleSelection = (p: any) => {
    setSelection(prev => {
      if (prev.find(s => s.id === p.id)) return prev.filter(s => s.id !== p.id)
      if (prev.length >= 3) return prev
      return [...prev, p]
    })
  }

  const isFiltered = search || typeFilter || marqueFilter || page > 0

  // Toutes les marques toujours disponibles (pas de restriction par type)
  const marquesDisponibles = toutesMarques

  // Types disponibles (toujours tous)
  const typesDisponibles = ALL_TYPES

  // ── Debounce recherche ───────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => { setSearch(searchInput); setPage(0) }, 350)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, typeFilter, marqueFilter])

  async function fetchData() {
    setLoading(true)
    const from = page * PAGE_SIZE

    // Utiliser !inner pour filtrer les produits qui ont bien un revêtement
    let query = supabase
      .from("produits")
      .select(
        "id, nom, slug, marques(id, nom), revetements!inner(numero_larc, type_revetement, couleurs_dispo, prix)",
        { count: "exact" }
      )
      .eq("actif", true)
      .order("nom")
      .range(from, from + PAGE_SIZE - 1)

    if (search) query = query.ilike("nom", "%" + search + "%")
    if (marqueFilter) query = query.eq("marque_id", marqueFilter)
    // Filtre type côté DB grâce à PostgREST embedded resource filtering
    if (typeFilter) query = (query as any).eq("revetements.type_revetement", typeFilter)

    const { data, count } = await query
    // Trier : produits avec avis en premier
    const sorted = [...(data || [])].sort(
      (a: any, b: any) => (avisCount[b.id] || 0) - (avisCount[a.id] || 0)
    )
    setProduits(sorted)
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
  const hasFilter = !!(searchInput || typeFilter || marqueFilter)

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{t("rubbers", "title")}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{total.toLocaleString("fr-FR")} {t("rubbers", "subtitle")}</p>
        </div>
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
          <span>{t("common", "compare")}</span>
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
            placeholder={t("rubbers", "searchPlaceholder")}
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
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "140px" }}
        >
          <option value="">{t("rubbers", "allTypes")}</option>
          {typesDisponibles.map(tp => (
            <option key={tp} value={tp}>{TYPE_LABELS[tp]}</option>
          ))}
        </select>

        <select
          value={marqueFilter}
          onChange={e => { setMarqueFilter(e.target.value); setPage(0) }}
          style={{ ...inputStyle, flex: 1, minWidth: "160px" }}
        >
          <option value="">{t("rubbers", "allBrands")}</option>
          {toutesMarques.filter(m => m.nbRevs >= 11).map((m) => (
            <option key={m.id} value={m.id}>{m.nom}</option>
          ))}
          <optgroup label={locale === "en" ? "── Other brands ──" : "── Autres marques ──"}>
            {toutesMarques.filter(m => m.nbRevs < 11).map((m) => (
              <option key={m.id} value={m.id}>{m.nom}</option>
            ))}
          </optgroup>
        </select>

        {hasFilter && (
          <button
            onClick={reset}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
          >
            ✕ {locale === "en" ? "Reset" : "Réinitialiser"}
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading ? t("common", "loading") : locale === "en"
          ? `${produits.length} result${produits.length > 1 ? "s" : ""} out of ${total.toLocaleString()}`
          : `${produits.length} résultat${produits.length > 1 ? "s" : ""} sur ${total.toLocaleString("fr-FR")}`}
      </p>

      {loading && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          {t("common", "loading")}
        </div>
      )}

      {!loading && produits.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          {locale === "en" ? "No rubber found." : "Aucun revêtement trouvé."}
          {hasFilter && (
            <button onClick={reset} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#D97757", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              ← {locale === "en" ? "Reset filters" : "Réinitialiser les filtres"}
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
                {[t("rubbers","colName"), t("rubbers","brand"), t("rubbers","colType"), t("rubbers","colPrice"), t("rubbers","colNotes"), t("rubbers","colReviews"), t("common","videos")].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
                {user && (
                  <th style={{ padding: "10px 16px", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{locale === "en" ? "Rate" : "Note"}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {produits.map((p: any, i: number) => (
                <tr
                  key={p.id}
                  onClick={() => window.location.href = "/revetements/" + p.slug}
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
                  <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{p.nom}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.marques?.nom}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {p.revetements?.type_revetement && (
                      <span style={{
                        fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px",
                        background: p.revetements.type_revetement === "In" ? "#EBF5FF"
                          : p.revetements.type_revetement === "Long" ? "#F0FDF4"
                          : p.revetements.type_revetement === "Mid" ? "#F5F0FF" : "#FFF7ED",
                        color: p.revetements.type_revetement === "In" ? "#1A56DB"
                          : p.revetements.type_revetement === "Long" ? "#0E7F4F"
                          : p.revetements.type_revetement === "Mid" ? "#7C3AED" : "#D97757",
                      }}>
                        {TYPE_LABELS[p.revetements.type_revetement]}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: "13px", fontWeight: p.revetements?.prix ? 600 : 400, color: p.revetements?.prix ? "var(--text)" : "var(--text-muted)" }}>
                    {p.revetements?.prix ? p.revetements.prix + " €" : "—"}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {notesCount[p.id] > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#1A56DB", background: "#EBF5FF", padding: "2px 8px", borderRadius: "10px" }}>
                        {notesCount[p.id]} {t("common", "notes")}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {avisCount[p.id] > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#D97757", background: "#FFF0EB", padding: "2px 8px", borderRadius: "10px" }}>
                        {avisCount[p.id]} {t("common", "reviews")}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    {videoCount[p.id] > 0 ? (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "#7C3AED", background: "#F5F0FF", padding: "2px 8px", borderRadius: "10px" }}>
                        ▶ {videoCount[p.id]}
                      </span>
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>—</span>
                    )}
                  </td>
                  {user && (
                    <td
                      style={{ padding: "12px 16px" }}
                      onClick={e => { e.stopPropagation(); setProduitANoter(p) }}
                    >
                      <span style={{ fontSize: "12px", color: "#D97757", fontWeight: 500, cursor: "pointer" }}>⭐ {locale === "en" ? "Rate" : "Noter"}</span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination — toujours visible si nécessaire */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "1.5rem", flexWrap: "wrap" as const }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page === 0 ? "var(--bg)" : "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}
          >
            ← {locale === "en" ? "Previous" : "Précédent"}
          </button>
          <span style={{ padding: "8px 16px", fontSize: "13px", color: "var(--text-muted)" }}>
            {locale === "en" ? "Page" : "Page"} {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: page >= totalPages - 1 ? "var(--bg)" : "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif" }}
          >
            {locale === "en" ? "Next" : "Suivant"} →
          </button>
        </div>
      )}

      {produitANoter && user && (
        <NoteModal produit={produitANoter} userId={user.id} onClose={() => setProduitANoter(null)} />
      )}

      {showComparaison && selection.length >= 2 && (
        <ComparaisonModal
          produits={selection}
          type="revetement"
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
            {selection.length < 2 ? (locale === "en" ? "Select 2 min." : "Sélectionner 2 min.") : t("common", "compare")}
          </button>
        </div>
      )}
    </main>
  )
}
