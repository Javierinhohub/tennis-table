import { supabase } from "@/lib/supabase"
import { getLocale, makeT } from "@/lib/getLocale"

export const revalidate = 60

export default async function StatsBar() {
  const locale = await getLocale()
  const t = makeT(locale)

  const [r1, r2, r3, r4, r5] = await Promise.all([
    supabase.from("revetements").select("*", { count: "exact", head: true }),
    supabase.from("marques").select("*", { count: "exact", head: true }),
    supabase.from("bois").select("*", { count: "exact", head: true }),
    supabase.from("avis").select("*", { count: "exact", head: true }).eq("valide", true),
    supabase.from("notes_revetements").select("*", { count: "exact", head: true }),
  ])

  const loc = locale === "en" ? "en-US" : "fr-FR"
  const stats = [
    { label: t("home", "statsRubbers"), value: (r1.count || 0).toLocaleString(loc) },
    { label: t("home", "statsBlades"),  value: (r3.count || 0).toLocaleString(loc) },
    { label: t("home", "statsBrands"),  value: (r2.count || 0).toLocaleString(loc) },
    { label: t("home", "statsReviews"), value: (r4.count || 0).toLocaleString(loc) },
    { label: t("home", "statsRatings"), value: (r5.count || 0).toLocaleString(loc) },
  ]

  return (
    <section style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "1.5rem 2rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
        {stats.map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ fontSize: "24px", fontWeight: 700, color: "#D97757", marginBottom: "2px" }}>{s.value}</p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
