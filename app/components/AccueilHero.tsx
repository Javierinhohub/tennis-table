"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"

type Result = { id: string, nom: string, slug: string, type: string, detail?: string }

const TYPE_COLORS: Record<string, string> = {
  "Revêtement": "#1A56DB",
  "Bois": "#0E7F4F",
  "Marque": "#D97757",
  "Article": "#D97757",
  "Conseil": "#7C3AED",
  "Joueur": "#EF4444",
}
const TYPE_LABELS: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin"
}

export default function AccueilHero() {
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const showDropdown = focused && search.length >= 2

  const fetchResults = useCallback(async (q: string) => {
    setLoading(true)
    const pattern = "%" + q + "%"

    const [revs, boisData, marqData, arts, joueurs] = await Promise.all([
      // !inner → filtre uniquement les produits ayant un revêtement
      supabase
        .from("produits")
        .select("id, nom, slug, marques(nom), revetements!inner(type_revetement)")
        .ilike("nom", pattern)
        .eq("actif", true)
        .order("nom")
        .limit(5),
      supabase
        .from("produits")
        .select("id, nom, slug, marques(nom), bois!inner(nb_plis)")
        .ilike("nom", pattern)
        .eq("actif", true)
        .order("nom")
        .limit(4),
      supabase
        .from("marques")
        .select("id, nom, slug")
        .ilike("nom", pattern)
        .order("nom")
        .limit(3),
      supabase
        .from("articles")
        .select("id, titre, slug, categorie")
        .ilike("titre", pattern)
        .eq("publie", true)
        .limit(2),
      supabase
        .from("joueurs_pro")
        .select("id, nom, pays")
        .ilike("nom", pattern)
        .limit(2),
    ])

    const all: Result[] = []

    revs.data?.forEach(p => all.push({
      id: p.id,
      nom: p.nom,
      slug: "/revetements/" + p.slug,
      type: "Revêtement",
      detail: (p.marques as any)?.nom + (p.revetements ? " · " + (TYPE_LABELS[(p.revetements as any).type_revetement] || "") : ""),
    }))
    boisData.data?.forEach(p => all.push({
      id: "b" + p.id,
      nom: p.nom,
      slug: "/bois/" + p.slug,
      type: "Bois",
      detail: (p.marques as any)?.nom,
    }))
    marqData.data?.forEach(m => all.push({
      id: "m" + m.id,
      nom: m.nom,
      slug: "/marques/" + m.slug,
      type: "Marque",
      detail: "Voir tous les produits",
    }))
    arts.data?.forEach(a => all.push({
      id: "a" + a.id,
      nom: a.titre,
      slug: "/articles/" + a.slug,
      type: a.categorie === "conseil" ? "Conseil" : "Article",
      detail: "",
    }))
    joueurs.data?.forEach(j => all.push({
      id: "j" + j.id,
      nom: j.nom,
      slug: "/joueurs/" + j.id,
      type: "Joueur",
      detail: j.pays,
    }))

    setResultats(all)
    setActiveIndex(-1)
    setLoading(false)
  }, [])

  useEffect(() => {
    if (search.length < 2) { setResultats([]); setLoading(false); setActiveIndex(-1); return }
    setLoading(true)
    const timer = setTimeout(() => fetchResults(search), 200)
    return () => clearTimeout(timer)
  }, [search, fetchResults])

  // Navigation clavier
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) return
    const items = resultats.length > 0 ? resultats.length + 1 : 0 // +1 pour "Tout voir"

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(i => Math.min(i + 1, items - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(i => Math.max(i - 1, -1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (activeIndex === -1 || activeIndex === resultats.length) {
        // Chercher dans revêtements
        window.location.href = "/revetements?q=" + encodeURIComponent(search)
      } else if (resultats[activeIndex]) {
        window.location.href = resultats[activeIndex].slug
      }
    } else if (e.key === "Escape") {
      setFocused(false)
      inputRef.current?.blur()
    }
  }

  const clearSearch = () => {
    setSearch("")
    setResultats([])
    setActiveIndex(-1)
    inputRef.current?.focus()
  }

  return (
    <section style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", padding: "3rem 2rem 2.5rem", textAlign: "center" as const }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Bienvenue chez TT-Kip
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem" }}>On évalue les équip&apos;</p>

        <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto" }}>
          {/* Champ de recherche */}
          <div style={{ position: "relative" }}>
            <input
              ref={inputRef}
              type="text"
              placeholder="Rechercher revêtement, bois, marque, joueur..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 200)}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
              name="search_ttk" id="search_ttk"
              style={{
                width: "100%", padding: "14px 80px 14px 18px", fontSize: "16px",
                border: "none", borderRadius: showDropdown && (resultats.length > 0 || loading) ? "12px 12px 0 0" : "12px",
                outline: "none", background: "#fff", color: "#111",
                fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const,
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              }}
            />
            {/* Bouton clear */}
            {search.length > 0 && (
              <button
                onMouseDown={e => { e.preventDefault(); clearSearch() }}
                style={{
                  position: "absolute", right: "44px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "16px",
                  color: "#aaa", padding: "4px", display: "flex", alignItems: "center",
                }}
                aria-label="Effacer"
              >✕</button>
            )}
            <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "15px", pointerEvents: "none" as const, color: "#aaa" }}>
              {loading ? "..." : "🔍"}
            </span>
          </div>

          {/* Dropdown résultats */}
          {showDropdown && (
            <div
              ref={listRef}
              style={{
                position: "absolute", top: "100%", left: 0, right: 0,
                background: "#fff", borderRadius: "0 0 12px 12px",
                overflow: "hidden", zIndex: 10,
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                textAlign: "left" as const,
                borderTop: "1px solid #f0f0f0",
              }}
            >
              {/* Aucun résultat */}
              {!loading && resultats.length === 0 && (
                <p style={{ fontSize: "14px", color: "#888", textAlign: "center" as const, padding: "16px" }}>
                  Aucun résultat pour « {search} »
                </p>
              )}

              {/* Liste des résultats */}
              {resultats.map((r, i) => (
                <a
                  key={r.id}
                  href={r.slug}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "11px 16px", textDecoration: "none", color: "#111",
                    borderBottom: "1px solid #f0f0f0",
                    background: activeIndex === i ? "#f0f6ff" : "#fff",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <div style={{ overflow: "hidden", flex: 1, minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>
                      {highlightMatch(r.nom, search)}
                    </span>
                    {r.detail && (
                      <span style={{ color: "#888", fontSize: "12px", marginLeft: "8px" }}>{r.detail}</span>
                    )}
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px",
                    background: (TYPE_COLORS[r.type] || "#D97757") + "20",
                    color: TYPE_COLORS[r.type] || "#D97757",
                    flexShrink: 0, marginLeft: "8px",
                  }}>
                    {r.type}
                  </span>
                </a>
              ))}

              {/* Pied : tout voir */}
              {resultats.length > 0 && (
                <div
                  style={{
                    padding: "8px 16px", fontSize: "12px", color: "#888",
                    background: activeIndex === resultats.length ? "#f0f6ff" : "#f9f9f9",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    transition: "background 0.1s", cursor: "pointer",
                  }}
                  onMouseEnter={() => setActiveIndex(resultats.length)}
                  onMouseLeave={() => setActiveIndex(-1)}
                >
                  <span>{resultats.length} résultat{resultats.length > 1 ? "s" : ""}</span>
                  <a
                    href={"/revetements?q=" + encodeURIComponent(search)}
                    style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}
                  >
                    Voir tous les revêtements →
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

/** Met en gras la portion recherchée dans le nom */
function highlightMatch(text: string, query: string) {
  if (!query) return <>{text}</>
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
