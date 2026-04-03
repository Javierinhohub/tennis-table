"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ForumCatPage({ params }: { params: { slug: string } }) {
  const [categorie, setCategorie] = useState<any>(null)
  const [sujets, setSujets] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [titre, setTitre] = useState("")
  const [contenu, setContenu] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data: cat } = await supabase.from("forum_categories").select("*").eq("slug", params.slug).single()
    setCategorie(cat)
    if (cat) {
      const { data: sujetsData } = await supabase
        .from("forum_sujets")
        .select("*, utilisateurs:user_id(pseudo), forum_reponses(id)")
        .eq("categorie_id", cat.id)
        .order("epingle", { ascending: false })
        .order("cree_le", { ascending: false })
      setSujets(sujetsData || [])
    }
    setLoading(false)
  }

  async function creerSujet(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push("/auth/login"); return }
    const { error } = await supabase.from("forum_sujets").insert({
      categorie_id: categorie.id,
      user_id: user.id,
      titre, contenu
    })
    if (error) { setMessage("Erreur : " + error.message); return }
    setTitre(""); setContenu(""); setShowForm(false)
    await fetchData()
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/forum" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour au forum
      </a>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{categorie?.nom}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>{categorie?.description}</p>
        </div>
        <button onClick={() => { if (!user) { router.push("/auth/login"); return } setShowForm(!showForm) }}
          style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
          Nouveau sujet
        </button>
      </div>

      {showForm && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}>Créer un nouveau sujet</h2>
          {message && <div style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px" }}>{message}</div>}
          <form onSubmit={creerSujet} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={labelStyle}>Titre</label><input type="text" value={titre} onChange={e => setTitre(e.target.value)} required style={inputStyle} placeholder="Titre de votre sujet..." /></div>
            <div><label style={labelStyle}>Message</label><textarea value={contenu} onChange={e => setContenu(e.target.value)} required rows={5} style={{ ...inputStyle, resize: "vertical" as const }} placeholder="Rédigez votre message..." /></div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button type="submit" style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Publier</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Annuler</button>
            </div>
          </form>
        </div>
      )}

      {sujets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun sujet pour le moment. Soyez le premier à en créer un !
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          {sujets.map((s: any, i: number) => (
            <a href={"/forum/" + params.slug + "/" + s.id} key={s.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: i < sujets.length - 1 ? "1px solid var(--border)" : "none", textDecoration: "none", transition: "background 0.1s" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  {s.epingle && <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--accent-light)", color: "var(--accent)", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.4px" }}>EPINGLE</span>}
                  {s.ferme && <span style={{ fontSize: "10px", fontWeight: 700, background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.4px" }}>FERME</span>}
                  <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{s.titre}</span>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Par <span style={{ fontWeight: 500 }}>{s.utilisateurs?.pseudo}</span> · {new Date(s.cree_le).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div style={{ textAlign: "center", minWidth: "60px" }}>
                <p style={{ fontSize: "16px", fontWeight: 700, color: "var(--text)" }}>{s.forum_reponses?.length || 0}</p>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>réponse{(s.forum_reponses?.length || 0) !== 1 ? "s" : ""}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </main>
  )
}