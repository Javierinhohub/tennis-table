"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const CAT_LABELS: Record<string, string> = {
  "revetements-inverse": "Backside",
  "revetements-picots-courts": "Picots courts",
  "revetements-picots-longs": "Picots longs",
  "revetements-anti-spin": "Anti-spin",
  "bois-offensif": "Bois offensif",
  "bois-defensif": "Bois défensif",
  "bois-tout-jeu": "Bois tout-jeu",
  "bois-penhold": "Bois penhold",
  "balles-competition": "Balle compétition",
  "balles-entrainement": "Balle entraînement",
  "colles-base-eau": "Colle base eau",
  "colles-autre": "Colle",
  "chaussures-homme": "Chaussure homme",
  "chaussures-femme": "Chaussure femme",
  "chaussures-junior": "Chaussure junior",
}

export default function AdminSearchBar({ onSelect }: { onSelect?: (p: any) => void }) {
  const [query, setQuery] = useState("")
  const [resultats, setResultats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (query.length < 2) { setResultats([]); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("produits")
        .select("id, nom, slug, actif, marques(nom), sous_categories(nom, slug)")
        .or("nom.ilike.%" + query + "%")
        .order("nom")
        .limit(12)
      setResultats(data || [])
      setLoading(false)
    }, 180)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div style={{ position: "relative", marginBottom: "1.5rem" }}>
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
        <input
          type="text"
          placeholder="Rechercher n'importe quel produit du site..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          style={{ width: "100%", padding: "12px 14px 12px 42px", fontSize: "14px", background: "#fff", border: "2px solid " + (focused ? "#D97757" : "var(--border)"), borderRadius: "10px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const, transition: "border-color 0.15s" }}
        />
        {loading && <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "12px" }}>...</span>}
        {query && !loading && <button onClick={() => { setQuery(""); setResultats([]) }} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "18px", lineHeight: 1 }}>×</button>}
      </div>

      {resultats.length > 0 && focused && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", zIndex: 50, boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {resultats.map((p, i) => {
            const subcat = p.sous_categories?.slug || ""
            const catLabel = CAT_LABELS[subcat] || p.sous_categories?.nom || ""
            const catPrefix = subcat.startsWith("revetements") ? "revetements" : subcat.startsWith("bois") ? "bois" : subcat.startsWith("balles") ? "balles" : subcat.startsWith("chaussures") ? "chaussures" : subcat.startsWith("colles") ? "colles" : "revetements"
            return (
              <div key={p.id}
                onClick={() => {
                  if (onSelect) onSelect(p)
                  setQuery("")
                  setResultats([])
                }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", cursor: "pointer", borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                onMouseLeave={e => e.currentTarget.style.background = "#fff"}
              >
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 500, fontSize: "14px", color: "var(--text)" }}>{p.nom}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "13px", marginLeft: "8px" }}>{p.marques?.nom}</span>
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  {catLabel && <span style={{ fontSize: "11px", background: "var(--accent-light)", color: "var(--accent)", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{catLabel}</span>}
                  <span style={{ fontSize: "11px", background: p.actif ? "var(--success-light)" : "#FEF2F2", color: p.actif ? "var(--success)" : "#DC2626", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{p.actif ? "Actif" : "Inactif"}</span>
                  <a href={"/" + catPrefix + "/" + p.slug} target="_blank"
                    onClick={e => e.stopPropagation()}
                    style={{ fontSize: "11px", background: "var(--bg)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", textDecoration: "none", border: "1px solid var(--border)" }}>
                    Voir
                  </a>
                </div>
              </div>
            )
          })}
          <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--text-muted)", background: "var(--bg)", borderTop: "1px solid var(--border)" }}>
            {resultats.length} résultat{resultats.length > 1 ? "s" : ""} — affichage limité à 12
          </div>
        </div>
      )}
    </div>
  )
}