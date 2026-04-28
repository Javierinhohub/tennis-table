import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026cleanup"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Archiver les joueurs actifs dont le classement > 50 (données obsolètes)
  const { data, error } = await supabaseAdmin
    .from("joueurs_pro")
    .update({ actif: false, classement_mondial: null })
    .eq("actif", true)
    .gt("classement_mondial", 50)
    .select("id, nom, genre, classement_mondial")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    archived: data?.length || 0,
    players: data?.map(j => `${j.nom} (${j.genre}) ex-#${j.classement_mondial}`),
  })
}
