import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026reactivate"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("joueurs_pro")
    .update({ actif: true })
    .eq("actif", false)
    .select("id, nom, genre")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    success: true,
    reactivated: data?.length || 0,
    players: data?.map(j => `${j.nom} (${j.genre})`),
  })
}
