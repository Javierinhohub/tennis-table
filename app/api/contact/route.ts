import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { nom, email, sujet, message } = await req.json()

  if (!nom || !email || !message) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 })
  }

  try {
    const { Resend } = await import("resend")
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { error } = await resend.emails.send({
      from: "TT-Kip Contact <onboarding@resend.dev>",
      to: "ttkip.pro@gmail.com",
      replyTo: email,
      subject: `[TT-Kip] ${sujet || "Nouveau message de " + nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #D97757; padding: 20px; border-radius: 8px 8px 0 0;">
            <h2 style="color: white; margin: 0;">Nouveau message TT-Kip</h2>
          </div>
          <div style="background: #f9f9f9; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #eee;">
            <p><strong>Nom :</strong> ${nom}</p>
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Sujet :</strong> ${sujet || "—"}</p>
            <hr style="border: 1px solid #eee; margin: 16px 0;" />
            <p><strong>Message :</strong></p>
            <p style="line-height: 1.7; color: #333;">${message.replace(/\n/g, "<br>")}</p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 16px;">
            Message envoyé depuis tt-kip.com
          </p>
        </div>
      `,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })

  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
