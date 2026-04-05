import { supabase } from "@/lib/supabase"

export const revalidate = 300

export default async function StatsBar() {
  const [r1, r2, r3, r4, r5] = await Promise.all([
    supabase.from("revetements").select("*", { count: "exact", head: true }),
    supabase.from("marques").select("*", { count: "exact", head: true }),
    supabase.from("bois").select("*", { count: "exact", head: true }),
    supabase.from("utilisateurs").select("*", { count: "exact", head: true }),
    supabase.from("avis").select("*", { count: "exact", head: true }).eq("valide", true)
  ])

  const stats = [
    { label: "Revêtements", value: (r1.count || 0).toLocaleString("fr-FR") },
    { label: "Marques", value: (r2.count || 0).toLocaleString("fr-FR") },
    { label: "Bois", value: (r3.count || 0).toLocaleString("fr-FR") },
    { label: "Membres", value: (r4.count || 0).toLocaleString("fr-FR") },
    { label: "Avis publiés", value: (r5.count || 0).toLocaleString("fr-FR") },
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
