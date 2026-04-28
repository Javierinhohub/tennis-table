import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase-admin"

const SECRET = "ttkip2026seed"

const PAYS_FR: Record<string, string> = {
  CHN: "Chine", JPN: "Japon", KOR: "Corée du Sud", GER: "Allemagne",
  FRA: "France", SWE: "Suède", BRA: "Brésil", EGY: "Égypte",
  IND: "Inde", USA: "États-Unis", AUS: "Australie", TPE: "Taipei",
  HKG: "Hong Kong", SGP: "Singapour", POR: "Portugal", POL: "Pologne",
  ROU: "Roumanie", SVN: "Slovénie", DEN: "Danemark", HRV: "Croatie",
  CZE: "Tchéquie", KAZ: "Kazakhstan", NGA: "Nigeria", BEL: "Belgique",
  ARG: "Argentine", CHL: "Chili", MDA: "Moldavie", HUN: "Hongrie",
  LUX: "Luxembourg", CMR: "Cameroun", BEN: "Bénin", IRN: "Iran",
  RUS: "Russie", UKR: "Ukraine", AUT: "Autriche", ESP: "Espagne",
  GBR: "Angleterre", ENG: "Angleterre", WLS: "Pays de Galles",
  PRI: "Porto Rico", MAC: "Macao", NED: "Pays-Bas", SRB: "Serbie",
  THA: "Thaïlande", ITA: "Italie", TUR: "Turquie", CAN: "Canada",
  ALG: "Algérie", DZA: "Algérie",
  China: "Chine", Japan: "Japon", "Korea Republic": "Corée du Sud",
  Germany: "Allemagne", France: "France", Sweden: "Suède",
  Brazil: "Brésil", Egypt: "Égypte", India: "Inde",
  "United States": "États-Unis", Australia: "Australie",
  "Chinese Taipei": "Taipei", "Hong Kong, China": "Hong Kong",
  Singapore: "Singapour", Portugal: "Portugal", Poland: "Pologne",
  Romania: "Roumanie", Slovenia: "Slovénie", Denmark: "Danemark",
  Croatia: "Croatie", "Czech Republic": "Tchéquie", Czechia: "Tchéquie",
  Kazakhstan: "Kazakhstan", Nigeria: "Nigeria", Belgium: "Belgique",
  Argentina: "Argentine", Chile: "Chili", Moldova: "Moldavie",
  Hungary: "Hongrie", Luxembourg: "Luxembourg", Cameroon: "Cameroun",
  Benin: "Bénin", Iran: "Iran", Russia: "Russie", Ukraine: "Ukraine",
  Austria: "Autriche", Spain: "Espagne", England: "Angleterre",
  "Puerto Rico": "Porto Rico", Macao: "Macao", Netherlands: "Pays-Bas",
  Serbia: "Serbie", Thailand: "Thaïlande", Italy: "Italie",
  Turkey: "Turquie", Canada: "Canada", Algeria: "Algérie",
}

function translateCountry(raw: string): string {
  if (!raw) return ""
  return PAYS_FR[raw.trim()] ?? raw.trim()
}

function parseRankings(data: unknown): { rang: number; nom: string; pays: string }[] {
  const items: unknown[] = Array.isArray(data)
    ? data
    : ((data as Record<string, unknown>)?.data as unknown[] | undefined) ??
      ((data as Record<string, unknown>)?.results as unknown[] | undefined) ??
      ((data as Record<string, unknown>)?.rankings as unknown[] | undefined) ??
      []

  const result: { rang: number; nom: string; pays: string }[] = []
  for (const item of items.slice(0, 200)) {
    const it = item as Record<string, unknown>
    const rang = it.rank ?? it.position ?? it.ranking ?? it.worldRanking ?? it.world_ranking
    const nom = (it.name ?? it.playerName ?? it.fullName ?? it.player_name ??
      `${it.lastName ?? ""} ${it.firstName ?? ""}`.trim()) as string
    const pays = (it.country ?? it.nationality ?? it.association ?? it.countryCode ?? "") as string

    if (rang && nom && String(rang).match(/^\d+$/)) {
      result.push({ rang: Number(rang), nom: nom.trim(), pays: pays.trim() })
    }
  }
  return result.sort((a, b) => a.rang - b.rang)
}

async function fetchOnePage(url: string): Promise<{ rang: number; nom: string; pays: string }[]> {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; TT-Kip Rankings Bot/1.0)" },
      signal: AbortSignal.timeout(15000),
    })
    if (!r.ok) return []
    const data = await r.json()
    return parseRankings(data)
  } catch {
    return []
  }
}

async function fetchTop100(genre: "ms" | "ws"): Promise<{ rang: number; nom: string; pays: string }[]> {
  const tab = genre === "ms" ? "MEN'S+SINGLES" : "WOMEN'S+SINGLES"

  // Niveau 1 : requête unique (espère 100+)
  const singleUrls = [
    `https://ranking.ittf.com/api/v1/ranking?type=${genre}&limit=200`,
    `https://ranking.ittf.com/api/v1/ranking?type=${genre}&limit=100`,
    `https://www.worldtabletennis.com/allplayersranking?Age=SENIOR&selectedTab=${tab}&pageSize=200`,
  ]
  for (const url of singleUrls) {
    const result = await fetchOnePage(url)
    if (result.length >= 80) return result
  }

  // Niveau 2 : deux pages explicites
  const paginationStrategies: [string, string][] = [
    [
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=1&pageSize=50`,
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=2&pageSize=50`,
    ],
    [
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=1&pageSize=100`,
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=2&pageSize=100`,
    ],
    [
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&limit=50&offset=0`,
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&limit=50&offset=50`,
    ],
    [
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=1`,
      `https://ranking.ittf.com/api/v1/ranking?type=${genre}&page=2`,
    ],
    [
      `https://www.worldtabletennis.com/allplayersranking?Age=SENIOR&selectedTab=${tab}&pageSize=50&page=1`,
      `https://www.worldtabletennis.com/allplayersranking?Age=SENIOR&selectedTab=${tab}&pageSize=50&page=2`,
    ],
  ]

  for (const [url1, url2] of paginationStrategies) {
    const [p1, p2] = await Promise.all([fetchOnePage(url1), fetchOnePage(url2)])
    if (!p1.length) continue
    if (p2.length) {
      const seen = new Set(p1.map(e => e.rang))
      const combined = [...p1, ...p2.filter(e => !seen.has(e.rang))]
        .sort((a, b) => a.rang - b.rang)
        .filter(e => e.rang <= 100)
      if (combined.length >= 80) return combined
    }
    if (p1.length >= 40) return p1 // fallback partiel
  }

  return []
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get("secret") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const dryRun = searchParams.get("dry") === "1"

  // 1. Récupérer les classements H et F en parallèle
  const [hommes, femmes] = await Promise.all([
    fetchTop100("ms"),
    fetchTop100("ws"),
  ])

  if (hommes.length < 10 || femmes.length < 10) {
    return NextResponse.json({
      error: "Impossible de récupérer les classements ITTF",
      hommes: hommes.length,
      femmes: femmes.length,
    }, { status: 502 })
  }

  if (dryRun) {
    return NextResponse.json({
      dry_run: true,
      hommes: hommes.length,
      femmes: femmes.length,
      top5H: hommes.slice(0, 5),
      top5F: femmes.slice(0, 5),
    })
  }

  // 2. Vider la table joueurs_pro
  const { error: deleteError } = await supabaseAdmin
    .from("joueurs_pro")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000") // supprime tout

  if (deleteError) {
    return NextResponse.json({ error: `Suppression échouée: ${deleteError.message}` }, { status: 500 })
  }

  // 3. Insérer les nouveaux joueurs
  const toInsert = [
    ...hommes.filter(j => j.rang <= 100).map(j => ({
      nom: j.nom,
      pays: translateCountry(j.pays),
      classement_mondial: j.rang,
      genre: "H",
      actif: true,
    })),
    ...femmes.filter(j => j.rang <= 100).map(j => ({
      nom: j.nom,
      pays: translateCountry(j.pays),
      classement_mondial: j.rang,
      genre: "F",
      actif: true,
    })),
  ]

  const { error: insertError } = await supabaseAdmin
    .from("joueurs_pro")
    .insert(toInsert)

  if (insertError) {
    return NextResponse.json({ error: `Insertion échouée: ${insertError.message}` }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    inserted: toInsert.length,
    hommes: hommes.filter(j => j.rang <= 100).length,
    femmes: femmes.filter(j => j.rang <= 100).length,
    sources: {
      hommes: `${hommes.length} joueurs récupérés`,
      femmes: `${femmes.length} joueuses récupérées`,
    },
  })
}
