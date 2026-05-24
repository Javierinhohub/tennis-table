import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Numéro de semaine ISO (lundi = jour 1)
function isoWeek(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`
}

// ── GET : vérification / GET check=true ──────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== "ttkip-seed-2026") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const currentWeek = isoWeek(new Date())

  // Cherche la dernière mise à jour de classement
  const { data } = await supabaseAdmin
    .from("joueurs_pro")
    .select("updated_at")
    .not("classement_mondial", "is", null)
    .order("updated_at", { ascending: false })
    .limit(1)
    .single()

  const lastUpdateWeek = data?.updated_at ? isoWeek(new Date(data.updated_at)) : null
  const alreadyUpdated = lastUpdateWeek === currentWeek

  return NextResponse.json({
    already_updated: alreadyUpdated,
    current_week: currentWeek,
    last_update_week: lastUpdateWeek,
    last_update_at: data?.updated_at ?? null,
    message: alreadyUpdated
      ? `✅ Classement déjà à jour cette semaine (${currentWeek})`
      : `⏳ Mise à jour nécessaire — dernière MAJ : ${lastUpdateWeek ?? "inconnue"}`,
  })
}

// ── POST : mise à jour des classements ───────────────────────────────────────
export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== "ttkip-seed-2026") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
  }

  const body = await req.json()
  // Format attendu : { rankings: { H: [{rank: 1, nom: "..."}, ...], F: [...] } }
  const { rankings } = body as {
    rankings: { H: { rank: number; nom: string }[]; F: { rank: number; nom: string }[] }
  }

  if (!rankings?.H || !rankings?.F) {
    return NextResponse.json({ error: "Format invalide : { rankings: { H: [...], F: [...] } }" }, { status: 400 })
  }

  // Charge tous les joueurs existants
  const { data: joueurs, error: fetchError } = await supabaseAdmin
    .from("joueurs_pro")
    .select("id, nom, classement_mondial, genre")
    .eq("actif", true)

  if (fetchError || !joueurs) {
    return NextResponse.json({ error: fetchError?.message ?? "Impossible de charger les joueurs" }, { status: 500 })
  }

  function normalize(s: string) {
    return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z\s]/g, "").trim()
  }

  const changes: { nom: string; old: number | null; new: number }[] = []
  const notFound: string[] = []
  let updated = 0

  for (const genre of ["H", "F"] as const) {
    for (const { rank, nom } of rankings[genre]) {
      const normNom = normalize(nom)
      const match = joueurs.find(j =>
        j.genre === genre && normalize(j.nom).includes(normNom.split(" ")[0])
        || normalize(j.nom) === normNom
      )

      if (!match) {
        notFound.push(`[${genre}] ${nom} (rang ${rank})`)
        continue
      }

      if (match.classement_mondial === rank) continue // pas de changement

      const { error } = await supabaseAdmin
        .from("joueurs_pro")
        .update({ classement_mondial: rank })
        .eq("id", match.id)

      if (!error) {
        changes.push({ nom: match.nom, old: match.classement_mondial, new: rank })
        updated++
      }
    }
  }

  return NextResponse.json({
    status: "updated",
    week: isoWeek(new Date()),
    updated,
    changes,
    not_found: notFound,
    message: `✅ ${updated} joueur(s) mis à jour pour la semaine ${isoWeek(new Date())}`,
  })
}
