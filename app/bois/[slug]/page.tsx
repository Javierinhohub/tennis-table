import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import AvisSectionBois from "./AvisSectionBois"
import NotesSectionBois from "./NotesSectionBois"
import BackButton from "@/app/components/BackButton"
import VideoSection from "@/app/components/VideoSection"

// ── Métadonnées dynamiques ────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("nom, marques(nom), bois(style, nb_plis, composition)")
    .eq("slug", slug)
    .single()

  if (!produit) return { title: "Bois introuvable" }

  const marque = (produit.marques as any)?.nom || ""
  const b = produit.bois as any
  const nom = produit.nom

  const details = [
    b?.style ? `style ${b.style}` : "",
    b?.nb_plis ? `${b.nb_plis} plis` : "",
    b?.poids_g ? `${b.poids_g} g` : "",
  ].filter(Boolean).join(", ")

  const title = `${marque} ${nom}${b?.style ? ` ${b.style}` : ""} — Avis, test et composition`
  const description = `Test et avis du bois de ping ${marque} ${nom}${details ? ` (${details})` : ""}${b?.composition ? `. Composition : ${b.composition}` : ""}. Notes et retours des joueurs sur TT-Kip.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.tt-kip.com/bois/${slug}`,
      type: "website",
    },
    alternates: { canonical: `https://www.tt-kip.com/bois/${slug}` },
    keywords: [`${marque} ${nom}`, "bois tennis de table", "bois ping pong", marque, b?.style || "", "TT-Kip"].filter(Boolean),
  }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const { data: produit } = await supabase
    .from("produits")
    .select(`
      id, nom, slug,
      marques(nom, site_web),
      bois(
        nb_plis, poids_g, epaisseur_mm, composition,
        pli1, pli2, pli3, pli4, pli5, pli6, pli7,
        style, prix,
        note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix
      )
    `)
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const b = produit.bois as any
  const marque = produit.marques as any

  // Joueurs pro qui utilisent ce bois
  const { data: joueursPro } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, genre")
    .ilike("bois_nom", "%" + produit.nom + "%")
    .eq("actif", true)
    .order("classement_mondial")

  // Utilisateurs du site qui utilisent ce bois
  const { data: utilisateurs } = await supabase
    .from("utilisateurs")
    .select("id, pseudo, classement, club")
    .eq("bois_id", produit.id)
    .limit(10)

  const DRAPEAUX: Record<string, string> = {
    "Chine":"🇨🇳","France":"🇫🇷","Allemagne":"🇩🇪","Suède":"🇸🇪","Japon":"🇯🇵",
    "Corée du Sud":"🇰🇷","Brésil":"🇧🇷","Taipei":"🇹🇼","Danemark":"🇩🇰",
    "Slovénie":"🇸🇮","Égypte":"🇪🇬","Australie":"🇦🇺","Russie":"🇷🇺",
    "Inde":"🇮🇳","États-Unis":"🇺🇸","Luxembourg":"🇱🇺","Hong Kong":"🇭🇰",
    "Portugal":"🇵🇹","Espagne":"🇪🇸","Croatie":"🇭🇷","Roumanie":"🇷🇴",
    "Pologne":"🇵🇱","Belgique":"🇧🇪",
  }

  const plis = [b?.pli1, b?.pli2, b?.pli3, b?.pli4, b?.pli5, b?.pli6, b?.pli7].filter(Boolean)

  // Vidéos YouTube liées à ce produit
  const { data: videosData } = await supabase
    .from("produit_videos")
    .select("id, youtube_url, titre")
    .eq("produit_id", produit.id)
    .order("ordre")
    .order("cree_le")

  // Avis : moyenne, nombre et contenu pour aggregateRating + review Google
  const { data: avisData } = await supabase
    .from("avis")
    .select("note, titre, contenu")
    .eq("produit_id", produit.id)
    .eq("valide", true)
    .order("cree_le", { ascending: false })
  const avisCount = avisData?.length ?? 0
  const avgNote = avisCount > 0
    ? (avisData!.reduce((s, a) => s + a.note, 0) / avisCount).toFixed(1)
    : null

  // Seulement si au moins 1 avis : évite le schema Product invalide sans reviews
  const jsonLd: Record<string, any> | null = avisCount > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${marque?.nom} ${produit.nom}`,
    "image": "https://www.tt-kip.com/og-image.jpg",
    "brand": { "@type": "Brand", "name": marque?.nom },
    "category": "Bois de tennis de table",
    "description": `Bois de tennis de table ${marque?.nom} ${produit.nom}${b?.style ? `, style ${b.style}` : ""}${b?.nb_plis ? `, ${b.nb_plis} plis` : ""}.`,
    "url": `https://www.tt-kip.com/bois/${slug}`,
    ...(b?.prix ? {
      "offers": {
        "@type": "Offer",
        "price": parseFloat(b.prix),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.tt-kip.com/bois/${slug}`,
      }
    } : {}),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgNote,
      "reviewCount": avisCount,
      "bestRating": "5",
      "worstRating": "1",
    },
    "review": avisData!
      .filter(a => a.contenu)
      .slice(0, 3)
      .map(a => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": "Membre TT-Kip" },
        ...(a.titre ? { "name": a.titre } : {}),
        "reviewBody": a.contenu.slice(0, 500),
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": String(a.note),
          "bestRating": "5",
          "worstRating": "1",
        },
      })),
  } : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <BackButton fallback="/bois" label="Retour aux bois" />

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" as const }}>
          <div>
            <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>{produit.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>{marque?.nom}</p>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
            {b?.style && (
              <span style={{ background: "#FFF0EB", color: "#D97757", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}>
                {b.style}
              </span>
            )}
            {b?.nb_plis && (
              <span style={{ background: "var(--bg)", color: "var(--text-muted)", padding: "4px 12px", borderRadius: "6px", fontSize: "13px", border: "1px solid var(--border)" }}>
                {b.nb_plis} plis
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        <div>

          {/* Caractéristiques */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>Caractéristiques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Style", value: b?.style || "Non renseigné" },
                { label: "Poids", value: b?.poids_g ? b.poids_g + " g" : "Non renseigné" },
                { label: "Épaisseur", value: b?.epaisseur_mm && b.epaisseur_mm !== "0.0" ? b.epaisseur_mm + " mm" : "Non renseigné" },
                { label: "Prix indicatif", value: b?.prix ? b.prix + " €" : "Non renseigné" },
                { label: "Nombre de plis", value: b?.nb_plis ? b.nb_plis + " plis" : "Non renseigné" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "3px" }}>{label}</p>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: value === "Non renseigné" ? "var(--text-muted)" : "var(--text)" }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Composition */}
          {plis.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>Composition pli par pli</h2>
              <div style={{ display: "flex", gap: "0", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border)" }}>
                {plis.map((pli: string, i: number) => (
                  <div key={i} style={{
                    flex: 1, padding: "10px 6px", textAlign: "center" as const,
                    background: i === Math.floor(plis.length / 2) ? "#FFF0EB" : i % 2 === 0 ? "#fff" : "var(--bg)",
                    borderRight: i < plis.length - 1 ? "1px solid var(--border)" : "none"
                  }}>
                    <p style={{ fontSize: "10px", color: "var(--text-muted)", marginBottom: "3px" }}>Pli {i + 1}</p>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: i === Math.floor(plis.length / 2) ? "#D97757" : "var(--text)" }}>{pli}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Joueurs pro */}
          {joueursPro && joueursPro.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
                Joueurs pro — matériel actuel
              </h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                {joueursPro.map((j: any) => (
                  <a key={j.id} href={"/joueurs/" + j.id}
                    style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", textDecoration: "none", background: "var(--bg)" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#D97757", minWidth: "30px" }}>#{j.classement_mondial}</span>
                    <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", flex: 1 }}>{j.nom}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{DRAPEAUX[j.pays] || ""} {j.pays}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Utilisateurs du site */}
          {utilisateurs && utilisateurs.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
                Membres TT-Kip qui utilisent ce bois
              </h2>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
                {utilisateurs.map((u: any) => (
                  <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "8px 12px", borderRadius: "8px", background: "var(--bg)" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#D97757" }}>
                      {(u.pseudo || "?")[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>{u.pseudo}</span>
                    {u.classement && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{u.classement} pts</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vidéos de jeu */}
          <VideoSection videos={videosData || []} />

          {/* Section Caractéristiques & Notes (TT-Kip + Utilisateurs) */}
          <NotesSectionBois produitId={produit.id} bois={b} />

          {/* Section avis écrits */}
          <AvisSectionBois produitId={produit.id} />

        </div>

        {/* Sidebar */}
        <div style={{ position: "sticky" as const, top: "80px" }}>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1rem" }}>
            <div style={{ fontSize: "28px", fontWeight: 800, color: "#D97757", marginBottom: "4px" }}>
              {b?.prix ? b.prix + " €" : "Prix non renseigné"}
            </div>
            {marque?.site_web && (
              <a href={marque.site_web} target="_blank" rel="noopener noreferrer"
                style={{ display: "block", background: "#D97757", color: "#fff", textAlign: "center" as const, padding: "10px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, marginTop: "1rem" }}>
                Voir sur le site {marque.nom}
              </a>
            )}
          </div>

          {b?.composition && (
            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.2rem" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "6px" }}>Composition</p>
              <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.6 }}>{b.composition}</p>
            </div>
          )}
        </div>
      </div>
    </main>
    </>
  )
}
