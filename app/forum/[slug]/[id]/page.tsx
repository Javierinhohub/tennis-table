"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ForumSujetPage({ params }: { params: { slug: string, id: string } }) {
  const [sujet, setSujet] = useState<any>(null)
  const [reponses, setReponses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contenu, setContenu] = useState("")
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: sujetData }, { data: reponsesData }] = await Promise.all([
      supabase.from("forum_sujets").select("*, utilisateurs:user_id(pseudo), forum_categories(nom, slug)").eq("id", params.id).single(),
      supabase.from("forum_reponses").select("*, utilisateurs:user_id(pseudo)").eq("sujet_id", params.id).order("cree_le")
    ])
    setSujet(sujetData)
    setReponses(reponsesData || [])
    if (sujetData) {
      await supabase.from("forum_sujets").update({ vues: (sujetData.vues || 0) + 1 }).eq("id", params.id)
    }
    setLoading(false)
  }

  async function repondre(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push("/auth/login"); return }
    const { error } = await supabase.from("forum_reponses").insert({
      sujet_id: params.id,
      user_id: user.id,
      contenu
    })
    if (error) { setMessage("Erreur : " + error.message); return }
    setContenu("")
    await fetchData()
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>
  if (!sujet) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Sujet introuvable.</div>

  const MessageCard = ({ pseudo, contenu, date, isFirst }: any) => (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
            {pseudo?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, fontSize: "13px" }}>{pseudo}</span>
          {isFirst && <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--accent)", color: "#fff", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.4px" }}>AUTEUR</span>}
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div style={{ padding: "16px", fontSize: "14px", lineHeight: "1.7", color: "var(--text)", whiteSpace: "pre-wrap" as const }}>
        {contenu}
      </div>
    </div>
  )

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href={"/forum/" + sujet.forum_categories?.slug} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour à {sujet.forum_categories?.nom}
      </a>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          {sujet.epingle && <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--accent-light)", color: "var(--accent)", padding: "2px 6px", borderRadius: "4px" }}>EPINGLE</span>}
          {sujet.ferme && <span style={{ fontSize: "10px", fontWeight: 700, background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px" }}>FERME</span>}
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{sujet.titre}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{reponses.length} réponse{reponses.length !== 1 ? "s" : ""} · {sujet.vues} vue{sujet.vues !== 1 ? "s" : ""}</p>
      </div>

      <MessageCard pseudo={sujet.utilisateurs?.pseudo} contenu={sujet.contenu} date={sujet.cree_le} isFirst={true} />

      {reponses.map((r: any) => (
        <MessageCard key={r.id} pseudo={r.utilisateurs?.pseudo} contenu={r.contenu} date={r.cree_le} isFirst={false} />
      ))}

      {!sujet.ferme && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginTop: "1.5rem" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 600, marginBottom: "16px" }}>Répondre</h2>
          {!user ? (
            <div style={{ textAlign: "center", padding: "1.5rem", color: "var(--text-muted)" }}>
              <a href="/auth/login" style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>Connectez-vous</a> pour répondre.
            </div>
          ) : (
            <form onSubmit={repondre} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {message && <div style={{ background: "#FEF2F2", color: "#DC2626", borderRadius: "8px", padding: "10px 14px", fontSize: "13px" }}>{message}</div>}
              <textarea value={contenu} onChange={e => setContenu(e.target.value)} required rows={4} style={{ ...inputStyle, resize: "vertical" as const }} placeholder="Rédigez votre réponse..." />
              <button type="submit" style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: "pointer", alignSelf: "flex-start" }}>
                Publier la réponse
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  )
}