"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import PolarChart, { PolarAxis } from "@/app/components/PolarChart"

type Props = {
  produitId: string
  ttkVitesse?: number | null
  ttkControle?: number | null
  ttkFlexibilite?: number | null
  ttkDurete?: number | null
  ttkQualitePrix?: number | null
}

const AXES_DEF = [
  { key: "note_vitesse",      label: "Vitesse",    ttkKey: "ttkVitesse" },
  { key: "note_controle",     label: "Contrôle",   ttkKey: "ttkControle" },
  { key: "note_flexibilite",  label: "Flexibilité",ttkKey: "ttkFlexibilite" },
  { key: "note_durete",       label: "Dureté",     ttkKey: "ttkDurete" },
  { key: "note_qualite_prix", label: "Q/Prix",     ttkKey: "ttkQualitePrix" },
]

export default function NotesBoisChart({ produitId, ttkVitesse, ttkControle, ttkFlexibilite, ttkDurete, ttkQualitePrix }: Props) {
  const [axes, setAxes] = useState<PolarAxis[]>([])

  const ttkProps: Record<string, number | null | undefined> = {
    ttkVitesse, ttkControle, ttkFlexibilite, ttkDurete, ttkQualitePrix,
  }

  useEffect(() => {
    fetchAverages()
    // Écoute l'événement émis par AvisSectionBois après une nouvelle note
    const handler = () => fetchAverages()
    window.addEventListener("notes_bois_updated", handler)
    return () => window.removeEventListener("notes_bois_updated", handler)
  }, [produitId])

  async function fetchAverages() {
    const { data } = await supabase
      .from("notes_bois")
      .select("note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix")
      .eq("produit_id", produitId)

    const avg = (field: string) => {
      if (!data || data.length === 0) return null
      const vals = data.filter((d: any) => d[field] != null).map((d: any) => d[field])
      return vals.length ? Math.round(vals.reduce((s: number, v: number) => s + v, 0) / vals.length * 10) / 10 : null
    }

    const built: PolarAxis[] = AXES_DEF.map(ax => ({
      label: ax.label,
      ttk: ttkProps[ax.ttkKey] ?? null,
      users: avg(ax.key),
    }))

    setAxes(built)
  }

  const hasTTK   = axes.some(a => a.ttk)
  const hasUsers = axes.some(a => a.users)

  if (!hasTTK && !hasUsers) return null

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1.5rem", marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "1.2rem" }}>
        Profil de performance
      </h2>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <PolarChart axes={axes} size={260} showMarque={false} />
        <div style={{ display: "flex", gap: "16px", marginTop: "10px", fontSize: "11px", fontWeight: 600 }}>
          {hasTTK   && <span style={{ color: "#1A56DB", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#1A56DB", borderRadius: "2px", display: "inline-block" }} />TT-Kip</span>}
          {hasUsers && <span style={{ color: "#0E7F4F", display: "flex", alignItems: "center", gap: "5px" }}><span style={{ width: "10px", height: "3px", background: "#0E7F4F", borderRadius: "2px", display: "inline-block" }} />Utilisateurs</span>}
        </div>
      </div>
    </div>
  )
}
