import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

async function getAdminUser(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "")
  if (!token) return null
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) return null
  const { data: profil } = await supabaseAdmin
    .from("utilisateurs").select("role").eq("id", user.id).single()
  return profil?.role === "admin" ? user : null
}

// GET — liste toutes les soumissions
export async function GET(req: NextRequest) {
  const user = await getAdminUser(req)
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  const { data, error } = await supabaseAdmin
    .from("perfometre_submissions")
    .select("*")
    .order("score", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ entries: data })
}

// PATCH — modifier une entrée
export async function PATCH(req: NextRequest) {
  const user = await getAdminUser(req)
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body?.id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })

  const { id, ...fields } = body

  if (fields.points_debut !== undefined && fields.points_fin !== undefined) {
    fields.score = calcScore(Number(fields.points_debut), Number(fields.points_fin))
  }

  const { error } = await supabaseAdmin
    .from("perfometre_submissions")
    .update(fields)
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — supprimer une entrée
export async function DELETE(req: NextRequest) {
  const user = await getAdminUser(req)
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 403 })

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 })

  const { error } = await supabaseAdmin
    .from("perfometre_submissions")
    .delete()
    .eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// ── Score ──────────────────────────────────────────────────────────
const TRANCHES = [
  { min: 1000, max: 1099, coeff: 1.10 }, { min: 1100, max: 1199, coeff: 1.20 },
  { min: 1200, max: 1299, coeff: 1.35 }, { min: 1300, max: 1399, coeff: 1.50 },
  { min: 1400, max: 1499, coeff: 1.70 }, { min: 1500, max: 1599, coeff: 1.95 },
  { min: 1600, max: 1699, coeff: 2.25 }, { min: 1700, max: 1799, coeff: 2.60 },
  { min: 1800, max: 1899, coeff: 3.00 }, { min: 1900, max: 1999, coeff: 3.50 },
  { min: 2000, max: Infinity, coeff: 4.20 },
]
function getCoeff(pts: number) { return TRANCHES.find(t => pts >= t.min && pts <= t.max)?.coeff ?? 1.10 }
function calcScore(start: number, end: number): number {
  let score = 0, current = start
  while (current < end) {
    const floor = Math.floor(current / 100) * 100
    const ceil = floor >= 2000 ? Infinity : floor + 100
    const pts = Math.min(ceil, end) - current
    score += pts * getCoeff(current)
    current = Math.min(ceil, end)
    if (ceil === Infinity) break
  }
  return Math.round(score * 10) / 10
}
