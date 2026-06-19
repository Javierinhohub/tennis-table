"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useLocale } from "@/lib/useLocale"
import { useT } from "@/lib/useT"
import AdBanner from "@/app/components/AdBanner"

// ⚠️ Remplace ces IDs par tes vrais data-ad-slot depuis AdSense → Annonces → Par unité
const AD_SLOT_JOUEURS_TOP    = "8736210453"  // Joueurs - Bannière filtres
const AD_SLOT_JOUEURS_MIDDLE = "9984003085"  // Joueurs - Carré milieu

const DRAPEAUX: Record<string, string> = {
  "Chine":"🇨🇳","France":"🇫🇷","Allemagne":"🇩🇪","Suède":"🇸🇪","Japon":"🇯🇵",
  "Corée du Sud":"🇰🇷","Brésil":"🇧🇷","Portugal":"🇵🇹","Autriche":"🇦🇹",
  "Roumanie":"🇷🇴","Croatie":"🇭🇷","Belgique":"🇧🇪","Danemark":"🇩🇰",
  "Slovénie":"🇸🇮","Égypte":"🇪🇬","Australie":"🇦🇺","Russie":"🇷🇺",
  "Inde":"🇮🇳","États-Unis":"🇺🇸","Tchéquie":"🇨🇿","Pologne":"🇵🇱",
  "Nigeria":"🇳🇬","Hong Kong":"🇭🇰","Espagne":"🇪🇸","Argentine":"🇦🇷",
  "Luxembourg":"🇱🇺","Kazakhstan":"🇰🇿","Iran":"🇮🇷","Algérie":"🇩🇿",
  "Chili":"🇨🇱","Moldavie":"🇲🇩","Hongrie":"🇭🇺","Angleterre":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Macao":"🇲🇴","Porto Rico":"🇵🇷","Singapour":"🇸🇬","Ukraine":"🇺🇦",
  "Turquie":"🇹🇷","Thaïlande":"🇹🇭","Italie":"🇮🇹","Pays-Bas":"🇳🇱",
  "Serbie":"🇷🇸","Canada":"🇨🇦","Cameroun":"🇨🇲","Bénin":"🇧🇯","Taipei":"🇹🇼",
  "Pays de Galles":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",
}

const TYPE_LABELS_FR: Record<string, string> = {
  "In": "Backside",
  "Out": "Picots courts",
  "Mid": "Picots mi-longs",
  "Long": "Picots longs",
  "Anti": "Anti-spin",
}
const TYPE_LABELS_EN: Record<string, string> = {
  "In": "Backside",
  "Out": "Short pips",
  "Mid": "Medium pips",
  "Long": "Long pips",
  "Anti": "Anti-spin",
}

// Inverse : label affiché → code type (pour parser le suffixe "— Backside" stocké en base)
const TYPE_LABEL_TO_CODE: Record<string, string> = {
  "Backside": "In",
  "Picots courts": "Out", "Short pips": "Out",
  "Picots mi-longs": "Mid", "Medium pips": "Mid",
  "Picots longs": "Long", "Long pips": "Long",
  "Anti-spin": "Anti",
}


function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function matchSearch(nom: string, query: string) {
  if (!query.trim()) return true
  const n = normalize(nom)
  return query.trim().split(/\s+/).every(word => n.includes(normalize(word)))
}

// Marque : vérifie si le nom de l'équipement COMMENCE par un nom de marque connu
// Ex: "Butterfly Tenergy 05" → "Butterfly", "DHS Hurricane 3" → "DHS"
function getBrand(nom: string | null, brandNames: string[]): string | null {
  if (!nom) return null
  const n = normalize(nom)
  let best: string | null = null
  let bestLen = 0
  for (const brand of brandNames) {
    const b = normalize(brand)
    if (b.length >= 2 && b.length > bestLen && (n === b || n.startsWith(b + " "))) {
      best = brand
      bestLen = b.length
    }
  }
  return best
}

// Nom du revêtement sans marque ni suffixe type : "Butterfly Tenergy 05 — Backside" → "Tenergy 05"
function getRubberName(nom: string | null, brandNames: string[]): string | null {
  if (!nom) return null
  let clean = nom.replace(/\s*—\s*.+$/, "").trim()
  const brand = getBrand(clean, brandNames)
  if (brand) clean = clean.slice(brand.length).trim()
  return clean || null
}

// Nom du bois sans marque ni parenthèses : "Butterfly Viscaria (5 plis)" → "Viscaria"
function getBladeName(nom: string | null, brandNames: string[]): string | null {
  if (!nom) return null
  let clean = nom.replace(/\s*\([^)]+\)\s*$/, "").trim()
  const brand = getBrand(clean, brandNames)
  if (brand) clean = clean.slice(brand.length).trim()
  return clean || null
}


// ── StatBars : barres horizontales pour la section statistiques ──────────────
type StatItem = { label: string; value: number; extra?: string }

function StatBars({ data, total, subtitle }: {
  data: StatItem[]
  total: number
  subtitle?: string
}) {
  if (!data.length) return <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Aucune donnée disponible.</p>
  const max = data[0]?.value || 1
  return (
    <div>
      {subtitle && <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px", lineHeight: 1.5 }}>{subtitle}</p>}
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
        {data.map((item, i) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", minWidth: "18px", textAlign: "right" as const, flexShrink: 0 }}>
              {i + 1}
            </span>
            <span title={item.label} style={{ fontSize: "12px", fontWeight: 500, color: "var(--text)", minWidth: "130px", maxWidth: "180px", flexShrink: 0, lineHeight: 1.3, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis" }}>
              {item.label}
            </span>
            <div style={{ flex: 1, background: "var(--bg)", borderRadius: "4px", height: "8px", overflow: "hidden", minWidth: "40px" }}>
              <div style={{
                width: `${(item.value / max) * 100}%`,
                height: "100%",
                background: i === 0 ? "#D97757" : i < 3 ? "#E08B68" : "#EDAA86",
                borderRadius: "4px",
              }} />
            </div>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text)", minWidth: "22px", textAlign: "right" as const, flexShrink: 0 }}>
              {item.value}
            </span>
            {total > 0 && (
              <span style={{ fontSize: "11px", color: "var(--text-muted)", minWidth: "34px", flexShrink: 0 }}>
                {Math.round((item.value / total) * 100)}%
              </span>
            )}
            {item.extra && (
              <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>{item.extra}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function CarteJoueur({ j }: { j: any }) {
  return (
    <Link href={"/joueurs/" + j.id}
      style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 12px", textDecoration: "none" }}
    >
      <span style={{ fontSize: "13px", fontWeight: 700, color: j.classement_mondial <= 3 ? "#D97757" : "var(--text-muted)", minWidth: "28px", textAlign: "center", flexShrink: 0 }}>
        {j.classement_mondial}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 600, fontSize: "13px", color: "var(--text)", lineHeight: 1.3 }}>{j.nom}</p>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{DRAPEAUX[j.pays] || ""} {j.pays}</p>
      </div>
    </Link>
  )
}

function PillButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      style={{
        padding: "5px 12px", borderRadius: "20px", border: "1px solid", fontSize: "12px", fontWeight: 600,
        cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.1s",
        background: active ? "#D97757" : "#fff",
        color: active ? "#fff" : "var(--text-muted)",
        borderColor: active ? "#D97757" : "var(--border)",
      }}>
      {label}
    </button>
  )
}

export default function JoueursPage() {
  const locale = useLocale()
  const t = useT()
  const TYPE_LABELS = locale === "en" ? TYPE_LABELS_EN : TYPE_LABELS_FR

  const [joueurs, setJoueurs]         = useState<any[]>([])
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [loading, setLoading]         = useState(true)
  const [query, setQuery]             = useState("")
  const [inputValue, setInputValue]   = useState("")
  const [filterBrand, setFilterBrand] = useState<string | null>(null)
  const [filterType, setFilterType]   = useState<string | null>(null)

  // Liste des noms de marques (pour matching startsWith)
  const [brandNames, setBrandNames] = useState<string[]>([])
  // Map : nom produit normalisé → type (fallback quand revetement_cd_type est null)
  const [typeMap, setTypeMap] = useState<Map<string, string>>(new Map())

  // Debounce recherche
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 200)
    return () => clearTimeout(t)
  }, [inputValue])

  useEffect(() => {
    fetch("/api/joueurs", { credentials: "same-origin" })
      .then(r => r.json())
      .then(({ joueurs: data, marques, typeMap: typeMapRaw, lastUpdated: lu }) => {
        setJoueurs(data || [])
        setLastUpdated(lu || null)
        setBrandNames(marques || [])
        const tm = new Map<string, string>()
        Object.entries(typeMapRaw || {}).forEach(([k, v]) => tm.set(normalize(k), v as string))
        setTypeMap(tm)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Résout le type d'un revêtement : 3 niveaux de fallback
  function resolveType(nomEquip: string | null, storedType: string | null): string | null {
    // 1. Colonne revetement_cd_type / revetement_rv_type (source la plus fiable)
    if (storedType) return storedType
    if (!nomEquip) return null

    // 2. Parser le suffixe " — Backside" inclus dans le nom formaté par l'admin
    //    Format stocké : "Butterfly Tenergy 05 — Backside"
    const suffixMatch = nomEquip.match(/—\s*(.+)$/)
    if (suffixMatch) {
      const code = TYPE_LABEL_TO_CODE[suffixMatch[1].trim()]
      if (code) return code
    }

    // 3. Lookup typeMap DB (fallback si le nom n'a pas de suffixe)
    const nomPropre = nomEquip.replace(/\s*—\s*.+$/, "").trim()
    const n = normalize(nomPropre)
    if (typeMap.has(n)) return typeMap.get(n)!
    for (const [key, type] of typeMap.entries()) {
      if (key.length >= 5 && n.includes(key)) return type
    }
    return null
  }

  // Détermine les marques et types de chaque joueur
  const joueursEnrichis = useMemo(() => {
    return joueurs.map(j => {
      const brandsSet = new Set<string>()
      const typesSet  = new Set<string>()
      // Marques : bois + cd + rv — le nom commence par le nom de marque
      ;[j.bois_nom, j.revetement_cd, j.revetement_rv].forEach(eq => {
        const b = getBrand(eq, brandNames)
        if (b) brandsSet.add(b)
      })
      // Types : colonne stockée en priorité, fallback lookup par nom
      const tCd = resolveType(j.revetement_cd, j.revetement_cd_type)
      const tRv = resolveType(j.revetement_rv, j.revetement_rv_type)
      if (tCd) typesSet.add(tCd)
      if (tRv) typesSet.add(tRv)
      return { ...j, brands: [...brandsSet], types: [...typesSet] }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [joueurs, brandNames, typeMap])

  // Marques disponibles (triées par nombre de joueurs)
  const brandsDispos = useMemo(() => {
    const count: Record<string, number> = {}
    joueursEnrichis.forEach(j => j.brands.forEach((b: string) => { count[b] = (count[b] || 0) + 1 }))
    return Object.entries(count).sort((a, b) => b[1] - a[1]).map(([b]) => b)
  }, [joueursEnrichis])

  // Types disponibles
  const typesDispos = useMemo(() => {
    const found = new Set<string>()
    joueursEnrichis.forEach(j => j.types.forEach((t: string) => found.add(t)))
    return Object.keys(TYPE_LABELS).filter(t => found.has(t))
  }, [joueursEnrichis])

  // Filtrage
  const filtered = useMemo(() => {
    return joueursEnrichis.filter(j => {
      if (!matchSearch(j.nom, query)) return false
      if (filterBrand && !j.brands.includes(filterBrand)) return false
      if (filterType  && !j.types.includes(filterType))  return false
      return true
    })
  }, [joueursEnrichis, query, filterBrand, filterType])

  const hommes    = filtered.filter(j => j.genre === "H")
  const femmes    = filtered.filter(j => j.genre === "F")
  const recherche = query.trim().length > 0 || !!filterBrand || !!filterType
  const nbFiltres = (filterBrand ? 1 : 0) + (filterType ? 1 : 0)

  // ── Stats matériel ─────────────────────────────────────────────────────────
  const [statTab,   setStatTab]   = useState<"marques"|"bois"|"revetements"|"pays"|"style">("marques")
  const [statGenre, setStatGenre] = useState<"tous"|"H"|"F">("tous")

  const statJoueurs = useMemo(() =>
    statGenre === "tous" ? joueursEnrichis : joueursEnrichis.filter((j: any) => j.genre === statGenre),
    [joueursEnrichis, statGenre]
  )

  const stats = useMemo(() => {
    const total = statJoueurs.length

    // Marques : nb de joueurs utilisant au moins un produit de la marque
    const brandInfo: Record<string, { ids: Set<string>; bois: number; rev: number }> = {}
    statJoueurs.forEach((j: any) => {
      const bBois = getBrand(j.bois_nom, brandNames)
      const bCd   = getBrand(j.revetement_cd ? j.revetement_cd.replace(/\s*—\s*.+$/, "") : null, brandNames)
      const bRv   = getBrand(j.revetement_rv ? j.revetement_rv.replace(/\s*—\s*.+$/, "") : null, brandNames)
      const seenB = new Set<string>()
      if (bBois) seenB.add(bBois)
      if (bCd)   seenB.add(bCd)
      if (bRv)   seenB.add(bRv)
      seenB.forEach(b => {
        if (!brandInfo[b]) brandInfo[b] = { ids: new Set(), bois: 0, rev: 0 }
        brandInfo[b].ids.add(j.id)
      })
      if (bBois) brandInfo[bBois].bois++
      if (bCd)   brandInfo[bCd].rev++
      if (bRv)   brandInfo[bRv].rev++
    })
    const topBrands: StatItem[] = Object.entries(brandInfo)
      .map(([name, v]) => ({ label: name, value: v.ids.size, extra: `${v.bois}🪵 ${v.rev}⚡` }))
      .sort((a, b) => b.value - a.value).slice(0, 10)

    // Bois les plus utilisés
    const bladeMap: Record<string, number> = {}
    statJoueurs.forEach((j: any) => {
      const name = getBladeName(j.bois_nom, brandNames)
      if (name) bladeMap[name] = (bladeMap[name] || 0) + 1
    })
    const topBlades: StatItem[] = Object.entries(bladeMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value).slice(0, 12)
    const totalWithBlade = statJoueurs.filter((j: any) => j.bois_nom).length

    // Revêtements les plus utilisés (CD + RV confondus)
    const rubberMap: Record<string, number> = {}
    statJoueurs.forEach((j: any) => {
      ;[j.revetement_cd, j.revetement_rv].forEach((rev: string | null) => {
        const name = getRubberName(rev, brandNames)
        if (name) rubberMap[name] = (rubberMap[name] || 0) + 1
      })
    })
    const topRubbers: StatItem[] = Object.entries(rubberMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value).slice(0, 12)
    const totalWithRubber = statJoueurs.filter((j: any) => j.revetement_cd || j.revetement_rv).length

    // Pays les plus représentés
    const countryMap: Record<string, number> = {}
    statJoueurs.forEach((j: any) => { if (j.pays) countryMap[j.pays] = (countryMap[j.pays] || 0) + 1 })
    const topCountries: StatItem[] = Object.entries(countryMap)
      .map(([pays, value]) => ({ label: `${DRAPEAUX[pays] || ""}  ${pays}`, value }))
      .sort((a, b) => b.value - a.value).slice(0, 12)

    // Style de jeu
    const styleMap: Record<string, number> = {}
    statJoueurs.forEach((j: any) => {
      const s = (j.style as string | null) || "Non renseigné"
      styleMap[s] = (styleMap[s] || 0) + 1
    })
    const topStyles: StatItem[] = Object.entries(styleMap)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)

    return { topBrands, topBlades, totalWithBlade, topRubbers, totalWithRubber, topCountries, topStyles, total }
  }, [statJoueurs, brandNames])

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>

      {/* En-tête */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>{t("players", "title")}</h1>
        {lastUpdated && (
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>
            {locale === "en" ? "ITTF world ranking · updated on " : "Classement mondial ITTF · mis à jour le "}
            <strong style={{ color: "var(--text)" }}>
              {new Date(lastUpdated).toLocaleDateString(locale === "en" ? "en-GB" : "fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </strong>
          </p>
        )}
      </div>

      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder={t("players", "searchPlaceholder")}
          value={inputValue} onChange={e => setInputValue(e.target.value)}
          autoComplete="off"
          style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "11px 40px 11px 40px", fontSize: "14px", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)" }}
        />
        {inputValue && (
          <button onClick={() => setInputValue("")}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "18px", lineHeight: 1, padding: "2px" }}>
            ×
          </button>
        )}
      </div>

      {/* Filtre type de revêtement — toujours visible */}
      {!loading && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const }}>
            {(["In","Out","Mid","Long","Anti"] as const).map(t => {
              const count = joueursEnrichis.filter(j => j.types.includes(t)).length
              return (
                <button key={t} onClick={() => setFilterType(filterType === t ? null : t)}
                  disabled={count === 0}
                  style={{
                    padding: "7px 14px", borderRadius: "8px", border: "1px solid", fontSize: "13px", fontWeight: 600,
                    cursor: count === 0 ? "default" : "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.1s",
                    background: filterType === t ? "#D97757" : count === 0 ? "var(--bg)" : "#fff",
                    color: filterType === t ? "#fff" : count === 0 ? "var(--text-muted)" : "var(--text)",
                    borderColor: filterType === t ? "#D97757" : "var(--border)",
                    opacity: count === 0 ? 0.5 : 1,
                  }}>
                  {TYPE_LABELS[t]}
                  {count > 0 && <span style={{ marginLeft: "6px", fontSize: "11px", fontWeight: 500, opacity: 0.7 }}>{count}</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Filtre marques */}
      {!loading && brandsDispos.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", marginBottom: "1.2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t("players", "brand")}</p>
            {nbFiltres > 0 && (
              <button onClick={() => { setFilterBrand(null); setFilterType(null) }}
                style={{ background: "none", border: "none", color: "#D97757", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Poppins, sans-serif" }}>
                {t("players", "clearFilters")} ({nbFiltres})
              </button>
            )}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {brandsDispos.map(b => (
              <PillButton key={b} label={b} active={filterBrand === b}
                onClick={() => setFilterBrand(filterBrand === b ? null : b)} />
            ))}
          </div>
        </div>
      )}

      {/* ── Pub sous les filtres — emplacement très visible ── */}
      {!loading && (
        <AdBanner slot={AD_SLOT_JOUEURS_TOP} format="horizontal"
          style={{ marginBottom: "1rem" }} />
      )}

      {/* Bandeau info (masqué pendant filtrage/recherche) */}
      {!recherche && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderLeft: "3px solid #D97757", borderRadius: "0 8px 8px 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.7 }}>
            {t("players", "infoText")}
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", fontSize: "14px" }}>{t("players", "loading")}</div>
      )}

      {/* Résultats filtrés : liste unifiée */}
      {!loading && recherche && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "14px" }}>
              {t("players", "noResults")}
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                {filtered.length} {filtered.length > 1 ? t("players", "players_plural") : t("players", "player")}
                {filterBrand && <> · <strong style={{ color: "var(--text)" }}>{filterBrand}</strong></>}
                {filterType  && <> · <strong style={{ color: "var(--text)" }}>{TYPE_LABELS[filterType]}</strong></>}
                {query.trim() && <> · « <strong style={{ color: "var(--text)" }}>{query}</strong> »</>}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {filtered.map(j => <CarteJoueur key={j.id} j={j} />)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vue normale : 2 colonnes Hommes / Femmes */}
      {!loading && !recherche && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div>
            <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>{t("players", "men")}</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{hommes.length} {t("players", "menRanked")}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {hommes.map(j => <CarteJoueur key={j.id} j={j} />)}
            </div>
          </div>
          {/* ── Pub entre Hommes et Femmes — très efficace sur mobile ── */}
          <AdBanner slot={AD_SLOT_JOUEURS_MIDDLE} format="rectangle"
            style={{ alignSelf: "start", position: "sticky", top: "80px" }} />

          <div>
            <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>{t("players", "women")}</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{femmes.length} {t("players", "womenRanked")}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {femmes.map(j => <CarteJoueur key={j.id} j={j} />)}
            </div>
          </div>
        </div>
      )}


      {/* ── Section Statistiques matériel ── */}
      {!loading && joueursEnrichis.length > 0 && (
        <section style={{ marginTop: "3rem", borderTop: "2px solid var(--border)", paddingTop: "2rem" }}>

          {/* En-tête + toggle genre */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap" as const, gap: "12px", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "4px" }}>Statistiques matériel</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Analyse du matériel utilisé par {stats.total} joueurs pros
                {statGenre !== "tous" && <> · {statGenre === "H" ? "Hommes" : "Femmes"}</>}
              </p>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {(["tous", "H", "F"] as const).map(g => (
                <button key={g} onClick={() => setStatGenre(g)}
                  style={{
                    padding: "6px 14px", borderRadius: "20px", border: "1px solid",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif",
                    background: statGenre === g ? "#D97757" : "#fff",
                    color: statGenre === g ? "#fff" : "var(--text-muted)",
                    borderColor: statGenre === g ? "#D97757" : "var(--border)",
                  }}>
                  {g === "tous" ? "Tous" : g === "H" ? "Hommes" : "Femmes"}
                </button>
              ))}
            </div>
          </div>

          {/* Onglets */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "1.2rem" }}>
            {([
              { key: "marques",     label: "Marques" },
              { key: "bois",        label: "Bois" },
              { key: "revetements", label: "Revêtements" },
              { key: "pays",        label: "Nationalité" },
              { key: "style",       label: "Style de jeu" },
            ] as const).map(({ key, label }) => (
              <button key={key} onClick={() => setStatTab(key)}
                style={{
                  padding: "7px 15px", borderRadius: "8px", border: "1px solid",
                  fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif",
                  background: statTab === key ? "#D97757" : "#fff",
                  color: statTab === key ? "#fff" : "var(--text)",
                  borderColor: statTab === key ? "#D97757" : "var(--border)",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
            {statTab === "marques" && (
              <StatBars
                subtitle="Nombre de joueurs utilisant au moins un produit de la marque (bois ou revêtement)"
                data={stats.topBrands}
                total={stats.total}
              />
            )}
            {statTab === "bois" && (
              <StatBars
                subtitle={`Bois les plus utilisés parmi les ${stats.totalWithBlade} joueurs avec données matériel`}
                data={stats.topBlades}
                total={stats.totalWithBlade}
              />
            )}
            {statTab === "revetements" && (
              <StatBars
                subtitle={`Coup droit et revers confondus — parmi les ${stats.totalWithRubber} joueurs avec données revêtements`}
                data={stats.topRubbers}
                total={stats.totalWithRubber * 2}
              />
            )}
            {statTab === "pays" && (
              <StatBars
                subtitle="Nationalités les plus représentées dans le classement mondial"
                data={stats.topCountries}
                total={stats.total}
              />
            )}
            {statTab === "style" && (
              <StatBars
                subtitle="Répartition des styles de jeu parmi les joueurs classés"
                data={stats.topStyles}
                total={stats.total}
              />
            )}
          </div>
        </section>
      )}

      {/* ── Notice copyright discrète ── */}
      <div style={{ marginTop: "2.5rem", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center" }}>
          © {new Date().getFullYear()} TT-Kip — Base de données protégée · Reproduction interdite
        </p>
      </div>

    </main>
  )
}
