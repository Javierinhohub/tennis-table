import { supabase } from "@/lib/supabase"
import BoisClient from "./BoisClient"

export const revalidate = 300

export default async function BoisPage() {
  const [{ data: produits }, { data: avisData }] = await Promise.all([
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), bois!inner(nb_plis, poids_g, epaisseur_mm, style, composition)")
      .eq("actif", true)
      .order("nom")
      .limit(2000),

    supabase
      .from("avis")
      .select("produit_id")
      .eq("valide", true),
  ])

  // Map produit_id → nombre d'avis
  const avisCount: Record<string, number> = {}
  avisData?.forEach((a: any) => {
    avisCount[a.produit_id] = (avisCount[a.produit_id] || 0) + 1
  })

  // Trier : bois avec avis en premier
  const sortedProduits = [...(produits || [])].sort(
    (a: any, b: any) => (avisCount[b.id] || 0) - (avisCount[a.id] || 0)
  )

  const marquesAvecBois = Array.from(
    new Map(
      (produits || [])
        .map((p: any) => p.marques)
        .filter(Boolean)
        .map((m: any) => [m.id, m])
    ).values()
  ).sort((a: any, b: any) => a.nom.localeCompare(b.nom))

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Bois</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{produits?.length || 0} bois disponibles</p>
      </div>
      <BoisClient produits={sortedProduits} marques={marquesAvecBois} avisCount={avisCount} />
    </main>
  )
}
