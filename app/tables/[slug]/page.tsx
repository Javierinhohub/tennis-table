"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

const NIVEAU_COLORS: Record<string, { bg: string; color: string }> = {
  loisir:      { bg: "#F0FDF4", color: "#0E7F4F" },
  club:        { bg: "#EBF5FF", color: "#1A56DB" },
  compétition: { bg: "#FFF0EB", color: "#D97757" },
}

export default function TableDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [table, setTable] = useState<any>(null)
  const [liens, setLiens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: t } = await supabase
        .from("tables_tt")
        .select("id, marque, nom, slug, type, niveau, prix, actif")
        .eq("slug", slug)
        .eq("actif", true)
        .single()

      if (!t) { router.push("/tables"); return }
      setTable(t)

      const { data: l } = await supabase
        .from("tables_tt_liens")
        .select("id, revendeur, url")
        .eq("table_id", t.id)
        .eq("actif", true)
        .order("revendeur")
      setLiens(l || [])
      setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem", textAlign: "center", color: "var(--text-muted)" }}>
      Chargement...
    </main>
  )

  if (!table) return null

  const nc = table.niveau ? (NIVEAU_COLORS[table.niveau] || NIVEAU_COLORS.loisir) : null

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      {/* Retour */}
      <Link href="/autre-materiel?cat=tables" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "1.5rem" }}>
        ← Retour aux tables
      </Link>

      {/* En-tête */}
      <div style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", borderRadius: "14px", padding: "24px 28px", color: "#fff", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, opacity: 0.8, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "1px" }}>{table.marque}</p>
        <h1 style={{ fontSize: "26px", fontWeight: 700, marginBottom: "12px" }}>{table.nom}</h1>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {table.type && (
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 600 }}>
              {table.type === "intérieur" ? "Intérieur" : "Extérieur"}
            </span>
          )}
          {table.niveau && (
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 600 }}>
              {table.niveau.charAt(0).toUpperCase() + table.niveau.slice(1)}
            </span>
          )}
          {table.prix && (
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: "20px", padding: "4px 12px", fontSize: "12px", fontWeight: 700 }}>
              {Number(table.prix).toLocaleString("fr-FR")} €
            </span>
          )}
        </div>
      </div>

      {/* Liens revendeurs */}
      {liens.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "14px" }}>
            Où acheter
          </p>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {liens.map(l => (
              <a key={l.id} href={l.url} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "#D97757", color: "#fff", borderRadius: "8px",
                  padding: "10px 18px", fontSize: "14px", fontWeight: 600,
                  textDecoration: "none", transition: "opacity 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.85"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              >
                {l.revendeur} ↗
              </a>
            ))}
          </div>
        </div>
      )}

      {liens.length === 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px", marginBottom: "1.5rem", color: "var(--text-muted)", fontSize: "14px" }}>
          Aucun lien revendeur disponible pour cette table.
        </div>
      )}

      {/* Caractéristiques */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px 24px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
          Caractéristiques
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {[
            { label: "Marque",  value: table.marque },
            { label: "Modèle",  value: table.nom },
            { label: "Type",    value: table.type ? (table.type === "intérieur" ? "Intérieur" : "Extérieur") : "—" },
            { label: "Niveau",  value: table.niveau ? (table.niveau.charAt(0).toUpperCase() + table.niveau.slice(1)) : "—" },
            { label: "Prix",    value: table.prix ? Number(table.prix).toLocaleString("fr-FR") + " €" : "—" },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: "var(--bg)", borderRadius: "8px", padding: "12px 16px" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "4px" }}>{label}</p>
              <p style={{ fontSize: "15px", fontWeight: 600 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
