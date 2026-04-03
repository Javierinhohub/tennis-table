"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const REGIONS = ["Auvergne-Rhône-Alpes","Bourgogne-Franche-Comté","Bretagne","Centre-Val de Loire","Corse","Grand Est","Hauts-de-France","Île-de-France","Normandie","Nouvelle-Aquitaine","Occitanie","Pays de la Loire","Provence-Alpes-Côte d'Azur","Guadeloupe","Martinique","Guyane","La Réunion","Mayotte","Autre"]

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
    e.preventDefault()
    setMessage("")
    const { error } = await supabase.from("utilisateurs").update({
      pseudo, classement: classement || null,
      region: region || null, club: club || null,
      bois_id: boisId || null,
      revetement_cd_id: cdId || null,
      revetement_rv_id: rvId || null,
    }).eq("id", user.id)
    if (error) { setMessage("Erreur : " + error.message); return }
    setMessage("Profil mis à jour avec succès !")
    await fetchData()
  }

  async function retirerMateriel(id: string) {
    await supabase.from("utilisateurs_produits").delete().eq("id", id)
    await fetchData()
  }

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  const SearchInput = ({ label, value, onChange, results, onSelect, selected }: any) => (
    <div style={{ position: "relative" }}>
      <label style={labelStyle}>{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} style={inputStyle} placeholder={"Rechercher " + label.toLowerCase() + "..."} />
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

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "2rem" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", fontWeight: 700, color: "#D97757" }}>
          {profil?.pseudo?.[0]?.toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2px" }}>{profil?.pseudo}</h1>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {profil?.classement && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Classement : <strong>{profil.classement}</strong></span>}
            {profil?.club && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Club : <strong>{profil.club}</strong></span>}
            {profil?.region && <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{profil.region}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <div style={{ textAlign: "center", padding: "8px 14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#D97757" }}>{materiel.length}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Matériel</p>
          </div>
          <div style={{ textAlign: "center", padding: "8px 14px", background: "#fff", border: "1px solid var(--border)", borderRadius: "8px" }}>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#D97757" }}>{avis.length}</p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>Avis</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "2rem" }}>
        {[
          { id: "materiel", label: "Mon matériel" },
          { id: "avis", label: "Mes avis" },
          { id: "parametres", label: "Paramètres" },
        ].map(t => (
          <button key={t.id} onClick={() => { setOnglet(t.id); setMessage("") }}
            style={{ background: "none", border: "none", borderBottom: onglet === t.id ? "2px solid #D97757" : "2px solid transparent", color: onglet === t.id ? "#D97757" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
            {t.label}
          </button>
        ))}
      </div>

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
                  <p style={{ color: "var(--text-light)", fontSize: "12px" }}>{new Date(a.cree_le).toLocaleDateString("fr-FR")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "8px" }}>Informations du compte</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "4px" }}>Email : {user?.email}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Membre depuis : {new Date(profil?.cree_le).toLocaleDateString("fr-FR")}</p>
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
              <button onClick={updateProfil as any} style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "10px", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif" }}>
                Sauvegarder l'équipement
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}