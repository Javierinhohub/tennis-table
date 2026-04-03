import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

const CAT_LABELS: Record<string, string> = {
  test: "Test", conseil: "Conseil", actualite: "Actualité", comparatif: "Comparatif"
}
const CAT_COLORS: Record<string, string> = {
  test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED"
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: article } = await supabase
    .from("articles")
    .select("*, utilisateurs:auteur_id(pseudo), produits(nom, slug)")
    .eq("slug", slug)
    .eq("publie", true)
    .single()

  if (!article) notFound()

  await supabase.from("articles").update({ vues: (article.vues || 0) + 1 }).eq("id", article.id)

  const color = CAT_COLORS[article.categorie] || "#D97757"

  return (
    <main style={{ maxWidth: "780px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/articles" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour aux articles
      </a>

      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: color + "20", color, letterSpacing: "0.4px", textTransform: "uppercase" as const }}>
            {CAT_LABELS[article.categorie] || article.categorie}
          </span>
          {article.produits && (
            <a href={"/revetements/" + article.produits.slug} style={{ fontSize: "12px", color: "#D97757", background: "#FFF0EB", padding: "2px 8px", borderRadius: "4px", textDecoration: "none", fontWeight: 500 }}>
              {article.produits.nom}
            </a>
          )}
        </div>
        <h1 style={{ fontSize: "clamp(1.6rem, 4vw, 2.2rem)", fontWeight: 700, marginBottom: "12px", letterSpacing: "-0.5px", lineHeight: 1.2 }}>{article.titre}</h1>
        <div style={{ display: "flex", gap: "16px", fontSize: "13px", color: "var(--text-muted)" }}>
          <span>Par <strong style={{ color: "var(--text)" }}>{article.utilisateurs?.pseudo || "TT-Kip"}</strong></span>
          <span>{new Date(article.cree_le).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
          <span>{article.vues} vue{article.vues !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {article.extrait && (
        <div style={{ background: "var(--bg)", borderLeft: "3px solid #D97757", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "2rem", fontSize: "15px", color: "var(--text-muted)", fontStyle: "italic", lineHeight: 1.6 }}>
          {article.extrait}
        </div>
      )}

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", lineHeight: 1.8, fontSize: "15px", color: "var(--text)", whiteSpace: "pre-wrap" as const }}>
        {article.contenu}
      </div>

      <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--bg)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Cet article vous a été utile ?</span>
        <a href="/forum" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600 }}>
          En discuter sur le forum
        </a>
      </div>
    </main>
  )
}