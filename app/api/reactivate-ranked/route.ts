import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026ranked"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Réactiver les joueurs archivés qui ont encore un classement_mondial (dernier rang connu)
  const { data: joueurs, error: fetchError } = await supabaseAdmin
    .from("joueurs_pro")
    .select("id, nom, genre, classement_mondial")
    .eq("actif", false)
    .not("classement_mondial", "is", null)

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 })
  if (!joueurs || joueurs.length === 0) {
    return NextResponse.json({ success: true, reactivated: 0, message: "Aucun joueur archivé avec rang connu" })
  }

  const ids = joueurs.map((j: any) => j.id)

  const { error: updateError } = await supabaseAdmin
    .from("joueurs_pro")
    .update({ actif: true })
    .in("id", ids)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    reactivated: joueurs.length,
    players: joueurs.map((j: any) => `${j.nom} (${j.genre}) #${j.classement_mondial}`),
  })
}
