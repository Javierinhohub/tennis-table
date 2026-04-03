import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AvisSection from "@/app/revetements/[slug]/AvisSection"
import MaterialSection from "@/app/revetements/[slug]/MaterialSection"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("id, nom, slug, marques(nom, pays, site_web), boosters(volume_ml, effet, vitesse_note, nombre_applications, revetements_compatibles)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const detail = produit.boosters as any
  const marque = produit.marques as any

  const infos = [
                { label: "Volume (ml)", value: detail?.volume_ml },
                { label: "Effet", value: detail?.effet },
                { label: "Vitesse /10", value: detail?.vitesse_note },
                { label: "Nombre d'applications", value: detail?.nombre_applications },
                { label: "Revêtements compatibles", value: detail?.revetements_compatibles },
  ].filter(i => i.value)

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/boosters" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "1.5rem" }}>
        Retour aux boosters
      </a>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px", letterSpacing: "-0.5px" }}>{produit.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>{marque?.nom}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Caractéristiques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {infos.map(info => (
                <div key={info.label}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 500 }}>{info.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{String(info.value)}</p>
                </div>
              ))}
            </div>
          </div>
          <AvisSection produitId={produit.id} />
        </div>
        <div style={{ position: "sticky", top: "80px" }}>
          <MaterialSection produitId={produit.id} produitNom={produit.nom} />
        </div>
      </div>
    </main>
  )
}