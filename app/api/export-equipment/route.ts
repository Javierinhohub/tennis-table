import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const [resH, resF] = await Promise.all([
    supabaseAdmin
      .from("joueurs_pro")
      .select("id, nom, pays, genre, classement_mondial, style, main, age, prise, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
      .eq("actif", true).eq("genre", "H").order("classement_mondial").limit(200),
    supabaseAdmin
      .from("joueurs_pro")
      .select("id, nom, pays, genre, classement_mondial, style, main, age, prise, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
      .eq("actif", true).eq("genre", "F").order("classement_mondial").limit(200),
  ])

  const joueurs = [...(resH.data || []), ...(resF.data || [])]
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(JSON.stringify(joueurs, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="joueurs_pro_backup_${date}.json"`,
    },
  })
}
