"use client"

import AdminSearchBar from "@/app/components/AdminSearchBar"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

// ─── Autocomplete bois / revêtements ─────────────────────────────────────────
function Autocomplete({ label, placeholder, value, onSelect, searchFn, displayFn }: {
  label: string; placeholder: string; value: string
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

  const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.4px" }
  const inputStyle: React.CSSProperties = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" }

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={query} onChange={e => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder} style={inputStyle} />
      {open && results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100, background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px", maxHeight: "220px", overflowY: "auto", boxShadow: "0 4px 16px rgba(0,0,0,0.1)" }}>
          {results.map((item, i) => (
            <button key={i} type="button"
              onClick={() => { onSelect(item); setQuery(displayFn(item)); setOpen(false) }}
              style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", fontFamily: "Poppins, sans-serif", borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none" }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}>
              {displayFn(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState("avis")
  const [avis, setAvis] = useState<any[]>([])
  const [produits, setProduits] = useState<any[]>([])
  const [marques, setMarques] = useState<any[]>([])
  const [subcats, setSubcats] = useState<any[]>([])
  const [joueurs, setJoueurs] = useState<any[]>([])
  const [liaisons, setLiaisons] = useState<any[]>([])
  const [message, setMessage] = useState("")
  const [searchProduits, setSearchProduits] = useState("")
  const router = useRouter()

  // Nouveau revêtement
  const [nom, setNom] = useState("")
  const [marqueId, setMarqueId] = useState("")
  const [subcatId, setSubcatId] = useState("")
  const [numeroLarc, setNumeroLarc] = useState("")
  const [typeRev, setTypeRev] = useState("In")
  const [couleurs, setCouleurs] = useState("")
  const [vitesse, setVitesse] = useState("")
  const [effet, setEffet] = useState("")
  const [controle, setControle] = useState("")
  const [poids, setPoids] = useState("")

  // Nouveau bois
  const [bNom, setBNom] = useState("")
  const [bMarqueId, setBMarqueId] = useState("")
  const [bSubcatId, setBSubcatId] = useState("")
  const [bStyle, setBStyle] = useState("OFF")
  const [bPlis, setBPlis] = useState("")
  const [bPoids, setBPoids] = useState("")
  const [bCompo, setBCompo] = useState("")
  const [bPrix, setBPrix] = useState("")
  const [bVitesse, setBVitesse] = useState("")
  const [bControle, setBControle] = useState("")
  const [bFlexibilite, setBFlexibilite] = useState("")
  const [bDurete, setBDurete] = useState("")
  const [bQP, setBQP] = useState("")

  // Nouveau joueur
  const [joueurNom, setJoueurNom] = useState("")
  const [joueurPays, setJoueurPays] = useState("")
  const [joueurClassement, setJoueurClassement] = useState("")

  // Liaison joueur-produit
  const [liaisonJoueurId, setLiaisonJoueurId] = useState("")
  const [liaisonProduitSearch, setLiaisonProduitSearch] = useState("")
  const [liaisonProduitId, setLiaisonProduitId] = useState("")
  const [produitsFiltres, setProduitsFiltres] = useState<any[]>([])

  // ── Tables TT ──
  const [tables, setTables] = useState<any[]>([])
  const [filtreTable, setFiltreTable] = useState("")
  const [tableSelectionnee, setTableSelectionnee] = useState<any>(null)
  const [savingTable, setSavingTable] = useState(false)
  const [messageTable, setMessageTable] = useState("")
  const [editTableNom, setEditTableNom] = useState("")
  const [editTableMarque, setEditTableMarque] = useState("")
  const [editTableType, setEditTableType] = useState("")
  const [editTableNiveau, setEditTableNiveau] = useState("")
  const [editTablePrix, setEditTablePrix] = useState("")

  const [editTableEpaisseur, setEditTableEpaisseur] = useState("")
  const [editTableActif, setEditTableActif] = useState(true)

  // ── Modification joueur pro ──
  const [joueurSelectionne, setJoueurSelectionne] = useState<any>(null)
  const [filtreJoueur, setFiltreJoueur] = useState("")
  const [editClassement, setEditClassement] = useState("")
  const [editStyle, setEditStyle] = useState("")
  const [editMain, setEditMain] = useState("")
  const [editAge, setEditAge] = useState("")
  const [editBoisNom, setEditBoisNom] = useState("")
  const [editRevetementCd, setEditRevetementCd] = useState("")
  const [editRevetementRv, setEditRevetementRv] = useState("")
  const [savingJoueur, setSavingJoueur] = useState(false)
  const [messageJoueur, setMessageJoueur] = useState("")

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    await Promise.all([fetchAvis(), fetchProduits(), fetchMarques(), fetchSubcats(), fetchJoueurs(), fetchLiaisons(), fetchTables()])
    setLoading(false)
  }

  async function fetchAvis() {
    const { data } = await supabase.from("avis").select("*, utilisateurs(pseudo), produits(nom)").order("cree_le", { ascending: false })
    setAvis(data || [])
  }

  async function fetchProduits() {
    const { data } = await supabase.from("produits").select("id, nom, actif, marques(nom), sous_categories(nom)").order("nom").limit(200)
    setProduits(data || [])
  }

  async function fetchMarques() {
    const { data } = await supabase.from("marques").select("id, nom").order("nom")
    setMarques(data || [])
  }

  async function fetchSubcats() {
    const { data } = await supabase.from("sous_categories").select("id, nom, slug").order("nom")
    setSubcats(data || [])
  }

  async function fetchJoueurs() {
    const { data } = await supabase.from("joueurs_pro").select("*").order("classement_mondial")
    setJoueurs(data || [])
  }

  async function fetchLiaisons() {
    const { data } = await supabase.from("joueurs_pro_produits").select("id, joueurs_pro(nom), produits(nom)").order("id")
    setLiaisons(data || [])
  }

  async function fetchTables() {
    const { data } = await supabase.from("tables_tt").select("*").order("marque").order("nom")
    setTables(data || [])
  }

  function selectionnerTable(t: any) {
    setMessageTable("")
    setTableSelectionnee(t)
    setEditTableNom(t.nom || "")
    setEditTableMarque(t.marque || "")
    setEditTableType(t.type || "intérieur")
    setEditTableNiveau(t.niveau || "loisir")
    setEditTablePrix(t.prix != null ? String(t.prix) : "")

    setEditTableEpaisseur(t.epaisseur_plateau != null ? String(t.epaisseur_plateau) : "")
    setEditTableActif(t.actif !== false)
  }

  async function handleSaveTable(e: React.FormEvent) {
    e.preventDefault()
    setSavingTable(true)
    setMessageTable("")
    const { error } = await supabase.from("tables_tt").update({
      nom: editTableNom || null,
      marque: editTableMarque || null,
      type: editTableType || null,
      niveau: editTableNiveau || null,
      prix: editTablePrix ? parseFloat(editTablePrix) : null,

      epaisseur_plateau: editTableEpaisseur ? parseFloat(editTableEpaisseur) : null,
      actif: editTableActif,
    }).eq("id", tableSelectionnee.id)
    setSavingTable(false)
    if (error) {
      setMessageTable("❌ Erreur : " + error.message)
    } else {
      setMessageTable("✅ Table mise à jour !")
      await fetchTables()
    }
  }

  useEffect(() => {
    if (liaisonProduitSearch.length < 2) { setProduitsFiltres([]); return }
    const s = liaisonProduitSearch.toLowerCase()
    setProduitsFiltres(produits.filter(p => p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))).slice(0, 8))
  }, [liaisonProduitSearch, produits])

  // ── Helpers autocomplete matériel ──
  async function searchBois(q: string) {
    const { data } = await supabase.from("produits").select("id, nom, marques(nom), bois!inner(nb_plis)").ilike("nom", `%${q}%`).limit(8)
    return data || []
  }

  async function searchRevetement(q: string) {
    const { data } = await supabase.from("produits").select("id, nom, marques(nom), revetements!inner(type_revetement)").ilike("nom", `%${q}%`).limit(8)
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

  function selectionnerJoueur(j: any) {
    setMessageJoueur("")
    setJoueurSelectionne(j)
    setEditClassement(j.classement_mondial ? String(j.classement_mondial) : "")
    setEditStyle(j.style || "")
    setEditMain(j.main || "")
    setEditAge(j.age ? String(j.age) : "")
    setEditBoisNom(j.bois_nom || "")
    setEditRevetementCd(j.revetement_cd || "")
    setEditRevetementRv(j.revetement_rv || "")
  }

  async function handleSaveJoueur(e: React.FormEvent) {
    e.preventDefault()
    setSavingJoueur(true)
    setMessageJoueur("")
    const { error } = await supabase.from("joueurs_pro").update({
      classement_mondial: editClassement ? parseInt(editClassement) : null,
      style: editStyle || null,
      main: editMain || null,
      age: editAge ? parseInt(editAge) : null,
      bois_nom: editBoisNom || null,
      revetement_cd: editRevetementCd || null,
      revetement_rv: editRevetementRv || null,
    }).eq("id", joueurSelectionne.id)
    setSavingJoueur(false)
    if (error) {
      setMessageJoueur("❌ Erreur : " + error.message)
    } else {
      setMessageJoueur("✅ Modifications enregistrées !")
      await fetchJoueurs()
    }
  }

  async function validerAvis(id: string, valide: boolean) {
    await supabase.from("avis").update({ valide }).eq("id", id)
    await fetchAvis()
  }

  async function supprimerAvis(id: string) {
    if (!confirm("Supprimer cet avis ?")) return
    await supabase.from("avis").delete().eq("id", id)
    await fetchAvis()
  }

  async function toggleProduit(id: string, actif: boolean) {
    await supabase.from("produits").update({ actif: !actif }).eq("id", id)
    await fetchProduits()
  }

  async function supprimerProduit(id: string) {
    if (!confirm("Supprimer ce produit ?")) return
    await supabase.from("produits").delete().eq("id", id)
    await fetchProduits()
  }

  async function ajouterProduit(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const slug = (marques.find(m => m.id === marqueId)?.nom + "-" + nom + "-" + numeroLarc).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)
    const { data: prod, error } = await supabase.from("produits").insert({ subcategory_id: subcatId, marque_id: marqueId, nom, slug, actif: true }).select("id").single()
    if (error) { setMessage("Erreur : " + error.message); return }
    await supabase.from("revetements").insert({
      produit_id: prod.id, larc_approuve: true, numero_larc: numeroLarc,
      type_revetement: typeRev, couleurs_dispo: couleurs,
      vitesse_note: vitesse ? parseInt(vitesse) : null,
      effet_note: effet ? parseInt(effet) : null,
      controle_note: controle ? parseInt(controle) : null,
      poids: poids || null
    })
    setMessage("Revêtement ajouté avec succès !")
    setNom(""); setNumeroLarc(""); setCouleurs(""); setVitesse(""); setEffet(""); setControle(""); setPoids("")
    await fetchProduits()
  }

  async function ajouterBois(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const marqueNom = marques.find(m => m.id === bMarqueId)?.nom || ""
    const baseSlug = (marqueNom + "-" + bNom).toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 75)

    // Si le slug existe déjà, ajouter un suffixe unique
    const { data: existing } = await supabase.from("produits").select("id").eq("slug", baseSlug).maybeSingle()
    const slug = existing ? baseSlug + "-" + Date.now().toString().slice(-4) : baseSlug

    const { data: prod, error } = await supabase
      .from("produits")
      .insert({ marque_id: bMarqueId, subcategory_id: bSubcatId || null, nom: bNom, slug, actif: true })
      .select("id").single()
    if (error) { setMessage("Erreur : " + error.message); return }
    const { error: e2 } = await supabase.from("bois").insert({
      produit_id: prod.id,
      style: bStyle || null,
      nb_plis: bPlis ? parseInt(bPlis) : null,
      poids_g: bPoids ? parseFloat(bPoids) : null,
      composition: bCompo || null,
      prix: bPrix ? parseFloat(bPrix) : null,
      note_vitesse: bVitesse ? parseFloat(bVitesse) : null,
      note_controle: bControle ? parseFloat(bControle) : null,
      note_flexibilite: bFlexibilite ? parseFloat(bFlexibilite) : null,
      note_durete: bDurete ? parseFloat(bDurete) : null,
      note_qualite_prix: bQP ? parseFloat(bQP) : null,
    })
    if (e2) { setMessage("Erreur bois : " + e2.message); return }
    setMessage("Bois ajouté avec succès !")
    setBNom(""); setBMarqueId(""); setBStyle("OFF"); setBPlis(""); setBPoids("")
    setBCompo(""); setBPrix(""); setBVitesse(""); setBControle("")
    setBFlexibilite(""); setBDurete(""); setBQP("")
    await fetchProduits()
  }

  async function ajouterJoueur(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    const { error } = await supabase.from("joueurs_pro").insert({
      nom: joueurNom, pays: joueurPays,
      classement_mondial: joueurClassement ? parseInt(joueurClassement) : null
    })
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Joueur ajouté avec succès !")
    setJoueurNom(""); setJoueurPays(""); setJoueurClassement("")
    await fetchJoueurs()
  }

  async function supprimerJoueur(id: string) {
    if (!confirm("Supprimer ce joueur ?")) return
    await supabase.from("joueurs_pro").delete().eq("id", id)
    await fetchJoueurs()
  }

  async function ajouterLiaison(e: React.FormEvent) {
    e.preventDefault()
    setMessage("")
    if (!liaisonJoueurId || !liaisonProduitId) { setMessage("Sélectionnez un joueur et un revêtement."); return }
    const { error } = await supabase.from("joueurs_pro_produits").insert({ joueur_id: liaisonJoueurId, produit_id: liaisonProduitId })
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Liaison ajoutée avec succès !")
    setLiaisonJoueurId(""); setLiaisonProduitId(""); setLiaisonProduitSearch("")
    await fetchLiaisons()
  }

  async function supprimerLiaison(id: string) {
    if (!confirm("Supprimer cette liaison ?")) return
    await supabase.from("joueurs_pro_produits").delete().eq("id", id)
    await fetchLiaisons()
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  const avisEnAttente = avis.filter(a => !a.valide)
  const avisValides = avis.filter(a => a.valide)
  const joueursFiltres = joueurs.filter(j => j.nom.toLowerCase().includes(filtreJoueur.toLowerCase()))

  const tablesFiltrees = tables.filter(t =>
    (t.nom || "").toLowerCase().includes(filtreTable.toLowerCase()) ||
    (t.marque || "").toLowerCase().includes(filtreTable.toLowerCase())
  )

  const onglets = [
    { id: "avis", label: "Avis", count: avisEnAttente.length },
    { id: "tables-tt", label: "Tables TT", count: tables.length },
    { id: "ajouter", label: "Ajouter un revêtement" },
    { id: "ajouter-bois", label: "Ajouter un bois" },
    { id: "joueurs", label: "Joueurs pro", count: joueurs.length },
    { id: "modifier-joueur", label: "Modifier un joueur" },
    { id: "articles", label: "Articles & Tests", href: "/admin/articles" },
    { id: "edit-produits", label: "Éditer revêtements / bois", href: "/admin/produits" },
    { id: "newsletter", label: "Newsletter", href: "/admin/newsletter" },
    { id: "videos", label: "Vidéos de jeu", href: "/admin/videos" },
  ]

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const btnPrimary = { background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%" }
  const btnDanger = { background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }
  const btnSuccess = { background: "var(--success-light)", color: "var(--success)", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }
  const inputStyleAC: React.CSSProperties = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <AdminSearchBar onSelect={p => window.open("/" + (p.sous_categories?.slug?.startsWith("bois") ? "bois" : "revetements") + "/" + p.slug, "_blank")} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Administration</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Gestion du site TT-Kip</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {avisEnAttente.length > 0 && <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px" }}>{avisEnAttente.length} avis en attente</span>}
          <span style={{ background: "var(--accent-light)", color: "var(--accent)", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px" }}>{produits.length} produits</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "2rem", overflowX: "auto" }}>
        {onglets.map(t => (
          (t as any).href
            ? <a key={t.id} href={(t as any).href}
                style={{ background: "none", border: "none", borderBottom: "2px solid transparent", textDecoration: "none",
                  color: "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const, display: "flex", alignItems: "center", gap: "6px" }}>
                {t.label}
              </a>
            : <button key={t.id} onClick={() => { setOnglet(t.id); setMessage("") }}
                style={{ background: "none", border: "none", borderBottom: onglet === t.id ? "2px solid var(--accent)" : "2px solid transparent",
                  color: onglet === t.id ? "var(--accent)" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const, display: "flex", alignItems: "center", gap: "6px" }}>
                {t.label}
                {t.count !== undefined && t.count > 0 && <span style={{ background: onglet === t.id ? "var(--accent-light)" : "var(--border)", color: onglet === t.id ? "var(--accent)" : "var(--text-muted)", borderRadius: "10px", padding: "1px 6px", fontSize: "11px" }}>{t.count}</span>}
              </button>
        ))}
      </div>

      {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>{message}</div>}

      {/* ── AVIS ── */}
      {onglet === "avis" && (
        <div>
          {avisEnAttente.length > 0 && (
            <div style={{ marginBottom: "2rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>En attente ({avisEnAttente.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {avisEnAttente.map(a => (
                  <div key={a.id} style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{a.titre}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px" }}>{a.produits?.nom} · {a.utilisateurs?.pseudo} · {"★".repeat(a.note)}</p>
                        <p style={{ fontSize: "13px", color: "var(--text)" }}>{a.contenu}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => validerAvis(a.id, true)} style={btnSuccess}>Valider</button>
                        <button onClick={() => supprimerAvis(a.id)} style={btnDanger}>Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {avisValides.length > 0 && (
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Publiés ({avisValides.length})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {avisValides.map(a => (
                  <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: "12px" }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>{a.titre}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "12px", marginBottom: "6px" }}>{a.produits?.nom} · {a.utilisateurs?.pseudo} · {"★".repeat(a.note)}</p>
                        <p style={{ fontSize: "13px", color: "var(--text)" }}>{a.contenu}</p>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button onClick={() => validerAvis(a.id, false)} style={{ ...btnSuccess, background: "var(--bg)", color: "var(--text-muted)" }}>Dépublier</button>
                        <button onClick={() => supprimerAvis(a.id)} style={btnDanger}>Supprimer</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {avis.length === 0 && <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "3rem" }}>Aucun avis pour le moment.</p>}
        </div>
      )}

      {/* ── TABLES TT ── */}
      {onglet === "tables-tt" && (
        <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Liste tables */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
              <input type="text" placeholder="Rechercher une table..." value={filtreTable}
                onChange={e => setFiltreTable(e.target.value)}
                style={{ ...inputStyleAC, padding: "7px 10px", fontSize: "13px" }} />
            </div>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {tablesFiltrees.map(t => (
                <button key={t.id} type="button" onClick={() => selectionnerTable(t)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 14px", textAlign: "left",
                    background: tableSelectionnee?.id === t.id ? "#FFF0EB" : "none",
                    border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer",
                    fontFamily: "Poppins, sans-serif",
                    borderLeft: tableSelectionnee?.id === t.id ? "3px solid #D97757" : "3px solid transparent" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.nom}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{t.marque} · {t.niveau}</p>
                  </div>
                  {!t.actif && <span style={{ fontSize: "10px", background: "#FEF2F2", color: "#DC2626", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, flexShrink: 0 }}>inactif</span>}
                </button>
              ))}
              {tablesFiltrees.length === 0 && <p style={{ padding: "1.5rem", color: "var(--text-muted)", fontSize: "13px", textAlign: "center" }}>Aucune table trouvée.</p>}
            </div>
          </div>

          {/* Formulaire édition */}
          {!tableSelectionnee ? (
            <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "28px", marginBottom: "10px" }}>👈</p>
              <p style={{ fontSize: "14px" }}>Sélectionnez une table dans la liste</p>
            </div>
          ) : (
            <form onSubmit={handleSaveTable} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {messageTable && (
                <div style={{ background: messageTable.startsWith("✅") ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${messageTable.startsWith("✅") ? "#A7F3D0" : "#FECACA"}`, color: messageTable.startsWith("✅") ? "#065F46" : "#DC2626", borderRadius: "8px", padding: "12px 16px", fontSize: "14px", fontWeight: 500 }}>
                  {messageTable}
                </div>
              )}

              {/* En-tête */}
              <div style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", borderRadius: "10px", padding: "14px 18px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "17px" }}>{tableSelectionnee.marque} {tableSelectionnee.nom}</p>
                  <p style={{ fontSize: "13px", opacity: 0.85 }}>{tableSelectionnee.type} · {tableSelectionnee.niveau}</p>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
                  <input type="checkbox" checked={editTableActif} onChange={e => setEditTableActif(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                  Active
                </label>
              </div>

              {/* Identité */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "14px" }}>📋 Informations générales</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Marque</label>
                    <input value={editTableMarque} onChange={e => setEditTableMarque(e.target.value)} style={inputStyleAC} placeholder="Ex: Cornilleau" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Nom du modèle</label>
                    <input value={editTableNom} onChange={e => setEditTableNom(e.target.value)} style={inputStyleAC} placeholder="Ex: 500 Indoor" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Type</label>
                    <select value={editTableType} onChange={e => setEditTableType(e.target.value)} style={inputStyleAC}>
                      <option value="intérieur">Intérieur</option>
                      <option value="extérieur">Extérieur</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Niveau</label>
                    <select value={editTableNiveau} onChange={e => setEditTableNiveau(e.target.value)} style={inputStyleAC}>
                      <option value="loisir">Loisir</option>
                      <option value="club">Club</option>
                      <option value="compétition">Compétition</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Caractéristiques techniques */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "14px" }}>🔧 Caractéristiques techniques</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Prix indicatif (€)</label>
                    <input type="number" step="0.01" value={editTablePrix} onChange={e => setEditTablePrix(e.target.value)} style={inputStyleAC} placeholder="Ex: 349.90" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Épaisseur plateau (mm)</label>
                    <input type="number" step="0.1" value={editTableEpaisseur} onChange={e => setEditTableEpaisseur(e.target.value)} style={inputStyleAC} placeholder="Ex: 25" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={savingTable}
                style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", opacity: savingTable ? 0.7 : 1, fontFamily: "Poppins, sans-serif" }}>
                {savingTable ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── AJOUTER REVÊTEMENT ── */}
      {onglet === "ajouter" && (
        <div style={{ maxWidth: "560px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Ajouter un revêtement</h2>
          <form onSubmit={ajouterProduit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={labelStyle}>Marque</label><select value={marqueId} onChange={e => setMarqueId(e.target.value)} required style={inputStyle}><option value="">Choisir...</option>{marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
            <div><label style={labelStyle}>Nom du revêtement</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={inputStyle} placeholder="Ex: Tenergy 05" /></div>
            <div><label style={labelStyle}>Sous-catégorie</label><select value={subcatId} onChange={e => setSubcatId(e.target.value)} required style={inputStyle}><option value="">Choisir...</option>{subcats.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}</select></div>
            <div><label style={labelStyle}>Numéro LARC</label><input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} style={inputStyle} placeholder="Ex: 012-345" /></div>
            <div><label style={labelStyle}>Type</label><select value={typeRev} onChange={e => setTypeRev(e.target.value)} style={inputStyle}><option value="In">Backside</option><option value="Out">Picots courts</option><option value="Mid">Picots mi-longs</option><option value="Long">Picots longs</option><option value="Anti">Anti-spin</option></select></div>
            <div><label style={labelStyle}>Couleurs</label><input type="text" value={couleurs} onChange={e => setCouleurs(e.target.value)} style={inputStyle} placeholder="Ex: Black, Red" /></div>
            <div><label style={labelStyle}>Poids</label><input type="text" value={poids} onChange={e => setPoids(e.target.value)} style={inputStyle} placeholder="Ex: 45g" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
              <div><label style={labelStyle}>Vitesse /10</label><input type="number" min="1" max="10" value={vitesse} onChange={e => setVitesse(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
              <div><label style={labelStyle}>Effet /10</label><input type="number" min="1" max="10" value={effet} onChange={e => setEffet(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
              <div><label style={labelStyle}>Contrôle /10</label><input type="number" min="1" max="10" value={controle} onChange={e => setControle(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
            </div>
            <button type="submit" style={btnPrimary}>Ajouter le revêtement</button>
          </form>
        </div>
      )}

      {/* ── AJOUTER BOIS ── */}
      {onglet === "ajouter-bois" && (
        <div style={{ maxWidth: "560px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Ajouter un bois</h2>
          <form onSubmit={ajouterBois} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={labelStyle}>Marque *</label><select value={bMarqueId} onChange={e => setBMarqueId(e.target.value)} required style={inputStyle}><option value="">Choisir...</option>{marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
            <div><label style={labelStyle}>Nom du bois *</label><input type="text" value={bNom} onChange={e => setBNom(e.target.value)} required style={inputStyle} placeholder="Ex: Viscaria" /></div>
            <div><label style={labelStyle}>Sous-catégorie</label><select value={bSubcatId} onChange={e => setBSubcatId(e.target.value)} style={inputStyle}><option value="">Choisir...</option>{subcats.filter(s => s.slug?.startsWith("bois")).map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}</select></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={labelStyle}>Style</label>
                <select value={bStyle} onChange={e => setBStyle(e.target.value)} style={inputStyle}>
                  {["OFF+","OFF","OFF-","ALL+","ALL","ALL-","DEF+","DEF","DEF-"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={labelStyle}>Nombre de plis</label><input type="number" value={bPlis} onChange={e => setBPlis(e.target.value)} style={inputStyle} placeholder="Ex: 7" /></div>
              <div><label style={labelStyle}>Poids (g)</label><input type="number" step="0.1" value={bPoids} onChange={e => setBPoids(e.target.value)} style={inputStyle} placeholder="Ex: 88" /></div>
              <div><label style={labelStyle}>Prix (€)</label><input type="number" step="0.01" value={bPrix} onChange={e => setBPrix(e.target.value)} style={inputStyle} placeholder="Ex: 135" /></div>
            </div>
            <div><label style={labelStyle}>Composition</label><input type="text" value={bCompo} onChange={e => setBCompo(e.target.value)} style={inputStyle} placeholder="Ex: Arylate Carbon" /></div>
            <div>
              <label style={labelStyle}>Notes TT-Kip (/10) — optionnelles</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginTop: "6px" }}>
                <div><label style={{ ...labelStyle, fontSize: "10px" }}>Vitesse</label><input type="number" min="1" max="10" step="0.1" value={bVitesse} onChange={e => setBVitesse(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={{ ...labelStyle, fontSize: "10px" }}>Contrôle</label><input type="number" min="1" max="10" step="0.1" value={bControle} onChange={e => setBControle(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={{ ...labelStyle, fontSize: "10px" }}>Flexibilité</label><input type="number" min="1" max="10" step="0.1" value={bFlexibilite} onChange={e => setBFlexibilite(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={{ ...labelStyle, fontSize: "10px" }}>Dureté</label><input type="number" min="1" max="10" step="0.1" value={bDurete} onChange={e => setBDurete(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={{ ...labelStyle, fontSize: "10px" }}>Qualité/Prix</label><input type="number" min="1" max="10" step="0.1" value={bQP} onChange={e => setBQP(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
              </div>
            </div>
            <button type="submit" style={btnPrimary}>Ajouter le bois</button>
          </form>
        </div>
      )}

      {/* ── JOUEURS (ajouter / supprimer) ── */}
      {onglet === "joueurs" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Ajouter un joueur pro</h2>
            <form onSubmit={ajouterJoueur} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><label style={labelStyle}>Nom complet</label><input type="text" value={joueurNom} onChange={e => setJoueurNom(e.target.value)} required style={inputStyle} placeholder="Ex: Fan Zhendong" /></div>
              <div><label style={labelStyle}>Pays</label><input type="text" value={joueurPays} onChange={e => setJoueurPays(e.target.value)} style={inputStyle} placeholder="Ex: Chine" /></div>
              <div><label style={labelStyle}>Classement mondial</label><input type="number" value={joueurClassement} onChange={e => setJoueurClassement(e.target.value)} style={inputStyle} placeholder="Ex: 1" /></div>
              <button type="submit" style={btnPrimary}>Ajouter le joueur</button>
            </form>
          </div>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Joueurs ({joueurs.length})</h2>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              {joueurs.map((j, i) => (
                <div key={j.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: i < joueurs.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "13px" }}>{j.nom}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{j.pays} · #{j.classement_mondial}</p>
                  </div>
                  <button onClick={() => supprimerJoueur(j.id)} style={btnDanger}>Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODIFIER UN JOUEUR ── */}
      {onglet === "modifier-joueur" && (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.5rem", alignItems: "start" }}>

          {/* Liste joueurs */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "10px 12px", borderBottom: "1px solid var(--border)" }}>
              <input type="text" placeholder="Rechercher..." value={filtreJoueur}
                onChange={e => setFiltreJoueur(e.target.value)}
                style={{ ...inputStyleAC, padding: "7px 10px", fontSize: "13px" }} />
            </div>
            <div style={{ maxHeight: "560px", overflowY: "auto" }}>
              {joueursFiltres.map(j => (
                <button key={j.id} type="button" onClick={() => selectionnerJoueur(j)}
                  style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", padding: "10px 14px", textAlign: "left", background: joueurSelectionne?.id === j.id ? "#FFF0EB" : "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", fontFamily: "Poppins, sans-serif", borderLeft: joueurSelectionne?.id === j.id ? "3px solid #D97757" : "3px solid transparent" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#D97757", minWidth: "28px" }}>#{j.classement_mondial}</span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.nom}</p>
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{j.genre === "F" ? "Femme" : "Homme"} · {j.pays}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire modification */}
          {!joueurSelectionne ? (
            <div style={{ background: "#fff", border: "1px dashed var(--border)", borderRadius: "10px", padding: "3rem", textAlign: "center", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "28px", marginBottom: "10px" }}>👈</p>
              <p style={{ fontSize: "14px" }}>Sélectionnez un joueur dans la liste</p>
            </div>
          ) : (
            <form onSubmit={handleSaveJoueur}>
              {messageJoueur && (
                <div style={{ background: messageJoueur.startsWith("✅") ? "#ECFDF5" : "#FEF2F2", border: `1px solid ${messageJoueur.startsWith("✅") ? "#A7F3D0" : "#FECACA"}`, color: messageJoueur.startsWith("✅") ? "#065F46" : "#DC2626", borderRadius: "8px", padding: "12px 16px", marginBottom: "12px", fontSize: "14px", fontWeight: 500 }}>
                  {messageJoueur}
                </div>
              )}

              {/* Header */}
              <div style={{ background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)", borderRadius: "10px", padding: "14px 18px", marginBottom: "12px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 700, fontSize: "17px" }}>{joueurSelectionne.nom}</p>
                  <p style={{ fontSize: "13px", opacity: 0.85 }}>{joueurSelectionne.pays} · {joueurSelectionne.genre === "F" ? "Femmes" : "Hommes"}</p>
                </div>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "5px 12px", borderRadius: "20px", fontSize: "14px", fontWeight: 700 }}>
                  #{joueurSelectionne.classement_mondial}
                </span>
              </div>

              {/* Classement & Infos */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px", marginBottom: "12px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "14px" }}>📊 Classement & Informations</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Classement</label>
                    <input type="number" value={editClassement} onChange={e => setEditClassement(e.target.value)} style={inputStyleAC} placeholder="Ex: 12" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Âge</label>
                    <input type="number" value={editAge} onChange={e => setEditAge(e.target.value)} style={inputStyleAC} placeholder="Ex: 28" />
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Style de jeu</label>
                    <select value={editStyle} onChange={e => setEditStyle(e.target.value)} style={inputStyleAC}>
                      <option value="">—</option>
                      <option value="Attaquant">Attaquant</option>
                      <option value="Défenseur">Défenseur</option>
                      <option value="Tout-jeu">Tout-jeu</option>
                      <option value="Bloqueur">Bloqueur</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...labelStyle, fontFamily: "Poppins, sans-serif" }}>Main</label>
                    <select value={editMain} onChange={e => setEditMain(e.target.value)} style={inputStyleAC}>
                      <option value="">—</option>
                      <option value="Droitier">Droitier</option>
                      <option value="Gaucher">Gaucher</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Matériel */}
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "18px", marginBottom: "12px" }}>
                <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>🏏 Matériel</p>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "14px" }}>Tapez au moins 2 caractères pour rechercher dans la base TT-Kip.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <Autocomplete label="Bois" placeholder="Ex: Viscaria, Timo Boll ALC..." value={editBoisNom}
                    onSelect={item => setEditBoisNom(displayBois(item))} searchFn={searchBois} displayFn={displayBois} />
                  <Autocomplete label="🔴 Revêtement coup droit" placeholder="Ex: Tenergy 05, Dignics..." value={editRevetementCd}
                    onSelect={item => setEditRevetementCd(displayRevetement(item))} searchFn={searchRevetement} displayFn={displayRevetement} />
                  <Autocomplete label="⚫ Revêtement revers" placeholder="Ex: Rozena, Glayzer..." value={editRevetementRv}
                    onSelect={item => setEditRevetementRv(displayRevetement(item))} searchFn={searchRevetement} displayFn={displayRevetement} />
                </div>

                {/* Aperçu */}
                {(editBoisNom || editRevetementCd || editRevetementRv) && (
                  <div style={{ marginTop: "14px", background: "var(--bg)", borderRadius: "8px", padding: "10px 14px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "8px" }}>Aperçu</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {editBoisNom && <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "80px" }}>🏏 Bois</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{editBoisNom}</span></div>}
                      {editRevetementCd && <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "80px" }}>🔴 CD</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{editRevetementCd}</span></div>}
                      {editRevetementRv && <div style={{ display: "flex", gap: "8px" }}><span style={{ fontSize: "12px", color: "var(--text-muted)", minWidth: "80px" }}>⚫ RV</span><span style={{ fontSize: "13px", fontWeight: 600 }}>{editRevetementRv}</span></div>}
                    </div>
                  </div>
                )}
              </div>

              <button type="submit" disabled={savingJoueur}
                style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", opacity: savingJoueur ? 0.7 : 1, fontFamily: "Poppins, sans-serif" }}>
                {savingJoueur ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          )}
        </div>
      )}

      {/* ── LIAISONS ── */}
      {onglet === "liaisons" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Lier un joueur à un revêtement</h2>
            <form onSubmit={ajouterLiaison} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Joueur</label>
                <select value={liaisonJoueurId} onChange={e => setLiaisonJoueurId(e.target.value)} required style={inputStyle}>
                  <option value="">Choisir un joueur...</option>
                  {joueurs.map(j => <option key={j.id} value={j.id}>{j.nom} ({j.pays})</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Rechercher un revêtement</label>
                <input type="text" value={liaisonProduitSearch} onChange={e => { setLiaisonProduitSearch(e.target.value); setLiaisonProduitId("") }} style={inputStyle} placeholder="Tapez le nom du revêtement..." />
                {produitsFiltres.length > 0 && (
                  <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px", overflow: "hidden" }}>
                    {produitsFiltres.map((p, i) => (
                      <div key={p.id}
                        onClick={() => { setLiaisonProduitId(p.id); setLiaisonProduitSearch(p.nom + " — " + p.marques?.nom); setProduitsFiltres([]) }}
                        style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < produitsFiltres.length - 1 ? "1px solid var(--border)" : "none", fontSize: "13px", background: liaisonProduitId === p.id ? "var(--accent-light)" : "#fff" }}
                        onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                        onMouseLeave={e => e.currentTarget.style.background = liaisonProduitId === p.id ? "var(--accent-light)" : "#fff"}>
                        <span style={{ fontWeight: 500 }}>{p.nom}</span>
                        <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{p.marques?.nom}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button type="submit" style={btnPrimary}>Créer la liaison</button>
            </form>
          </div>
          <div>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Liaisons existantes ({liaisons.length})</h2>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
              {liaisons.length === 0 && <p style={{ padding: "1.5rem", color: "var(--text-muted)", fontSize: "13px" }}>Aucune liaison.</p>}
              {liaisons.map((l: any, i) => (
                <div key={l.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", borderBottom: i < liaisons.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: "13px" }}>{l.joueurs_pro?.nom}</p>
                    <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>{l.produits?.nom}</p>
                  </div>
                  <button onClick={() => supprimerLiaison(l.id)} style={btnDanger}>Supprimer</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
