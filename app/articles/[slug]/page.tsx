import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ArticleComments from "./ArticleComments"
import type { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: article } = await supabase
    .from("articles")
    .select("titre, extrait")
    .eq("slug", slug)
    .eq("publie", true)
    .single()
  if (!article) return { title: "Article introuvable" }
  return {
    title: article.titre,
    description: article.extrait || undefined,
    alternates: { canonical: `https://www.tt-kip.com/articles/${slug}` },
    openGraph: {
      title: article.titre,
      description: article.extrait || undefined,
      url: `https://www.tt-kip.com/articles/${slug}`,
      type: "article",
    },
  }
}

const CAT_LABELS: Record<string, string> = {
  test: "Test", conseil: "Conseil", actualite: "Actualité", comparatif: "Comparatif"
}
const CAT_COLORS: Record<string, string> = {
  test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED"
}

function sanitize(str: string) {
  return str.replace(/<script[^>]*>.*?<\/script>/gis, '').replace(/on\w+="[^"]*"/gi, '').replace(/javascript:/gi, '')
}

function inlineFormat(t: string) {
  return t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\_(.+?)\_/g, "<em>$1</em>")
}

function renderMarkdown(text: string) {
  const lines = text.split("\n")
  const html: string[] = []
  let inList = false
  let inTable = false
  let tableHeaderDone = false

  const closeList = () => { if (inList) { html.push("</ul>"); inList = false } }
  const closeTable = () => { if (inTable) { html.push("</tbody></table>"); inTable = false; tableHeaderDone = false } }

  for (const line of lines) {
    const t = line.trim()

    // Tableau markdown (lignes commençant par |)
    if (t.startsWith("|")) {
      closeList()
      const cells = t.split("|").filter((_, i, a) => i > 0 && i < a.length - 1).map(c => c.trim())
      const isSeparator = cells.every(c => /^[-:]+$/.test(c))
      if (isSeparator) continue // ligne de séparation --- ignorée
      if (!inTable) {
        // Première ligne = en-tête
        html.push(`<table style="width:100%;border-collapse:collapse;margin:1rem 0;font-size:14px">`)
        html.push(`<thead><tr>${cells.map(c => `<th style="border:1px solid var(--border);padding:8px 12px;background:var(--bg);font-weight:700;text-align:left">${inlineFormat(c)}</th>`).join("")}</tr></thead>`)
        html.push(`<tbody>`)
        inTable = true
        tableHeaderDone = true
      } else {
        html.push(`<tr>${cells.map((c, i) => `<td style="border:1px solid var(--border);padding:8px 12px;${i === 0 ? "font-weight:600" : ""}">${inlineFormat(c)}</td>`).join("")}</tr>`)
      }
      continue
    }

    closeTable()

    if (!t) { closeList(); html.push("<br/>"); continue }
    if (t.startsWith("### ")) { closeList(); html.push(`<h3 style="font-size:16px;font-weight:700;margin:1.2rem 0 0.4rem">${inlineFormat(t.slice(4))}</h3>`); continue }
    if (t.startsWith("## ")) { closeList(); html.push(`<h2 style="font-size:18px;font-weight:700;margin:1.5rem 0 0.5rem;border-bottom:2px solid #D97757;padding-bottom:4px">${inlineFormat(t.slice(3))}</h2>`); continue }
    if (t.startsWith("# ")) { closeList(); html.push(`<h1 style="font-size:22px;font-weight:800;margin:1.5rem 0 0.5rem">${inlineFormat(t.slice(2))}</h1>`); continue }
    if (t.startsWith("- ") || t.startsWith("* ")) {
      if (!inList) { html.push(`<ul style="margin:0.5rem 0 0.5rem 1.2rem;">`); inList = true }
      html.push(`<li style="margin-bottom:4px">${inlineFormat(t.slice(2))}</li>`)
      continue
    }
    // Image markdown : ![légende](url)
    const imgMatch = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
    if (imgMatch) {
      const [, alt, src] = imgMatch
      html.push(`<figure style="margin:1.5rem 0;text-align:center"><img src="${src}" alt="${alt}" style="max-width:100%;border-radius:10px;border:1px solid var(--border)" loading="lazy" />${alt ? `<figcaption style="font-size:12px;color:var(--text-muted);margin-top:6px;font-style:italic">${alt}</figcaption>` : ""}</figure>`)
      continue
    }
    closeList()
    html.push(`<p style="margin:0.6rem 0;line-height:1.8">${inlineFormat(t)}</p>`)
  }
  closeList()
  closeTable()
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

      <ArticleComments articleId={article.id} />
    </main>
  )
}