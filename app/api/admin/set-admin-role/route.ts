import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

// POST /api/admin/set-admin-role?secret=ttkip-seed-2026
// Body : { email: "ttkip.pro@gmail.com" }
// Passe le rôle "admin" dans la table utilisateurs pour l'utilisateur donné.

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== "ttkip-seed-2026") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const { email } = await req.json()
  if (!email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 })
  }

  // 1. Trouver l'utilisateur Supabase Auth par email
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
  if (listError) {
    return NextResponse.json({ error: listError.message }, { status: 500 })
  }

  const authUser = users.find(u => u.email?.toLowerCase() === email.toLowerCase())
  if (!authUser) {
    return NextResponse.json({ error: `Aucun compte Supabase Auth trouvé pour : ${email}` }, { status: 404 })
  }

  // 2. Mettre à jour (ou insérer) le rôle dans la table utilisateurs
  const { error: upsertError } = await supabaseAdmin
    .from("utilisateurs")
    .upsert({ id: authUser.id, role: "admin" }, { onConflict: "id" })

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `✅ Compte ${email} (${authUser.id}) passé en admin avec succès.`,
  })
}
