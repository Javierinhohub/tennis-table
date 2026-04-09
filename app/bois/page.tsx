import { supabase } from "@/lib/supabase"
import BoisClient from "./BoisClient"

export const revalidate = 300

export default async function BoisPage() {
  const { data: produits } = await supabase
    .from("produits")
    .select("id, nom, slug, marques(id, nom), bois(nb_plis, poids_g, epaisseur_mm, composition)")
    .eq("actif", true)
    .not("bois", "is", null)
    .order("nom")
    .limit(2000)

  // Seules les marques qui ont au moins un bois dans les résultats
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
      <BoisClient produits={produits || []} marques={marquesAvecBois} />
    </main>
  )
}
