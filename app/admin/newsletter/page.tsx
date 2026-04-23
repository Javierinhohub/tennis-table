"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminNewsletterPage() {
  const [loading, setLoading]       = useState(true)
  const [abonnes, setAbonnes]       = useState<any[]>([])
  const [copied, setCopied]         = useState(false)
  const [onglet, setOnglet]         = useState<"liste" | "envoyer">("liste")

  // Formulaire envoi
  const [sujet, setSujet]           = useState("")
  const [contenu, setContenu]       = useState("")
  const [testEmail, setTestEmail]   = useState("")
  const [sending, setSending]       = useState(false)
  const [sendResult, setSendResult] = useState<{ ok?: boolean; sent?: number; error?: string; mode?: string } | null>(null)

  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/auth/login"); return }
      const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
      if (!profil || profil.role !== "admin") { router.push("/"); return }

      const { data } = await supabase
        .from("utilisateurs")
        .select("id, pseudo, classement, region, club, cree_le")
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
    a.download = `newsletter_abonnes_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyIds() {
    const ids = abonnes.map(a => a.id).join("\n")
    navigator.clipboard.writeText(ids)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function sendNewsletter(mode: "test" | "reel") {
    if (!sujet.trim() || !contenu.trim()) {
      setSendResult({ error: "Sujet et contenu sont obligatoires." })
      return
    }
    if (mode === "test" && !testEmail.trim()) {
      setSendResult({ error: "Renseigne un email de test." })
      return
    }
    setSending(true)
    setSendResult(null)
    const { data: { session } } = await supabase.auth.getSession()
    const body: any = { sujet, contenu }
    if (mode === "test") body.testEmail = testEmail
    const res = await fetch("/api/newsletter/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.access_token ?? ""}`,
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    setSendResult(json)
    setSending(false)
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  const inputStyle = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", width: "100%",
    fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)",
    boxSizing: "border-box" as const,
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "inline-block", marginBottom: "1.5rem" }}>
        ← Retour à l'admin
      </a>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Newsletter</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {abonnes.length} abonné{abonnes.length > 1 ? "s" : ""}
          </p>
        </div>
        {onglet === "liste" && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={copyIds}
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px", padding: "9px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              {copied ? "✓ Copié !" : "Copier les IDs"}
            </button>
            <button onClick={exportCSV}
              style={{ background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px", padding: "9px 14px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              Exporter CSV
            </button>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        {([["liste", "Liste des abonnés"], ["envoyer", "Envoyer une campagne"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => { setOnglet(id); setSendResult(null) }}
            style={{ background: "none", border: "none", borderBottom: onglet === id ? "2px solid #D97757" : "2px solid transparent", color: onglet === id ? "#D97757" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── Liste abonnés ── */}
      {onglet === "liste" && (
        <>
          <div style={{ background: "#FFF0EB", border: "1px solid #D97757", borderRadius: "10px", padding: "14px 16px", marginBottom: "1.5rem", fontSize: "13px", color: "#C4694A", lineHeight: 1.6 }}>
            <strong>📧 Pour récupérer les emails :</strong> Lance cette requête dans le <strong>SQL Editor Supabase</strong> :<br />
            <code style={{ display: "block", marginTop: "8px", background: "rgba(0,0,0,0.05)", padding: "8px 10px", borderRadius: "6px", fontSize: "12px" }}>
              SELECT u.email, p.pseudo, p.region, p.club FROM auth.users u JOIN utilisateurs p ON p.id = u.id WHERE p.newsletter_ok = true ORDER BY u.created_at DESC;
            </code>
          </div>

          {abonnes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
              Aucun abonné pour l'instant.
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
        </>
      )}

      {/* ── Formulaire envoi ── */}
      {onglet === "envoyer" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Rédiger la campagne</h2>

              <div style={{ marginBottom: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Sujet de l'email</label>
                <input type="text" value={sujet} onChange={e => setSujet(e.target.value)} style={inputStyle} placeholder="Ex: Nouveaux bois Donic disponibles sur TT-Kip !" />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }}>Corps du message</label>
                <textarea value={contenu} onChange={e => setContenu(e.target.value)} rows={12}
                  style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.6 }}
                  placeholder={"Écris ton message ici. Chaque ligne vide crée un nouveau paragraphe.\n\nEx:\nBonjour à tous !\n\nNous venons d'ajouter 76 nouveaux bois Donic et 48 bois Gewo sur TT-Kip..."}
                />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "6px" }}>Chaque ligne = un paragraphe dans l'email. Le prénom du membre est ajouté automatiquement.</p>
              </div>
            </div>

            {sendResult && (
              <div style={{
                background: sendResult.error ? "#FEF2F2" : "#F0FAF4",
                border: `1px solid ${sendResult.error ? "#FECACA" : "#A7F3D0"}`,
                color: sendResult.error ? "#DC2626" : "#2D7A4F",
                borderRadius: "8px", padding: "12px 16px", fontSize: "13px", fontWeight: 500
              }}>
                {sendResult.error
                  ? `❌ Erreur : ${sendResult.error}`
                  : sendResult.mode === "test"
                    ? `✓ Email de test envoyé à ${testEmail}`
                    : `✓ Campagne envoyée à ${sendResult.sent} abonné${(sendResult.sent || 0) > 1 ? "s" : ""} !`
                }
              </div>
            )}
          </div>

          {/* Sidebar envoi */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", position: "sticky", top: "80px" }}>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Test avant envoi</p>
              <input type="email" value={testEmail} onChange={e => setTestEmail(e.target.value)}
                style={{ ...inputStyle, marginBottom: "10px" }}
                placeholder="ton@email.com" />
              <button onClick={() => sendNewsletter("test")} disabled={sending}
                style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                {sending ? "Envoi…" : "Envoyer le test"}
              </button>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Envoi réel</p>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", lineHeight: 1.5 }}>
                Envoie à <strong style={{ color: "var(--text)" }}>{abonnes.length} abonné{abonnes.length > 1 ? "s" : ""}</strong>. Cette action est irréversible.
              </p>
              <button onClick={() => {
                if (window.confirm(`Envoyer à ${abonnes.length} abonné${abonnes.length > 1 ? "s" : ""} ?`)) sendNewsletter("reel")
              }} disabled={sending}
                style={{ width: "100%", background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                {sending ? "Envoi en cours…" : `Envoyer à ${abonnes.length} abonné${abonnes.length > 1 ? "s" : ""}`}
              </button>
            </div>

            <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px", fontSize: "12px", color: "var(--text-muted)", lineHeight: 1.6 }}>
              💡 <strong>Conseil :</strong> Toujours envoyer un test d'abord pour vérifier le rendu dans ta boîte mail avant l'envoi réel.
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
