import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Client avec service_role pour lire auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // 1. Vérif que c'est bien l'admin qui appelle
    const { sujet, contenu, testEmail } = await req.json()

    if (!sujet || !contenu) {
      return NextResponse.json({ error: "Sujet et contenu requis" }, { status: 400 })
    }

    // 2. Mode test : envoie uniquement à testEmail
    if (testEmail) {
      const { data, error } = await resend.emails.send({
        from: "TT-Kip <newsletter@tt-kip.com>",
        to: [testEmail],
        subject: `[TEST] ${sujet}`,
        html: buildHtml(sujet, contenu),
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, sent: 1, mode: "test" })
    }

    // 3. Récupère les abonnés (email depuis auth.users + pseudo depuis utilisateurs)
    const { data: abonnes, error: dbError } = await supabaseAdmin
      .from("utilisateurs")
      .select("id, pseudo")
      .eq("newsletter_ok", true)

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    if (!abonnes || abonnes.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    // 4. Récupère les emails depuis auth.users
    const ids = abonnes.map((a: any) => a.id)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })

    const emailMap: Record<string, string> = {}
    authData.users.forEach((u: any) => {
      if (ids.includes(u.id) && u.email) emailMap[u.id] = u.email
    })

    const destinataires = abonnes
      .filter((a: any) => emailMap[a.id])
      .map((a: any) => ({ email: emailMap[a.id], pseudo: a.pseudo }))

    if (destinataires.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    // 5. Envoi en batch (max 50 par appel Resend)
    const BATCH = 50
    let sent = 0
    for (let i = 0; i < destinataires.length; i += BATCH) {
      const batch = destinataires.slice(i, i + BATCH)
      const emails = batch.map((d: any) => ({
        from: "TT-Kip <newsletter@tt-kip.com>",
        to: [d.email],
        subject: sujet,
        html: buildHtml(sujet, contenu, d.pseudo),
      }))
      const { error: sendError } = await resend.batch.send(emails)
      if (sendError) return NextResponse.json({ error: sendError.message, sent }, { status: 500 })
      sent += batch.length
    }

    return NextResponse.json({ ok: true, sent })

  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Erreur inconnue" }, { status: 500 })
  }
}

function buildHtml(sujet: string, contenu: string, pseudo?: string) {
  // Convertit les sauts de ligne en paragraphes
  const paragraphes = contenu
    .split("\n")
    .filter((l: string) => l.trim())
    .map((l: string) => `<p style="margin:0 0 16px;line-height:1.6;color:#374151;">${l}</p>`)
    .join("")

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">

        <!-- Header -->
        <tr>
          <td style="background:#D97757;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">TT-Kip</p>
            <p style="margin:4px 0 0;font-size:13px;color:rgba(255,255,255,0.8);">La communauté tennis de table</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${pseudo ? `<p style="margin:0 0 20px;font-size:14px;color:#6B7280;">Bonjour ${pseudo},</p>` : ""}
            <h1 style="margin:0 0 20px;font-size:20px;font-weight:700;color:#111827;">${sujet}</h1>
            ${paragraphes}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9CA3AF;line-height:1.6;">
              Tu reçois cet email car tu es inscrit à la newsletter TT-Kip.<br>
              Pour te désabonner, rends-toi dans ton <a href="https://www.tt-kip.com/profil" style="color:#D97757;text-decoration:none;">profil</a> et décoche la case newsletter.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}
