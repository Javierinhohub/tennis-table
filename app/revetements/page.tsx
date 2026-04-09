import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"

export const revalidate = 60

export default async function RevatementsPage() {
  const [{ data: produits, count }, { data: produitsIndex }] = await Promise.all([
    // Page initiale (50 premiers)
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements(numero_larc, type_revetement, couleurs_dispo)", { count: "exact" })
      .eq("actif", true)
      .not("revetements", "is", null)
      .order("nom")
      .range(0, 49),

    // Index léger : tous les produits avec juste marque + type (pour les filtres dynamiques)
    supabase
      .from("produits")
      .select("marque_id, marques(id, nom), revetements(type_revetement)")
      .eq("actif", true)
      .not("revetements", "is", null)
  ])

  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>}>
      <RevatementsClient
        initialProduits={produits || []}
        initialTotal={count || 0}
        produitsIndex={produitsIndex || []}
      />
    </Suspense>
  )
}
