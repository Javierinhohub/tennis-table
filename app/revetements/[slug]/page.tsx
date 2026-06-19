import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"

export const revalidate = 3600 // ISR 1h — fiche produit statique entre les mises à jour
import AvisSection from "./AvisSection"
import MaterialSection from "./MaterialSection"
import NotesSection from "./NotesSection"
import BackButton from "@/app/components/BackButton"
import JoueursProSection from "./JoueursProSection"
import VideoSection from "@/app/components/VideoSection"
import FAQAccordion, { FAQItem } from "@/app/components/FAQAccordion"

function generateFaqRevetement(nom: string, marqueNom: string, rev: any): FAQItem[] {
  const faq: FAQItem[] = []
  const vitesse  = rev?.vitesse_note  as number | null
  const effet    = rev?.effet_note    as number | null
  const controle = rev?.controle_note as number | null
  const prix     = rev?.prix          as number | null
  const type     = rev?.type_revetement as string | null
  const epaisseur = rev?.epaisseur_max as number | null

  // Q1 — Niveau
  if (controle != null) {
    faq.push({ q: `Le ${marqueNom} ${nom} convient-il aux débutants ?`,
      a: controle >= 8
        ? `Oui, le ${nom} est accessible aux joueurs débutants et intermédiaires. Son contrôle de ${controle}/10 facilite la mise en jeu et pardonne les imprécisions techniques. C'est un bon choix pour progresser sans être freiné par son propre matériel.`
        : controle < 6
        ? `Non, le ${nom} est réservé aux joueurs de niveau avancé à expert. Avec un contrôle de seulement ${controle}/10, il exige des frappes propres et une technique solide — une imprécision se paie immédiatement par une balle dans le filet. Les débutants seront mieux servis par un revêtement plus tolérant.`
        : `Le ${nom} convient principalement aux joueurs de niveau intermédiaire à avancé. Son contrôle de ${controle}/10 requiert une technique déjà établie pour l'exploiter pleinement, même si les joueurs motivés pourront s'y adapter avec de l'entraînement.`
    })
  }

  // Q2 — Épaisseur (backside uniquement)
  if (type === "In" && epaisseur) {
    faq.push({ q: `Quelle épaisseur choisir pour le ${nom} ?`,
      a: `Le ${marqueNom} ${nom} est disponible en plusieurs épaisseurs jusqu'à ${epaisseur} mm. Une épaisseur fine (1,5-1,8 mm) apporte plus de sensation et de contrôle, idéale pour le jeu technique et les services. Une épaisseur maximale (${epaisseur} mm) maximise la vitesse et l'effet catapulte pour un jeu offensif. Pour débuter avec ce revêtement ou pour le revers, une épaisseur de 2,0 mm représente souvent le meilleur compromis.`
    })
  }

  // Q3 — Topspin / spin
  if (effet != null && vitesse != null) {
    faq.push({ q: `Le ${nom} est-il adapté au jeu de topspin ?`,
      a: `${effet >= 8 ? `Oui, le ${marqueNom} ${nom} est particulièrement adapté au topspin.` : `Le ${marqueNom} ${nom} offre une capacité de topspin correcte.`} Avec un effet de ${effet}/10 et une vitesse de ${vitesse}/10, il génère des rotations ${effet >= 9 ? "puissantes et difficiles à défendre — l'un des meilleurs du marché pour les topspins lourds" : effet >= 7 ? "chargées qui rendent les topspins efficaces avec une bonne technique" : "modérées, ce revêtement privilégiant davantage la vitesse que la rotation maximale"}.`
    })
  }

  // Q4 — Prix
  if (prix != null) {
    faq.push({ q: `Quel est le prix du ${marqueNom} ${nom} ?`,
      a: `Le ${marqueNom} ${nom} est vendu aux alentours de ${prix} €. ${prix >= 80 ? "C'est un revêtement haut de gamme — un investissement justifié pour les joueurs qui compétitionnent régulièrement et veulent le meilleur de leur matériel." : prix >= 40 ? "Son positionnement intermédiaire en fait un excellent rapport qualité-performance pour les joueurs de club sérieux." : "Son tarif accessible en fait l'un des meilleurs rapports qualité-prix du marché à son niveau."} Les prix varient selon les revendeurs et les promotions.`
    })
  }

  // Q5a — Couleur (backside) ou Q5b — Style (picots)
  if (type === "In") {
    faq.push({ q: `Faut-il choisir le ${nom} en rouge ou en noir ?`,
      a: `Le ${marqueNom} ${nom} est disponible en rouge et en noir conformément aux règles ITTF (les deux faces de la raquette doivent être de couleurs différentes). La différence entre les deux coloris est subtile : le rouge est traditionnellement associé à une légère souplesse supplémentaire, le noir à une dureté légèrement plus marquée. Ces nuances varient selon les marques — sur ce revêtement, le choix dépend avant tout de vos préférences tactiles et de votre stratégie de jeu.`
    })
  } else if (type && ["Out","Mid","Long"].includes(type)) {
    const typeLabel = type === "Out" ? "picots courts" : type === "Mid" ? "picots mi-longs" : "picots longs"
    faq.push({ q: `Le ${nom} est-il adapté à tous les styles de jeu ?`,
      a: `Non, le ${marqueNom} ${nom} (${typeLabel}) est un revêtement spécialisé qui ne convient pas à tous. ${type === "Out" ? "Les picots courts sont appréciés pour le jeu rapide près de la table et les retours déstabilisants en revers." : type === "Mid" ? "Les picots mi-longs permettent des effets perturbateurs et une défense active très efficace." : "Les picots longs sont le choix des défenseurs qui souhaitent perturber le rythme adverse avec des renversements d'effet."} Il est conseillé de maîtriser d'abord le jeu offensif classique avant de passer aux picots.`
    })
  }

  return faq.slice(0, 5)
}

const TYPE_LABELS: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin"
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
    .select("nom, marques(nom), revetements(type_revetement, vitesse_note, effet_note, controle_note)")
    .eq("slug", slug)
    .single()

  if (!produit) return { title: "Revêtement introuvable" }

  const marque = (produit.marques as any)?.nom || ""
  const rev = produit.revetements as any
  const type = TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement || "Revêtement"
  const nom = produit.nom

  const notes = [
    rev?.vitesse_note ? `Vitesse ${rev.vitesse_note}/10` : "",
    rev?.effet_note   ? `Effet ${rev.effet_note}/10`   : "",
    rev?.controle_note ? `Contrôle ${rev.controle_note}/10` : "",
  ].filter(Boolean).join(", ")

  const title = `${marque} ${nom} (${type}) — Avis et test ping`
  const description = `Test et avis du revêtement de tennis de table ${marque} ${nom} (${type.toLowerCase()})${notes ? `. ${notes}` : ""}. Retours des joueurs, comparaison et caractéristiques complètes sur TT-Kip.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.tt-kip.com/revetements/${slug}`,
      type: "website",
    },
    alternates: { canonical: `https://www.tt-kip.com/revetements/${slug}` },
    keywords: [`${marque} ${nom}`, "revêtement tennis de table", "revêtement ping pong", type, marque, "TT-Kip"].filter(Boolean),
  }
}

export default async function RevetementPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: produit } = await supabase
    .from("produits")
    .select("id, nom, slug, description, image_url, marques(nom, pays, site_web), revetements(numero_larc, type_revetement, couleurs_dispo, larc_approuve, vitesse_note, effet_note, controle_note, poids, epaisseur_max, prix, note_marque_vitesse, note_marque_spin, note_marque_controle, note_marque_durete, note_marque_durabilite, note_marque_rejet, note_marque_qualite_prix, note_marque_adherence, note_marque_gene, note_marque_inversion, note_marque_globale, note_ttk_durabilite, note_ttk_durete, note_ttk_rejet, note_ttk_qualite_prix, note_ttk_adherence, note_ttk_gene, note_ttk_inversion, commentaire_marque)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const rev = produit.revetements as any
  const marque = produit.marques as any

  // Cherche les pros qui utilisent ce revêtement (CD ou revers) en matchant le nom du produit
  const { data: joueursPro } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, genre, revetement_cd, revetement_rv, bois_nom")
    .or(`revetement_cd.ilike.%${produit.nom}%,revetement_rv.ilike.%${produit.nom}%`)
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
    ? (await supabase.from("produits").select("id, nom, slug, image_url, marques(nom), bois(style)").in("id", ttIds)).data || []
    : []

  // ── Bois recommandés — basés sur le matériel réel des pros ───────
  const MARQUES_LIST = ['Butterfly','Stiga','Donic','Tibhar','Joola','Yasaka','Andro','Xiom','Nittaku','DHS','Victas','Cornilleau','TSP','Spinlord']
  const stripMarque = (n: string) => {
    for (const m of MARQUES_LIST) {
      if (n.toLowerCase().startsWith(m.toLowerCase() + ' ')) return n.slice(m.length + 1).trim()
    }
    return n
  }
  const boisFreq: Record<string, number> = {}
  for (const j of joueursPro || []) {
    const bn = (j as any).bois_nom
    if (bn) boisFreq[bn] = (boisFreq[bn] || 0) + 1
  }
  const boisAssociations = (await Promise.all(
    Object.entries(boisFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(async ([boisNom, count]) => {
        const { data } = await supabase
          .from("produits")
          .select("id, nom, slug, image_url, marques(nom), bois(style)")
          .not("bois", "is", null)
          .ilike("nom", `%${stripMarque(boisNom)}%`)
          .limit(1)
          .maybeSingle()
        return data ? { ...data, proCount: count } : null
      })
  )).filter(Boolean)

  const stats = [
    { label: "Vitesse", value: rev?.vitesse_note, color: "#1A56DB" },
    { label: "Effet", value: rev?.effet_note, color: "#0E7F4F" },
    { label: "Contrôle", value: rev?.controle_note, color: "#B45309" },
  ]

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
  const avgNote = avisCount > 0 && avisData
    ? (avisData.reduce((s, a) => s + a.note, 0) / avisCount).toFixed(1)
    : null

  // Seulement si au moins 1 avis : évite le schema Product invalide sans reviews
  const jsonLd: Record<string, any> | null = avisCount > 0 ? {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${marque?.nom} ${produit.nom}`,
    "image": produit.image_url || "https://www.tt-kip.com/og-image.jpg",
    "brand": { "@type": "Brand", "name": marque?.nom },
    "category": "Revêtement de tennis de table",
    "description": produit.description || `Revêtement ${TYPE_LABELS[rev?.type_revetement] || ""} ${marque?.nom} ${produit.nom}. Vitesse ${rev?.vitesse_note || "—"}/10, Effet ${rev?.effet_note || "—"}/10, Contrôle ${rev?.controle_note || "—"}/10.`,
    "url": `https://www.tt-kip.com/revetements/${slug}`,
    ...(rev?.prix ? {
      "offers": {
        "@type": "Offer",
        "priceCurrency": "EUR",
        "price": parseFloat(rev.prix),
        "availability": "https://schema.org/InStock",
        "url": `https://www.tt-kip.com/revetements/${slug}`,
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

  const faq = generateFaqRevetement(produit.nom, marque?.nom || "", rev)
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
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <BackButton fallback="/revetements" label="Retour à la liste" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "2rem", alignItems: "start" }}>

        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px", flexWrap: "wrap" as const }}>
              <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px", background: "var(--success-light)", color: "var(--success)", letterSpacing: "0.3px" }}>APPROUVE LARC 2026</span>
              <span style={{ fontSize: "12px", padding: "3px 8px", borderRadius: "4px", background: "var(--accent-light)", color: "var(--accent)", fontWeight: 500 }}>{TYPE_LABELS[rev?.type_revetement] || rev?.type_revetement}</span>
              {joueursPro && joueursPro.length > 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", fontWeight: 700, padding: "3px 10px", borderRadius: "4px", background: "#0F172A", color: "#F8FAFC", letterSpacing: "0.2px" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                  Utilisé par {joueursPro.length} pro{joueursPro.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h1 style={{ fontSize: "28px", fontWeight: 700, marginBottom: "4px", letterSpacing: "-0.5px" }}>{produit.nom}</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "16px" }}>{marque?.nom}</p>
          </div>

          {/* Image produit */}
          {produit.image_url && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={produit.image_url} alt={`${marque?.nom} ${produit.nom}`}
                style={{ maxHeight: "220px", maxWidth: "100%", objectFit: "contain" }} />
            </div>
          )}

          {/* Description / Intro SEO */}
          {produit.description && (
            <div style={{ background: "linear-gradient(135deg, #FFFBF8, #FFF7F3)", border: "1px solid #FED7C3", borderRadius: "10px", padding: "22px 24px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>Présentation</h2>
              </div>
              <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text)", margin: 0 }}>{produit.description}</p>
            </div>
          )}

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Caractéristiques techniques</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
              {[
                { label: "Code LARC", value: rev?.numero_larc, mono: true },
                { label: "Type", value: TYPE_LABELS[rev?.type_revetement] },
                { label: "Couleurs", value: rev?.couleurs_dispo },
                { label: "Épaisseur max", value: rev?.epaisseur_max ? rev.epaisseur_max + " mm" : null },
                { label: "Poids", value: rev?.poids },
                { label: "Prix indicatif", value: rev?.prix ? rev.prix + " €" : null },
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

          {/* ── Sélection TT-Kip ── */}
          {ttAssociations.length > 0 && (
            <div style={{ background: "linear-gradient(135deg, #FFFBF8, #FFF7F3)", border: "1px solid #FED7C3", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#D97757">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>
                  Sélection TT-Kip
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>— bois recommandés avec ce revêtement</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {ttAssociations.map((b: any) => (
                  <a key={b.id} href={`/bois/${b.slug}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "1px solid #FED7C3", textDecoration: "none", background: "#fff" }}>
                    {b.image_url
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.image_url} alt={b.nom} style={{ width: "34px", height: "34px", objectFit: "contain", flexShrink: 0 }} />
                      : <div style={{ width: "34px", height: "34px", borderRadius: "6px", background: "#FFF0EB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                        </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{b.nom}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "1px 0 0" }}>{(b.marques as any)?.nom}{(b.bois as any)?.style ? ` · ${(b.bois as any).style}` : ""}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* ── Associations recommandées ── */}
          {boisAssociations.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                </svg>
                <h2 style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>
                  Bois souvent associés
                </h2>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>— d&apos;après le matériel des pros</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {boisAssociations.map((b: any) => (
                  <a key={b.id} href={`/bois/${b.slug}`} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", border: "1px solid var(--border)", textDecoration: "none", background: "var(--bg)" }}>
                    {b.image_url
                      ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={b.image_url} alt={b.nom} style={{ width: "34px", height: "34px", objectFit: "contain", flexShrink: 0 }} />
                      : <div style={{ width: "34px", height: "34px", borderRadius: "6px", background: "#FFF0EB", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                        </div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{b.nom}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: "1px 0 0" }}>{(b.marques as any)?.nom}</p>
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", whiteSpace: "nowrap" as const, flexShrink: 0 }}>
                      {b.proCount} pro{b.proCount > 1 ? "s" : ""}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          <JoueursProSection joueurs={joueursPro || []} produitNom={produit.nom} />

          <VideoSection videos={videosData || []} />
          <NotesSection produitId={produit.id} revetement={rev} typeRev={rev?.type_revetement} />
          <AvisSection produitId={produit.id} typeRevetement={rev?.type_revetement} />

          <FAQAccordion items={faq} />
        </div>

        <div style={{ position: "sticky", top: "80px" }}>
          <MaterialSection produitId={produit.id} produitNom={produit.nom} />
        </div>

      </div>
    </main>
    </>
  )
}