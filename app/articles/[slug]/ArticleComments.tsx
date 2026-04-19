"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ArticleComments({ articleId }: { articleId: string }) {
  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState("")
  const [isAdmin, setIsAdmin] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [texte, setTexte] = useState("")
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) {
        supabase
          .from("utilisateurs")
          .select("pseudo, role")
          .eq("id", u.id)
          .single()
          .then(({ data: profil }) => {
            setPseudo(profil?.pseudo || "")
            setIsAdmin(profil?.role === "admin")
          })
      }
    })
    fetchComments()
  }, [])

  async function fetchComments() {
    const { data } = await supabase
      .from("commentaires_articles")
      .select("id, contenu, cree_le, user_id, utilisateurs:user_id(pseudo)")
      .eq("article_id", articleId)
      .order("cree_le", { ascending: true })
    setComments(data || [])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const content = texte.trim()
    if (!content || !user || sending) return
    setSending(true)

    const { data, error } = await supabase
      .from("commentaires_articles")
      .insert({ article_id: articleId, user_id: user.id, contenu: content })
      .select("id, contenu, cree_le, user_id, utilisateurs:user_id(pseudo)")
      .single()

    if (data) {
      setComments(prev => [...prev, data])
      setTexte("")
    }
    setSending(false)
  }

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce commentaire ?")) return
    const { error } = await supabase
      .from("commentaires_articles")
      .delete()
      .eq("id", id)
    if (!error) setComments(prev => prev.filter(c => c.id !== id))
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 60_000) return "À l'instant"
    if (diff < 3_600_000) return "Il y a " + Math.floor(diff / 60_000) + " min"
    if (diff < 86_400_000) return "Il y a " + Math.floor(diff / 3_600_000) + " h"
    if (diff < 604_800_000) return "Il y a " + Math.floor(diff / 86_400_000) + " j"
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "17px", fontWeight: 700, marginBottom: "1.2rem", color: "var(--text)" }}>
        Commentaires {comments.length > 0 && <span style={{ fontSize: "14px", fontWeight: 400, color: "var(--text-muted)" }}>({comments.length})</span>}
      </h2>

      {/* Liste des commentaires */}
      {loading ? (
        <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Chargement…</p>
      ) : comments.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "24px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px", marginBottom: "1.2rem" }}>
          Aucun commentaire pour l'instant. Soyez le premier !
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "1.2rem" }}>
          {comments.map(c => (
            <div key={c.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                      {(c.utilisateurs?.pseudo || "?")[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>
                      {c.utilisateurs?.pseudo || "Utilisateur"}
                    </span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>·</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{formatDate(c.cree_le)}</span>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.6, margin: 0, paddingLeft: "36px", whiteSpace: "pre-wrap" as const }}>
                    {c.contenu}
                  </p>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(c.id)}
                    title="Supprimer ce commentaire"
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "4px", borderRadius: "4px", flexShrink: 0, lineHeight: 1 }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#DC2626"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulaire */}
      {user ? (
        <form onSubmit={handleSubmit} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
              {pseudo?.[0]?.toUpperCase() || "?"}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{pseudo}</span>
          </div>
          <textarea
            value={texte}
            onChange={e => setTexte(e.target.value)}
            placeholder="Laissez un commentaire…"
            maxLength={1000}
            rows={3}
            style={{ width: "100%", resize: "vertical" as const, padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "8px", outline: "none", fontFamily: "Poppins, sans-serif", color: "var(--text)", background: "var(--bg)", boxSizing: "border-box" as const, lineHeight: 1.5 }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{texte.length}/1000</span>
            <button
              type="submit"
              disabled={!texte.trim() || sending}
              style={{ background: texte.trim() ? "#D97757" : "var(--border)", color: texte.trim() ? "#fff" : "var(--text-muted)", border: "none", borderRadius: "8px", padding: "9px 20px", fontSize: "13px", fontWeight: 600, cursor: texte.trim() ? "pointer" : "not-allowed", fontFamily: "Poppins, sans-serif", transition: "background 0.15s" }}
            >
              {sending ? "Envoi…" : "Publier"}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "12px" }}>Connectez-vous pour laisser un commentaire.</p>
          <a href={"/auth/login?redirect=" + encodeURIComponent("/articles")} style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "9px 20px", fontSize: "13px", fontWeight: 600 }}>
            Se connecter
          </a>
        </div>
      )}
    </div>
  )
}
