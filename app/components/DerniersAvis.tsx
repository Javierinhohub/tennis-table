import { supabase } from "@/lib/supabase"

export const revalidate = 60

export default async function DerniersAvis() {
  const { data: avis } = await supabase
    .from("avis")
    .select("id, titre, contenu, note, cree_le, utilisateurs(pseudo), produits(nom, slug)")
    .eq("valide", true)
    .order("cree_le", { ascending: false })
    .limit(4)

  if (!avis || avis.length === 0) return (
    <div style={{ textAlign: "center", padding: "3rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
      Aucun avis pour le moment.
    </div>
  )

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
      {avis.map((a: any) => (
        <a key={a.id} href={"/revetements/" + a.produits?.slug}
          style={{ display: "block", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textDecoration: "none", transition: "border-color 0.15s" }}
        
        
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "13px", color: "#D97757", marginBottom: "2px" }}>{a.produits?.nom}</p>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{a.titre}</p>
            </div>
            <span style={{ color: "#F59E0B", fontSize: "13px", flexShrink: 0 }}>{"★".repeat(a.note)}{"☆".repeat(5 - a.note)}</span>
          </div>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: "10px", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{a.contenu}</p>
          <p style={{ fontSize: "11px", color: "var(--text-light)" }}>Par <strong>{a.utilisateurs?.pseudo}</strong> · {new Date(a.cree_le).toLocaleDateString("fr-FR")}</p>
        </a>
      ))}
    </div>
  )
}