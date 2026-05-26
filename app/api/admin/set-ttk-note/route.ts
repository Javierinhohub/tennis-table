import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Mapping critère → colonne TT-Kip dans la table revetements
const REV_TTK: Record<string, string> = {
  vitesse:      "vitesse_note",
  effet:        "effet_note",
  controle:     "controle_note",
  durabilite:   "note_ttk_durabilite",
  durete:       "note_ttk_durete",
  rejet:        "note_ttk_rejet",
  qualite_prix: "note_ttk_qualite_prix",
  adherence:    "note_ttk_adherence",
  gene:         "note_ttk_gene",
  inversion:    "note_ttk_inversion",
}

// Mapping critère → colonne TT-Kip dans la table bois
const BOIS_TTK: Record<string, string> = {
  vitesse:      "note_vitesse",
  controle:     "note_controle",
  flexibilite:  "note_flexibilite",
  durete:       "note_durete",
  qualite_prix: "note_qualite_prix",
}

export async function POST(req: NextRequest) {
  // 1. Vérifier l'authentification via le token Bearer
  const authHeader = req.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")
  if (!token) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
  }

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
  if (authError || !user) {
    return NextResponse.json({ error: "Token invalide" }, { status: 401 })
  }

  // 2. Vérifier que l'utilisateur est admin
  const { data: profil } = await supabaseAdmin
    .from("utilisateurs")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profil || profil.role !== "admin") {
    return NextResponse.json({ error: "Accès réservé aux administrateurs" }, { status: 403 })
  }

  // 3. Parser le body
  const { type, produitId, criteres } = await req.json() as {
    type: "revetement" | "bois"
    produitId: string
    criteres: Record<string, number>
  }

  if (!type || !produitId || !criteres) {
    return NextResponse.json({ error: "Paramètres manquants : type, produitId, criteres" }, { status: 400 })
  }

  // 4. Construire le payload TT-Kip
  const mapping = type === "revetement" ? REV_TTK : BOIS_TTK
  const table   = type === "revetement" ? "revetements" : "bois"

  const payload: Record<string, number> = {}
  for (const [key, value] of Object.entries(criteres)) {
    const col = mapping[key]
    if (col && value >= 1 && value <= 10) {
      payload[col] = value
    }
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: "Aucun critère valide fourni" }, { status: 400 })
  }

  // 5. Mettre à jour les champs TT-Kip dans la table produit
  const { error: updateError } = await supabaseAdmin
    .from(table)
    .update(payload)
    .eq("produit_id", produitId)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    message: `✅ Notes TT-Kip mises à jour (${Object.keys(payload).length} critères)`,
    updated: payload,
  })
}
