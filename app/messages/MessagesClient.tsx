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

    // 1. Récupérer les conversations
    const { data: convs } = await supabase
      .from("conversations")
      .select("id, participant_1, participant_2, last_message_at")
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .order("last_message_at", { ascending: false })

    if (!convs || convs.length === 0) { setLoading(false); return }

    // 2. Récupérer les pseudos des interlocuteurs en une seule requête
    const otherIds = convs.map((c: any) =>
      c.participant_1 === userId ? c.participant_2 : c.participant_1
    )
    const { data: users } = await supabase
      .from("utilisateurs")
      .select("id, pseudo")
      .in("id", [...new Set(otherIds)])

    const userMap: Record<string, string> = {}
    users?.forEach((u: any) => { userMap[u.id] = u.pseudo })

    // 3. Récupérer le dernier message de chaque conversation
    const enriched = await Promise.all(convs.map(async (conv: any) => {
      const otherId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1
      const { data: lastMsg } = await supabase
        .from("messages")
        .select("contenu, lu, sender_id, created_at")
        .eq("conversation_id", conv.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      return { ...conv, otherPseudo: userMap[otherId] || "Utilisateur", otherId, lastMsg }
    }))

    setConversations(enriched)
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
    const [p1, p2] = [user.id, otherId].sort()

    // 1. Chercher si la conversation existe déjà
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("participant_1", p1)
      .eq("participant_2", p2)
      .maybeSingle()

    if (existing?.id) {
      setCreating(false)
      router.push("/messages/" + existing.id)
      return
    }

    // 2. Sinon la créer
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({ participant_1: p1, participant_2: p2 })
      .select("id")
      .single()

    setCreating(false)
    if (created?.id) {
      router.push("/messages/" + created.id)
    } else {
      console.error("Impossible de créer la conversation :", error)
      alert("Erreur lors de la création de la conversation. Veuillez réessayer.")
    }
  }

  function unread(conv: any) {
    return conv.lastMsg && !conv.lastMsg.lu && conv.lastMsg.sender_id !== user?.id
  }

  function formatDate(iso: string) {
    if (!iso) return ""
    const d = new Date(iso)
    const diff = Date.now() - d.getTime()
    if (diff < 60_000) return "À l'instant"
    if (diff < 3_600_000) return Math.floor(diff / 60_000) + " min"
    if (diff < 86_400_000) return Math.floor(diff / 3_600_000) + " h"
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
  }

  if (loading) return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Chargement…</div>
    </main>
  )

  if (!user) return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "16px" }}>Connectez-vous pour accéder à vos messages.</p>
        <Link href="/auth/login?redirect=/messages" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, fontSize: "14px" }}>Se connecter</Link>
      </div>
    </main>
  )

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700 }}>Messages</h1>
        <button onClick={() => setShowNew(v => !v)}
          style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
          + Nouveau message
        </button>
      </div>

      {showNew && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "10px" }}>Contacter un utilisateur</p>
          <div style={{ position: "relative" }}>
            <input autoFocus type="text" placeholder="Rechercher par pseudo…" value={searchPseudo}
              onChange={e => setSearchPseudo(e.target.value)}
              style={{ width: "100%", padding: "10px 14px", fontSize: "14px", border: "1px solid var(--border)", borderRadius: "8px", outline: "none", fontFamily: "Poppins, sans-serif", boxSizing: "border-box" as const }} />
            {searchResults.length > 0 && (
              <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", zIndex: 20, overflow: "hidden" }}>
                {searchResults.map((u, i) => (
                  <div key={u.id} onClick={() => startConversation(u.id)}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", cursor: creating ? "wait" : "pointer", borderBottom: i < searchResults.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "#fff"}>
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

      {conversations.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: "8px", fontSize: "15px" }}>Aucun message pour l'instant.</p>
          <p style={{ fontSize: "13px" }}>Cliquez sur "+ Nouveau message" pour contacter un utilisateur.</p>
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {conversations.map((conv, i) => (
            <Link key={conv.id} href={"/messages/" + conv.id}
              style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", textDecoration: "none", borderBottom: i < conversations.length - 1 ? "1px solid var(--border)" : "none", background: unread(conv) ? "#FFFBF7" : "#fff" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = unread(conv) ? "#FFFBF7" : "#fff"}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#D97757", flexShrink: 0, position: "relative" }}>
                {conv.otherPseudo?.[0]?.toUpperCase()}
                {unread(conv) && <div style={{ position: "absolute", top: 0, right: 0, width: "10px", height: "10px", background: "#D97757", borderRadius: "50%", border: "2px solid #fff" }} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2px" }}>
                  <span style={{ fontSize: "14px", fontWeight: unread(conv) ? 700 : 500, color: "var(--text)" }}>{conv.otherPseudo}</span>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0, marginLeft: "8px" }}>
                    {conv.lastMsg ? formatDate(conv.lastMsg.created_at) : formatDate(conv.last_message_at)}
                  </span>
                </div>
                <p style={{ fontSize: "13px", color: unread(conv) ? "var(--text)" : "var(--text-muted)", margin: 0, whiteSpace: "nowrap" as const, overflow: "hidden", textOverflow: "ellipsis", fontWeight: unread(conv) ? 500 : 400 }}>
                  {conv.lastMsg
                    ? (conv.lastMsg.sender_id === user.id ? "Vous : " : "") + conv.lastMsg.contenu
                    : "Démarrez la conversation →"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
