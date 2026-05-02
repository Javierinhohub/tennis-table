import { supabaseAdmin } from "@/lib/supabase-admin"
import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(req: NextRequest) {
  // Vérification admin obligatoire
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
