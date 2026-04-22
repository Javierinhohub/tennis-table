import { NextRequest, NextResponse } from "next/server"

const PUBLIC_FILE = /\.(.*)$/
const LOCALES = ["en", "fr"]
const DEFAULT_LOCALE = "fr"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip static files, API routes, Next.js internals
  if (
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth")
  ) {
    return NextResponse.next()
  }

  // Detect if URL has /en/ prefix
  const pathnameLocale = LOCALES.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameLocale === "en") {
    // Strip /en prefix for internal routing and set header
    const newPathname = pathname.replace(/^\/en/, "") || "/"
    const url = request.nextUrl.clone()
    url.pathname = newPathname
    const response = NextResponse.rewrite(url)
    response.headers.set("x-locale", "en")
    return response
  }

  // Default: French, just pass through
  const response = NextResponse.next()
  response.headers.set("x-locale", "fr")
  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-image.jpg|robots.txt|sitemap.xml).*)",
  ],
}
