"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const LS_KEY = "ttk_compare_rev"

interface CompareInfo { id: string; nom: string; slug: string }

export default function CompareButton({ produit }: { produit: CompareInfo }) {
  const [stored, setStored] = useState<CompareInfo | null>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(LS_KEY)
      if (raw) setStored(JSON.parse(raw))
    } catch {}
  }, [])

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <button disabled style={{
        width: "100%", padding: "10px 14px", borderRadius: "8px",
        border: "1px solid var(--border)", background: "#fff",
        fontSize: "13px", fontWeight: 600, color: "var(--text-muted)",
        cursor: "default", fontFamily: "Poppins, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        Comparer
      </button>
    )
  }

  const isCurrent = stored?.id === produit.id
  const hasOther  = stored !== null && !isCurrent

  // --- Cet article est déjà sélectionné ---
  if (isCurrent) {
    return (
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "8px", border: "1px solid #BEF264", background: "#F7FEE7" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#65A30D" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#65A30D", flex: 1 }}>Sélectionné pour la comparaison</span>
        </div>
        <button
          onClick={() => { localStorage.removeItem(LS_KEY); setStored(null) }}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontSize: "11px", color: "var(--text-muted)", textDecoration: "underline",
            textAlign: "center" as const, fontFamily: "Poppins, sans-serif",
          }}
        >
          Annuler la sélection
        </button>
      </div>
    )
  }

  // --- Un autre article est déjà sélectionné → comparer ---
  if (hasOther) {
    return (
      <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
        <button
          onClick={() => router.push(`/revetements/comparer?a=${stored!.slug}&b=${produit.slug}`)}
          style={{
            width: "100%", padding: "10px 14px", borderRadius: "8px",
            border: "none", background: "#D97757", color: "#fff",
            fontSize: "13px", fontWeight: 700, cursor: "pointer",
            fontFamily: "Poppins, sans-serif",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <span>Comparer avec&nbsp;{stored!.nom}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </button>
        <button
          onClick={() => { localStorage.setItem(LS_KEY, JSON.stringify(produit)); setStored(produit) }}
          style={{
            background: "none", border: "none", cursor: "pointer", padding: 0,
            fontSize: "11px", color: "var(--text-muted)", textDecoration: "underline",
            textAlign: "center" as const, fontFamily: "Poppins, sans-serif",
          }}
        >
          Remplacer {stored!.nom} par celui-ci
        </button>
      </div>
    )
  }

  // --- Aucun article sélectionné ---
  return (
    <button
      onClick={() => { localStorage.setItem(LS_KEY, JSON.stringify(produit)); setStored(produit) }}
      style={{
        width: "100%", padding: "10px 14px", borderRadius: "8px",
        border: "1px solid var(--border)", background: "#fff", color: "var(--text)",
        fontSize: "13px", fontWeight: 600, cursor: "pointer",
        fontFamily: "Poppins, sans-serif",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
      Comparer ce revêtement
    </button>
  )
}
