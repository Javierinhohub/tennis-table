"use client"

import { useRouter } from "next/navigation"

export default function BackButton({ fallback, label }: { fallback: string; label: string }) {
  const router = useRouter()
  return (
    <button
      onClick={() => router.back()}
      style={{
        color: "#D97757", background: "none", border: "none", cursor: "pointer",
        fontSize: "13px", fontWeight: 500, fontFamily: "Poppins, sans-serif",
        padding: 0, display: "inline-flex", alignItems: "center", gap: "4px",
        marginBottom: "1.5rem",
      }}
    >
      ← {label}
    </button>
  )
}
