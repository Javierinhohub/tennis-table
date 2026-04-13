import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"

export const revalidate = 60

export default async function RevatementsPage() {
  const [{ data: produits, count }, { data: produitsIndex }, { data: toutesMarques }] = await Promise.all([
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements!inner(numero_larc, type_revetement, couleurs_dispo)", { count: "exact" })
      .eq("actif", true)
      .order("nom")
      .range(0, 49),

    supabase
      .from("produits")
      .select("marque_id, marques(id, nom), revetements!inner(type_revetement)")
      .eq("actif", true),

    // Toutes les marques ayant au moins un revêtement actif
    supabase
      .from("marques")
      .select("id, nom")
      .order("nom"),
  ])

  // Filtrer les marques qui ont effectivement un revêtement
  const marqueIdsAvecRev = new Set(
    (produitsIndex || []).map((p: any) => p.marque_id).filter(Boolean)
  )
  const marquesAvecRev = (toutesMarques || []).filter((m: any) => marqueIdsAvecRev.has(m.id))

  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>}>
      <RevatementsClient
        initialProduits={produits || []}
        initialTotal={count || 0}
        produitsIndex={produitsIndex || []}
        toutesMarques={marquesAvecRev}
      />
    </Suspense>
  )
}
