import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const TRANCHES = [
  { min: 1000, max: 1099, coeff: 1.10 },
  { min: 1100, max: 1199, coeff: 1.20 },
  { min: 1200, max: 1299, coeff: 1.35 },
  { min: 1300, max: 1399, coeff: 1.50 },
  { min: 1400, max: 1499, coeff: 1.70 },
  { min: 1500, max: 1599, coeff: 1.95 },
  { min: 1600, max: 1699, coeff: 2.25 },
  { min: 1700, max: 1799, coeff: 2.60 },
  { min: 1800, max: 1899, coeff: 3.00 },
  { min: 1900, max: 1999, coeff: 3.50 },
  { min: 2000, max: Infinity, coeff: 4.20 },
]

function getCoeff(pts: number): number {
  return TRANCHES.find(t => pts >= t.min && pts <= t.max)?.coeff ?? 1.10
}

function calcScore(start: number, end: number): number {
  let score = 0
  let current = start
  while (current < end) {
    const floor = Math.floor(current / 100) * 100
    const ceil = floor >= 2000 ? Infinity : floor + 100
    const coeff = getCoeff(current)
    const pts = Math.min(ceil, end) - current
    score += pts * coeff
    current = Math.min(ceil, end)
    if (ceil === Infinity) break
  }
  return Math.round(score * 10) / 10
}

// ── POST : nouvelle soumission ─────────────────────────────────────
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Corps invalide" }, { status: 400 })

  const { prenom, nom, instagram, age, points_debut, points_fin } = body

  // Validations
  if (!prenom?.trim() || !nom?.trim()) return NextResponse.json({ error: "Prénom et nom requis" }, { status: 400 })
  if (!age || age < 8 || age > 99) return NextResponse.json({ error: "Âge invalide" }, { status: 400 })
  if (!points_debut || points_debut < 1000) return NextResponse.json({ error: "Points de début inférieurs à 1000" }, { status: 400 })
  if (!points_fin || points_fin <= points_debut) return NextResponse.json({ error: "Les points de fin doivent être supérieurs au début" }, { status: 400 })
  if (prenom.length > 50 || nom.length > 50) return NextResponse.json({ error: "Nom trop long" }, { status: 400 })

  const score = calcScore(Number(points_debut), Number(points_fin))

  const { data, error } = await supabaseAdmin
    .from("perfometre_submissions")
    .insert({
      prenom: prenom.trim(),
      nom: nom.trim(),
      instagram: instagram?.trim().replace(/^@/, "") || null,
      age: Number(age),
      points_debut: Number(points_debut),
      points_fin: Number(points_fin),
      score,
      publie: true,
    })
    .select("token")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ token: data.token, score })
}

// ── PUT : mise à jour par le propriétaire du token ─────────────────
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: "Corps invalide" }, { status: 400 })

  const { token, prenom, nom, instagram, age, points_debut, points_fin } = body

  if (!token) return NextResponse.json({ error: "Token manquant" }, { status: 401 })

  // Vérifier que le token existe
  const { data: existing } = await supabaseAdmin
    .from("perfometre_submissions")
    .select("id")
    .eq("token", token)
    .single()

  if (!existing) return NextResponse.json({ error: "Token invalide" }, { status: 403 })

  // Validations
  if (!prenom?.trim() || !nom?.trim()) return NextResponse.json({ error: "Prénom et nom requis" }, { status: 400 })
  if (!age || age < 8 || age > 99) return NextResponse.json({ error: "Âge invalide" }, { status: 400 })
  if (!points_debut || points_debut < 1000) return NextResponse.json({ error: "Points de début inférieurs à 1000" }, { status: 400 })
  if (!points_fin || points_fin <= points_debut) return NextResponse.json({ error: "Les points de fin doivent être supérieurs au début" }, { status: 400 })

  const score = calcScore(Number(points_debut), Number(points_fin))

  const { error } = await supabaseAdmin
    .from("perfometre_submissions")
    .update({
      prenom: prenom.trim(),
      nom: nom.trim(),
      instagram: instagram?.trim().replace(/^@/, "") || null,
      age: Number(age),
      points_debut: Number(points_debut),
      points_fin: Number(points_fin),
      score,
    })
    .eq("token", token)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ score })
}
