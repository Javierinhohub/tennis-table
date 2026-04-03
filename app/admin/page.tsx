"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

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

  // Nouveau joueur
  const [joueurNom, setJoueurNom] = useState("")
  const [joueurPays, setJoueurPays] = useState("")
  const [joueurClassement, setJoueurClassement] = useState("")

  // Liaison joueur-produit
  const [liaisonJoueurId, setLiaisonJoueurId] = useState("")
  const [liaisonProduitSearch, setLiaisonProduitSearch] = useState("")
  const [liaisonProduitId, setLiaisonProduitId] = useState("")
  const [produitsFiltres, setProduitsFiltres] = useState<any[]>([])

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    await Promise.all([fetchAvis(), fetchProduits(), fetchMarques(), fetchSubcats(), fetchJoueurs(), fetchLiaisons()])
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

  useEffect(() => {
    if (liaisonProduitSearch.length < 2) { setProduitsFiltres([]); return }
    const s = liaisonProduitSearch.toLowerCase()
    setProduitsFiltres(produits.filter(p => p.nom.toLowerCase().includes(s) || (p.marques && p.marques.nom.toLowerCase().includes(s))).slice(0, 8))
  }, [liaisonProduitSearch, produits])

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

  const onglets = [
    { id: "avis", label: "Avis", count: avisEnAttente.length },
    { id: "produits", label: "Produits", count: produits.length },
    { id: "ajouter", label: "Ajouter un revêtement" },
    { id: "joueurs", label: "Joueurs pro", count: joueurs.length },
    { id: "liaisons", label: "Lier joueur / revêtement" },
  ]

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const btnPrimary = { background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "10px 16px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%" }
  const btnDanger = { background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }
  const btnSuccess = { background: "var(--success-light)", color: "var(--success)", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "12px", fontWeight: 500, cursor: "pointer" }

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Administration</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Gestion du site tennis de table</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {avisEnAttente.length > 0 && <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px" }}>{avisEnAttente.length} avis en attente</span>}
          <span style={{ background: "var(--accent-light)", color: "var(--accent)", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "6px" }}>{produits.length} produits</span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0", borderBottom: "1px solid var(--border)", marginBottom: "2rem", overflowX: "auto" }}>
        {onglets.map(t => (
          <button key={t.id} onClick={() => { setOnglet(t.id); setMessage("") }}
            style={{ background: "none", border: "none", borderBottom: onglet === t.id ? "2px solid var(--accent)" : "2px solid transparent",
              color: onglet === t.id ? "var(--accent)" : "var(--text-muted)", padding: "10px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" as const, display: "flex", alignItems: "center", gap: "6px" }}>
            {t.label}
            {t.count !== undefined && t.count > 0 && <span style={{ background: onglet === t.id ? "var(--accent-light)" : "var(--border)", color: onglet === t.id ? "var(--accent)" : "var(--text-muted)", borderRadius: "10px", padding: "1px 6px", fontSize: "11px" }}>{t.count}</span>}
          </button>
        ))}
      </div>

      {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>{message}</div>}

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

      {onglet === "produits" && (
        <div>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px" }}>Tous les produits ({produits.length})</h2>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Nom</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Marque</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Catégorie</th>
                  <th style={{ padding: "10px 16px", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {produits.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: i < produits.length - 1 ? "1px solid var(--border)" : "none", opacity: p.actif ? 1 : 0.5 }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500, fontSize: "13px" }}>{p.nom}</td>
                    <td style={{ padding: "10px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.marques?.nom}</td>
                    <td style={{ padding: "10px 16px", color: "var(--text-muted)", fontSize: "13px" }}>{p.sous_categories?.nom}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button onClick={() => toggleProduit(p.id, p.actif)} style={{ ...btnSuccess, background: p.actif ? "var(--bg)" : "var(--success-light)", color: p.actif ? "var(--text-muted)" : "var(--success)" }}>{p.actif ? "Désactiver" : "Activer"}</button>
                        <button onClick={() => supprimerProduit(p.id)} style={btnDanger}>Supprimer</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {onglet === "ajouter" && (
        <div style={{ maxWidth: "560px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "1.5rem" }}>Ajouter un revêtement</h2>
          <form onSubmit={ajouterProduit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div><label style={labelStyle}>Marque</label><select value={marqueId} onChange={e => setMarqueId(e.target.value)} required style={inputStyle}><option value="">Choisir...</option>{marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}</select></div>
            <div><label style={labelStyle}>Nom du revêtement</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={inputStyle} placeholder="Ex: Tenergy 05" /></div>
            <div><label style={labelStyle}>Sous-catégorie</label><select value={subcatId} onChange={e => setSubcatId(e.target.value)} required style={inputStyle}><option value="">Choisir...</option>{subcats.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}</select></div>
            <div><label style={labelStyle}>Numéro LARC</label><input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} style={inputStyle} placeholder="Ex: 012-345" /></div>
            <div><label style={labelStyle}>Type</label><select value={typeRev} onChange={e => setTypeRev(e.target.value)} style={inputStyle}><option value="In">Inversé</option><option value="Out">Picots courts</option><option value="Long">Picots longs</option><option value="Anti">Anti-spin</option></select></div>
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
                        onMouseLeave={e => e.currentTarget.style.background = liaisonProduitId === p.id ? "var(--accent-light)" : "#fff"}
                      >
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