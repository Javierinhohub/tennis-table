import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabaseAdmin } from "@/lib/supabase-admin"

const resend = new Resend(process.env.RESEND_API_KEY)
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.tt-kip.com"
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "TT-Kip <noreply@tt-kip.com>"

export async function POST(req: NextRequest) {
  try {
    const { recipientId, senderPseudo, conversationId, preview } = await req.json()

    if (!recipientId || !senderPseudo || !conversationId) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
    }

    // Récupérer l'email du destinataire via le client admin (contourne RLS)
    const { data: recipient } = await supabaseAdmin
      .from("utilisateurs")
      .select("email, pseudo")
      .eq("id", recipientId)
      .single()

    if (!recipient?.email) {
      return NextResponse.json({ ok: true, skipped: true })
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to: recipient.email,
      subject: `💬 Nouveau message de ${senderPseudo} sur TT-Kip`,
      html: `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB;">
          <div style="background: #D97757; padding: 24px 28px;">
            <p style="color: #fff; font-size: 20px; font-weight: 700; margin: 0;">TT-Kip</p>
          </div>
          <div style="padding: 28px;">
            <p style="font-size: 16px; color: #111827; margin: 0 0 8px;">Bonjour ${recipient.pseudo} 👋</p>
            <p style="font-size: 14px; color: #6B7280; margin: 0 0 20px;">
              <strong style="color: #D97757">${senderPseudo}</strong> vous a envoyé un message sur TT-Kip.
            </p>
            ${preview ? `
            <div style="background: #F9FAFB; border-left: 3px solid #D97757; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
              <p style="font-size: 13px; color: #374151; margin: 0; font-style: italic;">"${preview.slice(0, 120)}${preview.length > 120 ? "…" : ""}"</p>
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
  } catch (err: any) {
    console.error("notify error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
