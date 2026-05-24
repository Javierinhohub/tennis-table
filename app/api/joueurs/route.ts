import { supabaseAdmin } from "@/lib/supabase-admin"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// ── Rate limiting en mémoire (par IP) ────────────────────────────────────────
// Max 10 requêtes par minute par IP
const WINDOW_MS = 60_000
const MAX_REQUESTS = 10
const ipStore = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = ipStore.get(ip)
  if (!entry || now > entry.resetAt) {
    ipStore.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_REQUESTS) return false
  entry.count++
  return true
}

// Nettoyage périodique pour éviter les fuites mémoire
setInterval(() => {
  const now = Date.now()
  for (const [ip, entry] of ipStore) {
    if (now > entry.resetAt) ipStore.delete(ip)
  }
}, 5 * 60_000)

// ── User-Agents de scrapers connus ───────────────────────────────────────────
const BLOCKED_UA_PATTERNS = [
  /python-urllib/i, /python-requests/i, /scrapy/i, /httpx/i,
  /go-http-client/i, /java\//i, /curl\//i, /wget\//i,
  /axios\//i, /node-fetch/i, /got\//i, /undici/i,
  /bot/i, /crawler/i, /spider/i, /scraper/i,
  /headlesschrome/i, /phantomjs/i, /selenium/i, /puppeteer/i,
  /playwright/i, /mechanize/i,
]

function isBlockedUA(ua: string | null): boolean {
  if (!ua || ua.length < 10) return true
  return BLOCKED_UA_PATTERNS.some(p => p.test(ua))
}

// ── Handler ───────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  // 1. Vérification User-Agent
  const ua = req.headers.get("user-agent")
  if (isBlockedUA(ua)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // 2. Vérification Referer — doit venir du site lui-même
  const referer = req.headers.get("referer") || ""
  const origin = req.headers.get("origin") || ""
  const fromSite = referer.includes("tt-kip.com") || origin.includes("tt-kip.com")
    || referer.includes("localhost") || origin.includes("localhost")
  if (!fromSite) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 })
  }

  // 3. Rate limiting par IP
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown"
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429, headers: { "Retry-After": "60" } }
    )
  }

  // 4. Récupération des données
  const [resH, resF, resBrands] = await Promise.all([
    supabaseAdmin
      .from("joueurs_pro")
      .select("id, nom, pays, classement_mondial, genre, style, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type")
      .eq("actif", true)
      .eq("genre", "H")
      .not("classement_mondial", "is", null)
      .order("classement_mondial")
      .limit(200),
    supabaseAdmin
      .from("joueurs_pro")
      .select("id, nom, pays, classement_mondial, genre, style, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type")
      .eq("actif", true)
      .eq("genre", "F")
      .not("classement_mondial", "is", null)
      .order("classement_mondial")
      .limit(200),
    supabaseAdmin.from("marques").select("nom"),
  ])

  const joueurs = [...(resH.data || []), ...(resF.data || [])]
  const marques = (resBrands.data || []).map((m: any) => m.nom)

  // 5. Map type revêtement (requêtes uniquement si nécessaire)
  const nomsRev = [...new Set(
    joueurs.flatMap(j => [j.revetement_cd, j.revetement_rv].filter(Boolean))
  )]
  let typeMap: Record<string, string> = {}
  if (nomsRev.length > 0) {
    const { data: revData } = await supabaseAdmin
      .from("produits")
      .select("nom, revetements!inner(type_revetement)")
      .in("nom", nomsRev)
      .limit(200)
    if (revData) {
      revData.forEach((p: any) => {
        if (p.revetements?.type_revetement) {
          typeMap[p.nom] = p.revetements.type_revetement
        }
      })
    }
  }

  return NextResponse.json(
    { joueurs, marques, typeMap },
    {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
      },
    }
  )
}
