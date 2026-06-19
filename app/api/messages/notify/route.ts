import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabaseAdmin } from "@/lib/supabase-admin"

const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tt-kip.com"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "TT-Kip <noreply@tt-kip.com>"

// ── Rate limiting par sender.id : max 5 notifications/minute ─────────────────
const WINDOW_MS  = 60_000
const MAX_EMAILS = 5
const rateStore  = new Map<string, { count: number; resetAt: number }>()

function checkRate(userId: string): boolean {
  const now = Date.now()
  const entry = rateStore.get(userId)
  if (!entry || now > entry.resetAt) {
    rateStore.set(userId, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_EMAILS) return false
  entry.count++
  return true
}
setInterval(() => {
  const now = Date.now()
  for (const [id, e] of rateStore) if (now > e.resetAt) rateStore.delete(id)
}, 5 * 60_000)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
}

export async function POST(req: NextRequest) {
  try {
    // 1. Vérification token
    const token = req.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    const { data: { user: sender }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !sender) return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

    // 2. Rate limiting
    if (!checkRate(sender.id)) {
      return NextResponse.json(
        { error: "Trop de notifications envoyées. Réessayez dans une minute." },
        { status: 429, headers: { "Retry-After": "60" } }
      )
    }

    const { recipientId, conversationId, preview } = await req.json()
    if (!recipientId || !conversationId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    // 3. Vérifier que le sender est bien participant à la conversation
    const { data: conv } = await supabaseAdmin
      .from("conversations")
      .select("participant_1, participant_2")
      .eq("id", conversationId)
      .single()
    if (!conv || (conv.participant_1 !== sender.id && conv.participant_2 !== sender.id)) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    // 4. H-3 : récupérer le pseudo du sender depuis la DB (pas du body de requête)
    const { data: senderProfile } = await supabaseAdmin
      .from("utilisateurs")
      .select("pseudo")
      .eq("id", sender.id)
      .single()
    const senderPseudo = senderProfile?.pseudo || "Un utilisateur"

    // 5. Récupérer l'email du destinataire
    const { data: authUser, error: userError } = await supabaseAdmin.auth.admin.getUserById(recipientId)
    if (userError || !authUser?.user?.email) return NextResponse.json({ ok: true, skipped: true })
    const recipientEmail = authUser.user.email

    // 6. Récupérer le pseudo du destinataire
    const { data: recipientProfile } = await supabaseAdmin
      .from("utilisateurs")
      .select("pseudo")
      .eq("id", recipientId)
      .single()
    const recipientPseudo = recipientProfile?.pseudo || "cher utilisateur"

    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipientEmail,
      subject: `Nouveau message de ${senderPseudo} sur TT-Kip`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB;">
          <div style="background: #D97757; padding: 24px 28px;">
            <p style="color: #fff; font-size: 20px; font-weight: 700; margin: 0;">TT-Kip</p>
          </div>
          <div style="padding: 28px;">
            <p style="font-size: 16px; color: #111827; margin: 0 0 8px;">Bonjour ${escapeHtml(recipientPseudo)},</p>
            <p style="font-size: 14px; color: #6B7280; margin: 0 0 20px;">
              <strong style="color: #D97757">${escapeHtml(senderPseudo)}</strong> vous a envoyé un message sur TT-Kip.
            </p>
            ${preview ? `
            <div style="background: #F9FAFB; border-left: 3px solid #D97757; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
              <p style="font-size: 13px; color: #374151; margin: 0; font-style: italic;">"${escapeHtml(String(preview).slice(0, 120))}${String(preview).length > 120 ? "…" : ""}"</p>
            </div>` : ""}
            <a href="${SITE_URL}/messages/${conversationId}"
              style="display: inline-block; background: #D97757; color: #fff; text-decoration: none; border-radius: 8px; padding: 12px 24px; font-size: 14px; font-weight: 600;">
              Voir le message →
            </a>
            <p style="font-size: 11px; color: #9CA3AF; margin-top: 24px;">
              Vous recevez cet email car vous avez un compte sur TT-Kip.<br>
              Répondez directement sur le site — ne répondez pas à cet email.
            </p>
          </div>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("notify error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
