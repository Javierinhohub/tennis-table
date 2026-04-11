import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import AvisSectionBois from "./AvisSectionBois"
import NotesBoisChart from "./NotesBoisChart"

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

  const NoteBar = ({ label, value, color = "#D97757" }: { label: string, value: number | null, color?: string }) => (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 700, color: value ? color : "var(--text-muted)" }}>
          {value ? `${value}/10` : "Non renseigné"}
        </span>
      </div>
      <div style={{ background: "var(--bg)", borderRadius: "6px", height: "6px", overflow: "hidden" }}>
        {value && <div style={{ width: `${(value / 10) * 100}%`, height: "100%", background: color, borderRadius: "6px" }} />}
      </div>
    </div>
  )

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/bois" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-block", marginBottom: "1.5rem" }}>
        ← Retour aux bois
      </a>

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

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", alignItems: "start" }}>
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

          {/* Polar chart (TTK + utilisateurs) */}
          <NotesBoisChart
            produitId={produit.id}
            ttkVitesse={b?.note_vitesse}
            ttkControle={b?.note_controle}
            ttkFlexibilite={b?.note_flexibilite}
            ttkDurete={b?.note_durete}
            ttkQualitePrix={b?.note_qualite_prix}
          />

          {/* Notes barres TT-Kip */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>Notes TT-Kip</h2>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
              <NoteBar label="Vitesse" value={b?.note_vitesse} color="#1A56DB" />
              <NoteBar label="Contrôle" value={b?.note_controle} color="#0E7F4F" />
              <NoteBar label="Flexibilité" value={b?.note_flexibilite} color="#D97757" />
              <NoteBar label="Dureté" value={b?.note_durete} color="#7C3AED" />
              <NoteBar label="Rapport qualité/prix" value={b?.note_qualite_prix} color="#EF4444" />
            </div>
          </div>

          {/* Joueurs pro */}
          {joueursPro && joueursPro.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
                Joueurs pro qui utilisent ce bois
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

          {/* ✅ Section avis bois */}
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
  )
}
