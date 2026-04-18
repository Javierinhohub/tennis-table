"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export default function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0, above: true })
  const btnRef = useRef<HTMLButtonElement>(null)

  function computePosition() {
    if (!btnRef.current) return null
    const rect = btnRef.current.getBoundingClientRect()
    const W = 220
    const margin = 12
    const vw = typeof window !== "undefined" ? window.innerWidth : 375

    // Centre horizontalement sur le bouton, clamped dans le viewport
    let x = rect.left + rect.width / 2 - W / 2
    x = Math.max(margin, Math.min(x, vw - W - margin))

    // Affiche au-dessus si assez de place, sinon en-dessous
    const above = rect.top > 130
    const y = above ? rect.top - 8 : rect.bottom + 8

    return { x, y, above }
  }

  function show() {
    const pos = computePosition()
    if (pos) { setCoords(pos); setVisible(true) }
  }
  function hide() { setVisible(false) }
  function toggle(e: React.MouseEvent | React.TouchEvent) {
    e.stopPropagation()
    visible ? hide() : show()
  }

  // Ferme au clic/tap en dehors
  useEffect(() => {
    if (!visible) return
    function onOutside(e: PointerEvent) {
      if (btnRef.current && !btnRef.current.contains(e.target as Node)) hide()
    }
    document.addEventListener("pointerdown", onOutside)
    return () => document.removeEventListener("pointerdown", onOutside)
  }, [visible])

  const tooltipStyle: React.CSSProperties = {
    position: "fixed",
    left: coords.x,
    top: coords.above ? undefined : coords.y,
    bottom: coords.above ? `calc(100dvh - ${coords.y}px)` : undefined,
    transform: coords.above ? "translateY(-100%)" : "none",
    background: "#1F2937",
    color: "#F9FAFB",
    borderRadius: "8px",
    padding: "10px 12px",
    fontSize: "12px",
    lineHeight: 1.55,
    width: "220px",
    maxWidth: "calc(100vw - 24px)",
    zIndex: 9999,
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
    pointerEvents: "none",
  }

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: "4px", verticalAlign: "middle" }}>
      <button
        ref={btnRef}
        type="button"
        aria-label="En savoir plus"
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={toggle}
        style={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          background: "#E5E7EB",
          border: "none",
          cursor: "pointer",
          fontSize: "9px",
          fontWeight: 700,
          color: "#6B7280",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >?</button>

      {visible && typeof document !== "undefined" && createPortal(
        <div style={tooltipStyle}>{text}</div>,
        document.body
      )}
    </span>
  )
}
