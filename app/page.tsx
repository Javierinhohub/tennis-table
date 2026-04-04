import { Suspense } from "react"
import StatsBar from "./components/StatsBar"
import DerniersAvis from "./components/DerniersAvis"
import AccueilHero from "./components/AccueilHero"

export default function Home() {
  return (
    <>
      <AccueilHero />
      <Suspense fallback={
        <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Chargement des statistiques...</p>
        </section>
      }>
        <StatsBar />
      </Suspense>
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem" }}>Accès rapide</h2>
        <AccesRapide />
      </section>
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700 }}>Derniers avis</h2>
          <a href="/revetements" style={{ fontSize: "13px", color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Voir tous les revêtements</a>
        </div>
        <Suspense fallback={<div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>Chargement des avis...</div>}>
          <DerniersAvis />
        </Suspense>
      </section>
    </>
  )
}

const CATEGORIES = [
  { href: "/revetements", label: "Revêtements", description: "1 690 revêtements LARC 2026", icon: "R" },
  { href: "/bois", label: "Bois", description: "Lames et bois de compétition", icon: "B" },
  { href: "/autre-materiel", label: "Autre matériel", description: "Balles, colles et chaussures", icon: "+" },
  { href: "/articles", label: "Articles & Tests", description: "Tests et conseils", icon: "A" },
  { href: "/forum", label: "Forum", description: "Discussions et conseils", icon: "F" },
]

function AccesRapide() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
      {CATEGORIES.map(cat => (
        <a key={cat.href} href={cat.href}
          style={{ display: "flex", alignItems: "center", gap: "14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textDecoration: "none" }}
        >
          <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
            {cat.icon}
          </div>
          <div>
            <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", marginBottom: "2px" }}>{cat.label}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{cat.description}</p>
          </div>
        </a>
      ))}
    </div>
  )
}