import { supabase } from "@/lib/supabase"
import ArticlesClient from "./ArticlesClient"

export const revalidate = 60

const CAT_LABELS: Record<string, string> = { test: "Test", conseil: "Conseil", actualite: "Actualité", comparatif: "Comparatif" }
const CAT_COLORS: Record<string, string> = { test: "#1A56DB", conseil: "#0E7F4F", actualite: "#D97757", comparatif: "#7C3AED" }

export default async function ArticlesPage() {
  const { data: articles } = await supabase
    .from("articles")
    .select("id, titre, slug, extrait, categorie, image_url, vues, cree_le, utilisateurs:auteur_id(pseudo), produits(nom)")
    .eq("publie", true)
    .order("cree_le", { ascending: false })

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Articles & Tests</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Tests, conseils et actualités tennis de table</p>
      </div>
      <ArticlesClient articles={articles || []} catColors={CAT_COLORS} catLabels={CAT_LABELS} />
    </main>
  )
}
