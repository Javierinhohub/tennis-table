"use client"

import { useEffect, useState } from "react"
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

function normalize(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function matchSearch(nom: string, query: string) {
  if (!query.trim()) return true
  const n = normalize(nom)
  // Chaque mot du query doit être contenu dans le nom
  return query.trim().split(/\s+/).every(word => n.includes(normalize(word)))
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

export default function JoueursPage() {
  const [joueurs, setJoueurs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [inputValue, setInputValue] = useState("")

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setQuery(inputValue), 200)
    return () => clearTimeout(t)
  }, [inputValue])

  useEffect(() => {
    supabase
      .from("joueurs_pro")
      .select("id, nom, pays, classement_mondial, genre, style")
      .eq("actif", true)
      .order("classement_mondial")
      .then(({ data }) => { setJoueurs(data || []); setLoading(false) })
  }, [])

  const filtered = joueurs.filter(j => matchSearch(j.nom, query))
  const hommes = filtered.filter(j => j.genre === "H")
  const femmes = filtered.filter(j => j.genre === "F")
  const recherche = query.trim().length > 0

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>

      {/* En-tête */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Joueurs professionnels</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Classement mondial ITTF avril 2026</p>
      </div>

      {/* Barre de recherche */}
      <div style={{ position: "relative", marginBottom: "1.2rem" }}>
        <svg
          style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}
          width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Rechercher un joueur par nom ou prénom…"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            background: "#fff", border: "1px solid var(--border)", borderRadius: "10px",
            padding: "11px 40px 11px 40px", fontSize: "14px",
            fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)",
          }}
        />
        {inputValue && (
          <button onClick={() => setInputValue("")}
            style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "18px", lineHeight: 1, padding: "2px" }}>
            ×
          </button>
        )}
      </div>

      {/* Bandeau info (masqué pendant une recherche) */}
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

      {/* Résultats de recherche : liste unifiée */}
      {!loading && recherche && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)", fontSize: "14px" }}>
              Aucun joueur trouvé pour « {query} »
            </div>
          ) : (
            <div>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""} pour « <strong style={{ color: "var(--text)" }}>{query}</strong> »
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
          {/* Hommes */}
          <div>
            <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>Hommes</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{hommes.length} joueurs classés</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              {hommes.map(j => <CarteJoueur key={j.id} j={j} />)}
            </div>
          </div>

          {/* Femmes */}
          <div>
            <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>Femmes</h2>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{femmes.length} joueurs classées</p>
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
