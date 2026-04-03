"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const CATEGORIES = [
  { href: "/revetements", label: "Revêtements", description: "1 690 revêtements LARC 2026", icon: "R" },
  { href: "/bois", label: "Bois", description: "Lames et bois de compétition", icon: "B" },
  { href: "/balles", label: "Balles", description: "Balles homologuées ITTF", icon: "Ba" },
  { href: "/colles", label: "Colles", description: "Colles et accessoires", icon: "C" },
  { href: "/chaussures", label: "Chaussures", description: "Chaussures de compétition", icon: "Ch" },
  { href: "/forum", label: "Forum", description: "Discussions et conseils", icon: "F" },
]

export default function AccueilPage() {
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<any[]>([])
  const [avis, setAvis] = useState<any[]>([])
  const [stats, setStats] = useState({ produits: 0, marques: 0, membres: 0, avis: 0 })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => { fetchStats(); fetchAvis() }, [])

  async function fetchStats() {
    const [{ count: produits }, { count: marques }, { count: membres }, { count: avisCount }] = await Promise.all([
      supabase.from("revetements").select("*", { count: "exact", head: true }),
      supabase.from("marques").select("*", { count: "exact", head: true }),
      supabase.from("utilisateurs").select("*", { count: "exact", head: true }),
      supabase.from("avis").select("*", { count: "exact", head: true }).eq("valide", true)
    ])
    setStats({ produits: produits || 0, marques: marques || 0, membres: membres || 0, avis: avisCount || 0 })
  }

  async function fetchAvis() {
    const { data } = await supabase
      .from("avis")
      .select("id, titre, contenu, note, cree_le, utilisateurs(pseudo), produits(nom, slug)")
      .eq("valide", true)
      .order("cree_le", { ascending: false })
      .limit(4)
    setAvis(data || [])
  }

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
    <main>

      <section style={{ background: "#D97757", padding: "2.5rem 2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#fff", marginBottom: "12px", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Bienvenue chez TT-Kip
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", marginBottom: "1.5rem", fontWeight: 400 }}>
            On évalue les équip'
          </p>
          <div style={{ position: "relative", maxWidth: "560px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Rechercher un revêtement, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: "100%", padding: "16px 20px", fontSize: "15px", border: "none", borderRadius: "12px", outline: "none", background: "#fff", color: "#111", fontFamily: "Inter, sans-serif", boxSizing: "border-box" as const }}
            />
            {search && (
              <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", borderRadius: "10px", marginTop: "6px", overflow: "hidden", border: "1px solid var(--border)", zIndex: 10 }}>
                {loading && <div style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>Recherche...</div>}
                {!loading && resultats.length === 0 && search.length >= 2 && <div style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>Aucun résultat.</div>}
                {resultats.map((p, i) => (
                  <a key={p.id} href={"/revetements/" + p.slug}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", textDecoration: "none", color: "var(--text)", borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
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

      <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
          {[
            { label: "Revêtements", value: stats.produits.toLocaleString("fr-FR") },
            { label: "Marques", value: stats.marques.toLocaleString("fr-FR") },
            { label: "Membres", value: stats.membres.toLocaleString("fr-FR") },
            { label: "Avis publiés", value: stats.avis.toLocaleString("fr-FR") },
          ].map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "24px", fontWeight: 700, color: "#D97757", marginBottom: "2px" }}>{s.value}</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "3rem 2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem" }}>Accès rapide</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
          {CATEGORIES.map(cat => (
            <a key={cat.href} href={cat.href}
              style={{ display: "flex", alignItems: "center", gap: "14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textDecoration: "none", transition: "border-color 0.15s, transform 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#D97757"; e.currentTarget.style.transform = "translateY(-2px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                {cat.icon}
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{cat.label}</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cat.description}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Derniers avis</h2>
          <a href="/" style={{ fontSize: "13px", color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Voir tous les revêtements</a>
        </div>
        {avis.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
            Aucun avis pour le moment.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "12px" }}>
            {avis.map(a => (
              <a key={a.id} href={"/revetements/" + a.produits?.slug}
                style={{ display: "block", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textDecoration: "none", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#D97757"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "13px", color: "#D97757", marginBottom: "2px" }}>{a.produits?.nom}</p>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{a.titre}</p>
                  </div>
                  <span style={{ color: "#F59E0B", fontSize: "13px", flexShrink: 0 }}>{"★".repeat(a.note)}{"☆".repeat(5 - a.note)}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{a.contenu}</p>
                <p style={{ fontSize: "11px", color: "var(--text-light)" }}>Par <span style={{ fontWeight: 500 }}>{a.utilisateurs?.pseudo}</span> · {new Date(a.cree_le).toLocaleDateString("fr-FR")}</p>
              </a>
            ))}
          </div>
        )}
      </section>

    </main>
  )
}