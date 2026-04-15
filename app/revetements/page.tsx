import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"

export const revalidate = 60

export default async function RevatementsPage() {
  const SELECT = "id, nom, slug, marques(id, nom), revetements!inner(numero_larc, type_revetement, couleurs_dispo, prix)"

  const [
    { data: avisData },
    { data: notesData },
    { data: produitsIndex },
    { data: marquesData },
  ] = await Promise.all([
    supabase.from("avis").select("produit_id").eq("valide", true),
    supabase.from("notes_revetements").select("produit_id"),
    supabase.from("produits").select("id, marque_id, revetements!inner(type_revetement)").eq("actif", true).limit(1000),
    supabase.from("marques").select("id, nom, produits!inner(revetements!inner(id))").eq("produits.actif", true).order("nom"),
  ])

  const avisCount: Record<string, number> = {}
  avisData?.forEach((a: any) => {
    avisCount[a.produit_id] = (avisCount[a.produit_id] || 0) + 1
  })

  const notesCount: Record<string, number> = {}
  notesData?.forEach((n: any) => {
    notesCount[n.produit_id] = (notesCount[n.produit_id] || 0) + 1
  })

  // IDs des produits ayant au moins une note ou un avis (triés par score décroissant)
  const ratedIds = [...new Set([
    ...Object.keys(notesCount),
    ...Object.keys(avisCount),
  ])].sort((a, b) => {
    const scoreB = (notesCount[b] || 0) * 2 + (avisCount[b] || 0)
    const scoreA = (notesCount[a] || 0) * 2 + (avisCount[a] || 0)
    return scoreB - scoreA
  })

  // 1. Récupérer les produits notés/avec avis en priorité (max 50)
  const ratedIdsTop = ratedIds.slice(0, 50)

  let ratedProduits: any[] = []
  if (ratedIdsTop.length > 0) {
    const { data } = await supabase
      .from("produits")
      .select(SELECT)
      .eq("actif", true)
      .in("id", ratedIdsTop)
    // Trier selon le score
    ratedProduits = (data || []).sort((a: any, b: any) => {
      const scoreB = (notesCount[b.id] || 0) * 2 + (avisCount[b.id] || 0)
      const scoreA = (notesCount[a.id] || 0) * 2 + (avisCount[a.id] || 0)
      return scoreB - scoreA
    })
  }

  // 2. Compléter avec des produits non notés (alphabétique) si moins de 50 notés
  let fillProduits: any[] = []
  const remaining = 50 - ratedProduits.length
  if (remaining > 0) {
    const { data } = await supabase
      .from("produits")
      .select(SELECT)
      .eq("actif", true)
      .not("id", "in", `(${ratedIdsTop.length > 0 ? ratedIdsTop.join(",") : "null"})`)
      .order("nom")
      .limit(remaining)
    fillProduits = data || []
  }

  const sortedProduits = [...ratedProduits, ...fillProduits]

  // Count réel : nombre de produits avec un revêtement actif
  const { count: totalCount } = await supabase
    .from("produits")
    .select("id, revetements!inner(id)", { count: "exact", head: true })
    .eq("actif", true)

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
        initialTotal={totalCount || 0}
        produitsIndex={produitsIndex || []}
        toutesMarques={toutesMarques}
        avisCount={avisCount}
        notesCount={notesCount}
      />
    </Suspense>
  )
}
