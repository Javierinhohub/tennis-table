import { supabase } from "@/lib/supabase"

export const revalidate = 60

export default async function StatsBar() {
  const [r1, r2, r3, r4, r5] = await Promise.all([
    supabase.from("produits").select("*", { count: "exact", head: true })
      .eq("actif", true).not("revetements", "is", null),
    supabase.from("marques").select("*", { count: "exact", head: true }),
    supabase.from("produits").select("*", { count: "exact", head: true })
      .eq("actif", true).not("bois", "is", null),
    supabase.from("avis").select("*", { count: "exact", head: true }).eq("valide", true),
    supabase.from("notes_revetements").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Revêtements", value: (r1.count || 0).toLocaleString("fr-FR") },
    { label: "Bois", value: (r3.count || 0).toLocaleString("fr-FR") },
    { label: "Marques", value: (r2.count || 0).toLocaleString("fr-FR") },
    { label: "Avis publiés", value: (r4.count || 0).toLocaleString("fr-FR") },
    { label: "Notes", value: (r5.count || 0).toLocaleString("fr-FR") },
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
