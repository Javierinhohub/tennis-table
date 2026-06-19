"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 50

const TYPE_REV: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin"
}
const STYLES_BOIS = ["OFF+", "OFF", "OFF-", "ALL+", "ALL", "ALL-", "DEF+", "DEF", "DEF-"]

const inp: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
  padding: "9px 12px", fontSize: "14px", width: "100%",
  fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box",
}
const lbl: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 600,
  color: "var(--text-muted)", marginBottom: "4px",
  textTransform: "uppercase", letterSpacing: "0.4px",
}

// Défini HORS du composant pour éviter la perte de focus à chaque frappe
function Field({ label, value, onChange, type = "text", step }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; step?: string
}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} style={inp} placeholder="—" />
    </div>
  )
}

export default function AdminProduitsPage() {
  const router = useRouter()

  const [tab, setTab] = useState<"revetements" | "bois">("revetements")
  const [produits, setProduits] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  // Filtre marque
  const [brands, setBrands] = useState<{ id: string; nom: string }[]>([])
  const [filterBrand, setFilterBrand] = useState<string | null>(null)

  // Produit sélectionné pour édition
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Champs communs — image + description
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")

  // Champs éditables — revêtements
  const [rPrix, setRPrix] = useState("")
  const [rPoids, setRPoids] = useState("")
  const [rEpaisseur, setREpaisseur] = useState("")
  const [rVitesse, setRVitesse] = useState("")
  const [rEffet, setREffet] = useState("")
  const [rControle, setRControle] = useState("")
  const [rType, setRType] = useState("")
  const [rLarc, setRLarc] = useState("")

  // Associations TT-Kip
  const [assocList, setAssocList] = useState<any[]>([])
  const [assocQuery, setAssocQuery] = useState("")
  const [assocResults, setAssocResults] = useState<any[]>([])
  const [assocSearching, setAssocSearching] = useState(false)

  // FAQ produit
  const [faqList, setFaqList] = useState<any[]>([])
  const [faqNewQ, setFaqNewQ] = useState("")
  const [faqNewA, setFaqNewA] = useState("")
  const [faqEditId, setFaqEditId] = useState<string | null>(null)
  const [faqEditQ, setFaqEditQ] = useState("")
  const [faqEditA, setFaqEditA] = useState("")

  // Champs éditables — bois
  const [bPrix, setBPrix] = useState("")
  const [bStyle, setBStyle] = useState("")
  const [bPlis, setBPlis] = useState("")
  const [bPoids, setBPoids] = useState("")
  const [bEpaisseur, setBEpaisseur] = useState("")
  const [bCompo, setBCompo] = useState("")
  const [bVitesse, setBVitesse] = useState("")
  const [bControle, setBControle] = useState("")
  const [bFlexibilite, setBFlexibilite] = useState("")
  const [bDurete, setBDurete] = useState("")
  const [bQP, setBQP] = useState("")

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    // Charger la liste des marques une seule fois
    const { data: marqData } = await supabase.from("marques").select("id, nom").order("nom")
    setBrands(marqData || [])
    fetchProduits()
  }

  useEffect(() => {
    setPage(0)
    setSelected(null)
  }, [tab, search, filterBrand])

  useEffect(() => {
    fetchProduits()
  }, [tab, page, search, filterBrand])

  async function fetchProduits() {
    setLoading(true)
    const from = page * PAGE_SIZE
    if (tab === "revetements") {
      let q = supabase
        .from("produits")
        .select("id, nom, slug, actif, image_url, marques(id, nom), revetements!inner(id, type_revetement, prix, vitesse_note, effet_note, controle_note, poids, epaisseur_max, numero_larc)", { count: "exact" })
        .eq("actif", true)
        .order("nom")
        .range(from, from + PAGE_SIZE - 1)
      if (search) q = q.ilike("nom", `%${search}%`)
      if (filterBrand) q = q.eq("marque_id", filterBrand)
      const { data, count } = await q
      setProduits(data || [])
      setTotal(count || 0)
    } else {
      let q = supabase
        .from("produits")
        .select("id, nom, slug, actif, image_url, marques(id, nom), bois!inner(id, style, nb_plis, poids_g, epaisseur_mm, composition, prix, note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix)", { count: "exact" })
        .eq("actif", true)
        .order("nom")
        .range(from, from + PAGE_SIZE - 1)
      if (search) q = q.ilike("nom", `%${search}%`)
      if (filterBrand) q = q.eq("marque_id", filterBrand)
      const { data, count } = await q
      setProduits(data || [])
      setTotal(count || 0)
    }
    setLoading(false)
  }

  async function loadFaq(produitId: string) {
    const { data } = await supabase
      .from("faq_produits")
      .select("id, question, reponse, ordre")
      .eq("produit_id", produitId)
      .order("ordre")
    setFaqList(data || [])
  }

  async function addFaqItem() {
    if (!selected || !faqNewQ.trim() || !faqNewA.trim()) return
    const { error } = await supabase.from("faq_produits").insert({
      produit_id: selected.id,
      question: faqNewQ.trim(),
      reponse: faqNewA.trim(),
      ordre: faqList.length,
    })
    if (!error) { setFaqNewQ(""); setFaqNewA(""); await loadFaq(selected.id) }
  }

  async function deleteFaqItem(id: string) {
    await supabase.from("faq_produits").delete().eq("id", id)
    if (selected) await loadFaq(selected.id)
  }

  function startEditFaq(f: any) {
    setFaqEditId(f.id); setFaqEditQ(f.question); setFaqEditA(f.reponse)
  }

  async function saveEditFaq(id: string) {
    if (!faqEditQ.trim() || !faqEditA.trim()) return
    await supabase.from("faq_produits").update({ question: faqEditQ.trim(), reponse: faqEditA.trim() }).eq("id", id)
    setFaqEditId(null)
    if (selected) await loadFaq(selected.id)
  }

  async function loadAssociations(id: string) {
    const [{ data: d1 }, { data: d2 }] = await Promise.all([
      supabase.from("associations_produits").select("id, produit_associe_id").eq("produit_id", id),
      supabase.from("associations_produits").select("id, produit_id").eq("produit_associe_id", id),
    ])
    const items = [
      ...(d1 || []).map((a: any) => ({ assocId: a.id, otherId: a.produit_associe_id })),
      ...(d2 || []).map((a: any) => ({ assocId: a.id, otherId: a.produit_id })),
    ]
    if (items.length === 0) { setAssocList([]); return }
    const { data: prods } = await supabase
      .from("produits")
      .select("id, nom, slug, image_url, marques(nom), revetements(type_revetement), bois(style)")
      .in("id", items.map(i => i.otherId))
    setAssocList(items.map(i => {
      const p = (prods || []).find((p: any) => p.id === i.otherId)
      return p ? { ...p, assocId: i.assocId } : null
    }).filter(Boolean))
  }

  async function searchAssoc(q: string) {
    if (!q.trim()) { setAssocResults([]); return }
    setAssocSearching(true)
    const { data } = await supabase
      .from("produits")
      .select("id, nom, marques(nom), revetements(type_revetement), bois(style)")
      .ilike("nom", `%${q}%`)
      .limit(6)
    // Exclure le produit courant et les associations déjà existantes
    const excludeIds = new Set([selected?.id, ...assocList.map((a: any) => a.id)])
    setAssocResults((data || []).filter((r: any) => !excludeIds.has(r.id)))
    setAssocSearching(false)
  }

  async function addAssoc(otherId: string) {
    if (!selected) return
    const { error } = await supabase
      .from("associations_produits")
      .insert({ produit_id: selected.id, produit_associe_id: otherId })
    if (!error) { setAssocQuery(""); setAssocResults([]); await loadAssociations(selected.id) }
  }

  async function removeAssoc(assocId: string) {
    await supabase.from("associations_produits").delete().eq("id", assocId)
    if (selected) await loadAssociations(selected.id)
  }

  function selectionner(p: any) {
    setSelected(p)
    setMessage("")
    setAssocQuery("")
    setAssocResults([])
    setFaqNewQ("")
    setFaqNewA("")
    setFaqEditId(null)
    loadAssociations(p.id)
    loadFaq(p.id)
    setImageUrl(p.image_url || "")
    setDescription(p.description || "")
    if (tab === "revetements") {
      const r = p.revetements
      setRPrix(r?.prix != null ? String(r.prix) : "")
      setRPoids(r?.poids || "")
      setREpaisseur(r?.epaisseur_max != null ? String(r.epaisseur_max) : "")
      setRVitesse(r?.vitesse_note != null ? String(r.vitesse_note) : "")
      setREffet(r?.effet_note != null ? String(r.effet_note) : "")
      setRControle(r?.controle_note != null ? String(r.controle_note) : "")
      setRType(r?.type_revetement || "In")
      setRLarc(r?.numero_larc || "")
    } else {
      const b = p.bois
      setBPrix(b?.prix != null ? String(b.prix) : "")
      setBStyle(b?.style || "")
      setBPlis(b?.nb_plis != null ? String(b.nb_plis) : "")
      setBPoids(b?.poids_g != null ? String(b.poids_g) : "")
      setBEpaisseur(b?.epaisseur_mm || "")
      setBCompo(b?.composition || "")
      setBVitesse(b?.note_vitesse != null ? String(b.note_vitesse) : "")
      setBControle(b?.note_controle != null ? String(b.note_controle) : "")
      setBFlexibilite(b?.note_flexibilite != null ? String(b.note_flexibilite) : "")
      setBDurete(b?.note_durete != null ? String(b.note_durete) : "")
      setBQP(b?.note_qualite_prix != null ? String(b.note_qualite_prix) : "")
    }
  }

  async function handleDelete() {
    if (!selected) return
    const confirm1 = window.confirm(`Supprimer "${selected.nom}" ?\n\nToutes les notes et avis associés seront également supprimés.`)
    if (!confirm1) return
    const confirm2 = window.confirm(`Confirmation finale : supprimer définitivement "${selected.nom}" ?`)
    if (!confirm2) return

    setMessage("")
    // Suppression des données liées avant le produit
    const table = tab === "revetements" ? "notes_revetements" : "notes_bois"
    await supabase.from("avis").delete().eq("produit_id", selected.id)
    await supabase.from(table).delete().eq("produit_id", selected.id)
    if (tab === "revetements") {
      await supabase.from("revetements").delete().eq("produit_id", selected.id)
    } else {
      await supabase.from("bois").delete().eq("produit_id", selected.id)
    }
    const { error } = await supabase.from("produits").delete().eq("id", selected.id)
    if (error) {
      setMessage("Erreur : " + error.message)
    } else {
      setSelected(null)
      await fetchProduits()
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSaving(true)
    setMessage("")

    // Mise à jour image_url + description dans produits (commun aux deux types)
    const { error: imgErr } = await supabase
      .from("produits")
      .update({ image_url: imageUrl.trim() || null, description: description.trim() || null })
      .eq("id", selected.id)
    if (imgErr) { setMessage("Erreur image/description : " + imgErr.message); setSaving(false); return }

    if (tab === "revetements") {
      const payload: any = {
        type_revetement: rType || null,
        numero_larc: rLarc || null,
        poids: rPoids || null,
        epaisseur_max: rEpaisseur ? parseFloat(rEpaisseur) : null,
        vitesse_note: rVitesse ? parseFloat(rVitesse) : null,
        effet_note: rEffet ? parseFloat(rEffet) : null,
        controle_note: rControle ? parseFloat(rControle) : null,
        prix: rPrix ? parseFloat(rPrix) : null,
      }
      const { error } = await supabase.from("revetements").update(payload).eq("produit_id", selected.id)
      if (error) setMessage("Erreur : " + error.message)
      else { setMessage("Modifications enregistrées !"); await fetchProduits() }
    } else {
      const payload: any = {
        style: bStyle || null,
        nb_plis: bPlis ? parseInt(bPlis) : null,
        poids_g: bPoids ? parseFloat(bPoids) : null,
        epaisseur_mm: bEpaisseur || null,
        composition: bCompo || null,
        note_vitesse: bVitesse ? parseFloat(bVitesse) : null,
        note_controle: bControle ? parseFloat(bControle) : null,
        note_flexibilite: bFlexibilite ? parseFloat(bFlexibilite) : null,
        note_durete: bDurete ? parseFloat(bDurete) : null,
        note_qualite_prix: bQP ? parseFloat(bQP) : null,
        prix: bPrix ? parseFloat(bPrix) : null,
      }
      const { error } = await supabase.from("bois").update(payload).eq("produit_id", selected.id)
      if (error) setMessage("Erreur : " + error.message)
      else { setMessage("Modifications enregistrées !"); await fetchProduits() }
    }
    setSaving(false)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        ← Retour à l'administration
      </a>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Gestion des produits</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {total.toLocaleString("fr-FR")} {tab === "revetements" ? "revêtements" : "bois"} — page {page + 1}/{Math.max(1, totalPages)}
          </p>
        </div>

        {/* Onglets type */}
        <div style={{ display: "flex", gap: "0", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          {(["revetements", "bois"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: "9px 20px", border: "none", cursor: "pointer",
                background: tab === t ? "#D97757" : "#fff",
                color: tab === t ? "#fff" : "var(--text-muted)",
                fontSize: "13px", fontWeight: 600, fontFamily: "Poppins, sans-serif",
              }}>
              {t === "revetements" ? "Revêtements" : "Bois"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Liste produits ── */}
        <div>
          {/* Recherche + filtre marque */}
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder={`Rechercher un ${tab === "revetements" ? "revêtement" : "bois"}...`}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") setSearch(searchInput) }}
              style={{ ...inp, paddingRight: "40px" }}
            />
            <button
              onClick={() => setSearch(searchInput)}
              style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "#D97757", border: "none", borderRadius: "6px", color: "#fff", padding: "4px 10px", cursor: "pointer", fontSize: "12px", fontWeight: 600 }}>
              OK
            </button>
          </div>

          {/* Filtre par marque */}
          {brands.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "5px", marginBottom: "12px" }}>
              {filterBrand && (
                <button onClick={() => setFilterBrand(null)}
                  style={{ padding: "3px 10px", borderRadius: "20px", border: "1px solid #FECACA", background: "#FEF2F2", color: "#DC2626", fontSize: "11px", fontWeight: 700, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                  ✕ Effacer
                </button>
              )}
              {brands.map(b => (
                <button key={b.id} onClick={() => setFilterBrand(filterBrand === b.id ? null : b.id)}
                  style={{
                    padding: "3px 10px", borderRadius: "20px", border: "1px solid", fontSize: "11px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "Poppins, sans-serif",
                    background: filterBrand === b.id ? "#D97757" : "#fff",
                    color: filterBrand === b.id ? "#fff" : "var(--text-muted)",
                    borderColor: filterBrand === b.id ? "#D97757" : "var(--border)",
                  }}>
                  {b.nom}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)", background: "#fff", borderRadius: "10px", border: "1px solid var(--border)" }}>
              Chargement...
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                    {tab === "revetements"
                      ? ["Nom", "Marque", "Type", "Prix", "Vitesse", "Effet", "Contrôle"].map(h => (
                          <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                        ))
                      : ["Nom", "Marque", "Style", "Plis", "Prix", "Vitesse", "Contrôle"].map(h => (
                          <th key={h} style={{ padding: "9px 12px", textAlign: "left", fontSize: "10px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {produits.map((p, i) => {
                    const isSelected = selected?.id === p.id
                    const r = p.revetements
                    const b = p.bois
                    return (
                      <tr key={p.id}
                        onClick={() => selectionner(p)}
                        style={{
                          borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none",
                          cursor: "pointer",
                          background: isSelected ? "#FFF0EB" : "transparent",
                          borderLeft: isSelected ? "3px solid #D97757" : "3px solid transparent",
                        }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--bg)" }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent" }}
                      >
                        {tab === "revetements" ? <>
                          <td style={{ padding: "9px 12px", fontWeight: 500, fontSize: "13px" }}>{p.nom}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{p.marques?.nom}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px" }}>
                            {r?.type_revetement && (
                              <span style={{ background: r.type_revetement === "In" ? "#EBF5FF" : r.type_revetement === "Mid" ? "#F5F0FF" : r.type_revetement === "Long" ? "#F0FDF4" : "#FFF7ED", color: r.type_revetement === "In" ? "#1A56DB" : r.type_revetement === "Mid" ? "#7C3AED" : r.type_revetement === "Long" ? "#0E7F4F" : "#D97757", padding: "1px 6px", borderRadius: "6px", fontWeight: 600, fontSize: "11px" }}>
                                {TYPE_REV[r.type_revetement] || r.type_revetement}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", fontWeight: r?.prix ? 600 : 400, color: r?.prix ? "#D97757" : "var(--text-muted)" }}>{r?.prix ? r.prix + " €" : "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{r?.vitesse_note || "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{r?.effet_note || "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{r?.controle_note || "—"}</td>
                        </> : <>
                          <td style={{ padding: "9px 12px", fontWeight: 500, fontSize: "13px" }}>{p.nom}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{p.marques?.nom}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px" }}>
                            {b?.style && (
                              <span style={{ background: b.style.startsWith("OFF") ? "#FFF0EB" : b.style.startsWith("DEF") ? "#F0FDF4" : "#EBF5FF", color: b.style.startsWith("OFF") ? "#D97757" : b.style.startsWith("DEF") ? "#0E7F4F" : "#1A56DB", padding: "1px 6px", borderRadius: "6px", fontWeight: 600, fontSize: "11px" }}>
                                {b.style}
                              </span>
                            )}
                          </td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{b?.nb_plis ? b.nb_plis + " plis" : "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", fontWeight: b?.prix ? 600 : 400, color: b?.prix ? "#D97757" : "var(--text-muted)" }}>{b?.prix ? b.prix + " €" : "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{b?.note_vitesse || "—"}</td>
                          <td style={{ padding: "9px 12px", fontSize: "12px", color: "var(--text-muted)" }}>{b?.note_controle || "—"}</td>
                        </>}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "1rem", flexWrap: "wrap" }}>
              <button onClick={() => setPage(0)} disabled={page === 0}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "12px" }}>«</button>
              <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "#fff", cursor: page === 0 ? "not-allowed" : "pointer", fontSize: "12px" }}>← Préc.</button>
              <span style={{ padding: "6px 14px", fontSize: "12px", color: "var(--text-muted)" }}>
                {page + 1} / {totalPages}
              </span>
              <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                style={{ padding: "6px 14px", borderRadius: "6px", border: "1px solid var(--border)", background: "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: "12px" }}>Suiv. →</button>
              <button onClick={() => setPage(totalPages - 1)} disabled={page >= totalPages - 1}
                style={{ padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: "#fff", cursor: page >= totalPages - 1 ? "not-allowed" : "pointer", fontSize: "12px" }}>»</button>
            </div>
          )}
        </div>

        {/* ── Panneau édition ── */}
        <div style={{ position: "sticky", top: "20px" }}>
          {!selected ? (
            <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "14px" }}>Cliquez sur un produit pour l'éditer</p>
            </div>
          ) : (
            <form onSubmit={handleSave}>
              {/* Header produit */}
              <div style={{ background: "linear-gradient(135deg, #D97757, #C4694A)", borderRadius: "10px", padding: "14px 18px", marginBottom: "12px", color: "#fff" }}>
                <p style={{ fontWeight: 700, fontSize: "16px", marginBottom: "2px" }}>{selected.nom}</p>
                <p style={{ fontSize: "12px", opacity: 0.85 }}>{selected.marques?.nom}</p>
              </div>

              {message && (
                <div style={{
                  background: message.startsWith("Erreur") ? "#FEF2F2" : "#ECFDF5",
                  border: `1px solid ${message.startsWith("Erreur") ? "#FECACA" : "#A7F3D0"}`,
                  color: message.startsWith("Erreur") ? "#DC2626" : "#065F46",
                  borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", fontSize: "13px", fontWeight: 500,
                }}>
                  {message}
                </div>
              )}

              {/* ── Image ── */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "10px" }}>Photo produit</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  {/* Miniature */}
                  <div style={{ width: "64px", height: "64px", flexShrink: 0, border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                    ) : (
                      <span style={{ fontSize: "10px", color: "var(--text-muted)", textAlign: "center" as const }}>Pas d'image</span>
                    )}
                  </div>
                  {/* Champ URL */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label style={lbl}>URL de l'image</label>
                    <input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
                      placeholder="https://…"
                      style={{ ...inp, fontSize: "12px" }} />
                    {imageUrl && (
                      <button type="button" onClick={() => setImageUrl("")}
                        style={{ marginTop: "6px", fontSize: "11px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "Poppins, sans-serif" }}>
                        Supprimer l'image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Description SEO ── */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", marginBottom: "12px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.4px", marginBottom: "8px" }}>
                  Description (intro SEO — 150-300 mots)
                </p>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={6}
                  maxLength={3000}
                  placeholder="Présentation du produit (150-300 mots). Affiché en haut de la fiche produit, indexé par Google."
                  style={{ ...inp, resize: "vertical" as const, lineHeight: 1.6 }}
                />
                <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                  {description.length} / 3000 caractères
                </p>
              </div>

              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>

                {tab === "revetements" ? (<>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={lbl}>Type</label>
                      <select value={rType} onChange={e => setRType(e.target.value)} style={inp}>
                        {Object.entries(TYPE_REV).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                    <Field label="Code LARC" value={rLarc} onChange={setRLarc} />
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Prix & Caractéristiques</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <Field label="Prix (€)" value={rPrix} onChange={setRPrix} type="number" step="0.01" />
                      <Field label="Poids" value={rPoids} onChange={setRPoids} />
                      <Field label="Épaisseur max (mm)" value={rEpaisseur} onChange={setREpaisseur} type="number" step="0.1" />
                    </div>
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A56DB", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Notes TT-Kip (/10)</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      <Field label="Vitesse" value={rVitesse} onChange={setRVitesse} type="number" step="0.1" />
                      <Field label="Effet" value={rEffet} onChange={setREffet} type="number" step="0.1" />
                      <Field label="Contrôle" value={rControle} onChange={setRControle} type="number" step="0.1" />
                    </div>
                  </div>
                </>) : (<>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={lbl}>Style</label>
                      <select value={bStyle} onChange={e => setBStyle(e.target.value)} style={inp}>
                        <option value="">—</option>
                        {STYLES_BOIS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <Field label="Nombre de plis" value={bPlis} onChange={setBPlis} type="number" />
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Prix & Dimensions</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <Field label="Prix (€)" value={bPrix} onChange={setBPrix} type="number" step="0.01" />
                      <Field label="Poids (g)" value={bPoids} onChange={setBPoids} type="number" step="0.1" />
                      <Field label="Épaisseur (mm)" value={bEpaisseur} onChange={setBEpaisseur} />
                    </div>
                  </div>

                  <div>
                    <label style={lbl}>Composition</label>
                    <textarea value={bCompo} onChange={e => setBCompo(e.target.value)} rows={2}
                      style={{ ...inp, resize: "vertical" }} placeholder="Ex: Arylate Carbon, Hinoki..." />
                  </div>

                  <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#1A56DB", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>Notes TT-Kip (/10)</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <Field label="Vitesse" value={bVitesse} onChange={setBVitesse} type="number" step="0.1" />
                      <Field label="Contrôle" value={bControle} onChange={setBControle} type="number" step="0.1" />
                      <Field label="Flexibilité" value={bFlexibilite} onChange={setBFlexibilite} type="number" step="0.1" />
                      <Field label="Dureté" value={bDurete} onChange={setBDurete} type="number" step="0.1" />
                      <Field label="Qualité/Prix" value={bQP} onChange={setBQP} type="number" step="0.1" />
                    </div>
                  </div>
                </>)}
              </div>

              <button type="submit" disabled={saving}
                style={{
                  width: "100%", marginTop: "12px",
                  background: "#D97757", color: "#fff", border: "none", borderRadius: "8px",
                  padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                  fontFamily: "Poppins, sans-serif", opacity: saving ? 0.7 : 1,
                }}>
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>

              <a href={`/${tab === "revetements" ? "revetements" : "bois"}/${selected.slug}`} target="_blank"
                style={{ display: "block", textAlign: "center", marginTop: "8px", fontSize: "12px", color: "var(--text-muted)", textDecoration: "none" }}>
                Voir la fiche →
              </a>

              {/* ── Associations TT-Kip ── */}
              <div style={{ marginTop: "16px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D97757">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#D97757", textTransform: "uppercase" as const, letterSpacing: "0.4px", margin: 0 }}>
                    Associations TT-Kip
                  </p>
                </div>

                {assocList.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>Aucune association pour l&apos;instant.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "5px", marginBottom: "12px" }}>
                    {assocList.map((a: any) => {
                      const isRev = !!(a.revetements)
                      return (
                        <div key={a.assocId} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "7px 10px", background: "var(--bg)", borderRadius: "6px", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: isRev ? "#EBF5FF" : "#FFF0EB", color: isRev ? "#1A56DB" : "#D97757", flexShrink: 0 }}>
                            {isRev ? "REV" : "BOIS"}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: "12px", fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>{a.nom}</p>
                            <p style={{ fontSize: "10px", color: "var(--text-muted)", margin: "1px 0 0" }}>{(a.marques as any)?.nom}</p>
                          </div>
                          <button type="button" onClick={() => removeAssoc(a.assocId)}
                            style={{ flexShrink: 0, background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "4px", padding: "3px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                            Retirer
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}

                <div style={{ position: "relative" as const }}>
                  <input
                    type="text"
                    placeholder="Rechercher un bois ou revêtement à associer…"
                    value={assocQuery}
                    onChange={e => { setAssocQuery(e.target.value); searchAssoc(e.target.value) }}
                    style={{ ...inp, fontSize: "12px" }}
                  />
                  {assocSearching && (
                    <span style={{ position: "absolute" as const, right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "var(--text-muted)" }}>…</span>
                  )}
                </div>

                {assocResults.length > 0 && (
                  <div style={{ marginTop: "4px", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "#fff" }}>
                    {assocResults.map((r: any, i: number) => {
                      const isRev = !!(r.revetements)
                      return (
                        <button key={r.id} type="button" onClick={() => addAssoc(r.id)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center", gap: "8px",
                            padding: "8px 10px", background: "transparent", border: "none",
                            borderBottom: i < assocResults.length - 1 ? "1px solid var(--border)" : "none",
                            cursor: "pointer", textAlign: "left" as const, fontFamily: "Poppins, sans-serif",
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span style={{ fontSize: "9px", fontWeight: 700, padding: "1px 5px", borderRadius: "3px", background: isRev ? "#EBF5FF" : "#FFF0EB", color: isRev ? "#1A56DB" : "#D97757", flexShrink: 0 }}>
                            {isRev ? "REV" : "BOIS"}
                          </span>
                          <span style={{ fontSize: "12px", fontWeight: 600, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, color: "var(--text)" }}>{r.nom}</span>
                          <span style={{ fontSize: "11px", color: "var(--text-muted)", flexShrink: 0 }}>{(r.marques as any)?.nom}</span>
                          <span style={{ fontSize: "11px", color: "#D97757", fontWeight: 700, flexShrink: 0 }}>+ Ajouter</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ── FAQ ── */}
              <div style={{ marginTop: "16px", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0E7F4F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#0E7F4F", textTransform: "uppercase" as const, letterSpacing: "0.4px", margin: 0 }}>
                    FAQ — Questions fréquentes
                  </p>
                </div>

                {/* Liste des questions existantes */}
                {faqList.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "12px" }}>Aucune question pour l&apos;instant.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px", marginBottom: "14px" }}>
                    {faqList.map((f: any) => (
                      faqEditId === f.id ? (
                        <div key={f.id} style={{ background: "var(--bg)", borderRadius: "8px", padding: "10px", border: "1px solid #BEF264" }}>
                          <input
                            value={faqEditQ} onChange={e => setFaqEditQ(e.target.value)}
                            style={{ ...inp, marginBottom: "6px", fontSize: "12px" }}
                            placeholder="Question"
                          />
                          <textarea
                            value={faqEditA} onChange={e => setFaqEditA(e.target.value)}
                            rows={4} style={{ ...inp, resize: "vertical" as const, fontSize: "12px" }}
                            placeholder="Réponse"
                          />
                          <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                            <button type="button" onClick={() => saveEditFaq(f.id)}
                              style={{ flex: 1, background: "#0E7F4F", color: "#fff", border: "none", borderRadius: "6px", padding: "7px", fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                              Sauvegarder
                            </button>
                            <button type="button" onClick={() => setFaqEditId(null)}
                              style={{ background: "var(--border)", border: "none", borderRadius: "6px", padding: "7px 12px", fontSize: "12px", cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                              Annuler
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={f.id} style={{ background: "var(--bg)", borderRadius: "8px", padding: "9px 10px", border: "1px solid var(--border)" }}>
                          <p style={{ fontSize: "12px", fontWeight: 700, margin: "0 0 3px", color: "var(--text)" }}>{f.question}</p>
                          <p style={{ fontSize: "11px", color: "var(--text-muted)", margin: 0, lineHeight: 1.5,
                            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                            {f.reponse}
                          </p>
                          <div style={{ display: "flex", gap: "5px", marginTop: "7px" }}>
                            <button type="button" onClick={() => startEditFaq(f)}
                              style={{ flex: 1, background: "#EBF5FF", color: "#1A56DB", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                              ✏ Modifier
                            </button>
                            <button type="button" onClick={() => deleteFaqItem(f.id)}
                              style={{ background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "4px", padding: "4px 8px", fontSize: "11px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                )}

                {/* Ajouter une question */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", margin: "0 0 8px" }}>
                    Ajouter une question
                  </p>
                  <input
                    value={faqNewQ} onChange={e => setFaqNewQ(e.target.value)}
                    style={{ ...inp, marginBottom: "6px", fontSize: "12px" }}
                    placeholder="Ex : Ce revêtement convient-il aux débutants ?"
                  />
                  <textarea
                    value={faqNewA} onChange={e => setFaqNewA(e.target.value)}
                    rows={4} style={{ ...inp, resize: "vertical" as const, fontSize: "12px" }}
                    placeholder="Réponse complète…"
                  />
                  <button type="button" onClick={addFaqItem}
                    disabled={!faqNewQ.trim() || !faqNewA.trim()}
                    style={{
                      width: "100%", marginTop: "6px", background: "#0E7F4F", color: "#fff",
                      border: "none", borderRadius: "6px", padding: "8px", fontSize: "12px",
                      fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif",
                      opacity: (!faqNewQ.trim() || !faqNewA.trim()) ? 0.45 : 1,
                    }}>
                    + Ajouter cette question
                  </button>
                </div>
              </div>

              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                <button type="button" onClick={handleDelete}
                  style={{ width: "100%", background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                  🗑 Supprimer ce {tab === "revetements" ? "revêtement" : "bois"}
                </button>
                <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "6px" }}>
                  Supprime le produit et toutes ses données associées (notes, avis).
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
