import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  // Vérifier l'auth via token Bearer
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")
  if (!token) return NextResponse.json({ error: "Non authentifié" }, { status: 401 })

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) return NextResponse.json({ error: "Token invalide" }, { status: 401 })

  // Vérifier que l'utilisateur est admin
  const { data: profil } = await supabaseAdmin
    .from("utilisateurs").select("role").eq("id", user.id).single()
  if (!profil || profil.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 })
  }

  const { id, table, action } = await req.json() as {
    id: string
    table: "notes_revetements" | "notes_bois"
    action: "valider" | "supprimer"
  }

  if (!id || !table || !["notes_revetements", "notes_bois"].includes(table)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 })
  }

  if (action === "valider") {
    const { error } = await supabaseAdmin.from(table).update({ valide: true }).eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (action === "supprimer") {
    const { error } = await supabaseAdmin.from(table).delete().eq("id", id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: "Action inconnue" }, { status: 400 })
}
