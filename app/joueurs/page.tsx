import { supabase } from "@/lib/supabase"
import Link from "next/link"

export const revalidate = 60

const DRAPEAUX: Record<string, string> = {
  "Chine":"🇨🇳","France":"🇫🇷","Allemagne":"🇩🇪","Suède":"🇸🇪","Japon":"🇯🇵",
  "Corée du Sud":"🇰🇷","Brésil":"🇧🇷","Portugal":"🇵🇹","Autriche":"🇦🇹",
  "Roumanie":"🇷🇴","Croatie":"🇭🇷","Belgique":"🇧🇪","Danemark":"🇩🇰",
  "Slovénie":"🇸🇮","Égypte":"🇪🇬","Australie":"🇦🇺","Russie":"🇷🇺",
  "Inde":"🇮🇳","États-Unis":"🇺🇸","Tchéquie":"🇨🇿","Pologne":"🇵🇱",
  "Nigeria":"🇳🇬","Hong Kong":"🇭🇰","Espagne":"🇪🇸","Argentine":"🇦🇷",
  "Luxembourg":"🇱🇺","Kazakhstan":"🇰🇿","Iran":"🇮🇷","Algérie":"🇩🇿",
  "Chili":"🇨🇱","Moldavie":"🇲🇩","Hongrie":"🇭🇺","Angleterre":"🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  "Macao":"🇲🇴","Porto Rico":"🇵🇷","Singapour":"🇸🇬","Ukraine":"🇺🇦",
  "Turquie":"🇹🇷","Thaïlande":"🇹🇭","Italie":"🇮🇹","Pays-Bas":"🇳🇱",
  "Serbie":"🇷🇸","Canada":"🇨🇦","Cameroun":"🇨🇲","Bénin":"🇧🇯","Taipei":"🇹🇼",
  "Pays de Galles":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",
}

export default async function JoueursPage() {
  const { data: joueurs } = await supabase
    .from("joueurs_pro")
    .select("id, nom, pays, classement_mondial, genre, style")
    .eq("actif", true)
    .order("classement_mondial")

  const hommes = (joueurs || []).filter((j: any) => j.genre === "H")
  const femmes = (joueurs || []).filter((j: any) => j.genre === "F")

  const Colonne = ({ titre, liste }: { titre: string, liste: any[] }) => (
    <div>
      <div style={{ marginBottom: "1.2rem", paddingBottom: "12px", borderBottom: "2px solid #D97757" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)", letterSpacing: "-0.3px" }}>{titre}</h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{liste.length} joueurs classés</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "4px" }}>
        {liste.map((j: any) => (
          <Link key={j.id} href={"/joueurs/" + j.id}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 12px", textDecoration: "none" }}
          >
            <span style={{ fontSize: "13px", fontWeight: 700, color: j.classement_mondial <= 3 ? "#D97757" : "var(--text-muted)", minWidth: "28px", textAlign: "center" as const, flexShrink: 0 }}>
              {j.classement_mondial}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, fontSize: "13px", color: "var(--text)", lineHeight: 1.3 }}>{j.nom}</p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>{DRAPEAUX[j.pays] || ""} {j.pays}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "4px" }}>Joueurs professionnels</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Classement mondial ITTF avril 2026</p>
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderLeft: "3px solid #D97757", borderRadius: "0 8px 8px 0", padding: "12px 16px", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: 1.7 }}>
          Retrouvez sur cette page le matériel utilisé par les meilleurs joueurs mondiaux : bois, revêtements coup droit et revers.
          À noter que les professionnels jouent avec des versions spéciales de certains produits — boostés, personnalisés ou non disponibles à la vente — qui ne correspondent pas toujours aux gammes accessibles au grand public.
        </p>
      </div>

      {/* Grille responsive : 2 colonnes sur desktop, 1 colonne sur mobile */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
        <Colonne titre="Hommes" liste={hommes} />
        <Colonne titre="Femmes" liste={femmes} />
      </div>
    </main>
  )
}
