"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const PAGE_SIZE = 50

const TYPE_REV: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Long: "Picots longs", Anti: "Anti-spin"
}
const STYLES_BOIS = ["OFF+", "OFF", "OFF-", "ALL+", "ALL", "ALL-", "DEF+", "DEF", "DEF-"]

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

  // Produit sélectionné pour édition
  const [selected, setSelected] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  // Champs éditables — revêtements
  const [rPrix, setRPrix] = useState("")
  const [rPoids, setRPoids] = useState("")
  const [rEpaisseur, setREpaisseur] = useState("")
  const [rVitesse, setRVitesse] = useState("")
  const [rEffet, setREffet] = useState("")
  const [rControle, setRControle] = useState("")
  const [rType, setRType] = useState("")
  const [rLarc, setRLarc] = useState("")

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
    fetchProduits()
  }

  useEffect(() => {
    setPage(0)
    setSelected(null)
  }, [tab, search])

  useEffect(() => {
    fetchProduits()
  }, [tab, page, search])

  async function fetchProduits() {
    setLoading(true)
    const from = page * PAGE_SIZE
    if (tab === "revetements") {
      let q = supabase
        .from("produits")
        .select("id, nom, slug, actif, marques(id, nom), revetements!inner(id, type_revetement, prix, vitesse_note, effet_note, controle_note, poids, epaisseur_max, numero_larc)", { count: "exact" })
        .eq("actif", true)
        .order("nom")
        .range(from, from + PAGE_SIZE - 1)
      if (search) q = q.ilike("nom", `%${search}%`)
      const { data, count } = await q
      setProduits(data || [])
      setTotal(count || 0)
    } else {
      let q = supabase
        .from("produits")
        .select("id, nom, slug, actif, marques(id, nom), bois!inner(id, style, nb_plis, poids_g, epaisseur_mm, composition, prix, note_vitesse, note_controle, note_flexibilite, note_durete, note_qualite_prix)", { count: "exact" })
        .eq("actif", true)
        .order("nom")
        .range(from, from + PAGE_SIZE - 1)
      if (search) q = q.ilike("nom", `%${search}%`)
      const { data, count } = await q
      setProduits(data || [])
      setTotal(count || 0)
    }
    setLoading(false)
  }

  function selectionner(p: any) {
    setSelected(p)
    setMessage("")
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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSaving(true)
    setMessage("")

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

  function Field({ label, value, onChange, type = "text", step }: { label: string, value: string, onChange: (v: string) => void, type?: string, step?: string }) {
    return (
      <div>
        <label style={lbl}>{label}</label>
        <input type={type} step={step} value={value} onChange={e => onChange(e.target.value)} style={inp} placeholder="—" />
      </div>
    )
  }

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
          {/* Recherche */}
          <div style={{ position: "relative", marginBottom: "1rem" }}>
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
                              <span style={{ background: r.type_revetement === "In" ? "#EBF5FF" : "#FFF7ED", color: r.type_revetement === "In" ? "#1A56DB" : "#D97757", padding: "1px 6px", borderRadius: "6px", fontWeight: 600, fontSize: "11px" }}>
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
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
