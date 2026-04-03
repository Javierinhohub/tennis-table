"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const CATEGORIES = ["test", "conseil", "actualite", "comparatif"]

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [mode, setMode] = useState<"liste" | "nouveau">("liste")
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  const [titre, setTitre] = useState("")
  const [slug, setSlug] = useState("")
  const [extrait, setExtrait] = useState("")
  const [contenu, setContenu] = useState("")
  const [categorie, setCategorie] = useState("test")
  const [produitId, setProduitId] = useState("")
  const [produitSearch, setProduitSearch] = useState("")
  const [produitsFiltres, setProduitsFiltres] = useState<any[]>([])
  const [publie, setPublie] = useState(false)

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    setUser(user)
    const [{ data: arts }, { data: prods }] = await Promise.all([
      supabase.from("articles").select("id, titre, slug, categorie, publie, vues, cree_le").order("cree_le", { ascending: false }),
      supabase.from("produits").select("id, nom, marques(nom)").eq("actif", true).order("nom").limit(500)
    ])
    setArticles(arts || [])
    setProduits(prods || [])
    setLoading(false)
  }

  useEffect(() => {
    if (produitSearch.length < 2) { setProduitsFiltres([]); return }
    const s = produitSearch.toLowerCase()
    setProduitsFiltres(produits.filter(p => p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))).slice(0, 6))
  }, [produitSearch, produits])

  useEffect(() => {
    if (titre) setSlug(titre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80))
  }, [titre])

  async function publierArticle(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const { error } = await supabase.from("articles").insert({
      titre, slug, extrait: extrait || null, contenu,
      categorie, produit_id: produitId || null,
      auteur_id: user.id, publie
    })
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Article créé avec succès !")
    setTitre(""); setSlug(""); setExtrait(""); setContenu(""); setProduitId(""); setProduitSearch(""); setPublie(false)
    await checkAdmin()
    setMode("liste")
  }

  async function togglePublie(id: string, publie: boolean) {
    await supabase.from("articles").update({ publie: !publie }).eq("id", id)
    await checkAdmin()
  }

  async function supprimerArticle(id: string) {
    if (!confirm("Supprimer cet article ?")) return
    await supabase.from("articles").delete().eq("id", id)
    await checkAdmin()
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>Retour à l'administration</a>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700 }}>Articles & Tests</h1>
        <button onClick={() => setMode(mode === "liste" ? "nouveau" : "liste")}
          style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
          {mode === "liste" ? "+ Nouvel article" : "Voir la liste"}
        </button>
      </div>

      {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>{message}</div>}

      {mode === "liste" && (
        <div>
          {articles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>Aucun article pour le moment.</div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Titre</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Catégorie</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Vues</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Statut</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map((a, i) => (
                    <tr key={a.id} style={{ borderBottom: i < articles.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>
                        <a href={"/articles/" + a.slug} target="_blank" style={{ color: "var(--text)", textDecoration: "none" }}>{a.titre}</a>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)", textTransform: "capitalize" }}>{a.categorie}</td>
                      <td style={{ padding: "12px 16px", fontSize: "13px", color: "var(--text-muted)" }}>{a.vues}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", background: a.publie ? "var(--success-light)" : "#FEF3C7", color: a.publie ? "var(--success)" : "#92400E" }}>{a.publie ? "Publié" : "Brouillon"}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button onClick={() => togglePublie(a.id, a.publie)} style={{ background: a.publie ? "var(--bg)" : "var(--success-light)", color: a.publie ? "var(--text-muted)" : "var(--success)", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer" }}>{a.publie ? "Dépublier" : "Publier"}</button>
                          <button onClick={() => supprimerArticle(a.id)} style={{ background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", cursor: "pointer" }}>Supprimer</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {mode === "nouveau" && (
        <form onSubmit={publierArticle} style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Informations</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><label style={labelStyle}>Titre</label><input type="text" value={titre} onChange={e => setTitre(e.target.value)} required style={inputStyle} placeholder="Titre de l'article" /></div>
              <div><label style={labelStyle}>Slug (URL)</label><input type="text" value={slug} onChange={e => setSlug(e.target.value)} required style={{ ...inputStyle, fontFamily: "monospace", fontSize: "13px" }} /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Catégorie</label>
                  <select value={categorie} onChange={e => setCategorie(e.target.value)} style={inputStyle}>
                    {CATEGORIES.map(c => <option key={c} value={c} style={{ textTransform: "capitalize" }}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Produit lié (optionnel)</label>
                  <input type="text" value={produitSearch} onChange={e => { setProduitSearch(e.target.value); setProduitId("") }} style={inputStyle} placeholder="Rechercher un produit..." />
                  {produitsFiltres.length > 0 && (
                    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px", overflow: "hidden" }}>
                      {produitsFiltres.map((p, i) => (
                        <div key={p.id} onClick={() => { setProduitId(p.id); setProduitSearch(p.nom + " — " + p.marques?.nom); setProduitsFiltres([]) }}
                          style={{ padding: "8px 12px", cursor: "pointer", borderBottom: i < produitsFiltres.length - 1 ? "1px solid var(--border)" : "none", fontSize: "13px" }}
                          onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                          onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                        >
                          <span style={{ fontWeight: 500 }}>{p.nom}</span> <span style={{ color: "var(--text-muted)" }}>{p.marques?.nom}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div><label style={labelStyle}>Extrait (résumé)</label><textarea value={extrait} onChange={e => setExtrait(e.target.value)} rows={2} style={{ ...inputStyle, resize: "vertical" as const }} placeholder="Court résumé affiché dans la liste..." /></div>
            </div>
          </div>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <label style={labelStyle}>Contenu de l'article</label>
            <textarea value={contenu} onChange={e => setContenu(e.target.value)} required rows={20} style={{ ...inputStyle, resize: "vertical" as const, fontFamily: "monospace", fontSize: "13px", lineHeight: 1.6 }} placeholder="Rédigez votre article ici..." />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px", fontWeight: 500 }}>
              <input type="checkbox" checked={publie} onChange={e => setPublie(e.target.checked)} style={{ width: "16px", height: "16px" }} />
              Publier immédiatement
            </label>
            <button type="submit" style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
              {publie ? "Publier l'article" : "Enregistrer en brouillon"}
            </button>
          </div>
        </form>
      )}
    </main>
  )
}