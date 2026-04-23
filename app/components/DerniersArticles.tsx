import { supabase } from "@/lib/supabase"
import { getLocale, makeT } from "@/lib/getLocale"

export const revalidate = 60

const CAT_COLORS: Record<string, string> = {
  test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED"
}

export default async function DerniersArticles() {
  const locale = await getLocale()
  const t = makeT(locale)

  const CAT_LABELS: Record<string, string> = {
    test:       t("home", "catTest"),
    conseil:    t("home", "catAdvice"),
    actualite:  t("home", "catNews"),
    comparatif: t("home", "catComparative"),
  }

  const { data: articles } = await supabase
    .from("articles")
    .select("id, titre, slug, extrait, categorie, cree_le")
    .eq("publie", true)
    .order("cree_le", { ascending: false })
    .limit(3)

  if (!articles || articles.length === 0) return null

  const dateLocale = locale === "en" ? "en-GB" : "fr-FR"

  return (
    <div style={{ display: "flex", flexDirection: "column" as const, gap: "10px" }}>
      {articles.map((a: any) => (
        <a key={a.id} href={"/articles/" + a.slug}
          style={{ display: "block", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: (CAT_COLORS[a.categorie] || "#D97757") + "20", color: CAT_COLORS[a.categorie] || "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.4px" }}>
              {CAT_LABELS[a.categorie] || a.categorie}
            </span>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
              {new Date(a.cree_le).toLocaleDateString(dateLocale, { day: "numeric", month: "long" })}
            </span>
          </div>
          <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "4px", lineHeight: 1.4 }}>{a.titre}</p>
          {a.extrait && <p style={{ fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{a.extrait}</p>}
        </a>
      ))}
    </div>
  )
}
