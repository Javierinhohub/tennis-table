import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 3600

export default async function JoueursPage() {
  const { data: joueurs } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, photo_url")
    .eq("actif", true)
    .order("classement_mondial")

  const DRAPEAUX: Record<string, string> = {
    "Chine": "🇨🇳", "France": "🇫🇷", "Allemagne": "🇩🇪", "Suède": "🇸🇪",
    "Japon": "🇯🇵", "Corée du Sud": "🇰🇷", "Brésil": "🇧🇷", "Portugal": "🇵🇹",
    "Autriche": "🇦🇹", "Roumanie": "🇷🇴", "Croatie": "🇭🇷", "Belgique": "🇧🇪",
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Joueurs professionnels</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{joueurs?.length || 0} joueurs — classement mondial ITTF</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
        {(joueurs || []).map((j: any) => (
          <Link key={j.id} href={"/joueurs/" + j.id}
            style={{ display: "flex", alignItems: "center", gap: "14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", textDecoration: "none", transition: "border-color 0.15s" }}
          >
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
              {j.classement_mondial <= 3 ? ["🥇","🥈","🥉"][j.classement_mondial - 1] : j.nom[0]}
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 700, fontSize: "15px", color: "var(--text)", marginBottom: "2px" }}>{j.nom}</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {DRAPEAUX[j.pays] || ""} {j.pays}
              </p>
            </div>
            <div style={{ textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "20px", fontWeight: 800, color: "#D97757" }}>#{j.classement_mondial}</p>
              <p style={{ fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>mondial</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}