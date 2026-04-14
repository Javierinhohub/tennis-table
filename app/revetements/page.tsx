import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"

export const revalidate = 60

export default async function RevatementsPage() {
  const [
    { data: produits, count },
    { data: produitsIndex },
    { data: avisData },
    { data: notesData },
    { data: marquesData },
  ] = await Promise.all([
    // 50 premiers produits pour l'affichage initial
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements!inner(numero_larc, type_revetement, couleurs_dispo, prix)", { count: "exact" })
      .eq("actif", true)
      .order("nom")
      .range(0, 49),

    // Index léger pour le filtre type côté client
    supabase
      .from("produits")
      .select("id, marque_id, revetements!inner(type_revetement)")
      .eq("actif", true)
      .limit(1000),

    supabase.from("avis").select("produit_id").eq("valide", true),
    supabase.from("notes_revetements").select("produit_id"),

    // Toutes les marques ayant au moins un revêtement actif
    // Double !inner : marques → produits → revetements (peu de marques, pas de problème de limite)
    supabase
      .from("marques")
      .select("id, nom, produits!inner(revetements!inner(id))")
      .eq("produits.actif", true)
      .order("nom"),
  ])

  const avisCount: Record<string, number> = {}
  avisData?.forEach((a: any) => {
    avisCount[a.produit_id] = (avisCount[a.produit_id] || 0) + 1
  })

  const notesCount: Record<string, number> = {}
  notesData?.forEach((n: any) => {
    notesCount[n.produit_id] = (notesCount[n.produit_id] || 0) + 1
  })

  // Trier : notes utilisateurs en premier, puis avis, puis le reste
  const sortedProduits = [...(produits || [])].sort((a: any, b: any) => {
    const scoreB = (notesCount[b.id] || 0) * 2 + (avisCount[b.id] || 0)
    const scoreA = (notesCount[a.id] || 0) * 2 + (avisCount[a.id] || 0)
    return scoreB - scoreA
  })

  // Compter les revêtements par marque et séparer principales / autres
  const toutesMarques = (marquesData || []).map((m: any) => {
    // produits!inner retourne un tableau, chaque produit a revetements!inner (tableau aussi)
    const nbRevs = (m.produits || []).filter((p: any) =>
      Array.isArray(p.revetements) ? p.revetements.length > 0 : !!p.revetements
    ).length
    return { id: m.id, nom: m.nom, nbRevs }
  })

  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>}>
      <RevatementsClient
        initialProduits={sortedProduits}
        initialTotal={count || 0}
        produitsIndex={produitsIndex || []}
        toutesMarques={toutesMarques}
        avisCount={avisCount}
        notesCount={notesCount}
      />
    </Suspense>
  )
}
