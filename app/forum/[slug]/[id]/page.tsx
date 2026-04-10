"use client"

import { use, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ForumSujetPage({ params }: { params: Promise<{ slug: string, id: string }> }) {
  const { slug, id } = use(params)
  const [sujet, setSujet] = useState<any>(null)
  const [reponses, setReponses] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contenu, setContenu] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (data.user) {
        const { data: profile } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", data.user.id)
          .single()
        setIsAdmin(profile?.role === "admin")
      }
    })
  }, [])

  async function fetchData() {
    setLoading(true)
    const [{ data: sujetData }, { data: reponsesData }] = await Promise.all([
      supabase.from("forum_sujets").select("*, utilisateurs:user_id(pseudo), forum_categories(nom, slug)").eq("id", id).single(),
      supabase.from("forum_reponses").select("*, utilisateurs:user_id(pseudo)").eq("sujet_id", id).order("cree_le")
    ])
    setSujet(sujetData)
    setReponses(reponsesData || [])
    // Incrémente les vues via une fonction sécurisée côté serveur
    if (sujetData) {
      await supabase.rpc("increment_forum_views", { sujet_id: id })
    }
    setLoading(false)
  }

  async function repondre(e: React.FormEvent) {
    e.preventDefault()
    if (!user) { router.push("/auth/login"); return }
    setSubmitting(true)
    setMessage("")
    const { error } = await supabase.from("forum_reponses").insert({
      sujet_id: id,
      user_id: user.id,
      contenu
    })
    setSubmitting(false)
    if (error) { setMessage("Erreur : " + error.message); return }
    setContenu("")
    await fetchData()
  }

  async function supprimerReponse(reponseId: string) {
    if (!confirm("Supprimer cette réponse ?")) return
    await supabase.from("forum_reponses").delete().eq("id", reponseId)
    await fetchData()
  }

  async function toggleEpingle() {
    await supabase.from("forum_sujets").update({ epingle: !sujet.epingle }).eq("id", id)
    await fetchData()
  }

  async function toggleFerme() {
    await supabase.from("forum_sujets").update({ ferme: !sujet.ferme }).eq("id", id)
    await fetchData()
  }

  async function supprimerSujet() {
    if (!confirm("Supprimer ce sujet et toutes ses réponses ? Cette action est irréversible.")) return
    await supabase.from("forum_reponses").delete().eq("sujet_id", id)
    await supabase.from("forum_sujets").delete().eq("id", id)
    router.push("/forum/" + slug)
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>
  if (!sujet) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Sujet introuvable.</div>

  const MessageCard = ({ pseudo, contenu: msgContenu, date, isFirst, reponseId }: any) => (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
            {pseudo?.[0]?.toUpperCase()}
          </div>
          <span style={{ fontWeight: 600, fontSize: "13px" }}>{pseudo}</span>
          {isFirst && <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--accent)", color: "#fff", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.4px" }}>AUTEUR</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
          {/* Boutons admin sur chaque message */}
          {isAdmin && isFirst && (
            <div style={{ display: "flex", gap: "4px" }}>
              <button onClick={toggleEpingle} title={sujet.epingle ? "Désépingler" : "Épingler"}
                style={{ background: sujet.epingle ? "var(--accent-light)" : "none", border: "1px solid var(--border)", borderRadius: "5px", padding: "2px 7px", fontSize: "12px", cursor: "pointer" }}>📌</button>
              <button onClick={toggleFerme} title={sujet.ferme ? "Réouvrir" : "Fermer"}
                style={{ background: sujet.ferme ? "#FEF3C7" : "none", border: "1px solid var(--border)", borderRadius: "5px", padding: "2px 7px", fontSize: "12px", cursor: "pointer" }}>🔒</button>
              <button onClick={supprimerSujet} title="Supprimer le sujet"
                style={{ background: "none", border: "1px solid #FECACA", borderRadius: "5px", padding: "2px 7px", fontSize: "12px", cursor: "pointer", color: "#DC2626" }}>🗑️</button>
            </div>
          )}
          {isAdmin && !isFirst && reponseId && (
            <button onClick={() => supprimerReponse(reponseId)} title="Supprimer la réponse"
              style={{ background: "none", border: "1px solid #FECACA", borderRadius: "5px", padding: "2px 7px", fontSize: "12px", cursor: "pointer", color: "#DC2626" }}>🗑️</button>
          )}
        </div>
      </div>
      <div style={{ padding: "16px", fontSize: "14px", lineHeight: "1.7", color: "var(--text)", whiteSpace: "pre-wrap" as const }}>
        {msgContenu}
      </div>
    </div>
  )

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href={"/forum/" + sujet.forum_categories?.slug} style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        ← Retour à {sujet.forum_categories?.nom}
      </a>

      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          {sujet.epingle && <span style={{ fontSize: "10px", fontWeight: 700, background: "var(--accent-light)", color: "var(--accent)", padding: "2px 6px", borderRadius: "4px" }}>ÉPINGLÉ</span>}
          {sujet.ferme && <span style={{ fontSize: "10px", fontWeight: 700, background: "#FEF3C7", color: "#92400E", padding: "2px 6px", borderRadius: "4px" }}>FERMÉ</span>}
        </div>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>{sujet.titre}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{reponses.length} réponse{reponses.length !== 1 ? "s" : ""} · {sujet.vues || 0} vue{(sujet.vues || 0) !== 1 ? "s" : ""}</p>
      </div>

      <MessageCard pseudo={sujet.utilisateurs?.pseudo} contenu={sujet.contenu} date={sujet.cree_le} isFirst={true} />

      {reponses.map((r: any) => (
        <MessageCard key={r.id} pseudo={r.utilisateurs?.pseudo} contenu={r.contenu} date={r.cree_le} isFirst={false} reponseId={r.id} />
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
              <button
                type="submit"
                disabled={submitting}
                style={{ background: submitting ? "#9CA3AF" : "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "14px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", alignSelf: "flex-start" }}
              >
                {submitting ? "Publication..." : "Publier la réponse"}
              </button>
            </form>
          )}
        </div>
      )}
    </main>
  )
}