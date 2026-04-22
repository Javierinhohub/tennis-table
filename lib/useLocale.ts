"use client"

import { usePathname } from "next/navigation"

export type Locale = "fr" | "en"

export function useLocale(): Locale {
  const pathname = usePathname()
  // The user is on /en/... or exactly /en
  if (pathname.startsWith("/en/") || pathname === "/en") return "en"
  return "fr"
}
