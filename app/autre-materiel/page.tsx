"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense } from "react"

const SOUS_CATS = {
  balles: { label: "Balles", slug_prefix: "balles" },
  colles: { label: "Colles", slug_prefix: "colles" },
  chaussures: { label: "Chaussures", slug_prefix: "chaussures" },
}

function AutreMatérielContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const cat = (searchParams.get("cat") || "balles") as keyof typeof SOUS_CATS
  const [produits, setProduits] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [marqueFilter, setMarqueFilter] = useState("")
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from("marques").select("id, nom").order("nom").then(({ data }) => setMarques(data || []))
  }, [])

  useEffect(() => {
    setSearch("")
    setMarqueFilter("")
    fetchData("", "")
  }, [cat])

  async function fetchData(s: string, m: string) {
    setLoading(true)
    let query = supabase
      .from("produits")
      .select("id, nom, slug, marques(nom)", { count: "exact" })
      .eq("actif", true)
      .order("nom")
      .limit(100)

    const { data: subcats } = await supabase.from("sous_categories").select("id, slug").ilike("slug", cat + "%")
    const subcatIds = (subcats || []).map((sc: any) => sc.id)
    if (subcatIds.length > 0) query = query.in("subcategory_id", subcatIds)
    if (s) query = query.ilike("nom", "%" + s + "%")
    if (m) query = query.eq("marque_id", m)

    const { data, count } = await query
    setProduits(data || [])
    setTotal(count || 0)
    setLoading(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => fetchData(search, marqueFilter), 400)
    return () => clearTimeout(timer)
  }, [search, marqueFilter])

  const setCategory = (c: string) => router.push("/autre-materiel?cat=" + c)

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Autre matériel</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Balles, colles et chaussures de tennis de table</p>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "1.5rem" }}>
        {Object.entries(SOUS_CATS).map(([key, val]) => (
          <button key={key} onClick={() => setCategory(key)}
            style={{ background: cat === key ? "#D97757" : "#fff", color: cat === key ? "#fff" : "var(--text-muted)", border: "1px solid " + (cat === key ? "#D97757" : "var(--border)"), borderRadius: "8px", padding: "8px 18px", fontSize: "14px", fontWeight: cat === key ? 600 : 400, cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "all 0.15s" }}>
            {val.label}
          </button>
        ))}
      </div>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "1.5rem", display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <input type="text" placeholder={"Rechercher " + SOUS_CATS[cat].label.toLowerCase() + "..."} value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 2, minWidth: "200px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif" }} />
        <select value={marqueFilter} onChange={e => setMarqueFilter(e.target.value)}
          style={{ flex: 1, minWidth: "150px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", outline: "none", color: "var(--text)", fontFamily: "Poppins, sans-serif" }}>
          <option value="">Toutes les marques</option>
          {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
        </select>
        {(search || marqueFilter) && (
          <button onClick={() => { setSearch(""); setMarqueFilter("") }}
            style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "13px", color: "var(--text-muted)", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            Réinitialiser
          </button>
        )}
      </div>

      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "1rem" }}>
        {loading ? "Chargement..." : total + " résultat" + (total !== 1 ? "s" : "")}
      </p>

      {!loading && produits.length === 0 && (
        <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
          Aucun produit trouvé.
        </div>
      )}

      {produits.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden", opacity: loading ? 0.6 : 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nom</th>
                <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p, i) => (
                <tr key={p.id}
                  onClick={() => window.location.href = "/" + cat + "/" + p.slug}
                  style={{ borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none", cursor: "pointer", transition: "background 0.1s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
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