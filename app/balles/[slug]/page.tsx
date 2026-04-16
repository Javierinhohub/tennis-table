import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AvisSection from "@/app/revetements/[slug]/AvisSection"
import MaterialSection from "@/app/revetements/[slug]/MaterialSection"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("id, nom, slug, marques(nom, pays, site_web), balles(etoiles, materiau, couleur, diametre_mm, poids_g, certification, pack_quantite)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const detail = produit.balles as any
  const marque = produit.marques as any

  // Avis : moyenne et nombre pour aggregateRating Google
  const { data: avisData } = await supabase
    .from("avis")
    .select("note")
    .eq("produit_id", produit.id)
    .eq("valide", true)
  const avisCount = avisData?.length ?? 0
  const avgNote = avisCount > 0
    ? (avisData!.reduce((s, a) => s + a.note, 0) / avisCount).toFixed(1)
    : null

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${marque?.nom} ${produit.nom}`,
    "brand": { "@type": "Brand", "name": marque?.nom },
    "category": "Balle de tennis de table",
    "description": `Balle de tennis de table ${marque?.nom} ${produit.nom}${detail?.etoiles ? ` ${detail.etoiles} étoiles` : ""}${detail?.certification ? `, ${detail.certification}` : ""}.`,
    ...(avgNote ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": avgNote, "reviewCount": avisCount, "bestRating": "5", "worstRating": "1" } } : {}),
  }

  const infos = [
                { label: "Etoiles", value: detail?.etoiles },
                { label: "Matériau", value: detail?.materiau },
                { label: "Couleur", value: detail?.couleur },
                { label: "Diamètre (mm)", value: detail?.diametre_mm },
                { label: "Poids (g)", value: detail?.poids_g },
                { label: "Certification", value: detail?.certification },
                { label: "Quantité par pack", value: detail?.pack_quantite },
  ].filter(i => i.value)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/balles" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "1.5rem" }}>
        Retour aux balles
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
    </>
  )
}