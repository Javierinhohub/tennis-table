import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { cookies } from "next/headers"

// ── GET : classement complet ───────────────────────────────────────
// Accessible si : token valide dans query params OU session admin
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get("token")

  let hasAccess = false
  let ownId: string | null = null

  // 1. Vérifier session admin (cookie de session)
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("tt_session")?.value
  if (sessionToken) {
    const { data: sessionUser } = await supabaseAdmin
      .from("utilisateurs")
      .select("role")
      .eq("session_token", sessionToken)
      .single()
    if (sessionUser?.role === "admin") hasAccess = true
  }

  // 2. Vérifier token participant
  if (!hasAccess && token) {
    const { data: entry } = await supabaseAdmin
      .from("perfometre_submissions")
      .select("id")
      .eq("token", token)
      .single()
    if (entry) {
      hasAccess = true
      ownId = entry.id
    }
  }

  if (!hasAccess) return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from("perfometre_submissions")
    .select("id, prenom, nom, instagram, age, points_debut, points_fin, score, publie, cree_le")
    .eq("publie", true)
    .order("score", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Masquer le nom complet côté public — garder seulement initiale
  const entries = (data || []).map((e: any) => ({
    id: e.id,
    prenom: e.prenom,
    nom_initial: e.nom.charAt(0).toUpperCase() + ".",
    instagram: e.instagram,
    age: e.age,
    points_debut: e.points_debut,
    points_fin: e.points_fin,
    progression: e.points_fin - e.points_debut,
    score: e.score,
    publie: e.publie,
    cree_le: e.cree_le,
    is_own: ownId ? e.id === ownId : false,
  }))

  return NextResponse.json({ entries })
}
