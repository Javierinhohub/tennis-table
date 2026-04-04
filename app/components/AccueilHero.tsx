"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"

type Result = { id: string, nom: string, slug: string, type: string, detail?: string }

export default function AccueilHero() {
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (search.length < 2) { setResultats([]); setLoading(false); return }
    setLoading(true)
    const timer = setTimeout(async () => {
      const [revs, boisData, arts, joueurs] = await Promise.all([
        supabase.from("produits").select("id, nom, slug, marques(nom), revetements(type_revetement)").ilike("nom", search + "%").eq("actif", true).not("revetements", "is", null).limit(4),
        supabase.from("produits").select("id, nom, slug, marques(nom)").ilike("nom", search + "%").eq("actif", true).not("bois", "is", null).limit(2),
        supabase.from("articles").select("id, titre, slug, categorie").ilike("titre", "%" + search + "%").eq("publie", true).limit(2),
        supabase.from("joueurs_pro").select("id, nom, pays").ilike("nom", "%" + search + "%").eq("actif", true).limit(2),
      ])

      const all: Result[] = []
      const TYPE_LABELS: Record<string, string> = { In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin" }

      revs.data?.forEach(p => all.push({ id: p.id, nom: p.nom, slug: "/revetements/" + p.slug, type: "Revêtement", detail: (p.marques as any)?.nom + (p.revetements ? " · " + TYPE_LABELS[(p.revetements as any).type_revetement] || "" : "") }))
      boisData.data?.forEach(p => all.push({ id: p.id, nom: p.nom, slug: "/bois/" + p.slug, type: "Bois", detail: (p.marques as any)?.nom }))
      arts.data?.forEach(a => all.push({ id: a.id, nom: a.titre, slug: "/articles/" + a.slug, type: a.categorie === "conseil" ? "Conseil" : a.categorie === "test" ? "Test" : "Article", detail: "" }))
      joueurs.data?.forEach(j => all.push({ id: j.id, nom: j.nom, slug: "/joueurs/" + j.id, type: "Joueur", detail: j.pays }))

      setResultats(all)
      setLoading(false)
    }, 180)
    return () => clearTimeout(timer)
  }, [search])

  const TYPE_COLORS: Record<string, string> = {
    "Revêtement": "#1A56DB", "Bois": "#0E7F4F", "Test": "#D97757", "Conseil": "#7C3AED", "Article": "#D97757", "Joueur": "#EF4444"
  }

  return (
    <section style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", padding: "3rem 2rem 2.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "8px", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Bienvenue chez TT-Kip
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem" }}>On évalue les équip'</p>
        <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto" }}>
          <input ref={inputRef} type="text"
            placeholder="Rechercher revêtement, bois, joueur, article..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 200)}
            style={{ width: "100%", padding: "14px 44px 14px 18px", fontSize: "15px", border: "none", borderRadius: "12px", outline: "none", background: "#fff", color: "#111", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", transition: "box-shadow 0.2s" }}
          />
          <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "18px", pointerEvents: "none" }}>
            {loading ? "⏳" : "🔍"}
          </span>
          {search && resultats.length === 0 && !loading && search.length >= 2 && focused && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", borderRadius: "12px", padding: "16px", zIndex: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", textAlign: "left" }}>
              <p style={{ fontSize: "14px", color: "var(--text-muted)", textAlign: "center" as const }}>Aucun résultat pour « {search} »</p>
            </div>
          )}
          {resultats.length > 0 && focused && (
            <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, background: "#fff", borderRadius: "12px", overflow: "hidden", zIndex: 10, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", textAlign: "left" }}>
              {resultats.map((r, i) => (
                <a key={r.id + r.type} href={r.slug}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 16px", textDecoration: "none", color: "var(--text)", borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", transition: "background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                >
                  <div>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>{r.nom}</span>
                    {r.detail && <span style={{ color: "var(--text-muted)", fontSize: "13px", marginLeft: "8px" }}>{r.detail}</span>}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "10px", background: (TYPE_COLORS[r.type] || "#D97757") + "20", color: TYPE_COLORS[r.type] || "#D97757", flexShrink: 0, marginLeft: "8px" }}>{r.type}</span>
                </a>
              ))}
              <div style={{ padding: "8px 16px", fontSize: "12px", color: "var(--text-muted)", background: "var(--bg)", display: "flex", justifyContent: "space-between" }}>
                <span>{resultats.length} résultat{resultats.length > 1 ? "s" : ""}</span>
                <a href={"/revetements?q=" + encodeURIComponent(search)} style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Tout voir →</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}