import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getLocale, makeT } from "@/lib/getLocale"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const { data: j } = await supabase
    .from("joueurs_pro")
    .select("nom, pays, classement_mondial, genre, style, bois_nom, revetement_cd, revetement_rv")
    .eq("id", id)
    .single()

  if (!j) return { title: "Joueur introuvable" }

  const genre = j.genre === "F" ? "joueuse" : "joueur"
  const title = `${j.nom} — Matériel et classement #${j.classement_mondial} mondial`
  const materiel = [j.bois_nom, j.revetement_cd, j.revetement_rv].filter(Boolean).join(", ")
  const description = `${j.nom} est ${genre} de tennis de table professionnel(le), classé(e) #${j.classement_mondial} mondial (${j.pays})${j.style ? `, style ${j.style}` : ""}. ${materiel ? `Matériel utilisé : ${materiel}.` : ""} Retrouvez sa fiche complète sur TT-Kip.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.tt-kip.com/joueurs/${id}`,
      type: "profile",
    },
    alternates: { canonical: `https://www.tt-kip.com/joueurs/${id}` },
  }
}

const DRAPEAUX: Record<string, string> = {
  "Chine": "🇨🇳", "Suède": "🇸🇪", "Brésil": "🇧🇷", "Japon": "🇯🇵",
  "France": "🇫🇷", "Taipei": "🇹🇼", "Corée du Sud": "🇰🇷", "Allemagne": "🇩🇪",
  "Danemark": "🇩🇰", "Slovénie": "🇸🇮", "Égypte": "🇪🇬", "Australie": "🇦🇺",
  "Russie": "🇷🇺", "Inde": "🇮🇳", "États-Unis": "🇺🇸", "Tchéquie": "🇨🇿",
  "Roumanie": "🇷🇴", "Croatie": "🇭🇷", "Pologne": "🇵🇱", "Nigeria": "🇳🇬",
  "Hong Kong": "🇭🇰", "Espagne": "🇪🇸", "Portugal": "🇵🇹", "Argentine": "🇦🇷",
  "Luxembourg": "🇱🇺", "Belgique": "🇧🇪", "Kazakhstan": "🇰🇿", "Iran": "🇮🇷",
  "Algérie": "🇩🇿", "Chili": "🇨🇱", "Moldavie": "🇲🇩", "Hongrie": "🇭🇺",
  "Angleterre": "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "Macao": "🇲🇴", "Porto Rico": "🇵🇷", "Autriche": "🇦🇹",
  "Singapour": "🇸🇬", "Pays de Galles": "🏴󠁧󠁢󠁷󠁬󠁳󠁿", "Ukraine": "🇺🇦", "Turquie": "🇹🇷",
  "Thaïlande": "🇹🇭", "Italie": "🇮🇹", "Pays-Bas": "🇳🇱", "Serbie": "🇷🇸",
  "Canada": "🇨🇦", "Cameroun": "🇨🇲", "Bénin": "🇧🇯",
}

export default async function JoueurPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const locale = await getLocale()
  const t = makeT(locale)

  const { data: j } = await supabase
    .from("joueurs_pro")
    .select("*")
    .eq("id", id)
    .single()

  if (!j) notFound()

  const drapeau = DRAPEAUX[j.pays] || "🏳️"
  const badge = (label: string, value: string, color = "#D97757") => (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px" }}>
      <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</p>
      <p style={{ fontSize: "15px", fontWeight: 700, color }}>{value || "—"}</p>
    </div>
  )

  const ageLabel = j.age ? `${j.age} ${t("players", "years")}` : "—"

  const materielParts = [j.bois_nom, j.revetement_cd, j.revetement_rv].filter(Boolean)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": j.nom,
    "url": `https://www.tt-kip.com/joueurs/${j.id || ""}`,
    "nationality": { "@type": "Country", "name": j.pays },
    "description": `${j.nom}, ${j.genre === "F" ? "joueuse" : "joueur"} de tennis de table professionnel(le), classé(e) #${j.classement_mondial} mondial (${j.pays})${j.style ? `, style de jeu ${j.style}` : ""}.${materielParts.length > 0 ? ` Matériel : ${materielParts.join(", ")}.` : ""}`,
    "sport": "Tennis de table",
    ...(j.style ? { "hasOccupation": { "@type": "Occupation", "name": `Joueur de tennis de table (style ${j.style})` } } : {}),
  }

  const worldLabel = locale === "en"
    ? `#${j.classement_mondial} ${t("players", "worldRanking")} ${j.genre === "F" ? "🏆 Women" : "🏆 Men"}`
    : `#${j.classement_mondial} ${t("players", "worldRanking")} ${j.genre === "F" ? "🏆 Femmes" : "🏆 Hommes"}`

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/joueurs" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-block", marginBottom: "1.5rem" }}>
        {t("players", "backToPlayers")}
      </a>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", borderRadius: "16px", padding: "2rem", marginBottom: "1.5rem", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" as const }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", flexShrink: 0 }}>
            {drapeau}
          </div>
          <div>
            <h1 style={{ fontSize: "clamp(1.4rem, 4vw, 2rem)", fontWeight: 800, marginBottom: "6px", letterSpacing: "-0.5px" }}>{j.nom}</h1>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" as const }}>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "13px", fontWeight: 600 }}>
                {worldLabel}
              </span>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "13px" }}>
                {j.pays}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Caractéristiques */}
      <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>{t("players", "characteristics")}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        {badge(t("players", "playStyle"), j.style || "—")}
        {badge(t("players", "hand"), j.main || "—")}
        {badge(t("players", "age"), ageLabel)}
        {badge(t("players", "country"), `${drapeau} ${j.pays}`)}
      </div>

      {/* Matériel */}
      {(j.bois_nom || j.revetement_cd || j.revetement_rv) && (
        <>
          <h2 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>{t("players", "equipment")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
            {j.bois_nom && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "4px" }}>🏏 {t("players", "blade")}</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{j.bois_nom}</p>
              </div>
            )}
            {j.revetement_cd && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "4px" }}>🔴 {t("players", "forehand")}</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{j.revetement_cd}</p>
              </div>
            )}
            {j.revetement_rv && (
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 18px" }}>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "4px" }}>⚫ {t("players", "backhand")}</p>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>{j.revetement_rv}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Note info */}
      <div style={{ background: "#FFF0EB", border: "1px solid #D97757", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", color: "#C4694A" }}>
        {t("players", "equipmentNote")}
      </div>
    </main>
    </>
  )
}
