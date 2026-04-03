"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const CATEGORIES_TABLES = {
  revetements: { table: "revetements", label: "Revêtement" },
  bois: { table: "bois", label: "Bois" },
  balles: { table: "balles", label: "Balle" },
  chaussures: { table: "chaussures", label: "Chaussure" },
  colles: { table: "colles", label: "Colle" },
}

export default function AjouterPage() {
  const [marques, setMarques] = useState<any[]>([])
  const [subcats, setSubcats] = useState<any[]>([])
  const [categorie, setCategorie] = useState("revetements")
  const [marqueId, setMarqueId] = useState("")
  const [nom, setNom] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Champs communs
  const [description, setDescription] = useState("")

  // Revêtements
  const [numeroLarc, setNumeroLarc] = useState("")
  const [typeRev, setTypeRev] = useState("In")
  const [couleurs, setCouleurs] = useState("")
  const [vitesse, setVitesse] = useState("")
  const [effet, setEffet] = useState("")
  const [controle, setControle] = useState("")
  const [poids, setPoids] = useState("")

  // Bois
  const [nombrePlis, setNombrePlis] = useState("")
  const [composition, setComposition] = useState("")
  const [typeJeu, setTypeJeu] = useState("")
  const [typeManche, setTypeManche] = useState("")
  const [tailleLame, setTailleLame] = useState("")
  const [rigidite, setRigidite] = useState("")
  const [boisVitesse, setBoisVitesse] = useState("")
  const [boisControle, setBoisControle] = useState("")
  const [boisPoids, setBoisPoids] = useState("")

  // Balles
  const [etoiles, setEtoiles] = useState("")
  const [materiau, setMateriau] = useState("")
  const [couleurBalle, setCouleurBalle] = useState("")
  const [diametre, setDiametre] = useState("")
  const [poidsBalle, setPoidsBalle] = useState("")
  const [certification, setCertification] = useState("")
  const [packQuantite, setPackQuantite] = useState("")

  // Chaussures
  const [genre, setGenre] = useState("")
  const [typeSemelle, setTypeSemelle] = useState("")
  const [pointures, setPointures] = useState("")
  const [couleurChaussure, setCouleurChaussure] = useState("")
  const [prix, setPrix] = useState("")

  // Colles
  const [typeColle, setTypeColle] = useState("")
  const [volumeColle, setVolumeColle] = useState("")
  const [baseEau, setBaseEau] = useState(true)
  const [tempsSechage, setTempsSechage] = useState("")
  const [odeur, setOdeur] = useState("")

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
    const [{ data: m }, { data: s }] = await Promise.all([
      supabase.from("marques").select("id, nom").order("nom"),
      supabase.from("sous_categories").select("id, nom, slug").order("nom")
    ])
    setMarques(m || [])
    setSubcats(s || [])
  }

  const subcatsFiltrees = subcats.filter(s => s.slug.startsWith(categorie === "revetements" ? "revetements" : categorie))
  const [subcatId, setSubcatId] = useState("")

  function resetForm() {
    setNom(""); setMarqueId(""); setSubcatId(""); setDescription("")
    setNumeroLarc(""); setCouleurs(""); setVitesse(""); setEffet(""); setControle(""); setPoids("")
    setNombrePlis(""); setComposition(""); setTypeJeu(""); setTypeManche(""); setTailleLame(""); setRigidite(""); setBoisVitesse(""); setBoisControle(""); setBoisPoids("")
    setEtoiles(""); setMateriau(""); setCouleurBalle(""); setDiametre(""); setPoidsBalle(""); setCertification(""); setPackQuantite("")
    setGenre(""); setTypeSemelle(""); setPointures(""); setCouleurChaussure(""); setPrix("")
    setTypeColle(""); setVolumeColle(""); setBaseEau(true); setTempsSechage(""); setOdeur("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const marqueNom = marques.find(m => m.id === marqueId)?.nom || ""
    const slug = (marqueNom + "-" + nom).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80)

    const { data: prod, error: prodErr } = await supabase.from("produits").insert({
      subcategory_id: subcatId || null,
      marque_id: marqueId || null,
      nom, slug, actif: true, description: description || null
    }).select("id").single()

    if (prodErr) { setMessage("Erreur : " + prodErr.message); setLoading(false); return }

    let detailErr = null
    if (categorie === "revetements") {
      const { error } = await supabase.from("revetements").insert({
        produit_id: prod.id, larc_approuve: !!numeroLarc,
        numero_larc: numeroLarc || null, type_revetement: typeRev,
        couleurs_dispo: couleurs || null,
        vitesse_note: vitesse ? parseInt(vitesse) : null,
        effet_note: effet ? parseInt(effet) : null,
        controle_note: controle ? parseInt(controle) : null,
        poids: poids || null
      })
      detailErr = error
    } else if (categorie === "bois") {
      const { error } = await supabase.from("bois").insert({
        produit_id: prod.id,
        nombre_plis: nombrePlis ? parseInt(nombrePlis) : null,
        composition: composition || null, type_jeu: typeJeu || null,
        type_manche: typeManche || null, taille_lame: tailleLame || null,
        rigidite: rigidite || null,
        vitesse_note: boisVitesse ? parseInt(boisVitesse) : null,
        controle_note: boisControle ? parseInt(boisControle) : null,
        poids: boisPoids || null
      })
      detailErr = error
    } else if (categorie === "balles") {
      const { error } = await supabase.from("balles").insert({
        produit_id: prod.id,
        etoiles: etoiles ? parseInt(etoiles) : null,
        materiau: materiau || null, couleur: couleurBalle || null,
        diametre_mm: diametre ? parseFloat(diametre) : null,
        poids_g: poidsBalle ? parseFloat(poidsBalle) : null,
        certification: certification || null,
        pack_quantite: packQuantite ? parseInt(packQuantite) : null
      })
      detailErr = error
    } else if (categorie === "chaussures") {
      const { error } = await supabase.from("chaussures").insert({
        produit_id: prod.id, genre: genre || null,
        type_semelle: typeSemelle || null, pointures: pointures || null,
        couleur: couleurChaussure || null, prix_indicatif: prix || null
      })
      detailErr = error
    } else if (categorie === "colles") {
      const { error } = await supabase.from("colles").insert({
        produit_id: prod.id, type_colle: typeColle || null,
        volume_ml: volumeColle ? parseInt(volumeColle) : null,
        base_eau: baseEau, temps_sechage: tempsSechage || null,
        odeur: odeur || null
      })
      detailErr = error
    }

    if (detailErr) {
      setMessage("Produit créé mais erreur sur les détails : " + detailErr.message)
    } else {
      setMessage("Produit ajouté avec succès !")
      resetForm()
    }
    setLoading(false)
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const sectionStyle = { marginBottom: "20px" }

  return (
    <main style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour à l'administration
      </a>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>Ajouter un produit</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>Les champs varient selon la catégorie choisie.</p>

      {message && (
        <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0" }}>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Informations générales</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={sectionStyle}>
              <label style={labelStyle}>Catégorie</label>
              <select value={categorie} onChange={e => { setCategorie(e.target.value); setSubcatId("") }} style={inputStyle}>
                <option value="revetements">Revêtement</option>
                <option value="bois">Bois</option>
                <option value="balles">Balle</option>
                <option value="chaussures">Chaussure</option>
                <option value="colles">Colle</option>
              </select>
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Marque</label>
              <select value={marqueId} onChange={e => setMarqueId(e.target.value)} style={inputStyle}>
                <option value="">Choisir une marque...</option>
                {marques.map(m => <option key={m.id} value={m.id}>{m.nom}</option>)}
              </select>
            </div>
            <div style={sectionStyle}>
              <label style={labelStyle}>Nom du produit</label>
              <input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={inputStyle} placeholder="Ex: Tenergy 05" />
            </div>
            {subcatsFiltrees.length > 0 && (
              <div style={sectionStyle}>
                <label style={labelStyle}>Sous-catégorie</label>
                <select value={subcatId} onChange={e => setSubcatId(e.target.value)} style={inputStyle}>
                  <option value="">Choisir...</option>
                  {subcatsFiltrees.map(s => <option key={s.id} value={s.id}>{s.nom}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        {categorie === "revetements" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Détails du revêtement</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><label style={labelStyle}>Numéro LARC</label><input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} style={inputStyle} placeholder="Ex: 012-345" /></div>
              <div><label style={labelStyle}>Type</label><select value={typeRev} onChange={e => setTypeRev(e.target.value)} style={inputStyle}><option value="In">Backside</option><option value="Out">Picots courts</option><option value="Long">Picots longs</option><option value="Anti">Anti-spin</option></select></div>
              <div><label style={labelStyle}>Couleurs disponibles</label><input type="text" value={couleurs} onChange={e => setCouleurs(e.target.value)} style={inputStyle} placeholder="Ex: Black, Red" /></div>
              <div><label style={labelStyle}>Poids</label><input type="text" value={poids} onChange={e => setPoids(e.target.value)} style={inputStyle} placeholder="Ex: 45g" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Vitesse /10</label><input type="number" min="1" max="10" value={vitesse} onChange={e => setVitesse(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={labelStyle}>Effet /10</label><input type="number" min="1" max="10" value={effet} onChange={e => setEffet(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={labelStyle}>Contrôle /10</label><input type="number" min="1" max="10" value={controle} onChange={e => setControle(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
              </div>
            </div>
          </div>
        )}

        {categorie === "bois" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Détails du bois</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Nombre de plis</label><input type="number" value={nombrePlis} onChange={e => setNombrePlis(e.target.value)} style={inputStyle} placeholder="Ex: 5" /></div>
                <div><label style={labelStyle}>Poids</label><input type="text" value={boisPoids} onChange={e => setBoisPoids(e.target.value)} style={inputStyle} placeholder="Ex: 85g" /></div>
              </div>
              <div><label style={labelStyle}>Composition</label><input type="text" value={composition} onChange={e => setComposition(e.target.value)} style={inputStyle} placeholder="Ex: 5 bois + 2 carbone" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Type de jeu</label><input type="text" value={typeJeu} onChange={e => setTypeJeu(e.target.value)} style={inputStyle} placeholder="Ex: Offensif" /></div>
                <div><label style={labelStyle}>Type de manche</label><input type="text" value={typeManche} onChange={e => setTypeManche(e.target.value)} style={inputStyle} placeholder="Ex: Flared" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Taille de lame</label><input type="text" value={tailleLame} onChange={e => setTailleLame(e.target.value)} style={inputStyle} placeholder="Ex: 157x150mm" /></div>
                <div><label style={labelStyle}>Rigidité</label><input type="text" value={rigidite} onChange={e => setRigidite(e.target.value)} style={inputStyle} placeholder="Ex: Rigide" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Vitesse /10</label><input type="number" min="1" max="10" value={boisVitesse} onChange={e => setBoisVitesse(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
                <div><label style={labelStyle}>Contrôle /10</label><input type="number" min="1" max="10" value={boisControle} onChange={e => setBoisControle(e.target.value)} style={inputStyle} placeholder="1-10" /></div>
              </div>
            </div>
          </div>
        )}

        {categorie === "balles" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Détails de la balle</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Etoiles</label><select value={etoiles} onChange={e => setEtoiles(e.target.value)} style={inputStyle}><option value="">Choisir...</option><option value="1">1 étoile</option><option value="2">2 étoiles</option><option value="3">3 étoiles</option></select></div>
                <div><label style={labelStyle}>Matériau</label><input type="text" value={materiau} onChange={e => setMateriau(e.target.value)} style={inputStyle} placeholder="Ex: Plastique ABS" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Couleur</label><input type="text" value={couleurBalle} onChange={e => setCouleurBalle(e.target.value)} style={inputStyle} placeholder="Ex: Blanc, Orange" /></div>
                <div><label style={labelStyle}>Certification</label><input type="text" value={certification} onChange={e => setCertification(e.target.value)} style={inputStyle} placeholder="Ex: ITTF approuvée" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Diamètre (mm)</label><input type="number" step="0.1" value={diametre} onChange={e => setDiametre(e.target.value)} style={inputStyle} placeholder="40.5" /></div>
                <div><label style={labelStyle}>Poids (g)</label><input type="number" step="0.1" value={poidsBalle} onChange={e => setPoidsBalle(e.target.value)} style={inputStyle} placeholder="2.7" /></div>
                <div><label style={labelStyle}>Quantité/pack</label><input type="number" value={packQuantite} onChange={e => setPackQuantite(e.target.value)} style={inputStyle} placeholder="Ex: 6" /></div>
              </div>
            </div>
          </div>
        )}

        {categorie === "chaussures" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Détails de la chaussure</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Genre</label><select value={genre} onChange={e => setGenre(e.target.value)} style={inputStyle}><option value="">Choisir...</option><option value="Homme">Homme</option><option value="Femme">Femme</option><option value="Junior">Junior</option><option value="Mixte">Mixte</option></select></div>
                <div><label style={labelStyle}>Type de semelle</label><input type="text" value={typeSemelle} onChange={e => setTypeSemelle(e.target.value)} style={inputStyle} placeholder="Ex: Caoutchouc" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Pointures</label><input type="text" value={pointures} onChange={e => setPointures(e.target.value)} style={inputStyle} placeholder="Ex: 36-47" /></div>
                <div><label style={labelStyle}>Couleur</label><input type="text" value={couleurChaussure} onChange={e => setCouleurChaussure(e.target.value)} style={inputStyle} placeholder="Ex: Blanc/Rouge" /></div>
              </div>
              <div><label style={labelStyle}>Prix indicatif</label><input type="text" value={prix} onChange={e => setPrix(e.target.value)} style={inputStyle} placeholder="Ex: 89€" /></div>
            </div>
          </div>
        )}

        {categorie === "colles" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Détails de la colle</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Type de colle</label><input type="text" value={typeColle} onChange={e => setTypeColle(e.target.value)} style={inputStyle} placeholder="Ex: Colle à eau" /></div>
                <div><label style={labelStyle}>Volume (ml)</label><input type="number" value={volumeColle} onChange={e => setVolumeColle(e.target.value)} style={inputStyle} placeholder="Ex: 100" /></div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Temps de séchage</label><input type="text" value={tempsSechage} onChange={e => setTempsSechage(e.target.value)} style={inputStyle} placeholder="Ex: 30 minutes" /></div>
                <div><label style={labelStyle}>Odeur</label><input type="text" value={odeur} onChange={e => setOdeur(e.target.value)} style={inputStyle} placeholder="Ex: Faible" /></div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input type="checkbox" id="baseEau" checked={baseEau} onChange={e => setBaseEau(e.target.checked)} style={{ width: "16px", height: "16px" }} />
                <label htmlFor="baseEau" style={{ fontSize: "14px", fontWeight: 500, cursor: "pointer" }}>Base eau (écologique)</label>
              </div>
            </div>
          </div>
        )}

        <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </form>
    </main>
  )
}