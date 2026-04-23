"use client"

import { useEffect } from "react"

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main style={{ maxWidth: "560px", margin: "0 auto", padding: "6rem 2rem", textAlign: "center" as const, fontFamily: "Poppins, sans-serif" }}>
      <div style={{ fontSize: "48px", marginBottom: "1rem" }}>⚠️</div>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>Une erreur est survenue</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem", lineHeight: 1.6 }}>
        Quelque chose s'est mal passé. Tu peux réessayer ou revenir à l'accueil.
      </p>
      <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}
        >
          Réessayer
        </button>
        <a href="/" style={{ background: "var(--bg)", color: "var(--text)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
          Accueil
        </a>
      </div>
    </main>
  )
}
