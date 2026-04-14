"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// ── Couleurs par produit ──────────────────────────────────────────────────────
const COLORS = ["#D97757", "#1A56DB", "#0E7F4F"]
const COLORS_BG = ["#D9775730", "#1A56DB30", "#0E7F4F30"]

// ── Axes et champs dans les tables de notes utilisateurs ─────────────────────
const REV_AXES = [
  { label: "Vitesse",    userKey: "note_vitesse" },
  { label: "Effet",      userKey: "note_effet" },
  { label: "Contrôle",   userKey: "note_controle" },
  { label: "Durabilité", userKey: "note_durabilite" },
  { label: "Dureté",     userKey: "note_durete_mousse" },
  { label: "Rejet",      userKey: "note_rejet" },
  { label: "Q/Prix",     userKey: "note_qualite_prix" },
]

const BOIS_AXES = [
  { label: "Vitesse",     userKey: "note_vitesse" },
  { label: "Contrôle",   userKey: "note_controle" },
  { label: "Flexibilité", userKey: "note_flexibilite" },
  { label: "Dureté",     userKey: "note_durete" },
  { label: "Q/Prix",     userKey: "note_qualite_prix" },
]

// ── Calcul de la moyenne (ignore les nulls) ───────────────────────────────────
function avg(rows: any[], key: string): number | null {
  const vals = rows.map(r => r[key]).filter(v => v !== null && v !== undefined)
  if (!vals.length) return null
  return Math.round((vals.reduce((s, v) => s + v, 0) / vals.length) * 10) / 10
}

// ── Radar SVG ─────────────────────────────────────────────────────────────────
function RadarChart({ datasets, axes, size = 320 }: {
  datasets: { nom: string; values: (number | null)[] }[]
  axes: { label: string }[]
  size?: number
}) {
  const cx = size / 2, cy = size / 2
  const R  = (size / 2) * 0.55
  const Rg = (size / 2) * 0.57
  const n  = axes.length
  const GRID = [2, 4, 6, 8, 10]

  const angle = (i: number) => (2 * Math.PI * i / n) - Math.PI / 2
  const pt = (r: number, i: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  const gridPolygons = GRID.map(lvl => {
    const r = (lvl / 10) * Rg
    return axes.map((_, i) => {
      const { x, y } = pt(r, i)
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(" ")
  })

  const labels = axes.map((ax, i) => {
    const a = angle(i)
    const { x, y } = pt(Rg + 22, i)
    const cos = Math.cos(a)
    const anchor = cos > 0.15 ? "start" : cos < -0.15 ? "end" : "middle"
    return { ...ax, x, y, anchor }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", overflow: "visible" }}>
      <circle cx={cx} cy={cy} r={Rg} fill="#F9FAFB" />
      {axes.map((_, i) => {
        const { x, y } = pt(Rg, i)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#E5E7EB" strokeWidth="0.8" />
      })}
      {gridPolygons.map((pts, idx) => (
        <polygon key={idx} points={pts} fill="none" stroke="#E5E7EB"
          strokeWidth={GRID[idx] === 10 ? "1" : "0.6"}
          strokeDasharray={GRID[idx] === 10 ? "none" : "2,2"} />
      ))}
      {GRID.map((lvl) => {
        const r = (lvl / 10) * Rg
        return (
          <text key={lvl}
            x={cx + r * Math.cos(angle(0)) + 2}
            y={cy + r * Math.sin(angle(0))}
            fontSize="7" fill="#9CA3AF" textAnchor="start" dominantBaseline="middle"
            fontFamily="Poppins, sans-serif">{lvl}</text>
        )
      })}
      {datasets.map((ds, di) => {
        const pathPts = ds.values.map((v, i) => {
          const r = ((v || 0) / 10) * R
          const { x, y } = pt(r, i)
          return `${x.toFixed(2)},${y.toFixed(2)}`
        })
        const d = `M ${pathPts.join(" L ")} Z`
        return (
          <g key={di}>
            <path d={d} fill={COLORS_BG[di]} stroke={COLORS[di]} strokeWidth="2" strokeLinejoin="round" />
            {ds.values.map((v, i) => {
              if (!v) return null
              const r = (v / 10) * R
              const { x, y } = pt(r, i)
              return <circle key={i} cx={x} cy={y} r="3.5" fill={COLORS[di]} stroke="#fff" strokeWidth="1.5" />
            })}
          </g>
        )
      })}
      {labels.map(({ label, x, y, anchor }, i) => (
        <text key={i} x={x} y={y} textAnchor={anchor as any}
          dominantBaseline="middle" fontSize="9" fontWeight="600"
          fontFamily="Poppins, sans-serif" fill="#6B7280"
          style={{ textTransform: "uppercase", letterSpacing: "0.3px" }}>
          {label}
        </text>
      ))}
    </svg>
  )
}

// ── Modal principal ───────────────────────────────────────────────────────────
export default function ComparaisonModal({
  produits, type, onClose,
}: {
  produits: any[]
  type: "revetement" | "bois"
  onClose: () => void
}) {
  // notes[produit_id] = tableau des lignes de notes utilisateurs
  const [notesMap, setNotesMap]   = useState<Record<string, any[]>>({})
  const [details, setDetails]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const axes = type === "revetement" ? REV_AXES : BOIS_AXES

  useEffect(() => {
    if (!produits.length) return
    fetchAll()
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [produits])

  async function fetchAll() {
    setLoading(true)
    const ids = produits.map(p => p.id)
    const table = type === "revetement" ? "notes_revetements" : "notes_bois"

    const selectCols = type === "revetement"
      ? "produit_id, note_vitesse, note_effet, note_controle, note_durabilite, note_durete_mousse, note_rejet, note_qualite_prix, note_globale"
      : "produit_id, note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix, note_globale"

    const detailsSelect = type === "revetement"
      ? "id, nom, marques(nom), revetements(type_revetement, epaisseur_max, poids)"
      : "id, nom, marques(nom), bois(style, nb_plis, poids_g, composition)"

    const [{ data: notesRows }, { data: detailsData }] = await Promise.all([
      supabase.from(table).select(selectCols).in("produit_id", ids),
      supabase.from("produits").select(detailsSelect).in("id", ids),
    ])

    // Regrouper les notes par produit_id
    const map: Record<string, any[]> = {}
    ids.forEach(id => { map[id] = [] })
    notesRows?.forEach((r: any) => {
      if (map[r.produit_id]) map[r.produit_id].push(r)
    })
    setNotesMap(map)
    setDetails(detailsData || [])
    setLoading(false)
  }

  // Moyennes utilisateurs par produit pour le radar
  const datasets = produits.map(p => {
    const rows = notesMap[p.id] || []
    const values = axes.map(ax => avg(rows, ax.userKey))
    return { nom: p.nom, values }
  })

  const hasAnyData = datasets.some(ds => ds.values.some(v => v !== null))

  const TYPE_LABELS: Record<string, string> = {
    In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div style={{
        background: "#fff", borderRadius: "16px", width: "100%", maxWidth: "860px",
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 24px", borderBottom: "1px solid #F0F0F0",
          position: "sticky", top: 0, background: "#fff", zIndex: 1,
          borderRadius: "16px 16px 0 0",
        }}>
          <div>
            <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "2px" }}>
              Comparaison {type === "revetement" ? "revêtements" : "bois"}
            </h2>
            <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
              Basée sur la moyenne des notes de tous les utilisateurs TT-Kip
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "#F3F4F6", border: "none", borderRadius: "8px",
            width: "32px", height: "32px", cursor: "pointer",
            fontSize: "16px", color: "#6B7280",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>✕</button>
        </div>

        <div style={{ padding: "24px" }}>

          {/* Légende produits avec nombre de notes */}
          <div style={{
            display: "flex", gap: "12px", justifyContent: "center",
            flexWrap: "wrap", marginBottom: "16px",
          }}>
            {produits.map((p, i) => {
              const nbNotes = (notesMap[p.id] || []).length
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  background: COLORS_BG[i], border: `1.5px solid ${COLORS[i]}`,
                  borderRadius: "10px", padding: "10px 16px",
                }}>
                  <span style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: COLORS[i], flexShrink: 0,
                  }} />
                  <div>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#111" }}>{p.nom}</p>
                    <p style={{ fontSize: "11px", color: "#6B7280" }}>
                      {p.marques?.nom}
                      {!loading && (
                        <span style={{ marginLeft: "6px", fontWeight: 600, color: COLORS[i] }}>
                          · {nbNotes} note{nbNotes > 1 ? "s" : ""}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Mention source des données */}
          <p style={{
            textAlign: "center", fontSize: "11px", color: "#9CA3AF",
            marginBottom: "20px", fontStyle: "italic",
          }}>
            Les graphiques représentent la moyenne des notes attribuées par les membres du site (sur 10)
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#9CA3AF" }}>
              Chargement des notes...
            </div>
          ) : (
            <>
              {/* Radar chart */}
              {hasAnyData ? (
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "28px" }}>
                  <RadarChart datasets={datasets} axes={axes} size={340} />
                </div>
              ) : (
                <div style={{
                  textAlign: "center", padding: "2rem", color: "#9CA3AF",
                  fontSize: "14px", marginBottom: "24px",
                  background: "#F9FAFB", borderRadius: "10px",
                }}>
                  Aucun utilisateur n'a encore noté ces produits.<br />
                  <span style={{ fontSize: "12px" }}>Soyez le premier à laisser une note !</span>
                </div>
              )}

              {/* Tableau comparatif des notes */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F9FAFB" }}>
                      <th style={{
                        padding: "10px 14px", textAlign: "left",
                        fontSize: "11px", fontWeight: 600, color: "#9CA3AF",
                        textTransform: "uppercase", letterSpacing: "0.5px", width: "130px",
                      }}>Critère</th>
                      {produits.map((p, i) => (
                        <th key={p.id} style={{
                          padding: "10px 14px", textAlign: "center",
                          fontWeight: 700, color: COLORS[i], fontSize: "13px",
                        }}>
                          {p.nom}
                          <span style={{
                            display: "block", fontSize: "10px", fontWeight: 400,
                            color: "#9CA3AF", marginTop: "2px",
                          }}>
                            {(notesMap[p.id] || []).length} note{(notesMap[p.id] || []).length > 1 ? "s" : ""}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Note globale */}
                    {(() => {
                      const vals = produits.map(p => avg(notesMap[p.id] || [], "note_globale"))
                      const max = Math.max(...(vals.filter(v => v !== null) as number[]))
                      return (
                        <tr style={{ borderBottom: "1px solid #F3F4F6", background: "#FFF8F5" }}>
                          <td style={{ padding: "10px 14px", fontWeight: 700, color: "#374151" }}>
                            Note globale
                          </td>
                          {vals.map((v, vi) => (
                            <td key={vi} style={{ padding: "10px 14px", textAlign: "center" }}>
                              {v !== null ? (
                                <span style={{
                                  fontWeight: 800, fontSize: "15px",
                                  color: v === max && max > 0 ? COLORS[vi] : "#374151",
                                }}>{v}<span style={{ fontSize: "11px", fontWeight: 400, color: "#9CA3AF" }}>/10</span></span>
                              ) : <span style={{ color: "#D1D5DB" }}>—</span>}
                            </td>
                          ))}
                        </tr>
                      )
                    })()}

                    {/* Critères détaillés */}
                    {axes.map((ax, ai) => {
                      const vals = produits.map(p => avg(notesMap[p.id] || [], ax.userKey))
                      const max = Math.max(...(vals.filter(v => v !== null) as number[]))
                      return (
                        <tr key={ai} style={{ borderBottom: "1px solid #F3F4F6" }}>
                          <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>
                            {ax.label}
                          </td>
                          {vals.map((v, vi) => (
                            <td key={vi} style={{ padding: "10px 14px", textAlign: "center" }}>
                              {v !== null ? (
                                <div style={{
                                  display: "flex", alignItems: "center",
                                  gap: "6px", justifyContent: "center",
                                }}>
                                  <div style={{
                                    flex: 1, height: "6px", background: "#F3F4F6",
                                    borderRadius: "3px", maxWidth: "80px",
                                  }}>
                                    <div style={{
                                      height: "100%", borderRadius: "3px",
                                      background: COLORS[vi],
                                      width: `${(v / 10) * 100}%`,
                                      transition: "width 0.5s",
                                    }} />
                                  </div>
                                  <span style={{
                                    fontWeight: 700, minWidth: "28px",
                                    color: v === max && max > 0 ? COLORS[vi] : "#374151",
                                  }}>{v}</span>
                                </div>
                              ) : <span style={{ color: "#D1D5DB" }}>—</span>}
                            </td>
                          ))}
                        </tr>
                      )
                    })}

                    {/* Infos produit */}
                    {type === "revetement" && [
                      { label: "Type",          fn: (d: any) => d?.revetements ? (TYPE_LABELS[d.revetements.type_revetement] || d.revetements.type_revetement) : "—" },
                      { label: "Épaisseur max", fn: (d: any) => d?.revetements?.epaisseur_max ? d.revetements.epaisseur_max + " mm" : "—" },
                      { label: "Poids",         fn: (d: any) => d?.revetements?.poids || "—" },
                    ].map(row => (
                      <tr key={row.label} style={{ borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>{row.label}</td>
                        {produits.map((p, vi) => {
                          const det = details.find(d => d.id === p.id)
                          return <td key={vi} style={{ padding: "10px 14px", textAlign: "center", color: "#6B7280" }}>{row.fn(det)}</td>
                        })}
                      </tr>
                    ))}

                    {type === "bois" && [
                      { label: "Style",       fn: (d: any) => d?.bois?.style || "—" },
                      { label: "Plis",        fn: (d: any) => d?.bois?.nb_plis ? d.bois.nb_plis + " plis" : "—" },
                      { label: "Poids",       fn: (d: any) => d?.bois?.poids_g ? d.bois.poids_g + " g" : "—" },
                      { label: "Composition", fn: (d: any) => d?.bois?.composition || "—" },
                    ].map(row => (
                      <tr key={row.label} style={{ borderBottom: "1px solid #F3F4F6", background: "#FAFAFA" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, color: "#374151" }}>{row.label}</td>
                        {produits.map((p, vi) => {
                          const det = details.find(d => d.id === p.id)
                          return <td key={vi} style={{ padding: "10px 14px", textAlign: "center", color: "#6B7280", fontSize: "12px" }}>{row.fn(det)}</td>
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Liens vers les fiches */}
              <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap" }}>
                {produits.map((p, i) => (
                  <a key={p.id}
                    href={`/${type === "revetement" ? "revetements" : "bois"}/${p.slug}`}
                    target="_blank"
                    style={{
                      flex: 1, minWidth: "160px", textAlign: "center",
                      padding: "10px 16px", borderRadius: "8px", textDecoration: "none",
                      border: `1.5px solid ${COLORS[i]}`, color: COLORS[i],
                      fontSize: "13px", fontWeight: 600, background: COLORS_BG[i],
                    }}>
                    Voir {p.nom} →
                  </a>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
