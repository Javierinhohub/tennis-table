import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

const CAT_LABELS: Record<string, string> = {
  test: "Test", conseil: "Conseil", actualite: "Actualité", comparatif: "Comparatif"
}
const CAT_COLORS: Record<string, string> = {
  test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED"
}

function sanitize(str: string) {
  return str.replace(/<script[^>]*>.*?<\/script>/gis, '').replace(/on\w+="[^"]*"/gi, '').replace(/javascript:/gi, '')
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const html: string[] = []
  let inList = false
  for (const line of lines) {
    const t = line.trim()
    if (!t) { if (inList) { html.push("</ul>"); inList = false } html.push("<br/>"); continue }
    if (t.startsWith("### ")) { if (inList) { html.push("</ul>"); inList = false } html.push(`<h3 style="font-size:16px;font-weight:700;margin:1.2rem 0 0.4rem">${t.slice(4)}</h3>`); continue }
    if (t.startsWith("## ")) { if (inList) { html.push("</ul>"); inList = false } html.push(`<h2 style="font-size:18px;font-weight:700;margin:1.5rem 0 0.5rem;border-bottom:2px solid #D97757;padding-bottom:4px">${t.slice(3)}</h2>`); continue }
    if (t.startsWith("# ")) { if (inList) { html.push("</ul>"); inList = false } html.push(`<h1 style="font-size:22px;font-weight:800;margin:1.5rem 0 0.5rem">${t.slice(2)}</h1>`); continue }
    if (t.startsWith("- ") || t.startsWith("* ")) {
      if (!inList) { html.push("<ul style=\"margin:0.5rem 0 0.5rem 1.2rem;\">"); inList = true }
      let item = t.slice(2)
      item = item.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      item = item.replace(/\_(.+?)\_/g, "<em>$1</em>")
      html.push(`<li style="margin-bottom:4px">${item}</li>`)
      continue
    }
    if (inList) { html.push("</ul>"); inList = false }
    let p = t
    p = p.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    p = p.replace(/\_(.+?)\_/g, "<em>$1</em>")
    html.push(`<p style="margin:0.6rem 0;line-height:1.8">${p}</p>`)
  }
  if (inList) html.push("</ul>")
  return sanitize(html.join(""))
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
  const html = renderMarkdown(article.contenu)

  return (
    <main style={{ maxWidth: "780px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/articles" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        ← Retour aux articles
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

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", fontSize: "15px", color: "var(--text)" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--bg)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>Cet article vous a été utile ?</span>
        <a href="/forum" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "8px 16px", fontSize: "13px", fontWeight: 600 }}>
          En discuter sur le forum
        </a>
      </div>
    </main>
  )
}