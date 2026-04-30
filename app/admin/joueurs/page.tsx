"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// ─── Autocomplete générique ───────────────────────────────────────────────────
function Autocomplete({
  label, placeholder, value, onSelect, searchFn, displayFn,
}: {
  label: string
  placeholder: string
  value: string
  onSelect: (item: any) => void
  searchFn: (q: string) => Promise<any[]>
  displayFn: (item: any) => string
}) {
  const [query, setQuery] = useState(value)
  const [results, setResults] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { setQuery(value) }, [value])

  useEffect(() => {
    if (query.length < 2) { setResults([]); return }
    const t = setTimeout(async () => {
      const r = await searchFn(query)
      setResults(r)
      setOpen(true)
    }, 200)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 600,
    color: "var(--text-muted)", marginBottom: "4px",
    textTransform: "uppercase", letterSpacing: "0.4px",
  }
  const inputStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", width: "100%",
    fontFamily: "Poppins, sans-serif", outline: "none",
    color: "var(--text)", boxSizing: "border-box",
  }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        style={inputStyle}
      />
      {open && results.length > 0 && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
          background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
          marginTop: "4px", maxHeight: "220px", overflowY: "auto",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}>
          {results.map((item, i) => (
            <button
              key={i} type="button"
              onClick={() => { onSelect(item); setQuery(displayFn(item)); setOpen(false) }}
              style={{
                display: "block", width: "100%", textAlign: "left", padding: "10px 14px",
                background: "none", border: "none", cursor: "pointer",
                fontSize: "13px", fontFamily: "Poppins, sans-serif",
                borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              {displayFn(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminJoueursPage() {
  const router = useRouter()
  const [joueurs, setJoueurs] = useState<any[]>([])
  const [filtreNom, setFiltreNom] = useState("")
  const [joueur, setJoueur] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [backupLoading, setBackupLoading] = useState(false)

  // Champs éditables
  const [classement, setClassement] = useState("")
  const [style, setStyle] = useState("")
  const [main, setMain] = useState("")
  const [age, setAge] = useState("")
  const [prise, setPrise] = useState("")

  // Matériel — texte affiché + ID produit pour la sync joueurs_pro_produits
  const [boisNom, setBoisNom] = useState("")
  const [boisId, setBoisId] = useState<string | null>(null)
  const [revetementCd, setRevetementCd] = useState("")
  const [revetementCdId, setRevetementCdId] = useState<string | null>(null)
  const [revetementCdType, setRevetementCdType] = useState("")
  const [revetementRv, setRevetementRv] = useState("")
  const [revetementRvId, setRevetementRvId] = useState<string | null>(null)
  const [revetementRvType, setRevetementRvType] = useState("")

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase
      .from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    fetchJoueurs()
  }

  async function downloadBackup() {
    setBackupLoading(true)
    // Récupérer TOUS les joueurs (H et F séparément pour éviter la limite Supabase)
    const [resH, resF] = await Promise.all([
      supabase.from("joueurs_pro")
        .select("id, nom, pays, genre, classement_mondial, style, main, age, prise, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
        .eq("actif", true).eq("genre", "H").order("classement_mondial").limit(200),
      supabase.from("joueurs_pro")
        .select("id, nom, pays, genre, classement_mondial, style, main, age, prise, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
        .eq("actif", true).eq("genre", "F").order("classement_mondial").limit(200),
    ])
    const tous = [...(resH.data || []), ...(resF.data || [])]
    const date = new Date().toISOString().slice(0, 10)
    const json = JSON.stringify(tous, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `joueurs_pro_backup_${date}.json`
    a.click()
    URL.revokeObjectURL(url)
    setBackupLoading(false)
  }

  async function fetchJoueurs() {
    const { data, error } = await supabase
      .from("joueurs_pro")
      .select("id, nom, pays, classement_mondial, genre, style, main, age, prise, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
      .eq("actif", true)
      .order("classement_mondial")
    if (error) {
      // Fallback si la colonne prise n'existe pas encore en base
      const { data: data2 } = await supabase
        .from("joueurs_pro")
        .select("id, nom, pays, classement_mondial, genre, style, main, age, bois_nom, revetement_cd, revetement_cd_type, revetement_rv, revetement_rv_type, actif")
        .eq("actif", true)
        .order("classement_mondial")
      setJoueurs(data2 || [])
    } else {
      setJoueurs(data || [])
    }
  }

  function selectionner(j: any) {
    setMessage("")
    setJoueur(j)
    setClassement(j.classement_mondial ? String(j.classement_mondial) : "")
    setStyle(j.style || "")
    setMain(j.main || "")
    setAge(j.age ? String(j.age) : "")
    setPrise(j.prise || "Classique")
    setBoisNom(j.bois_nom || "")
    setBoisId(null)
    setRevetementCd(j.revetement_cd || "")
    setRevetementCdId(null)
    setRevetementCdType(j.revetement_cd_type || "")
    setRevetementRv(j.revetement_rv || "")
    setRevetementRvId(null)
    setRevetementRvType(j.revetement_rv_type || "")
  }

  // Recherche bois dans la base
  async function searchBois(q: string) {
    const { data } = await supabase
      .from("produits")
      .select("id, nom, marques(nom), bois!inner(nb_plis)")
      .ilike("nom", `%${q}%`)
      .limit(8)
    return data || []
  }

  // Recherche revêtements dans la base
  async function searchRevetement(q: string) {
    const { data } = await supabase
      .from("produits")
      .select("id, nom, marques(nom), revetements!inner(type_revetement)")
      .ilike("nom", `%${q}%`)
      .limit(8)
    return data || []
  }

  function displayBois(item: any) {
    const marque = (item.marques as any)?.nom || ""
    const plis = (item.bois as any)?.nb_plis
    return `${marque} ${item.nom}${plis ? ` (${plis} plis)` : ""}`
  }

  function displayRevetement(item: any) {
    const marque = (item.marques as any)?.nom || ""
    const TYPE: Record<string, string> = { In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin" }
    const type = TYPE[(item.revetements as any)?.type_revetement] || ""
    return `${marque} ${item.nom}${type ? ` — ${type}` : ""}`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // 1. Sauvegarde du joueur
    const { error } = await supabase
      .from("joueurs_pro")
      .update({
        classement_mondial: classement ? parseInt(classement) : null,
        style: style || null,
        main: main || null,
        age: age ? parseInt(age) : null,
        prise: prise || null,
        bois_nom: boisNom || null,
        revetement_cd: revetementCd || null,
        revetement_cd_type: revetementCdType || null,
        revetement_rv: revetementRv || null,
        revetement_rv_type: revetementRvType || null,
      })
      .eq("id", joueur.id)

    if (error) {
      setLoading(false)
      setMessage("Erreur : " + error.message)
      return
    }

    // 2. Sync joueurs_pro_produits — uniquement si des IDs ont été sélectionnés via autocomplete
    const newIds = [boisId, revetementCdId, revetementRvId].filter(Boolean) as string[]
    if (newIds.length > 0) {
      // Supprime les liaisons existantes pour ce joueur
      await supabase.from("joueurs_pro_produits").delete().eq("joueur_id", joueur.id)
      // Insère les nouvelles liaisons (dédupliquées)
      const uniq = [...new Set(newIds)]
      await supabase.from("joueurs_pro_produits").insert(
        uniq.map(produit_id => ({ joueur_id: joueur.id, produit_id }))
      )
    }

    setLoading(false)
    setMessage("Modifications enregistrées !")
    fetchJoueurs()
  }

  const joueursFiltres = joueurs.filter(j =>
    j.nom.toLowerCase().includes(filtreNom.toLowerCase())
  )

  const inputStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", width: "100%",
    fontFamily: "Poppins, sans-serif", outline: "none",
    color: "var(--text)", boxSizing: "border-box",
  }
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 600,
    color: "var(--text-muted)", marginBottom: "4px",
    textTransform: "uppercase", letterSpacing: "0.4px",
  }
  const cardStyle: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)",
    borderRadius: "10px", padding: "20px", marginBottom: "12px",
  }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        ← Retour à l'administration
      </a>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>Joueurs professionnels</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Sélectionnez un joueur pour mettre à jour son classement et son matériel.
          </p>
        </div>
        <button
          onClick={downloadBackup}
          disabled={backupLoading}
          title="Télécharge un fichier JSON avec tous les équipements — à conserver précieusement !"
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            background: backupLoading ? "var(--bg)" : "#fff",
            border: "1px solid var(--border)", borderRadius: "8px",
            padding: "10px 16px", fontSize: "13px", fontWeight: 600,
            cursor: backupLoading ? "default" : "pointer",
            color: "var(--text)", fontFamily: "Poppins, sans-serif",
            flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          {backupLoading ? "Export..." : "Sauvegarder les équipements"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "1.5rem", alignItems: "start" }}>

        {/* ── Liste joueurs ── */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
            <input
              type="text"
              placeholder="Rechercher un joueur..."
              value={filtreNom}
              onChange={e => setFiltreNom(e.target.value)}
              style={{ ...inputStyle, padding: "8px 12px", fontSize: "13px" }}
            />
          </div>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {joueursFiltres.map(j => (
              <button
                key={j.id}
                type="button"
                onClick={() => selectionner(j)}
                style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  width: "100%", padding: "10px 16px", textAlign: "left",
                  background: joueur?.id === j.id ? "#FFF0EB" : "none",
                  border: "none", borderBottom: "1px solid var(--border)",
                  cursor: "pointer", fontFamily: "Poppins, sans-serif",
                  borderLeft: joueur?.id === j.id ? "3px solid #D97757" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", minWidth: "32px" }}>
                  #{j.classement_mondial}
                </span>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {j.nom}
                  </p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {j.genre === "F" ? "Femme" : "Homme"} · {j.pays}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Formulaire ── */}
        {!joueur ? (
          <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "14px" }}>Sélectionnez un joueur dans la liste</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {message && (
              <div style={{
                background: message.startsWith("✅") ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${message.startsWith("✅") ? "#A7F3D0" : "#FECACA"}`,
                color: message.startsWith("✅") ? "#065F46" : "#DC2626",
                borderRadius: "8px", padding: "12px 16px", marginBottom: "1rem",
                fontSize: "14px", fontWeight: 500,
              }}>
                {message}
              </div>
            )}

            {/* Header joueur */}
            <div style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", borderRadius: "10px", padding: "16px 20px", marginBottom: "12px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: "18px" }}>{joueur.nom}</p>
                <p style={{ fontSize: "13px", opacity: 0.85 }}>{joueur.pays} · {joueur.genre === "F" ? "Femmes" : "Hommes"}</p>
              </div>
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: "20px", fontSize: "14px", fontWeight: 700 }}>
                #{joueur.classement_mondial}
              </span>
            </div>

            {/* Classement & Infos */}
            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>Classement & Informations</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "10px" }}>
                <div>
                  <label style={labelStyle}>Classement mondial</label>
                  <input
                    type="number" value={classement}
                    onChange={e => setClassement(e.target.value)}
                    style={inputStyle} placeholder="Ex: 12"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Âge</label>
                  <input
                    type="number" value={age}
                    onChange={e => setAge(e.target.value)}
                    style={inputStyle} placeholder="Ex: 28"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Style de jeu</label>
                  <select value={style} onChange={e => setStyle(e.target.value)} style={inputStyle}>
                    <option value="">—</option>
                    <option value="Attaquant">Attaquant</option>
                    <option value="Défenseur">Défenseur</option>
                    <option value="Tout-jeu">Tout-jeu</option>
                    <option value="Bloqueur">Bloqueur</option>
                  </select>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={labelStyle}>Main</label>
                  <select value={main} onChange={e => setMain(e.target.value)} style={inputStyle}>
                    <option value="">—</option>
                    <option value="Droitier">Droitier</option>
                    <option value="Gaucher">Gaucher</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Type de prise</label>
                  <select value={prise} onChange={e => setPrise(e.target.value)} style={inputStyle}>
                    <option value="">—</option>
                    <option value="Classique">Classique</option>
                    <option value="Porte-plume">Porte-plume</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Matériel */}
            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>Matériel</p>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>
                Tapez au moins 2 caractères pour rechercher dans la base TT-Kip.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                <Autocomplete
                  label="Bois"
                  placeholder="Rechercher un bois... (ex: Viscaria, Timo Boll)"
                  value={boisNom}
                  onSelect={item => { setBoisNom(displayBois(item)); setBoisId(item.id) }}
                  searchFn={searchBois}
                  displayFn={displayBois}
                />

                <div>
                  <Autocomplete
                    label="Revêtement coup droit"
                    placeholder="Rechercher un revêtement... (ex: Tenergy, Dignics)"
                    value={revetementCd}
                    onSelect={item => {
                      setRevetementCd(displayRevetement(item))
                      setRevetementCdId(item.id)
                      const t = Array.isArray(item.revetements) ? item.revetements[0]?.type_revetement : item.revetements?.type_revetement
                      if (t) setRevetementCdType(t)
                    }}
                    searchFn={searchRevetement}
                    displayFn={displayRevetement}
                  />
                  <div style={{ marginTop: "8px" }}>
                    <label style={labelStyle}>Type — coup droit</label>
                    <select value={revetementCdType} onChange={e => setRevetementCdType(e.target.value)} style={inputStyle}>
                      <option value="">— Sélectionner un type</option>
                      <option value="In">Backside (In)</option>
                      <option value="Out">Picots courts (Out)</option>
                      <option value="Mid">Picots mi-longs (Mid)</option>
                      <option value="Long">Picots longs (Long)</option>
                      <option value="Anti">Anti-spin</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Autocomplete
                    label="Revêtement revers"
                    placeholder="Rechercher un revêtement... (ex: Rozena, Glayzer)"
                    value={revetementRv}
                    onSelect={item => {
                      setRevetementRv(displayRevetement(item))
                      setRevetementRvId(item.id)
                      const t = Array.isArray(item.revetements) ? item.revetements[0]?.type_revetement : item.revetements?.type_revetement
                      if (t) setRevetementRvType(t)
                    }}
                    searchFn={searchRevetement}
                    displayFn={displayRevetement}
                  />
                  <div style={{ marginTop: "8px" }}>
                    <label style={labelStyle}>Type — revers</label>
                    <select value={revetementRvType} onChange={e => setRevetementRvType(e.target.value)} style={inputStyle}>
                      <option value="">— Sélectionner un type</option>
                      <option value="In">Backside (In)</option>
                      <option value="Out">Picots courts (Out)</option>
                      <option value="Mid">Picots mi-longs (Mid)</option>
                      <option value="Long">Picots longs (Long)</option>
                      <option value="Anti">Anti-spin</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Aperçu matériel actuel */}
              {(boisNom || revetementCd || revetementRv) && (
                <div style={{ marginTop: "16px", background: "var(--bg)", borderRadius: "8px", padding: "12px 14px" }}>
                  <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "10px" }}>
                    Aperçu
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {boisNom && (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "70px" }}>Bois</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{boisNom}</span>
                      </div>
                    )}
                    {revetementCd && (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "70px" }}>Coup droit</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{revetementCd}</span>
                        {revetementCdType && <span style={{ fontSize: "11px", background: "#F0F0F0", borderRadius: "6px", padding: "2px 8px", color: "var(--text-muted)" }}>{revetementCdType}</span>}
                      </div>
                    )}
                    {revetementRv && (
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "70px" }}>Revers</span>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{revetementRv}</span>
                        {revetementRvType && <span style={{ fontSize: "11px", background: "#F0F0F0", borderRadius: "6px", padding: "2px 8px", color: "var(--text-muted)" }}>{revetementRvType}</span>}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading}
              style={{
                background: "#D97757", color: "#fff", border: "none", borderRadius: "8px",
                padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                width: "100%", opacity: loading ? 0.7 : 1, fontFamily: "Poppins, sans-serif",
              }}
            >
              {loading ? "Enregistrement..." : "Enregistrer les modifications"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
