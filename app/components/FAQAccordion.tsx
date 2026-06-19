"use client"

import { useState } from "react"

export interface FAQItem { q: string; a: string }

export default function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!items.length) return null

  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h2 style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: 0 }}>
          Questions fréquentes
        </h2>
      </div>

      <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer",
                textAlign: "left" as const, fontFamily: "Poppins, sans-serif", gap: "12px",
              }}
            >
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text)", lineHeight: 1.4, flex: 1 }}>
                {item.q}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke="#D97757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, marginTop: "2px", transform: open === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}
              >
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {open === i && (
              <div style={{ padding: "0 16px 16px 16px", borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: "14px", lineHeight: 1.75, color: "var(--text)", margin: "12px 0 0" }}>
                  {item.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
