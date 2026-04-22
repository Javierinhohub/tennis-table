"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

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

const TYPE_LABELS: Record<string, string> = {
  "In": "Backside",
  "Out": "Picots courts",
  "Mid": "Picots mi-longs",
  "Long": "Picots longs",
  "Anti": "Anti-spin",
}


function normalize(s: string) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function matchSearch(nom: string, query: string) {
  if (!query.trim()) return true
  const n = normalize(nom)
  return query.trim().split(/\s+/).every(word => n.includes(normalize(word)))
}

// Matching strict : exact ou préfixe long (min 6 chars) avec limite de mot
function matchProduct(equipmentName: string, productKey: string): boolean {
  if (productKey.length < 6) return false
  if (equipmentName === productKey) return true
  // Le nom de l'équipement doit commencer par la clé suivie d'un espace, tiret ou fin de chaîne
  return equipmentName.startsWith(productKey + " ") || equipmentName.startsWith(productKey + "-")
}

function getBrand(nom: string | null, productMap: Map<string, string>): string | null {
  if (!nom) return null
  const n = normalize(nom)
  // Exact match
  if (productMap.has(n)) return productMap.get(n)!
  // Préfixe le plus long (min 6 chars)
  let best: string | null = null
  let bestLen = 0
  for (const [key, brand] of productMap.entries()) {
    if (matchProduct(n, key) && key.length > bestLen) {
      best = brand; bestLen = key.length
    }
  }
  return best
}

function getType(nom: string | null, typeMap: Map<string, string>): string | null {
  if (!nom) return null
  const n = normalize(nom)
  // Exact match uniquement — on préfère ne rien afficher plutôt qu'un faux positif
  if (typeMap.has(n)) return typeMap.get(n)!
  // Préfixe strict : le nom du joueur commence par le nom produit (min 10 chars)
  let best: string | null = null
  let bestLen = 0
  for (const [key, type] of typeMap.entries()) {
    if (key.length >= 10 && (n === key || n.startsWith(key + " ") || n.startsWith(key + "-")) && key.length > bestLen) {
      best = type; bestLen = key.length
    }
  }
  return best
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
  const [joueurs, setJoueurs]         = useState<any[]>([])
  const [loading, setLoading]         = useState(true)
  const [query, setQuery]             = useState("")
  const [inputValue, setInputValue]   = useState("")
  const [filterBrand, setFilterBrand] = useState<string | null>(null)
  const [filterType, setFilterType]   = useState<string | null>(null)

  // Maps : nom normalisé → marque / type
  const [productMap, setProductMap] = useState<Map<string, string>>(new Map())
  const [typeMap, setTypeMap]       = useState<Map<string, string>>(new Map())

  // Debounce recherche
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 200)
    return () => clearTimeout(t)
  }, [inputValue])

  useEffect(() => {
    // Joueurs pro avec équipement
    supabase
      .from("joueurs_pro")
      .select("id, nom, pays, classement_mondial, genre, style, bois_nom, revetement_cd, revetement_rv")
      .eq("actif", true)
      .order("classement_mondial")
      .then(({ data }) => { setJoueurs(data || []); setLoading(false) })

    // Requête combinée : marques + types en une seule fois
    Promise.all([
      supabase.from("produits").select("nom, marques(nom)"),
      supabase.from("revetements").select("type_revetement, produits(nom)"),
    ]).then(([{ data: produitsData }, { data: revData }]) => {
      const pm = new Map<string, string>()
      const tm = new Map<string, string>()

      // Marques depuis produits (marques = many-to-one → objet ou tableau selon Supabase)
      produitsData?.forEach((p: any) => {
        const marque = Array.isArray(p.marques) ? p.marques[0] : p.marques
        if (marque?.nom) pm.set(normalize(p.nom), marque.nom)
      })

      // Types depuis revetements (produits = many-to-one → objet ou tableau)
      revData?.forEach((r: any) => {
        const produit = Array.isArray(r.produits) ? r.produits[0] : r.produits
        const nom = produit?.nom
        if (nom && r.type_revetement) tm.set(normalize(nom), r.type_revetement)
      })

      setProductMap(pm)
      setTypeMap(tm)
    })
  }, [])

  // Détermine les marques et types de chaque joueur
  const joueursEnrichis = useMemo(() => {
    return joueurs.map(j => {
      const brandsSet = new Set<string>()
      const typesSet  = new Set<string>()
      // Marques : bois + cd + rv
      ;[j.bois_nom, j.revetement_cd, j.revetement_rv].forEach(eq => {
        const b = getBrand(eq, productMap)
        if (b) brandsSet.add(b)
      })
      // Types : UNIQUEMENT revetement_cd et revetement_rv — jamais le bois
      ;[j.revetement_cd, j.revetement_rv].forEach(eq => {
        const t = getType(eq, typeMap)
        if (t) typesSet.add(t)
      })
      return { ...j, brands: [...brandsSet], types: [...typesSet] }
    })
  }, [joueurs, productMap, typeMap])

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

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>

      {/* En-tête */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Joueurs professionnels</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Classement mondial ITTF avril 2026</p>
      </div>

      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <svg style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Rechercher un joueur par nom ou prénom…"
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
            {(["In","Out","Mid","Long"] as const).map(t => {
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
            <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>Marque</p>
            {nbFiltres > 0 && (
              <button onClick={() => { setFilterBrand(null); setFilterType(null) }}
                style={{ background: "none", border: "none", color: "#D97757", fontSize: "12px", fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "Poppins, sans-serif" }}>
                × Effacer ({nbFiltres})
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

      {/* Bandeau info (masqué pendant filtrage/recherche) */}
      {!recherche && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderLeft: "3px solid #D97757", borderRadius: "0 8px 8px 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.7 }}>
            Retrouvez sur cette page le matériel utilisé par les meilleurs joueurs mondiaux : bois, revêtements coup droit et revers.
            À noter que les professionnels jouent avec des versions spéciales de certains produits — boostés, personnalisés ou non disponibles à la vente — qui ne correspondent pas toujours aux gammes accessibles au grand public.
          </p>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)", fontSize: "14px" }}>Chargement...</div>
      )}

      {/* Résultats filtrés : liste unifiée */}
      {!loading && recherche && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "14px" }}>
              Aucun joueur trouvé pour ces critères
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                {filtered.length} joueur{filtered.length > 1 ? "s" : ""}
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
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>Hommes</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{hommes.length} joueurs classés</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {hommes.map(j => <CarteJoueur key={j.id} j={j} />)}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>Femmes</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{femmes.length} joueuses classées</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {femmes.map(j => <CarteJoueur key={j.id} j={j} />)}
            </div>
          </div>
        </div>
      )}

    </main>
  )
}
