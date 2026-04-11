"use client"

export type PolarAxis = {
  label: string
  ttk?: number | null
  marque?: number | null
  users?: number | null
}

const GRID_LEVELS = [2, 4, 6, 8, 10]
const TTK_COLOR   = "#1A56DB"
const MARQUE_COLOR = "#D97757"
const USERS_COLOR  = "#0E7F4F"

function polarToXY(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

function buildPath(
  axes: PolarAxis[],
  source: "ttk" | "marque" | "users",
  cx: number, cy: number, R: number
): string {
  const n = axes.length
  const pts = axes.map((ax, i) => {
    const val = ax[source] ?? 0
    const r = (val / 10) * R
    const a = (2 * Math.PI * i / n) - Math.PI / 2
    const { x, y } = polarToXY(cx, cy, r, a)
    return `${x.toFixed(2)},${y.toFixed(2)}`
  })
  return `M ${pts.join(" L ")} Z`
}

export default function PolarChart({
  axes,
  size = 300,
  showTTK = true,
  showMarque = true,
  showUsers = true,
}: {
  axes: PolarAxis[]
  size?: number
  showTTK?: boolean
  showMarque?: boolean
  showUsers?: boolean
}) {
  if (!axes.length) return null

  const cx = size / 2
  const cy = size / 2
  const R  = (size / 2) * 0.58   // rayon des données
  const Rg = (size / 2) * 0.60   // rayon de la grille (légèrement + grand)
  const n  = axes.length

  const angleOf = (i: number) => (2 * Math.PI * i / n) - Math.PI / 2

  const hasTTK    = showTTK    && axes.some(a => a.ttk)
  const hasMarque = showMarque && axes.some(a => a.marque)
  const hasUsers  = showUsers  && axes.some(a => a.users)

  if (!hasTTK && !hasMarque && !hasUsers) return null

  /* ── Grille polygonale ── */
  const gridPolygons = GRID_LEVELS.map(level => {
    const r = (level / 10) * Rg
    const pts = axes.map((_, i) => {
      const { x, y } = polarToXY(cx, cy, r, angleOf(i))
      return `${x.toFixed(1)},${y.toFixed(1)}`
    }).join(" ")
    return { level, pts }
  })

  /* ── Labels ── */
  const LABEL_MARGIN = 20
  const labelPositions = axes.map((ax, i) => {
    const a = angleOf(i)
    const lr = Rg + LABEL_MARGIN
    const { x, y } = polarToXY(cx, cy, lr, a)
    // Alignement horizontal selon position angulaire
    const cosA = Math.cos(a)
    const anchor = cosA > 0.15 ? "start" : cosA < -0.15 ? "end" : "middle"
    return { label: ax.label, x, y, anchor }
  })

  /* ── Points dots sur les axes ── */
  const dotSets: { source: "ttk"|"marque"|"users", color: string, show: boolean }[] = [
    { source: "ttk",    color: TTK_COLOR,    show: hasTTK },
    { source: "marque", color: MARQUE_COLOR, show: hasMarque },
    { source: "users",  color: USERS_COLOR,  show: hasUsers },
  ]

  return (
    <svg
      width={size} height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", overflow: "visible" }}
      aria-label="Graphique radar des notes"
    >
      {/* Fond */}
      <circle cx={cx} cy={cy} r={Rg} fill="var(--bg, #F9FAFB)" stroke="none" />

      {/* Lignes d'axe */}
      {axes.map((_, i) => {
        const { x, y } = polarToXY(cx, cy, Rg, angleOf(i))
        return (
          <line key={i} x1={cx} y1={cy} x2={x} y2={y}
            stroke="var(--border, #E5E7EB)" strokeWidth="0.8" />
        )
      })}

      {/* Polygones de grille */}
      {gridPolygons.map(({ level, pts }) => (
        <polygon key={level} points={pts}
          fill="none"
          stroke="var(--border, #E5E7EB)"
          strokeWidth={level === 10 ? "1" : "0.6"}
          strokeDasharray={level === 10 ? "none" : "2,2"} />
      ))}

      {/* Valeurs grille (2/10, 4/10…) — affiché sur 1er axe */}
      {GRID_LEVELS.map(level => {
        const r = (level / 10) * Rg
        const { x, y } = polarToXY(cx, cy, r + 2, angleOf(0) + 0.08)
        return (
          <text key={level} x={x} y={y}
            textAnchor="start" dominantBaseline="middle"
            fontSize="7" fill="var(--text-muted, #9CA3AF)"
            fontFamily="Poppins, sans-serif">
            {level}
          </text>
        )
      })}

      {/* ── Polygones données (ordre : users → marque → ttk pour la lisibilité) ── */}
      {hasUsers && (
        <path d={buildPath(axes, "users", cx, cy, R)}
          fill={USERS_COLOR + "28"} stroke={USERS_COLOR}
          strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {hasMarque && (
        <path d={buildPath(axes, "marque", cx, cy, R)}
          fill={MARQUE_COLOR + "28"} stroke={MARQUE_COLOR}
          strokeWidth="1.5" strokeLinejoin="round" />
      )}
      {hasTTK && (
        <path d={buildPath(axes, "ttk", cx, cy, R)}
          fill={TTK_COLOR + "20"} stroke={TTK_COLOR}
          strokeWidth="2" strokeLinejoin="round" />
      )}

      {/* ── Petits ronds sur chaque axe ── */}
      {dotSets.filter(d => d.show).map(({ source, color }) =>
        axes.map((ax, i) => {
          const val = ax[source]
          if (!val) return null
          const r = (val / 10) * R
          const { x, y } = polarToXY(cx, cy, r, angleOf(i))
          return (
            <circle key={`${source}-${i}`} cx={x} cy={y} r="3"
              fill={color} stroke="#fff" strokeWidth="1.2" />
          )
        })
      )}

      {/* Labels des axes */}
      {labelPositions.map(({ label, x, y, anchor }, i) => (
        <text key={i} x={x} y={y}
          textAnchor={anchor as any}
          dominantBaseline="middle"
          fontSize="9"
          fontFamily="Poppins, sans-serif"
          fontWeight="600"
          fill="var(--text-muted, #6B7280)"
          style={{ textTransform: "uppercase", letterSpacing: "0.3px" }}>
          {label}
        </text>
      ))}
    </svg>
  )
}
