import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AvisSection from "@/app/revetements/[slug]/AvisSection"
import BoisMaterialSection from "./BoisMaterialSection"

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("id, nom, slug, marques(nom, pays, site_web), bois(nombre_plis, vitesse_note, controle_note, composition, rigidite, poids, taille_lame, type_jeu, type_manche)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const detail = produit.bois as any
  const marque = produit.marques as any

  const infos = [
    { label: "Nombre de plis", value: detail?.nombre_plis },
    { label: "Composition", value: detail?.composition },
    { label: "Type de jeu", value: detail?.type_jeu },
    { label: "Type de manche", value: detail?.type_manche },
    { label: "Taille de lame", value: detail?.taille_lame },
    { label: "Poids", value: detail?.poids },
    { label: "Rigidité", value: detail?.rigidite },
    { label: "Vitesse /10", value: detail?.vitesse_note },
    { label: "Contrôle /10", value: detail?.controle_note },
  ].filter(i => i.value)

  const stats = [
    { label: "Vitesse", value: detail?.vitesse_note, color: "#1A56DB" },
    { label: "Contrôle", value: detail?.controle_note, color: "#0E7F4F" },
  ]

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/bois" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "1.5rem" }}>
        Retour aux bois
      </a>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px", letterSpacing: "-0.5px" }}>{produit.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>{marque?.nom}</p>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Caractéristiques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {infos.map(info => (
                <div key={info.label}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 500 }}>{info.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500 }}>{String(info.value)}</p>
                </div>
              ))}
            </div>
            {stats.some(s => s.value) && (
              <div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>Performances</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {stats.filter(s => s.value).map(stat => (
                    <div key={stat.label}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span style={{ fontSize: "13px", fontWeight: 500 }}>{stat.label}</span>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{stat.value}/10</span>
                      </div>
                      <div style={{ background: "var(--border)", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: "4px", background: stat.color, width: (stat.value / 10 * 100) + "%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <AvisSection produitId={produit.id} />
        </div>
        <div style={{ position: "sticky", top: "80px" }}>
          <BoisMaterialSection produitId={produit.id} produitNom={produit.nom} />
        </div>
      </div>
    </main>
  )
}