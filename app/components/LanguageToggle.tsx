"use client"

import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "@/lib/useLocale"

// Drapeau France en SVG
function FlagFR() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 20" width="28" height="19" style={{ borderRadius: "3px", display: "block" }}>
      <rect width="10" height="20" fill="#002395"/>
      <rect x="10" width="10" height="20" fill="#EDEDED"/>
      <rect x="20" width="10" height="20" fill="#ED2939"/>
    </svg>
  )
}

// Drapeau Royaume-Uni en SVG
function FlagGB() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="28" height="19" style={{ borderRadius: "3px", display: "block" }}>
      <rect width="60" height="30" fill="#012169"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#fff" strokeWidth="10"/>
      <path d="M30,0 V30 M0,15 H60" stroke="#C8102E" strokeWidth="6"/>
    </svg>
  )
}

export default function LanguageToggle() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function toggle() {
    if (locale === "fr") {
      router.push("/en" + pathname)
    } else {
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
        background: "transparent",
        border: "none",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        transition: "opacity 0.15s, transform 0.15s",
        flexShrink: 0,
        opacity: 0.85,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.opacity = "1"
        el.style.transform = "scale(1.1)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.opacity = "0.85"
        el.style.transform = "scale(1)"
      }}
    >
      {/* Affiche le drapeau de la langue CIBLE (celle vers laquelle on bascule) */}
      {locale === "fr" ? <FlagGB /> : <FlagFR />}
    </button>
  )
}
