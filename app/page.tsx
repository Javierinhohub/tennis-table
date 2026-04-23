import { Suspense } from "react"
import StatsBar from "./components/StatsBar"
import DerniersAvis from "./components/DerniersAvis"
import DerniersArticles from "./components/DerniersArticles"
import AccueilHero from "./components/AccueilHero"
import { getLocale, makeT } from "@/lib/getLocale"

export const revalidate = 60

export default async function Home() {
  const locale = await getLocale()
  const t = makeT(locale)

  const CATEGORIES = [
    { href: "/revetements", label: t("nav", "rubbers"),   description: t("home", "catRubbersDesc"), icon: "R" },
    { href: "/bois",        label: t("nav", "blades"),    description: t("home", "catBladesDesc"),  icon: "B" },
    { href: "/autre-materiel", label: t("nav", "otherGear"), description: t("home", "catOtherDesc"), icon: "+" },
    { href: "/joueurs",     label: t("nav", "proPlayers"), description: t("home", "catPlayersDesc"), icon: "J" },
    { href: "/articles",    label: t("nav", "articles"),   description: t("home", "catArticlesDesc"), icon: "A" },
    { href: "/forum",       label: t("nav", "forum"),      description: t("home", "catForumDesc"),   icon: "F" },
  ]

  return (
    <>
      <AccueilHero />

      <section style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "1.2rem 2rem", textAlign: "center" as const }}>
        <p style={{ maxWidth: "700px", margin: "0 auto", fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.7 }}>
          {t("home", "tagline")}
        </p>
      </section>

      <Suspense fallback={
        <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem" }} />
      }>
        <StatsBar />
      </Suspense>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem" }}>{t("home", "quickAccess")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {CATEGORIES.map(cat => (
            <a key={cat.href} href={cat.href}
              style={{ display: "flex", alignItems: "center", gap: "14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textDecoration: "none" }}>
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
      </section>

      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 2rem 3rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700 }}>{t("home", "latestReviews")}</h2>
              <a href="/revetements" style={{ fontSize: "13px", color: "#D97757", textDecoration: "none", fontWeight: 500 }}>{t("home", "seeAll")}</a>
            </div>
            <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>{t("home", "loading")}</div>}>
              <DerniersAvis />
            </Suspense>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.2rem" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700 }}>{t("home", "latestArticles")}</h2>
              <a href="/articles" style={{ fontSize: "13px", color: "#D97757", textDecoration: "none", fontWeight: 500 }}>{t("home", "seeAll")}</a>
            </div>
            <Suspense fallback={<div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>{t("home", "loading")}</div>}>
              <DerniersArticles />
            </Suspense>
          </div>

        </div>
      </section>
    </>
  )
}
