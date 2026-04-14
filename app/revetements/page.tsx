import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"

export const revalidate = 60

export default async function RevatementsPage() {
  const [{ data: produits, count }, { data: produitsIndex }, { data: avisData }, { data: notesData }] = await Promise.all([
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements!inner(numero_larc, type_revetement, couleurs_dispo)", { count: "exact" })
      .eq("actif", true)
      .order("nom")
      .range(0, 49),

    supabase
      .from("produits")
      .select("id, marque_id, marques(id, nom), revetements!inner(type_revetement)")
      .eq("actif", true)
      .limit(5000),

    supabase.from("avis").select("produit_id").eq("valide", true),
    supabase.from("notes_revetements").select("produit_id"),
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

  // Toutes les marques ayant au moins un revêtement (sans doublon)
  const marquesMap = new Map<string, any>()
  ;(produitsIndex || []).forEach((p: any) => {
    if (p.marques && !marquesMap.has(p.marques.id)) marquesMap.set(p.marques.id, p.marques)
  })
  const toutesMarques = Array.from(marquesMap.values()).sort((a, b) => a.nom.localeCompare(b.nom))

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
