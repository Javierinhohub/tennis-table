export const metadata = {
  title: "Articles & Tests tennis de table",
  description: "Tests, conseils et comparatifs de matériel de tennis de table par des joueurs passionnés. Guides d'achat et analyses approfondies.",
  alternates: { canonical: "https://www.tt-kip.com/articles" },
  openGraph: { title: "Articles & Tests tennis de table", description: "Tests et conseils matériel ping pong par TT-Kip.", url: "https://www.tt-kip.com/articles" },
}
import { supabase } from "@/lib/supabase"
import ArticlesClient from "./ArticlesClient"

export const dynamic = "force-dynamic"

const CAT_LABELS: Record<string, string> = { test: "Test", conseil: "Conseil", actualite: "Actualité", comparatif: "Comparatif" }
const CAT_COLORS: Record<string, string> = { test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED" }

export default async function ArticlesPage() {
  const { data: articles, error } = await supabase
    .from("articles")
    .select("id, titre, slug, extrait, categorie, vues, cree_le, utilisateurs:auteur_id(pseudo), produits(nom)")
    .eq("publie", true)
    .order("cree_le", { ascending: false })

  // Fallback sans le join utilisateurs si la FK n'est pas déclarée
  const articlesData = error
    ? (await supabase
        .from("articles")
        .select("id, titre, slug, extrait, categorie, vues, cree_le")
        .eq("publie", true)
        .order("cree_le", { ascending: false })
      ).data
    : articles

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Articles & Tests</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Tests, conseils et actualités tennis de table</p>
      </div>
      <ArticlesClient articles={articlesData || []} catColors={CAT_COLORS} catLabels={CAT_LABELS} />
    </main>
  )
}
