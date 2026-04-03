"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [materiel, setMateriel] = useState<any[]>([])
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState("materiel")
  const [pseudo, setPseudo] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    setUser(user)

    const [{ data: profilData }, { data: materielData }, { data: avisData }] = await Promise.all([
      supabase.from("utilisateurs").select("*").eq("id", user.id).single(),
      supabase.from("utilisateurs_produits").select("id, depuis, produits(id, nom, slug, marques(nom), sous_categories(nom))").eq("user_id", user.id),
      supabase.from("avis").select("*, produits(nom, slug)").eq("user_id", user.id).order("cree_le", { ascending: false })
    ])

    setProfil(profilData)
    setPseudo(profilData?.pseudo || "")
    setMateriel(materielData || [])
    setAvis(avisData || [])
    setLoading(false)
  }

  async function updatePseudo(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const { error } = await supabase.from("utilisateurs").update({ pseudo }).eq("id", user.id)
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Pseudo mis à jour avec succès !")
    await fetchData()
  }

  async function retirerMateriel(id: string) {
    await supabase.from("utilisateurs_produits").delete().eq("id", id)
    await fetchData()
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "var(--accent)" }}>
          {profil?.pseudo?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2px" }}>{profil?.pseudo}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{user?.email}</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
          <div style={{ textAlign: "center", padding: "10px 16px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>{materiel.length}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Matériel</p>
          </div>
          <div style={{ textAlign: "center", padding: "10px 16px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>{avis.length}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Avis</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
        {[
          { id: "materiel", label: "Mon matériel" },
          { id: "avis", label: "Mes avis" },
          { id: "parametres", label: "Paramètres" },
        ].map(t => (
          <button key={t.id} onClick={() => setOnglet(t.id)}
            style={{ background: "none", border: "none", borderBottom: onglet === t.id ? "2px solid var(--accent)" : "2px solid transparent", color: onglet === t.id ? "var(--accent)" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            {t.label}
          </button>
        ))}
      </div>

      {onglet === "materiel" && (
        <div>
          {materiel.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
              <p style={{ marginBottom: "12px", fontSize: "15px" }}>Vous n'avez pas encore ajouté de matériel.</p>
              <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>Parcourir les revêtements</a>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {materiel.map((m: any) => (
                <div key={m.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <a href={"/" + (m.produits?.sous_categories?.nom?.toLowerCase().includes("bois") ? "bois" : m.produits?.sous_categories?.nom?.toLowerCase().includes("ball") ? "balles" : "revetements") + "/" + m.produits?.slug} style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)", textDecoration: "none" }}>
                        {m.produits?.nom}
                      </a>
                      <span style={{ fontSize: "11px", background: "var(--bg)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{m.produits?.sous_categories?.nom}</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{m.produits?.marques?.nom}</p>
                  </div>
                  <button onClick={() => retirerMateriel(m.id)} style={{ background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>
                    Retirer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {onglet === "avis" && (
        <div>
          {avis.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
              <p style={{ marginBottom: "12px", fontSize: "15px" }}>Vous n'avez pas encore laissé d'avis.</p>
              <a href="/" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>Parcourir les revêtements</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {avis.map((a: any) => (
                <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <div>
                      <a href={"/revetements/" + a.produits?.slug} style={{ fontWeight: 600, fontSize: "14px", color: "var(--accent)", textDecoration: "none" }}>{a.produits?.nom}</a>
                      <p style={{ fontWeight: 500, fontSize: "14px", marginTop: "2px" }}>{a.titre}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span style={{ color: "#F59E0B", fontSize: "14px" }}>{"★".repeat(a.note)}{"☆".repeat(5 - a.note)}</span>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: a.valide ? "var(--success-light)" : "#FEF3C7", color: a.valide ? "var(--success)" : "#92400E", fontWeight: 600 }}>{a.valide ? "Publié" : "En attente"}</span>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "8px" }}>{a.contenu}</p>
                  <p style={{ color: "var(--text-light)", fontSize: "12px" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {onglet === "parametres" && (
        <div style={{ maxWidth: "480px" }}>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Modifier mon pseudo</h2>
            {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", fontWeight: 500 }}>{message}</div>}
            <form onSubmit={updatePseudo} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Pseudo</label>
                <input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)} required minLength={3} style={inputStyle} />
              </div>
              <button type="submit" style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Sauvegarder
              </button>
            </form>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Informations du compte</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "4px" }}>Email : {user?.email}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Membre depuis : {new Date(profil?.cree_le).toLocaleDateString("fr-FR")}</p>
          </div>
        </div>
      )}
    </main>
  )
}