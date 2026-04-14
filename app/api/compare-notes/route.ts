import { createClient } from "@supabase/supabase-js"
import { NextRequest, NextResponse } from "next/server"

// Client admin côté serveur — contourne le RLS pour lire toutes les notes
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const ids = searchParams.get("ids")?.split(",").filter(Boolean) || []
  const type = searchParams.get("type") // "revetement" | "bois"

  if (!ids.length || !type) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 })
  }

  const table = type === "revetement" ? "notes_revetements" : "notes_bois"

  const selectCols = type === "revetement"
    ? "produit_id, note_vitesse, note_effet, note_controle, note_durabilite, note_durete_mousse, note_rejet, note_qualite_prix, note_globale"
    : "produit_id, note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix, note_globale"

  const detailsSelect = type === "revetement"
    ? "id, nom, marques(nom), revetements(type_revetement, epaisseur_max, poids)"
    : "id, nom, marques(nom), bois(style, nb_plis, poids_g, composition)"

  const [{ data: notesRows, error: notesError }, { data: details, error: detailsError }] = await Promise.all([
    supabaseAdmin.from(table).select(selectCols).in("produit_id", ids),
    supabaseAdmin.from("produits").select(detailsSelect).in("id", ids),
  ])

  if (notesError || detailsError) {
    return NextResponse.json({ error: notesError?.message || detailsError?.message }, { status: 500 })
  }

  return NextResponse.json({ notes: notesRows || [], details: details || [] })
}
