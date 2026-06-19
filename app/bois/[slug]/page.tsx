import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const revalidate = 3600 // ISR 1h — fiche bois statique entre les mises à jour
import AvisSectionBois from "./AvisSectionBois"
import NotesSectionBois from "./NotesSectionBois"
import BackButton from "@/app/components/BackButton"
import VideoSection from "@/app/components/VideoSection"
import FAQAccordion, { FAQItem } from "@/app/components/FAQAccordion"

function generateFaqBois(nom: string, marqueNom: string, b: any): FAQItem[] {
  const faq: FAQItem[] = []
  const style       = b?.style         as string | null
  const nbPlis      = b?.nb_plis       as number | null
  const composition = b?.composition   as string | null
  const poids       = b?.poids_g       as number | null
  const prix        = b?.prix          as number | null
  const vitesse     = b?.note_vitesse  as number | null

  // Q1 — Niveau
  if (style) {
    const isOff = style.startsWith("OFF")
    const isAll = style.startsWith("ALL")
    faq.push({ q: `Le ${marqueNom} ${nom} convient-il aux débutants ?`,
      a: isOff
        ? `Le ${nom} est un bois de style ${style}, destiné aux joueurs de niveau avancé à expert. Sa vitesse élevée exige une technique solide et des frappes propres pour maîtriser la trajectoire. Les débutants auront du mal à contrôler sa puissance et seront mieux servis par un bois de style ALL ou OFF-.`
        : isAll
        ? `Oui, le ${nom} de style ${style} est un excellent choix pour les joueurs de niveau intermédiaire à confirmé. Son profil équilibré facilite l'apprentissage du jeu offensif sans brider les joueurs plus avancés — c'est souvent la lame idéale pour progresser durablement.`
        : `Le ${nom} de style ${style} est adapté aux joueurs défenseurs ou souhaitant un jeu très contrôlé. Ce profil convient à des niveaux variés, des débutants qui travaillent leur placement jusqu'aux défenseurs confirmés.`
    })
  }

  // Q2 — Style de jeu
  if (style || vitesse != null) {
    const jeuDesc = style?.startsWith("OFF+") ? "l'attaque pure, les topspins puissants des deux côtés et les frappes directes décisives"
      : style?.startsWith("OFF-") ? "l'attaque construite, le jeu à mi-distance et les variations de rythme"
      : style?.startsWith("OFF") ? "le jeu offensif basé sur le topspin et les accélérations directes"
      : style?.startsWith("ALL") ? "un jeu complet alternant attaque, blocs actifs et variations"
      : "la défense, le lobbing et les retours déstabilisants"
    faq.push({ q: `Quel style de jeu favorise le ${nom} ?`,
      a: `Le ${marqueNom} ${nom} est conçu pour ${jeuDesc}. ${vitesse != null ? `Avec une vitesse de ${vitesse}/10, il ${vitesse >= 9 ? "propulse la balle très rapidement — idéal pour dominer l'échange par la vitesse pure" : vitesse >= 7 ? "offre une bonne puissance offensive tout en restant maniable" : "privilégie le placement et la précision sur la vitesse brute"}.` : ""} ${composition ? `Sa composition ${composition} contribue directement à ce profil.` : ""}`
    })
  }

  // Q3 — Composition
  if (nbPlis || composition) {
    const plisDesc = nbPlis === 5 ? "5 plis est la configuration offensive standard, offrant un bon équilibre entre sensation de balle et puissance de frappe"
      : nbPlis === 7 ? "7 plis favorise la rigidité et la stabilité, typique des lames allround à haut contrôle"
      : nbPlis ? `${nbPlis} plis est une configuration qui offre un profil de jeu spécifique` : ""
    faq.push({ q: `Quelle est la composition du ${nom} ?`,
      a: `${composition ? `Le ${nom} est construit avec ${composition}.` : `Le ${nom} est composé de ${nbPlis} plis de bois sélectionnés.`} ${plisDesc ? plisDesc + "." : ""} ${poids != null ? `Son poids d'environ ${poids} g le rend ${poids < 82 ? "très léger, ce qui favorise la récupération rapide et réduit la fatigue en longue session" : poids < 92 ? "bien équilibré entre stabilité et légèreté" : "conséquent — la stabilité supplémentaire compense le poids dans les frappes puissantes"}.` : ""}`
    })
  }

  // Q4 — Prix
  if (prix != null) {
    faq.push({ q: `Quel est le prix du ${marqueNom} ${nom} ?`,
      a: `Le ${marqueNom} ${nom} est disponible aux alentours de ${prix} €. ${prix >= 200 ? "C'est une lame premium dont le prix reflète l'excellence des matériaux et la précision de fabrication — un investissement pour ceux qui visent le très haut niveau." : prix >= 100 ? "Son positionnement haut de gamme correspond à un investissement sérieux pour les compétiteurs de niveau national et régional." : prix >= 50 ? "Son rapport qualité-prix est excellent pour une lame de ce niveau, accessible aux joueurs de club sérieux." : "C'est l'une des lames les plus abordables dans sa catégorie, idéale pour les joueurs en progression."} Les prix varient selon les revendeurs.`
    })
  }

  // Q5 — Durabilité
  faq.push({ q: `Quelle est la durée de vie du ${nom} ?`,
    a: `Une lame comme le ${marqueNom} ${nom} est conçue pour durer des années, voire une décennie, avec un entretien approprié. Contrairement aux revêtements qui se dégradent après quelques mois d'utilisation intensive, la lame ne perd pratiquement pas ses propriétés dans le temps. Pour maximiser sa durée de vie : conservez-la dans un étui rigide, évitez l'humidité et les températures extrêmes. Un choc sur le bord peut provoquer une fissure irréparable — l'utilisation d'un protège-chant est fortement recommandée.`
  })

  return faq.slice(0, 5)
}

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
    /youtube\.com\/shorts\/([^?&\s]+)/,
  ]
  for (const p of patterns) { const m = url.match(p); if (m) return m[1] }
  return null
}

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
      id, nom, slug, description, image_url,
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
    .select("id, nom, pays, classement_mondial, genre, revetement_cd, revetement_rv")
    .ilike("bois_nom", "%" + produit.nom + "%")
    .eq("actif", true)
    .order("classement_mondial")

  // ── Associations TT-Kip ──────────────────────────────────────────
  const [{ data: ttDir1 }, { data: ttDir2 }] = await Promise.all([
    supabase.from("associations_produits").select("produit_associe_id").eq("produit_id", produit.id),
    supabase.from("associations_produits").select("produit_id").eq("produit_associe_id", produit.id),
  ])
  const ttIds = [
    ...(ttDir1 || []).map((a: any) => a.produit_associe_id),
    ...(ttDir2 || []).map((a: any) => a.produit_id),
  ]
  const ttAssociations: any[] = ttIds.length > 0
    ? (await supabase.from("produits").select("id, nom, slug, image_url, marques(nom), revetements(type_revetement)").in("id", ttIds)).data || []
    : []

  // ── Revêtements recommandés — basés sur le matériel réel des pros ─
  const MARQUES_LIST_B = ['Butterfly','Stiga','Donic','Tibhar','Joola','Yasaka','Andro','Xiom','Nittaku','DHS','Victas','Cornilleau','TSP','Spinlord']
  const stripMarqueB = (n: string) => {
    for (const m of MARQUES_LIST_B) {
      if (n.toLowerCase().startsWith(m.toLowerCase() + ' ')) return n.slice(m.length + 1).trim()
    }
    return n
  }
  const revFreq: Record<string, number> = {}
  for (const j of joueursPro || []) {
    const jj = j as any
    if (jj.revetement_cd) revFreq[jj.revetement_cd] = (revFreq[jj.revetement_cd] || 0) + 1
    if (jj.revetement_rv) revFreq[jj.revetement_rv] = (revFreq[jj.revetement_rv] || 0) + 1
  }
  const revAssociations = (await Promise.all(
    Object.entries(revFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(async ([revNom, count]) => {
        const { data } = await supabase
          .from("produits")
          .select("id, nom, slug, image_url, marques(nom), revetements(type_revetement)")
          .not("revetements", "is", null)
          .ilike("nom", `%${stripMarqueB(revNom)}%`)
          .limit(1)
          .maybeSingle()
        return data ? { ...data, proCount: count } : null
      })
  )).filter(Boolean)

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
    .select("id, youtube_url, titre, cree_le")
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
    "image": produit.image_url || "https://www.tt-kip.com/og-image.jpg",
    "brand": { "@type": "Brand", "name": marque?.nom },
    "category": "Bois de tennis de table",
    "description": produit.description || `Bois de tennis de table ${marque?.nom} ${produit.nom}${b?.style ? `, style ${b.style}` : ""}${b?.nb_plis ? `, ${b.nb_plis} plis` : ""}.`,
    "url": `https://www.tt-kip.com/bois/${slug}`,
    ...(b?.prix ? {
      "offers": {
        "@type": "Offer",
        "price": parseFloat(b.prix),
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "url": `https://www.tt-kip.com/bois/${slug}`,
        "hasMerchantReturnPolicy": {
          "@type": "MerchantReturnPolicy",
          "applicableCountry": "FR",
          "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
          "merchantReturnDays": 30,
          "returnMethod": "https://schema.org/ReturnByMail",
          "returnFees": "https://schema.org/FreeReturn"
        },
        "shippingDetails": {
          "@type": "OfferShippingDetails",
          "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "EUR" },
          "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "FR" },
          "deliveryTime": {
            "@type": "ShippingDeliveryTime",
            "handlingTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" },
            "transitTime": { "@type": "QuantitativeValue", "minValue": 2, "maxValue": 5, "unitCode": "DAY" }
          }
        }
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

  const faq = generateFaqBois(produit.nom, marque?.nom || "", b)
  const faqJsonLd = faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(item => ({
      "@type": "Question",
      "name": item.q,
      "acceptedAnswer": { "@type": "Answer", "text": item.a }
    }))
  } : null

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {faqJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />}
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <BackButton fallback="/bois" label="Retour aux bois" />

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" as const }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            {produit.image_url && (
              <div style={{ flexShrink: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={produit.image_url} alt={`${marque?.nom} ${produit.nom}`}
                  style={{ width: "90px", height: "90px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff", padding: "6px" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "26px", fontWeight: 700, letterSpacing: "-0.5px", marginBottom: "4px" }}>{produit.nom}</h1>
              <p style={{ color: "var(--text-muted)", fontSize: "15px" }}>{marque?.nom}</p>
            </div>
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
            {joueursPro && joueursPro.length > 0 && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, padding: "4px 12px", borderRadius: "6px", background: "#0F172A", color: "#F8FAFC", letterSpacing: "0.2px" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                </svg>
                Utilisé par {joueursPro.length} pro{joueursPro.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>
        <div>

          {/* Description / Intro SEO */}
          {produit.description && (
            <div style={{ background: "linear-gradient(135deg, #FFFBF8, #FFF7F3)", border: "1px solid #FED7C3", borderRadius: "12px", padding: "22px 24px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>Présentation</h2>
              </div>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text)", margin: 0 }}>{produit.description}</p>
            </div>
          )}

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

          {/* ── Sélection TT-Kip ── */}
          {ttAssociations.length > 0 && (
            <div style={{ background: "linear-gradient(135deg, #FFFBF8, #FFF7F3)", border: "1px solid #FED7C3", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97757">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>
                  Sélection TT-Kip
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>— revêtements recommandés avec ce bois</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {ttAssociations.map((r: any) => {
                  const TYPE_SHORT: Record<string,string> = { In:"Backside", Out:"Picots courts", Mid:"Picots mi-longs", Long:"Picots longs", Anti:"Anti-spin" }
                  const typeLabel = TYPE_SHORT[(r.revetements as any)?.type_revetement] || ""
                  return (
                    <a key={r.id} href={`/revetements/${r.slug}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "1px solid #FED7C3", textDecoration: "none", background: "#fff" }}>
                      {r.image_url
                        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.image_url} alt={r.nom} style={{ width: "34px", height: "34px", objectFit: "contain", flexShrink: 0 }} />
                        : <div style={{ width: "34px", height: "34px", borderRadius: "6px", background: "#FFF0EB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>
                          </div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.nom}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "1px 0 0" }}>{(r.marques as any)?.nom}{typeLabel ? ` · ${typeLabel}` : ""}</p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Associations recommandées ── */}
          {revAssociations.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>
                  Revêtements souvent associés
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>— d&apos;après le matériel des pros</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {revAssociations.map((r: any) => {
                  const TYPE_SHORT: Record<string,string> = { In:"Backside", Out:"Picots courts", Mid:"Picots mi-longs", Long:"Picots longs", Anti:"Anti-spin" }
                  const typeLabel = TYPE_SHORT[(r.revetements as any)?.type_revetement] || ""
                  return (
                    <a key={r.id} href={`/revetements/${r.slug}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", textDecoration: "none", background: "var(--bg)" }}>
                      {r.image_url
                        ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={r.image_url} alt={r.nom} style={{ width: "34px", height: "34px", objectFit: "contain", flexShrink: 0 }} />
                        : <div style={{ width: "34px", height: "34px", borderRadius: "6px", background: "#FFF0EB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 9 9"/></svg>
                          </div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{r.nom}</p>
                        <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "1px 0 0" }}>{(r.marques as any)?.nom}{typeLabel ? ` · ${typeLabel}` : ""}</p>
                      </div>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                        {r.proCount} pro{r.proCount > 1 ? "s" : ""}
                      </span>
                    </a>
                  )
                })}
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

          <FAQAccordion items={faq} />
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
