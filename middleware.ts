import { NextRequest, NextResponse } from "next/server"

const RATE_LIMIT_MAP = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 60 * 1000

function rateLimit(ip: string): boolean {
  const now = Date.now()
  const record = RATE_LIMIT_MAP.get(ip)
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    RATE_LIMIT_MAP.set(ip, { count: 1, timestamp: now })
    return true
  }
  if (record.count >= RATE_LIMIT_MAX) return false
  record.count++
  return true
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Rate limiting sur les routes auth
  if (pathname.startsWith("/auth") || pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    if (!rateLimit(ip)) {
      return new NextResponse("Trop de requêtes. Réessayez dans une minute.", {
        status: 429,
        headers: { "Content-Type": "text/plain; charset=utf-8", "Retry-After": "60" }
      })
    }
  }

  // Bloquer les user agents suspects
  const userAgent = request.headers.get("user-agent") || ""
  const suspiciousAgents = ["sqlmap", "nikto", "nmap", "masscan", "zgrab"]
  if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
    return new NextResponse("Accès refusé.", { status: 403 })
  }

  // Protéger les routes admin
  if (pathname.startsWith("/admin")) {
    const referer = request.headers.get("referer") || ""
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
  }

  // Headers de sécurité supplémentaires
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|favicon.svg).*)"],
}