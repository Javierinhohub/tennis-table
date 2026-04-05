"use client"

import { Suspense } from "react"
import { supabase } from "@/lib/supabase"
import RevatementsClient from "./RevatementsClient"


export default async function RevatementsPage() {
  const [{ data: produits, count }, { data: marques }] = await Promise.all([
    supabase
      .from("produits")
      .select("id, nom, slug, marques(id, nom), revetements(numero_larc, type_revetement, couleurs_dispo)", { count: "exact" })
      .eq("actif", true)
      .not("revetements", "is", null)
      .order("nom")
      .range(0, 49),
    supabase.from("marques").select("id, nom").order("nom")
  ])

  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>}>
      <RevatementsClient
        initialProduits={produits || []}
        initialTotal={count || 0}
        marques={marques || []}
      />
    </Suspense>
  )
}// SEO metadata already handled by layout