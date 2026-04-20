import { supabase } from "@/lib/supabase"
import BoisClient from "./BoisClient"

export const revalidate = 60

const PAGE_SIZE = 50

export default async function BoisPage() {
  const [
    { data: produits, count: total },
    { data: avisData },
    { data: notesData },
    { data: toutesMarques },
  ] = await Promise.all([
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), bois!inner(nb_plis, poids_g, epaisseur_mm, style, composition)", { count: "exact" })
      .eq("actif", true)
      .order("nom")
      .range(0, PAGE_SIZE - 1),

    supabase.from("avis").select("produit_id").eq("valide", true),
    supabase.from("notes_bois").select("produit_id"),

    supabase.from("marques").select("id, nom").order("nom"),
  ])

  const avisCount: Record<string, number> = {}
  avisData?.forEach((a: any) => {
    avisCount[a.produit_id] = (avisCount[a.produit_id] || 0) + 1
  })

  const notesCount: Record<string, number> = {}
  notesData?.forEach((n: any) => {
    notesCount[n.produit_id] = (notesCount[n.produit_id] || 0) + 1
  })

  // Tri : bois avec notes/avis en premier, puis alphabétique
  const produitsTriés = [...(produits || [])].sort((a, b) => {
    const scoreA = (avisCount[a.id] || 0) + (notesCount[a.id] || 0)
    const scoreB = (avisCount[b.id] || 0) + (notesCount[b.id] || 0)
    if (scoreB !== scoreA) return scoreB - scoreA
    return a.nom.localeCompare(b.nom, "fr")
  })

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Bois</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{(total || 0).toLocaleString("fr-FR")} bois disponibles</p>
      </div>
      <BoisClient
        initialProduits={produitsTriés}
        initialTotal={total || 0}
        toutesMarques={toutesMarques || []}
        avisCount={avisCount}
        notesCount={notesCount}
      />
    </main>
  )
}
