"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const REGIONS = ["Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Bretagne","Centre-Val de Loire","Corse","Grand Est","Hauts-de-France","Île-de-France","Normandie","Nouvelle-Aquitaine","Occitanie","Pays de la Loire","Provence-Alpes-Côte d'Azur","Guadeloupe","Martinique","Guyane","La Réunion","Mayotte","Autre"]

// ✅ HORS du composant — évite la perte de focus à chaque frappe
const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

// ✅ HORS du composant — React ne recrée plus ce composant à chaque render
function SearchInput({ label, value, onChange, results, onSelect, selected }: {
  label: string
  value: string
  onChange: (v: string) => void
  results: any[]
  onSelect: (p: any) => void
  selected: string | null
}) {
  return (
    <div style={{ position: "relative" }}>
      <label style={labelStyle}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
        placeholder={"Rechercher " + label.toLowerCase() + "..."}
        autoComplete="off"
      />
      {selected && <p style={{ fontSize: "12px", color: "var(--success)", marginTop: "4px", fontWeight: 500 }}>Sélectionné : {selected}</p>}
      {results.length > 0 && (
        <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px", zIndex: 10, overflow: "hidden" }}>
          {results.map((p: any, i: number) => (
            <div key={p.id}
              onClick={() => onSelect(p)}
              style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < results.length - 1 ? "1px solid var(--border)" : "none", fontSize: "13px" }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
              onMouseLeave={e => e.currentTarget.style.background = "#fff"}
            >
              <span style={{ fontWeight: 500 }}>{p.nom}</span>
              <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{p.marques?.nom}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProfilPage() {
  const [user, setUser] = useState<any>(null)
  const [profil, setProfil] = useState<any>(null)
  const [materiel, setMateriel] = useState<any[]>([])
  const [avis, setAvis] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [onglet, setOnglet] = useState("materiel")
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Champs profil
  const [pseudo, setPseudo] = useState("")
  const [classement, setClassement] = useState("")
  const [region, setRegion] = useState("")
  const [club, setClub] = useState("")

  // Recherche produits
  const [searchBois, setSearchBois] = useState("")
  const [searchCD, setSearchCD] = useState("")
  const [searchRV, setSearchRV] = useState("")
  const [resultsBois, setResultsBois] = useState<any[]>([])
  const [resultsCD, setResultsCD] = useState<any[]>([])
  const [resultsRV, setResultsRV] = useState<any[]>([])
  const [boisId, setBoisId] = useState<string | null>(null)
  const [cdId, setCdId] = useState<string | null>(null)
  const [rvId, setRvId] = useState<string | null>(null)
  const [boisNom, setBoisNom] = useState("")
  const [cdNom, setCdNom] = useState("")
  const [rvNom, setRvNom] = useState("")

  // Newsletter
  const [newsletterOk, setNewsletterOk] = useState(false)
  const [newsletterMsg, setNewsletterMsg] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)

  // Suppression de compte
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => { fetchData() }, [])

  async function fetchData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    setUser(user)
    const [{ data: profilData }, { data: materielData }, { data: avisData }] = await Promise.all([
      supabase.from("utilisateurs").select("*").eq("id", user.id).single(),
      supabase.from("utilisateurs_produits").select("id, depuis, produits(id, nom, slug, marques(nom), sous_categories(nom))").eq("user_id", user.id),
      supabase.from("avis").select("*, produits(nom, slug)").eq("user_id", user.id).order("cree_le", { ascending: false })
    ])
    setProfil(profilData)
    setPseudo(profilData?.pseudo || "")
    setClassement(profilData?.classement || "")
    setRegion(profilData?.region || "")
    setClub(profilData?.club || "")
    setNewsletterOk(profilData?.newsletter_ok || false)
    setBoisId(profilData?.bois_id || null)
    setCdId(profilData?.revetement_cd_id || null)
    setRvId(profilData?.revetement_rv_id || null)
    if (profilData?.bois_id) {
      const { data: b } = await supabase.from("produits").select("nom, marques(nom)").eq("id", profilData.bois_id).single()
      if (b) setBoisNom(b.nom + " — " + (b.marques as any)?.nom)
    }
    if (profilData?.revetement_cd_id) {
      const { data: cd } = await supabase.from("produits").select("nom, marques(nom)").eq("id", profilData.revetement_cd_id).single()
      if (cd) setCdNom(cd.nom + " — " + (cd.marques as any)?.nom)
    }
    if (profilData?.revetement_rv_id) {
      const { data: rv } = await supabase.from("produits").select("nom, marques(nom)").eq("id", profilData.revetement_rv_id).single()
      if (rv) setRvNom(rv.nom + " — " + (rv.marques as any)?.nom)
    }
    setMateriel(materielData || [])
    setAvis(avisData || [])
    setLoading(false)
  }

  async function searchProduits(q: string, type: string) {
    if (q.length < 2) {
      if (type === "bois") setResultsBois([])
      if (type === "cd") setResultsCD([])
      if (type === "rv") setResultsRV([])
      return
    }
    const { data } = await supabase.from("produits").select("id, nom, marques(nom)").ilike("nom", "%" + q + "%").eq("actif", true).limit(6)
    if (type === "bois") setResultsBois(data || [])
    if (type === "cd") setResultsCD(data || [])
    if (type === "rv") setResultsRV(data || [])
  }

  async function updateProfil(e: React.FormEvent) {
    e?.preventDefault()
    if (!user) { setMessage("Erreur : utilisateur non connecté"); return }
    setMessage("")
    const { error } = await supabase.from("utilisateurs").update({
      pseudo, classement: classement || null,
      region: region || null, club: club || null,
      bois_id: boisId || null,
      revetement_cd_id: cdId || null,
      revetement_rv_id: rvId || null,
      newsletter_ok: newsletterOk,
    }).eq("id", user.id)
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Profil mis à jour avec succès !")
    await fetchData()
  }

  async function toggleNewsletter() {
    if (!user) return
    setNewsletterLoading(true)
    setNewsletterMsg("")
    const newVal = !newsletterOk
    const { error } = await supabase.from("utilisateurs").update({ newsletter_ok: newVal }).eq("id", user.id)
    if (error) { setNewsletterMsg("Erreur : " + error.message); setNewsletterLoading(false); return }
    setNewsletterOk(newVal)
    setNewsletterMsg(newVal ? "✓ Inscrit à la newsletter !" : "✓ Désinscrit de la newsletter.")
    setNewsletterLoading(false)
  }

  async function retirerMateriel(id: string) {
    await supabase.from("utilisateurs_produits").delete().eq("id", id)
    await fetchData()
  }

  async function handleDeleteAccount() {
    setDeleteError("")
    if (deleteConfirm !== "SUPPRIMER") {
      setDeleteError("Veuillez taper exactement SUPPRIMER pour confirmer.")
      return
    }
    setDeleteLoading(true)
    try {
      const { error } = await supabase.rpc("delete_user_account")
      if (error) throw error
      await supabase.auth.signOut()
      router.push("/?compte_supprime=1")
    } catch (err: any) {
      setDeleteError("Une erreur est survenue : " + (err?.message || "réessayez plus tard."))
      setDeleteLoading(false)
    }
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  const onglets = [
    { id: "materiel", label: "Mon matériel" },
    { id: "avis", label: "Mes avis" },
    { id: "parametres", label: "Paramètres" },
  ]

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      {/* ── Modale suppression compte ── */}
      {showDeleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "#fff", borderRadius: "14px", padding: "2rem", maxWidth: "440px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "#DC2626" }}>Supprimer mon compte</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
                Cette action est <strong>irréversible</strong>. Votre profil, vos avis et tout votre historique seront définitivement supprimés.
              </p>
            </div>
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "8px", padding: "12px 14px", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "13px", color: "#DC2626", fontWeight: 500 }}>Compte : <strong>{user?.email}</strong></p>
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ ...labelStyle, color: "#DC2626" }}>Tapez <strong>SUPPRIMER</strong> pour confirmer</label>
              <input type="text" value={deleteConfirm}
                onChange={e => { setDeleteConfirm(e.target.value); setDeleteError("") }}
                placeholder="SUPPRIMER"
                style={{ ...inputStyle, border: "1px solid #FECACA" }}
                autoFocus />
              {deleteError && <p style={{ fontSize: "12px", color: "#DC2626", marginTop: "6px", fontWeight: 500 }}>{deleteError}</p>}
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setShowDeleteModal(false); setDeleteConfirm(""); setDeleteError("") }}
                disabled={deleteLoading}
                style={{ flex: 1, background: "var(--bg)", color: "var(--text-muted)", border: "1px solid var(--border)", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Annuler
              </button>
              <button onClick={handleDeleteAccount}
                disabled={deleteLoading || deleteConfirm !== "SUPPRIMER"}
                style={{ flex: 1, background: deleteConfirm === "SUPPRIMER" ? "#DC2626" : "#FCA5A5", color: "#fff", border: "none", borderRadius: "8px", padding: "11px", fontSize: "14px", fontWeight: 600, cursor: deleteConfirm === "SUPPRIMER" ? "pointer" : "not-allowed", fontFamily: "Poppins, sans-serif" }}>
                {deleteLoading ? "Suppression..." : "Supprimer définitivement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Header profil ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
          {profil?.pseudo?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "2px" }}>{profil?.pseudo}</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{user?.email}</p>
        </div>
      </div>

      {/* ── Onglets ── */}
      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
        {onglets.map(t => (
          <button key={t.id} onClick={() => setOnglet(t.id)}
            style={{ background: "none", border: "none", borderBottom: onglet === t.id ? "2px solid #D97757" : "2px solid transparent", color: onglet === t.id ? "#D97757" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Onglet Matériel ── */}
      {onglet === "materiel" && (
        <div>
          {materiel.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
              <p style={{ marginBottom: "12px" }}>Vous n'avez pas encore ajouté de matériel.</p>
              <a href="/revetements" style={{ color: "#D97757", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>Parcourir les revêtements</a>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "8px" }}>
              {materiel.map((m: any) => (
                <div key={m.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>{m.produits?.nom}</span>
                      <span style={{ fontSize: "11px", background: "var(--bg)", color: "var(--text-muted)", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>{m.produits?.sous_categories?.nom}</span>
                    </div>
                    <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>{m.produits?.marques?.nom}</p>
                  </div>
                  <button onClick={() => retirerMateriel(m.id)} style={{ background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "6px", padding: "6px 12px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }}>Retirer</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Avis ── */}
      {onglet === "avis" && (
        <div>
          {avis.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", color: "var(--text-muted)" }}>
              <p style={{ marginBottom: "12px" }}>Vous n'avez pas encore laissé d'avis.</p>
              <a href="/revetements" style={{ color: "#D97757", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>Parcourir les revêtements</a>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {avis.map((a: any) => (
                <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                    <div>
                      <a href={"/revetements/" + a.produits?.slug} style={{ fontWeight: 600, fontSize: "14px", color: "#D97757", textDecoration: "none" }}>{a.produits?.nom}</a>
                      <p style={{ fontWeight: 500, fontSize: "14px", marginTop: "2px" }}>{a.titre}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <span style={{ color: "#F59E0B", fontSize: "14px" }}>{"★".repeat(a.note)}{"☆".repeat(5 - a.note)}</span>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px", background: a.valide ? "var(--success-light)" : "#FEF3C7", color: a.valide ? "var(--success)" : "#92400E", fontWeight: 600 }}>{a.valide ? "Publié" : "En attente"}</span>
                    </div>
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "8px" }}>{a.contenu}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Onglet Paramètres ── */}
      {onglet === "parametres" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          <div>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "16px" }}>Informations personnelles</h2>
              {message && <div style={{ background: message.startsWith("Erreur") ? "#FEF2F2" : "var(--success-light)", border: "1px solid " + (message.startsWith("Erreur") ? "#FECACA" : "#A7F3D0"), color: message.startsWith("Erreur") ? "#DC2626" : "var(--success)", borderRadius: "8px", padding: "10px", marginBottom: "12px", fontSize: "13px", fontWeight: 500 }}>{message}</div>}
              <form onSubmit={updateProfil} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div><label style={labelStyle}>Pseudo</label><input type="text" value={pseudo} onChange={e => setPseudo(e.target.value)} required minLength={3} style={inputStyle} /></div>
                <div><label style={labelStyle}>Classement FFTT</label><input type="text" value={classement} onChange={e => setClassement(e.target.value)} style={inputStyle} placeholder="Ex: 500, N3, R6..." /></div>
                <div><label style={labelStyle}>Club</label><input type="text" value={club} onChange={e => setClub(e.target.value)} style={inputStyle} placeholder="Nom de votre club" /></div>
                <div>
                  <label style={labelStyle}>Région</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} style={inputStyle}>
                    <option value="">Choisir...</option>
                    {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <button type="submit" style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>Sauvegarder</button>
              </form>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Informations du compte</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "4px" }}>Email : {user?.email}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Membre depuis : {new Date(profil?.cree_le).toLocaleDateString("fr-FR")}</p>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Newsletter</h2>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", marginBottom: "2px" }}>Newsletter TT-Kip</p>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Nouveaux produits, articles, actus ping</p>
                </div>
                <button onClick={toggleNewsletter} disabled={newsletterLoading}
                  style={{ flexShrink: 0, padding: "8px 16px", borderRadius: "20px", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", transition: "background 0.15s",
                    background: newsletterOk ? "#F0FAF4" : "#D97757",
                    color: newsletterOk ? "#2D7A4F" : "#fff"
                  }}>
                  {newsletterLoading ? "…" : newsletterOk ? "Se désinscrire" : "S'inscrire"}
                </button>
              </div>
              {newsletterMsg && (
                <p style={{ fontSize: "12px", marginTop: "10px", fontWeight: 500, color: newsletterMsg.startsWith("Erreur") ? "#DC2626" : "#2D7A4F" }}>
                  {newsletterMsg}
                </p>
              )}
            </div>

            <div style={{ border: "1px solid #FECACA", borderRadius: "10px", padding: "20px", background: "#FFF5F5" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#DC2626", marginBottom: "8px" }}>Suppression du compte</h2>
              <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "14px", lineHeight: 1.5 }}>
                La suppression de votre compte est définitive. Toutes vos données (profil, avis, matériel) seront effacées.
              </p>
              <button onClick={() => setShowDeleteModal(true)}
                style={{ background: "none", border: "1px solid #DC2626", color: "#DC2626", borderRadius: "8px", padding: "9px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", width: "100%" }}>
                Je veux supprimer mon compte
              </button>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "4px" }}>Mon équipement</h2>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "16px" }}>Tapez pour rechercher et sélectionner votre matériel.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <SearchInput
                label="Bois"
                value={searchBois || boisNom}
                onChange={(v: string) => { setSearchBois(v); setBoisNom(v); setBoisId(null); searchProduits(v, "bois") }}
                results={resultsBois}
                onSelect={(p: any) => { setBoisId(p.id); setBoisNom(p.nom + " — " + p.marques?.nom); setSearchBois(""); setResultsBois([]) }}
                selected={boisId ? boisNom : null}
              />
              <SearchInput
                label="Revêtement coup droit"
                value={searchCD || cdNom}
                onChange={(v: string) => { setSearchCD(v); setCdNom(v); setCdId(null); searchProduits(v, "cd") }}
                results={resultsCD}
                onSelect={(p: any) => { setCdId(p.id); setCdNom(p.nom + " — " + p.marques?.nom); setSearchCD(""); setResultsCD([]) }}
                selected={cdId ? cdNom : null}
              />
              <SearchInput
                label="Revêtement revers"
                value={searchRV || rvNom}
                onChange={(v: string) => { setSearchRV(v); setRvNom(v); setRvId(null); searchProduits(v, "rv") }}
                results={resultsRV}
                onSelect={(p: any) => { setRvId(p.id); setRvNom(p.nom + " — " + p.marques?.nom); setSearchRV(""); setResultsRV([]) }}
                selected={rvId ? rvNom : null}
              />
              <button onClick={updateProfil as any}
                style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Sauvegarder l'équipement
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
