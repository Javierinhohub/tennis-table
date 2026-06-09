"use client"

import { useEffect, useRef } from "react"

interface AdBannerProps {
  slot: string                          // data-ad-slot depuis le dashboard AdSense
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  style?: React.CSSProperties
  className?: string
}

/**
 * Composant AdSense réutilisable.
 * Publisher ID : ca-pub-5536128858087793
 *
 * Pour créer une unité de pub :
 * AdSense → Annonces → Par unité → Annonces display → Copier le data-ad-slot
 */
export default function AdBanner({ slot, format = "auto", style, className }: AdBannerProps) {
  const ref = useRef<HTMLModElement>(null)
  const pushed = useRef(false)

  useEffect(() => {
    // Ne pusher qu'une seule fois par montage
    if (pushed.current) return
    pushed.current = true
    try {
      // @ts-ignore
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense non encore chargé ou bloqué par adblock
    }
  }, [])

  return (
    <div
      className={className}
      style={{
        overflow: "hidden",
        textAlign: "center",
        ...style,
      }}
    >
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5536128858087793"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
