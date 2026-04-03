import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AvisSection from "./AvisSection"
import MaterialSection from "./MaterialSection"

const TYPE_LABELS: Record<string, string> = {
  In: "Inversé", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
}

export default async function RevetementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("id, nom, slug, marques(nom, pays, site_web), revetements(numero_larc, type_revetement, couleurs_dispo, larc_approuve, vitesse_note, effet_note, controle_note, poids, epaisseur_max)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const rev = produit.revetements as any
  const marque = produit.marques as any

  const { data: joueursPro } = await supabase
    .from("joueurs_pro_produits")
    .select("depuis, joueurs_pro(nom, pays, classement_mondial)")
    .eq("produit_id", produit.id)

  const stats = [
    { label: "Vitesse", value: rev?.vitesse_note, color: "#1A56DB" },
    { label: "Effet", value: rev?.effet_note, color: "#0E7F4F" },
    { label: "Contrôle", value: rev?.controle_note, color: "#B45309" },
  ]

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "4px", marginBottom: "1.5rem" }}>
        Retour à la liste
      </a>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", background: "var(--success-light)", color: "var(--success)", letterSpacing: "0.3px" }}>APPROUVE LARC 2026</span>
              <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent)", fontWeight: 500 }}>{TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement}</span>
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px", letterSpacing: "-0.5px" }}>{produit.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>{marque?.nom}</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Caractéristiques techniques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "Code LARC", value: rev?.numero_larc, mono: true },
                { label: "Type", value: TYPE_LABELS[rev?.type_revetement] },
                { label: "Couleurs", value: rev?.couleurs_dispo },
                { label: "Epaisseur max", value: rev?.epaisseur_max ? rev.epaisseur_max + " mm" : null },
                { label: "Poids", value: rev?.poids },
                { label: "Marque", value: marque?.nom },
              ].filter(item => item.value).map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "2px", fontWeight: 500 }}>{item.label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 500, fontFamily: item.mono ? "monospace" : "inherit" }}>{item.value}</p>
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

          {joueursPro && joueursPro.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Joueurs professionnels</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {joueursPro.map((jp: any) => (
                  <div key={jp.joueurs_pro?.nom} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg)", borderRadius: "8px" }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: "14px" }}>{jp.joueurs_pro?.nom}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{jp.joueurs_pro?.pays}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Classement mondial</p>
                      <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--accent)" }}>#{jp.joueurs_pro?.classement_mondial}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <AvisSection produitId={produit.id} />
        </div>

        <div style={{ position: "sticky", top: "80px" }}>
          <MaterialSection produitId={produit.id} produitNom={produit.nom} />
        </div>

      </div>
    </main>
  )
}