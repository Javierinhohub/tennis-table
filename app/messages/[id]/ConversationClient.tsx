"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ConversationClient({ conversationId }: { conversationId: string }) {
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)

  const [user, setUser] = useState<any>(null)
  const [pseudo, setPseudo] = useState("")
  const [conversation, setConversation] = useState<any>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [texte, setTexte] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      setUser(u)
      if (u) init(u.id)
      else setLoading(false)
    })
  }, [])

  async function init(userId: string) {
    // Charger la conversation + vérifier que l'utilisateur en fait partie
    const { data: conv } = await supabase
      .from("conversations")
      .select("id, participant_1, participant_2")
      .eq("id", conversationId)
      .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
      .single()

    if (!conv) { router.push("/messages"); return }

    // Récupérer les pseudos des deux participants séparément
    const { data: participants } = await supabase
      .from("utilisateurs")
      .select("id, pseudo")
      .in("id", [conv.participant_1, conv.participant_2])

    const participantMap: Record<string, { id: string; pseudo: string }> = {}
    participants?.forEach((p: any) => { participantMap[p.id] = p })

    // Stocker le pseudo de l'utilisateur connecté pour les notifications
    const myPseudo = participantMap[userId]?.pseudo || ""
    setPseudo(myPseudo)

    setConversation({
      ...conv,
      p1: participantMap[conv.participant_1] || { id: conv.participant_1, pseudo: "Utilisateur" },
      p2: participantMap[conv.participant_2] || { id: conv.participant_2, pseudo: "Utilisateur" },
    })
    await fetchMessages()
    await markAsRead(userId)
    setLoading(false)
  }

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, contenu, lu, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
    setMessages(data || [])
  }

  async function markAsRead(userId: string) {
    await supabase
      .from("messages")
      .update({ lu: true })
      .eq("conversation_id", conversationId)
      .neq("sender_id", userId)
      .eq("lu", false)
  }

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Realtime : écoute les nouveaux messages
  useEffect(() => {
    if (!user) return
    const channel = supabase
      .channel("conv-" + conversationId)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: "conversation_id=eq." + conversationId,
      }, (payload) => {
        setMessages(prev => {
          // Éviter le doublon si on est l'expéditeur (optimistic update déjà présent)
          const alreadyExists = prev.some(m => m.id === payload.new.id)
          if (alreadyExists) return prev
          return [...prev, payload.new]
        })
        if (payload.new.sender_id !== user.id) {
          supabase.from("messages").update({ lu: true }).eq("id", payload.new.id)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [user, conversationId])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    const content = texte.trim()
    if (!content || !user || sending) return
    setSending(true)
    setTexte("")

    // Optimistic update : afficher le message immédiatement sans attendre Supabase
    const tempId = "temp-" + Date.now()
    const optimisticMsg = {
      id: tempId,
      sender_id: user.id,
      contenu: content,
      lu: false,
      created_at: new Date().toISOString(),
      _pending: true,
    }
    setMessages(prev => [...prev, optimisticMsg])

    const { data: msg } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: user.id, contenu: content })
      .select("id, sender_id, contenu, lu, created_at")
      .single()

    if (msg) {
      // Remplacer le message optimiste par la vraie réponse Supabase
      setMessages(prev => prev.map(m => m.id === tempId ? msg : m))

      // Notification email au destinataire (fire-and-forget)
      const other = getInterlocutor()
      if (other?.id) {
        fetch("/api/messages/notify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipientId: other.id,
            senderPseudo: pseudo,
            conversationId,
            preview: content,
          }),
        }).catch(() => {})
      }
    } else {
      // Échec : retirer le message optimiste et restaurer le texte
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setTexte(content)
    }

    setSending(false)
  }

  function getInterlocutor() {
    if (!conversation || !user) return null
    return conversation.p1?.id === user.id ? conversation.p2 : conversation.p1
  }

  function formatTime(iso: string) {
    const d = new Date(iso)
    const now = new Date()
    const sameDay = d.toDateString() === now.toDateString()
    if (sameDay) return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }) + " · " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  }

  const other = getInterlocutor()

  if (loading) {
    return (
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>Chargement…</div>
      </main>
    )
  }

  if (!user) {
    return (
      <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "3rem", textAlign: "center" }}>
          <Link href="/auth/login?redirect=/messages" style={{ background: "#D97757", color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 20px", fontWeight: 600, fontSize: "14px" }}>Se connecter</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      {/* En-tête */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
        <Link href="/messages" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", gap: "4px" }}>
          ← Messages
        </Link>
        {other && (
          <>
            <span style={{ color: "var(--border)" }}>|</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757" }}>
                {other.pseudo?.[0]?.toUpperCase()}
              </div>
              <span style={{ fontSize: "15px", fontWeight: 700 }}>{other.pseudo}</span>
            </div>
          </>
        )}
      </div>

      {/* Zone messages */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, padding: "16px", display: "flex", flexDirection: "column", gap: "8px", minHeight: "300px", maxHeight: "520px", overflowY: "auto" }}>
          {messages.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "13px", margin: "auto" }}>
              Démarrez la conversation !
            </p>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.sender_id === user.id
            const prevMsg = messages[i - 1]
            const showTime = !prevMsg || new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60_000
            return (
              <div key={msg.id}>
                {showTime && (
                  <p style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", margin: "8px 0 4px" }}>
                    {formatTime(msg.created_at)}
                  </p>
                )}
                <div style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start" }}>
                  <div style={{
                    maxWidth: "75%",
                    background: isMe ? "#D97757" : "var(--bg)",
                    color: isMe ? "#fff" : "var(--text)",
                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "10px 14px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    wordBreak: "break-word" as const,
                  }}>
                    {msg.contenu}
                  </div>
                </div>
                {isMe && i === messages.length - 1 && (
                  <p style={{ textAlign: "right", fontSize: "10px", color: "var(--text-muted)", marginTop: "2px", marginRight: "4px" }}>
                    {msg.lu ? "Lu" : "Envoyé"}
                  </p>
                )}
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Formulaire envoi */}
        <form
          onSubmit={handleSend}
          style={{ borderTop: "1px solid var(--border)", padding: "12px 16px", display: "flex", gap: "10px", alignItems: "flex-end", background: "var(--bg)" }}
        >
          <textarea
            value={texte}
            onChange={e => setTexte(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e as any) } }}
            placeholder="Écrire un message… (Entrée pour envoyer)"
            maxLength={500}
            rows={1}
            style={{
              flex: 1, resize: "none", padding: "10px 14px", fontSize: "14px",
              border: "1px solid var(--border)", borderRadius: "10px", outline: "none",
              fontFamily: "Poppins, sans-serif", background: "#fff", color: "var(--text)",
              maxHeight: "120px", overflowY: "auto",
            }}
          />
          <button
            type="submit"
            disabled={!texte.trim() || sending}
            style={{
              background: texte.trim() ? "#D97757" : "var(--border)",
              color: texte.trim() ? "#fff" : "var(--text-muted)",
              border: "none", borderRadius: "10px", padding: "10px 18px",
              fontSize: "14px", fontWeight: 600, cursor: texte.trim() ? "pointer" : "not-allowed",
              fontFamily: "Poppins, sans-serif", flexShrink: 0, transition: "background 0.15s",
            }}
          >
            {sending ? "…" : "Envoyer"}
          </button>
        </form>
        <p style={{ textAlign: "right", fontSize: "10px", color: "var(--text-muted)", padding: "2px 16px 8px", background: "var(--bg)" }}>
          {texte.length}/500
        </p>
      </div>
    </main>
  )
}
