"use client"

import { useState, useMemo } from "react"

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

export default function BoisClient({ produits, marques }: { produits: any[], marques: any[] }) {
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [styleFilter, setStyleFilter] = useState("")

  // Styles disponibles parmi les produits chargés
  const stylesDisponibles = useMemo(() => {
    const set = new Set<string>()
    produits.forEach(p => { if (p.bois?.style) set.add(p.bois.style) })
    return STYLE_ORDER.filter(s => set.has(s))
  }, [produits])

  const resultats = useMemo(() => {
    const s = search.toLowerCase().trim()
    return produits.filter(p => {
      const nomOk = !s
        || p.nom.toLowerCase().includes(s)
        || (p.marques?.nom || "").toLowerCase().includes(s)
        || (p.bois?.composition || "").toLowerCase().includes(s)
      const marqueOk = !marqueFilter || p.marques?.id === marqueFilter
      const styleOk = !styleFilter || p.bois?.style === styleFilter
      return nomOk && marqueOk && styleOk
    })
  }, [produits, search, marqueFilter, styleFilter])

  const hasFilter = !!(search || marqueFilter || styleFilter)

  const reset = () => { setSearch(""); setMarqueFilter(""); setStyleFilter("") }

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)",
    borderRadius: "8px", fontFamily: "Poppins, sans-serif", outline: "none",
    background: "#fff", color: "var(--text)",
  }

  return (
    <>
      {/* Barre de filtres */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" as const }}>

        {/* Champ texte avec bouton clear */}
        <div style={{ position: "relative", flex: 2, minWidth: "200px" }}>
          <input
            type="text"
            placeholder="Rechercher un bois..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
            style={{ ...inputStyle, width: "100%", paddingRight: search ? "36px" : "14px", boxSizing: "border-box" as const }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", color: "#aaa",
                fontSize: "14px", padding: "2px", lineHeight: 1,
              }}
            >✕</button>
          )}
        </div>

        {/* Filtre marque */}
        <select
          value={marqueFilter}
          onChange={e => setMarqueFilter(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: "160px" }}
        >
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>

        {/* Filtre style de jeu */}
        {stylesDisponibles.length > 0 && (
          <select
            value={styleFilter}
            onChange={e => setStyleFilter(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: "150px" }}
          >
            <option value="">Tous les styles</option>
            {stylesDisponibles.map(s => (
              <option key={s} value={s}>{STYLE_LABELS[s] || s}</option>
            ))}
          </select>
        )}

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
        {resultats.length} résultat{resultats.length > 1 ? "s" : ""}
        {hasFilter && produits.length !== resultats.length && ` sur ${produits.length}`}
      </p>

      {resultats.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>
          Aucun bois trouvé.
          {hasFilter && (
            <button onClick={reset} style={{ display: "block", margin: "12px auto 0", background: "none", border: "none", color: "#D97757", cursor: "pointer", fontFamily: "Poppins, sans-serif", fontSize: "14px" }}>
              ← Réinitialiser les filtres
            </button>
          )}
        </div>
      )}

      {resultats.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {["Nom", "Marque", "Style", "Plis", "Poids", "Composition"].map(h => (
                  <th key={h} style={{ padding: "10px 16px", textAlign: "left" as const, fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultats.map((p: any, i: number) => (
                <tr
                  key={p.id}
                  onClick={() => window.location.href = "/bois/" + p.slug}
                  style={{ borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "14px" }}>
                    {highlightMatch(p.nom, search)}
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
                  <td style={{ padding: "12px 16px", textAlign: "center" as const, fontSize: "13px", color: "var(--text-muted)" }}>
                    {p.bois?.poids_g ? p.bois.poids_g + " g" : "—"}
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

/** Met en gras la portion recherchée dans le texte */
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
