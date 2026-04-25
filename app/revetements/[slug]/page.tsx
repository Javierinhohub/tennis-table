import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import AvisSection from "./AvisSection"
import MaterialSection from "./MaterialSection"
import NotesSection from "./NotesSection"
import BackButton from "@/app/components/BackButton"
import VideoSection from "@/app/components/VideoSection"

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
    .select("id, nom, slug, marques(nom, pays, site_web), revetements(numero_larc, type_revetement, couleurs_dispo, larc_approuve, vitesse_note, effet_note, controle_note, poids, epaisseur_max, prix, note_marque_vitesse, note_marque_spin, note_marque_controle, note_marque_durete, note_marque_durabilite, note_marque_rejet, note_marque_qualite_prix, note_marque_adherence, note_marque_gene, note_marque_inversion, note_marque_globale, note_ttk_durabilite, note_ttk_durete, note_ttk_rejet, note_ttk_qualite_prix, note_ttk_adherence, note_ttk_gene, note_ttk_inversion, commentaire_marque)")
    .eq("slug", slug)
    .single()

  if (!produit) notFound()

  const rev = produit.revetements as any
  const marque = produit.marques as any

  // Cherche les pros qui utilisent ce revêtement (CD ou revers) en matchant le nom du produit
  const { data: joueursPro } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, genre, revetement_cd, revetement_rv")
    .or(`revetement_cd.ilike.%${produit.nom}%,revetement_rv.ilike.%${produit.nom}%`)
    .eq("actif", true)
    .order("classement_mondial")

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
    "image": "https://www.tt-kip.com/og-image.jpg",
    "brand": { "@type": "Brand", "name": marque?.nom },
    "category": "Revêtement de tennis de table",
    "description": `Revêtement ${TYPE_LABELS[rev?.type_revetement] || ""} ${marque?.nom} ${produit.nom}. Vitesse ${rev?.vitesse_note || "—"}/10, Effet ${rev?.effet_note || "—"}/10, Contrôle ${rev?.controle_note || "—"}/10.`,
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

  // VideoObject JSON-LD pour chaque vidéo YouTube — requis par Google pour indexation vidéo
  const videoJsonLd = videosData && videosData.length > 0 ? videosData
    .filter(v => getYoutubeId(v.youtube_url))
    .map(v => {
      const vid = getYoutubeId(v.youtube_url)!
      return {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": v.titre || `${marque?.nom} ${produit.nom} — vidéo de jeu`,
        "description": `Vidéo de jeu du revêtement ${marque?.nom} ${produit.nom}. Voir les caractéristiques techniques et avis sur TT-Kip.`,
        "thumbnailUrl": `https://img.youtube.com/vi/${vid}/maxresdefault.jpg`,
        "uploadDate": v.cree_le ? new Date(v.cree_le).toISOString() : new Date().toISOString(),
        "embedUrl": `https://www.youtube.com/embed/${vid}`,
        "contentUrl": `https://www.youtube.com/watch?v=${vid}`,
        "url": `https://www.tt-kip.com/revetements/${slug}`,
      }
    }) : []

  return (
    <>
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      {videoJsonLd.map((vld, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(vld) }} />
      ))}
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <BackButton fallback="/revetements" label="Retour à la liste" />

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

          {joueursPro && joueursPro.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Joueurs professionnels — matériel actuel</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {joueursPro.map((jp: any) => (
                  <a key={jp.id} href={"/joueurs/" + jp.id}
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg)", borderRadius: "8px", textDecoration: "none" }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{jp.nom}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                        {jp.pays}
                        {jp.revetement_cd?.toLowerCase().includes(produit.nom.toLowerCase()) && " · Coup droit"}
                        {jp.revetement_rv?.toLowerCase().includes(produit.nom.toLowerCase()) && " · Revers"}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" as const }}>
                      <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Classement mondial</p>
                      <p style={{ fontWeight: 700, fontSize: "16px", color: "var(--accent)" }}>#{jp.classement_mondial}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <VideoSection videos={videosData || []} />
          <NotesSection produitId={produit.id} revetement={rev} typeRev={rev?.type_revetement} />
          <AvisSection produitId={produit.id} revetement={rev} typeRev={rev?.type_revetement} />
        </div>

        <div style={{ position: "sticky", top: "80px" }}>
          <MaterialSection produitId={produit.id} produitNom={produit.nom} />
        </div>

      </div>
    </main>
    </>
  )
}