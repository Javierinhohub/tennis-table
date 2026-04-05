import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 3600

const DRAPEAUX: Record<string, string> = {
  "Chine": "🇨🇳", "France": "🇫🇷", "Allemagne": "🇩🇪", "Suède": "🇸🇪",
  "Japon": "🇯🇵", "Corée du Sud": "🇰🇷", "Brésil": "🇧🇷", "Portugal": "🇵🇹",
  "Autriche": "🇦🇹", "Roumanie": "🇷🇴", "Croatie": "🇭🇷", "Belgique": "🇧🇪",
  "Danemark": "🇩🇰", "Slovénie": "🇸🇮", "Égypte": "🇪🇬", "Australie": "🇦🇺",
  "Russie": "🇷🇺", "Inde": "🇮🇳", "États-Unis": "🇺🇸", "Tchéquie": "🇨🇿",
  "Pologne": "🇵🇱", "Nigeria": "🇳🇬", "Hong Kong": "🇭🇰", "Espagne": "🇪🇸",
  "Argentine": "🇦🇷", "Luxembourg": "🇱🇺", "Kazakhstan": "🇰🇿", "Iran": "🇮🇷",
  "Algérie": "🇩🇿", "Chili": "🇨🇱", "Moldavie": "🇲🇩", "Hongrie": "🇭🇺",
  "Angleterre": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Macao": "🇲🇴", "Porto Rico": "🇵🇷",
  "Singapour": "🇸🇬", "Pays de Galles": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Ukraine": "🇺🇦",
  "Turquie": "🇹🇷", "Thaïlande": "🇹🇭", "Italie": "🇮🇹", "Pays-Bas": "🇳🇱",
  "Serbie": "🇷🇸", "Canada": "🇨🇦", "Cameroun": "🇨🇲", "Bénin": "🇧🇯",
  "Taipei": "🇹🇼",
}

function CarteJoueur({ j }: { j: any }) {
  return (
    <Link href={"/joueurs/" + j.id}
      style={{ display: "flex", alignItems: "center", gap: "12px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px 14px", textDecoration: "none", transition: "border-color 0.15s, transform 0.1s" }}
      onMouseEnter={(e: any) => { e.currentTarget.style.borderColor = "#D97757"; e.currentTarget.style.transform = "translateY(-1px)" }}
      onMouseLeave={(e: any) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none" }}
    >
      <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
        {j.classement_mondial <= 3 ? ["🥇","🥈","🥉"][j.classement_mondial - 1] : j.nom[0]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text)", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.nom}</p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{DRAPEAUX[j.pays] || ""} {j.pays}</p>
      </div>
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <p style={{ fontSize: "18px", fontWeight: 800, color: "#D97757", lineHeight: 1 }}>#{j.classement_mondial}</p>
      </div>
    </Link>
  )
}

export default async function JoueursPage() {
  const { data: joueurs } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, genre")
    .eq("actif", true)
    .order("classement_mondial")

  const hommes = (joueurs || []).filter((j: any) => j.genre === "H")
  const femmes = (joueurs || []).filter((j: any) => j.genre === "F")

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Joueurs professionnels</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Classement mondial ITTF — Top 100 Hommes & Femmes</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

        {/* HOMMES */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", paddingBottom: "10px", borderBottom: "2px solid #D97757" }}>
            <span style={{ fontSize: "20px" }}>🏓</span>
            <h2 style={{ fontSize: "17px", fontWeight: 700 }}>Hommes</h2>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", background: "var(--bg)", padding: "2px 10px", borderRadius: "10px" }}>{hommes.length} joueurs</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {hommes.map((j: any) => <CarteJoueur key={j.id} j={j} />)}
          </div>
        </div>

        {/* FEMMES */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem", paddingBottom: "10px", borderBottom: "2px solid #D97757" }}>
            <span style={{ fontSize: "20px" }}>🏓</span>
            <h2 style={{ fontSize: "17px", fontWeight: 700 }}>Femmes</h2>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "var(--text-muted)", background: "var(--bg)", padding: "2px 10px", borderRadius: "10px" }}>{femmes.length} joueuses</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {femmes.map((j: any) => <CarteJoueur key={j.id} j={j} />)}
          </div>
        </div>

      </div>
    </main>
  )
}
