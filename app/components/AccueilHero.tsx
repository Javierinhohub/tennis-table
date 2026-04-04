"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function AccueilHero() {
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (search.length < 2) { setResultats([]); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("produits")
        .select("id, nom, slug, marques(nom), revetements(type_revetement)")
        .ilike("nom", "%" + search + "%")
        .eq("actif", true)
        .limit(6)
      setResultats(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const TYPE_LABELS: Record<string, string> = { In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin" }

  return (
    <section style={{ background: "#D97757", padding: "2.5rem 2rem", textAlign: "center" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Bienvenue chez TT-Kip
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem" }}>On évalue les équip'</p>
        <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto" }}>
          <input type="text" placeholder="Rechercher un revêtement, une marque..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "14px 20px", fontSize: "15px", border: "none", borderRadius: "10px", outline: "none", background: "#fff", color: "#111", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const }} />
          {search && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: "10px", marginTop: "6px", overflow: "hidden", border: "1px solid var(--border)", zIndex: 10, textAlign: "left" }}>
              {loading && <div style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>Recherche...</div>}
              {!loading && resultats.length === 0 && search.length >= 2 && <div style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>Aucun résultat.</div>}
              {resultats.map((p, i) => (
                <a key={p.id} href={"/revetements/" + p.slug}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", textDecoration: "none", color: "var(--text)", borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{p.nom}</span>
                    <span style={{ color: "var(--text-muted)", fontSize: "13px", marginLeft: "8px" }}>{p.marques?.nom}</span>
                  </div>
                  {p.revetements && <span style={{ fontSize: "11px", background: "var(--accent-light)", color: "var(--accent)", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{TYPE_LABELS[p.revetements.type_revetement] || p.revetements.type_revetement}</span>}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}