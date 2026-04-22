"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "@/lib/useLocale"

export default function LanguageToggle() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    if (locale === "fr") {
      // Switch to English: prefix path with /en
      router.push("/en" + pathname)
    } else {
      // Switch to French: remove /en prefix
      const newPath = pathname.replace(/^\/en/, "") || "/"
      router.push(newPath)
    }
  }

  return (
    <button
      onClick={toggle}
      title={locale === "fr" ? "Switch to English" : "Passer en français"}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 700,
        color: "var(--text-muted)",
        letterSpacing: "0.3px",
        fontFamily: "Poppins, sans-serif",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        transition: "background 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = "#FFF0EB"
        el.style.color = "#D97757"
        el.style.borderColor = "#D97757"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.background = "var(--bg)"
        el.style.color = "var(--text-muted)"
        el.style.borderColor = "var(--border)"
      }}
    >
      {locale === "fr" ? "EN" : "FR"}
    </button>
  )
}
