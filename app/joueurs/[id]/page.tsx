import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const revalidate = 3600

const DRAPEAUX: Record<string, string> = {
  "Chine": "🇨🇳", "France": "🇫🇷", "Allemagne": "🇩🇪", "Suède": "🇸🇪",
  "Japon": "🇯🇵", "Corée du Sud": "🇰🇷", "Brésil": "🇧🇷", "Portugal": "🇵🇹",
  "Autriche": "🇦🇹", "Roumanie": "🇷🇴", "Croatie": "🇭🇷", "Belgique": "🇧🇪",
}

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: joueur }, { data: produits }] = await Promise.all([
    supabase.from("joueurs_pro").select("*").eq("id", id).single(),
    supabase
      .from("joueurs_pro_produits")
      .select("depuis, produits(id, nom, slug, marques(nom), sous_categories(nom), revetements(type_revetement))")
      .eq("joueur_id", id)
  ])

  if (!joueur) notFound()

  const TYPE_LABELS: Record<string, string> = {
    In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
  }

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/joueurs" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour aux joueurs
      </a>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "24px", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 800, color: "#D97757", flexShrink: 0 }}>
            {joueur.classement_mondial <= 3 ? ["🥇","🥈","🥉"][joueur.classement_mondial - 1] : joueur.nom[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "4px", letterSpacing: "-0.5px" }}>{joueur.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>
              {DRAPEAUX[joueur.pays] || ""} {joueur.pays}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "36px", fontWeight: 800, color: "#D97757", lineHeight: 1 }}>#{joueur.classement_mondial}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Classement mondial</p>
          </div>
        </div>
      </div>

      {produits && produits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
            Matériel utilisé
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {produits.map((p: any) => {
              const prod = p.produits
              const rev = prod?.revetements
              return (
                <a key={prod?.id} href={"/" + (prod?.sous_categories?.nom?.toLowerCase().includes("bois") ? "bois" : "revetements") + "/" + prod?.slug}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", background: "var(--bg)", borderRadius: "8px", textDecoration: "none", border: "1px solid transparent", transition: "border-color 0.15s" }}
                >
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{prod?.nom}</p>
                    <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{prod?.marques?.nom} · {prod?.sous_categories?.nom}</p>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    {rev && <span style={{ fontSize: "11px", fontWeight: 500, padding: "3px 8px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent)" }}>{TYPE_LABELS[rev.type_revetement] || rev.type_revetement}</span>}
                    {p.depuis && <span style={{ fontSize: "11px", color: "var(--text-muted)", padding: "3px 8px", borderRadius: "4px", background: "#fff", border: "1px solid var(--border)" }}>Depuis {p.depuis}</span>}
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )}

      {(!produits || produits.length === 0) && (
        <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", color: "var(--text-muted)" }}>
          Aucun matériel renseigné pour ce joueur.
        </div>
      )}
    </main>
  )
}