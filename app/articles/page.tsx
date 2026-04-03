"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

const CATEGORIES = [
  { value: "", label: "Tous" },
  { value: "test", label: "Tests" },
  { value: "conseil", label: "Conseils" },
  { value: "actualite", label: "Actualités" },
  { value: "comparatif", label: "Comparatifs" },
]

export default function ArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [catFilter, setCatFilter] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [catFilter])

  async function fetchData() {
    setLoading(true)
    let query = supabase
      .from("articles")
      .select("id, titre, slug, extrait, categorie, image_url, vues, cree_le, utilisateurs:auteur_id(pseudo), produits(nom)")
      .eq("publie", true)
      .order("cree_le", { ascending: false })

    if (catFilter) query = query.eq("categorie", catFilter)

    const { data } = await query
    setArticles(data || [])
    setLoading(false)
  }

  const CAT_COLORS: Record<string, string> = {
    test: "#1A56DB",
    conseil: "#0E7F4F",
    actualite: "#D97757",
    comparatif: "#7C3AED",
  }

  const CAT_LABELS: Record<string, string> = {
    test: "Test",
    conseil: "Conseil",
    actualite: "Actualité",
    comparatif: "Comparatif",
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Articles & Tests</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Tests, conseils et actualités tennis de table</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "2rem", flexWrap: "wrap" }}>
        {CATEGORIES.map(c => (
          <button key={c.value} onClick={() => setCatFilter(c.value)}
            style={{ background: catFilter === c.value ? "#D97757" : "#fff", color: catFilter === c.value ? "#fff" : "var(--text-muted)", border: "1px solid " + (catFilter === c.value ? "#D97757" : "var(--border)"), borderRadius: "8px", padding: "7px 16px", fontSize: "13px", fontWeight: catFilter === c.value ? 600 : 400, cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.15s" }}>
            {c.label}
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>Chargement...</div>}

      {!loading && articles.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun article pour le moment.
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {articles.map(a => (
          <a key={a.id} href={"/articles/" + a.slug}
            style={{ display: "block", textDecoration: "none", background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", transition: "border-color 0.15s, transform 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#D97757"; e.currentTarget.style.transform = "translateY(-2px)" }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)" }}
          >
            <div style={{ padding: "20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: (CAT_COLORS[a.categorie] || "#D97757") + "20", color: CAT_COLORS[a.categorie] || "#D97757", letterSpacing: "0.4px", textTransform: "uppercase" as const }}>
                  {CAT_LABELS[a.categorie] || a.categorie}
                </span>
                {a.produits && <span style={{ fontSize: "12px", color: "var(--text-muted)", background: "var(--bg)", padding: "2px 8px", borderRadius: "4px" }}>{a.produits.nom}</span>}
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text)", marginBottom: "8px", letterSpacing: "-0.3px" }}>{a.titre}</h2>
              {a.extrait && <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.6, marginBottom: "14px" }}>{a.extrait}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: "16px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span>Par <strong>{a.utilisateurs?.pseudo || "TT-Kip"}</strong></span>
                  <span>{new Date(a.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{a.vues} vue{a.vues !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </main>
  )
}