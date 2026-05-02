import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

// Client anon pour vérifier le token de l'appelant (ne pas utiliser admin pour ça)
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    // 1. Vérif que c'est bien l'admin qui appelle
    const authHeader = req.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const { data: { user }, error: authCheckError } = await supabaseClient.auth.getUser(token)
    if (authCheckError || !user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }
    const { data: profil } = await supabaseAdmin
      .from("utilisateurs")
      .select("role")
      .eq("id", user.id)
      .single()
    if (!profil || profil.role !== "admin") {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
    }

    const { sujet, contenu, testEmail } = await req.json()

    if (!sujet || !contenu) {
      return NextResponse.json({ error: "Sujet et contenu requis" }, { status: 400 })
    }

    // 2. Mode test : envoie uniquement à testEmail
    if (testEmail) {
      const { error } = await resend.emails.send({
        from: "TT-Kip <newsletter@tt-kip.com>",
        to: [testEmail],
        subject: `[TEST] ${sujet}`,
        html: buildHtml(sujet, contenu),
      })
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ ok: true, sent: 1, mode: "test" })
    }

    // 3. Récupère les abonnés
    const { data: abonnes, error: dbError } = await supabaseAdmin
      .from("utilisateurs")
      .select("id, pseudo")
      .eq("newsletter_ok", true)

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 })
    if (!abonnes || abonnes.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    // 4. Récupère les emails depuis auth.users (avec pagination pour large audiences)
    const ids = abonnes.map((a: { id: string; pseudo: string }) => a.id)
    const emailMap: Record<string, string> = {}
    let page = 1
    const PER_PAGE = 1000
    while (true) {
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: PER_PAGE,
      })
      if (authError) return NextResponse.json({ error: authError.message }, { status: 500 })
      authData.users.forEach((u: { id: string; email?: string }) => {
        if (ids.includes(u.id) && u.email) emailMap[u.id] = u.email
      })
      if (authData.users.length < PER_PAGE) break
      page++
    }

    const destinataires = abonnes
      .filter((a: { id: string; pseudo: string }) => emailMap[a.id])
      .map((a: { id: string; pseudo: string }) => ({ email: emailMap[a.id], pseudo: a.pseudo }))

    if (destinataires.length === 0) {
      return NextResponse.json({ ok: true, sent: 0 })
    }

    // 5. Envoi en batch (max 50 par appel Resend)
    const BATCH = 50
    let sent = 0
    for (let i = 0; i < destinataires.length; i += BATCH) {
      const batch = destinataires.slice(i, i + BATCH)
      const emails = batch.map((d: { email: string; pseudo: string }) => ({
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

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

function buildHtml(sujet: string, contenu: string, pseudo?: string) {
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
