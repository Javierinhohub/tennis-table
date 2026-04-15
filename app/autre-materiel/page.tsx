"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

const SOUS_CATS = {
  tables:     { label: "Tables" },
  balles:     { label: "Balles" },
  colles:     { label: "Colles" },
  chaussures: { label: "Chaussures" },
}

type Cat = keyof typeof SOUS_CATS

const NIVEAU_COLORS: Record<string, { bg: string; color: string }> = {
  loisir:      { bg: "#F0FDF4", color: "#0E7F4F" },
  club:        { bg: "#EBF5FF", color: "#1A56DB" },
  compétition: { bg: "#FFF0EB", color: "#D97757" },
}

function AutreMatérielContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cat = (searchParams.get("cat") || "tables") as Cat

  const [items, setItems] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")   // pour les tables
  const [niveauFilter, setNiveauFilter] = useState("") // pour les tables
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  // Reset filtres au changement d'onglet
  useEffect(() => {
    setSearch(""); setMarqueFilter(""); setTypeFilter(""); setNiveauFilter("")
  }, [cat])

  // Chargement des marques (pour les onglets produits)
  useEffect(() => {
    if (cat !== "tables") {
      supabase.from("marques").select("id, nom").order("nom").then(({ data }) => setMarques(data || []))
    }
  }, [cat])

  // Chargement des données
  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 350)
    return () => clearTimeout(timer)
  }, [cat, search, marqueFilter, typeFilter, niveauFilter])

  async function fetchData() {
    setLoading(true)

    if (cat === "tables") {
      // Données depuis tables_tt
      let q = supabase
        .from("tables_tt")
        .select("id, marque, nom, type, niveau, prix", { count: "exact" })
        .eq("actif", true)
        .order("marque").order("nom")
        .limit(500)
      if (search) q = q.or(`nom.ilike.%${search}%,marque.ilike.%${search}%`)
      if (marqueFilter) q = q.eq("marque", marqueFilter)
      if (typeFilter) q = q.eq("type", typeFilter)
      if (niveauFilter) q = q.eq("niveau", niveauFilter)
      const { data, count } = await q
      setItems(data || [])
      setTotal(count || 0)

      // Marques distinctes pour les tables
      if (!marques.length || marqueFilter === "") {
        const { data: all } = await supabase
          .from("tables_tt").select("marque").eq("actif", true).order("marque")
        if (all) setMarques([...new Set(all.map((r: any) => r.marque))].map(m => ({ id: m, nom: m })))
      }
    } else {
      // Données depuis produits
      let query = supabase
        .from("produits")
        .select("id, nom, slug, marques(nom)", { count: "exact" })
        .eq("actif", true).order("nom").limit(100)
      const { data: subcats } = await supabase
        .from("sous_categories").select("id, slug").ilike("slug", cat + "%")
      const subcatIds = (subcats || []).map((sc: any) => sc.id)
      if (subcatIds.length > 0) query = query.in("subcategory_id", subcatIds)
      if (search) query = query.ilike("nom", "%" + search + "%")
      if (marqueFilter) query = query.eq("marque_id", marqueFilter)
      const { data, count } = await query
      setItems(data || [])
      setTotal(count || 0)
    }
    setLoading(false)
  }

  const setCategory = (c: string) => router.push("/autre-materiel?cat=" + c)
  const hasFilter = !!(search || marqueFilter || typeFilter || niveauFilter)
  const resetFilters = () => { setSearch(""); setMarqueFilter(""); setTypeFilter(""); setNiveauFilter("") }

  const inp: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", outline: "none",
    color: "var(--text)", fontFamily: "Poppins, sans-serif",
  }

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Autre matériel</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
          Tables, balles, colles et chaussures de tennis de table
        </p>
      </div>

      {/* Onglets catégories */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        {Object.entries(SOUS_CATS).map(([key, val]) => (
          <button key={key} onClick={() => setCategory(key)}
            style={{
              background: cat === key ? "#D97757" : "#fff",
              color: cat === key ? "#fff" : "var(--text-muted)",
              border: "1px solid " + (cat === key ? "#D97757" : "var(--border)"),
              borderRadius: "8px", padding: "8px 18px", fontSize: "14px",
              fontWeight: cat === key ? 600 : 400, cursor: "pointer",
              fontFamily: "Poppins, sans-serif", transition: "all 0.15s",
            }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Barre de filtres */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input type="text"
          placeholder={`Rechercher ${SOUS_CATS[cat].label.toLowerCase()}...`}
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, flex: 2, minWidth: "200px", boxSizing: "border-box" }} />

        {/* Filtre marque */}
        <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "150px" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>

        {/* Filtres spécifiques aux tables */}
        {cat === "tables" && <>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ ...inp, flex: 1, minWidth: "150px" }}>
            <option value="">Int. & Ext.</option>
            <option value="intérieur">Intérieur</option>
            <option value="extérieur">Extérieur</option>
          </select>
          <select value={niveauFilter} onChange={e => setNiveauFilter(e.target.value)}
            style={{ ...inp, flex: 1, minWidth: "140px" }}>
            <option value="">Tous niveaux</option>
            <option value="loisir">Loisir</option>
            <option value="club">Club</option>
            <option value="compétition">Compétition</option>
          </select>
        </>}

        {hasFilter && (
          <button onClick={resetFilters}
            style={{ ...inp, background: "var(--bg)", color: "var(--text-muted)", cursor: "pointer" }}>
            Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading ? "Chargement..." : `${total} résultat${total !== 1 ? "s" : ""}`}
      </p>

      {!loading && items.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun produit trouvé.
        </div>
      )}

      {items.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", opacity: loading ? 0.6 : 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                {cat === "tables" ? (
                  <>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Modèle</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Type</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Niveau</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Prix</th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nom</th>
                    <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {cat === "tables" ? items.map((t, i) => {
                const nc = NIVEAU_COLORS[t.niveau] || NIVEAU_COLORS.loisir
                return (
                  <tr key={t.id}
                    style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                  >
                    <td style={{ padding: "12px 16px", fontWeight: 600, fontSize: "14px", color: "#D97757" }}>{t.marque}</td>
                    <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{t.nom}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "10px", background: t.type === "intérieur" ? "#F5F0FF" : "#FFF0EB", color: t.type === "intérieur" ? "#7C3AED" : "#D97757" }}>
                        {t.type === "intérieur" ? "Intérieur" : "Extérieur"}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "10px", background: nc.bg, color: nc.color }}>
                        {t.niveau.charAt(0).toUpperCase() + t.niveau.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 700, fontSize: "14px", color: t.prix ? "var(--text)" : "var(--text-muted)" }}>
                      {t.prix ? t.prix.toLocaleString("fr-FR") + " €" : "—"}
                    </td>
                  </tr>
                )
              }) : items.map((p, i) => (
                <tr key={p.id}
                  onClick={() => window.location.href = "/" + cat + "/" + p.slug}
                  style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                >
                  <td style={{ padding: "12px 16px", fontWeight: 500, fontSize: "14px" }}>{p.nom}</td>
                  <td style={{ padding: "12px 16px", color: "var(--text-muted)", fontSize: "14px" }}>{p.marques?.nom}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

export default function AutreMatérielPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>}>
      <AutreMatérielContent />
    </Suspense>
  )
}
