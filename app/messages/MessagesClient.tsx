"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function MessagesClient() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Nouvelle conversation
  const [showNew, setShowNew] = useState(false)
  const [searchPseudo, setSearchPseudo] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) fetchConversations(u.id)
      else setLoading(false)
    })
  }, [])

  async function fetchConversations(userId: string) {
    setLoading(true)
    const { data } = await supabase
      .from("conversations")
      .select(`
        id, last_message_at,
        p1:utilisateurs!conversations_participant_1_fkey(id, pseudo),
        p2:utilisateurs!conversations_participant_2_fkey(id, pseudo),
        messages(contenu, lu, sender_id, created_at)
      `)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order("last_message_at", { ascending: false })
      .limit(1, { foreignTable: "messages" })

    // Pour chaque conversation, récupérer le dernier message séparément
    if (data) {
      const enriched = await Promise.all(data.map(async (conv: any) => {
        const { data: lastMsg } = await supabase
          .from("messages")
          .select("contenu, lu, sender_id, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()
        return { ...conv, lastMsg }
      }))
      setConversations(enriched)
    }
    setLoading(false)
  }

  async function searchUsers(q: string) {
    if (!q.trim() || !user) { setSearchResults([]); return }
    const { data } = await supabase
      .from("utilisateurs")
      .select("id, pseudo")
      .ilike("pseudo", "%" + q + "%")
      .neq("id", user.id)
      .limit(6)
    setSearchResults(data || [])
  }

  useEffect(() => {
    const t = setTimeout(() => searchUsers(searchPseudo), 300)
    return () => clearTimeout(t)
  }, [searchPseudo])

  async function startConversation(otherId: string) {
    if (!user || creating) return
    setCreating(true)

    // Ordonner les participants (participant_1 < participant_2)
    const [p1, p2] = [user.id, otherId].sort()

    // Upsert conversation (crée ou retrouve)
    const { data: conv } = await supabase
      .from("conversations")
      .upsert({ participant_1: p1, participant_2: p2 }, { onConflict: "participant_1,participant_2" })
      .select("id")
      .single()

    setCreating(false)
    if (conv?.id) router.push("/messages/" + conv.id)
  }

  function getInterlocutor(conv: any) {
    if (!user) return null
    return conv.p1?.id === user.id ? conv.p2 : conv.p1
  }

  function unreadCount(conv: any) {
    // Le dernier message n'est pas lu ET ce n'est pas moi qui l'ai envoyé
    if (!conv.lastMsg || conv.lastMsg.lu || conv.lastMsg.sender_id === user?.id) return 0
    return 1
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60_000) return "À l'instant"
    if (diff < 3_600_000) return Math.floor(diff / 60_000) + " min"
    if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + " h"
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  if (loading) {
    return (
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          Chargement…
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Connectez-vous pour accéder à vos messages.</p>
          <Link href="/auth/login?redirect=/messages" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, fontSize: "14px" }}>Se connecter</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      {/* En-tête */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>Messages</h1>
        <button
          onClick={() => setShowNew(v => !v)}
          style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
        >
          + Nouveau message
        </button>
      </div>

      {/* Recherche utilisateur */}
      {showNew && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Contacter un utilisateur</p>
          <div style={{ position: "relative" }}>
            <input
              autoFocus
              type="text"
              placeholder="Rechercher par pseudo…"
              value={searchPseudo}
              onChange={e => setSearchPseudo(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "8px", outline: "none", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const }}
            />
            {searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", zIndex: 20, overflow: "hidden" }}>
                {searchResults.map((u, i) => (
                  <div
                    key={u.id}
                    onClick={() => startConversation(u.id)}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: creating ? "wait" : "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}
                  >
                    <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                      {u.pseudo?.[0]?.toUpperCase()}
                    </div>
                    <span style={{ fontSize: "14px", fontWeight: 500 }}>{u.pseudo}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Liste conversations */}
      {conversations.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: "8px", fontSize: "15px" }}>Aucun message pour l'instant.</p>
          <p style={{ fontSize: "13px" }}>Cliquez sur "+ Nouveau message" pour contacter un utilisateur.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {conversations.map((conv, i) => {
            const other = getInterlocutor(conv)
            const unread = unreadCount(conv)
            return (
              <Link
                key={conv.id}
                href={"/messages/" + conv.id}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "14px 16px", textDecoration: "none",
                  borderBottom: i < conversations.length - 1 ? "1px solid var(--border)" : "none",
                  background: unread ? "#FFFBF7" : "#fff",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = unread ? "#FFFBF7" : "#fff"}
              >
                {/* Avatar */}
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#D97757", flexShrink: 0, position: "relative" }}>
                  {other?.pseudo?.[0]?.toUpperCase()}
                  {unread > 0 && (
                    <div style={{ position: "absolute", top: 0, right: 0, width: "10px", height: "10px", background: "#D97757", borderRadius: "50%", border: "2px solid #fff" }} />
                  )}
                </div>
                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                    <span style={{ fontSize: "14px", fontWeight: unread ? 700 : 500, color: "var(--text)" }}>{other?.pseudo}</span>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px" }}>
                      {conv.lastMsg ? formatDate(conv.lastMsg.created_at) : formatDate(conv.last_message_at)}
                    </span>
                  </div>
                  <p style={{ fontSize: "13px", color: unread ? "var(--text)" : "var(--text-muted)", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: unread ? 500 : 400 }}>
                    {conv.lastMsg ? (conv.lastMsg.sender_id === user.id ? "Vous : " : "") + conv.lastMsg.contenu : "Conversation démarrée"}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </main>
  )
}
