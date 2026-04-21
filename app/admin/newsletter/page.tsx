"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminNewsletterPage() {
  const [loading, setLoading] = useState(true)
  const [abonnes, setAbonnes] = useState<any[]>([])
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
      if (!profil || profil.role !== "admin") { router.push("/"); return }

      // Récupère les abonnés avec leur auth.email via la vue/table utilisateurs
      // Note: l'email n'est pas dans utilisateurs, il faut croiser avec auth.users via l'API service role
      // Ici on récupère les utilisateurs qui ont newsletter_ok = true
      const { data } = await supabase
        .from("utilisateurs")
        .select("id, pseudo, classement, region, club, cree_le, newsletter_ok")
        .eq("newsletter_ok", true)
        .order("cree_le", { ascending: false })

      setAbonnes(data || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  function exportCSV() {
    const header = "pseudo,region,club,classement,inscrit_le"
    const rows = abonnes.map(a =>
      [a.pseudo, a.region || "", a.club || "", a.classement || "", new Date(a.cree_le).toLocaleDateString("fr-FR")].join(",")
    )
    const csv = [header, ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter_abonnes_${new Date().toISOString().slice(0,10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyIds() {
    const ids = abonnes.map(a => a.id).join("\n")
    navigator.clipboard.writeText(ids)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-block", marginBottom: "1.5rem" }}>
        ← Retour à l'admin
      </a>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Newsletter</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {abonnes.length} membre{abonnes.length > 1 ? "s" : ""} abonné{abonnes.length > 1 ? "s" : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={copyIds}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px", padding: "9px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            {copied ? "✓ Copié !" : "Copier les IDs"}
          </button>
          <button onClick={exportCSV}
            style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Bloc info email */}
      <div style={{ background: "#FFF0EB", border: "1px solid #D97757", borderRadius: "10px", padding: "14px 16px", marginBottom: "1.5rem", fontSize: "13px", color: "#C4694A", lineHeight: 1.6 }}>
        <strong>📧 Pour récupérer les emails :</strong> Va dans ton dashboard Supabase → <strong>Authentication → Users</strong>, puis filtre ou exporte. Les user IDs ci-dessous correspondent aux <code>auth.users.id</code>. Tu peux aussi lancer cette requête SQL dans le SQL Editor :<br />
        <code style={{ display: "block", marginTop: "8px", background: "rgba(0,0,0,0.05)", padding: "8px 10px", borderRadius: "6px", fontSize: "12px" }}>
          SELECT u.email, p.pseudo, p.region, p.club FROM auth.users u JOIN utilisateurs p ON p.id = u.id WHERE p.newsletter_ok = true ORDER BY u.created_at DESC;
        </code>
      </div>

      {abonnes.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun abonné pour l'instant. La case newsletter est disponible dans les paramètres du profil.
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                {["Pseudo", "Région", "Club", "Classement", "Inscrit le"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {abonnes.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: i < abonnes.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                        {a.pseudo?.[0]?.toUpperCase()}
                      </div>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{a.pseudo}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)" }}>{a.region || "—"}</td>
                  <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)" }}>{a.club || "—"}</td>
                  <td style={{ padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)" }}>{a.classement || "—"}</td>
                  <td style={{ padding: "10px 14px", fontSize: "12px", color: "var(--text-muted)" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
