"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import AdminSearchBar from "@/app/components/AdminSearchBar"

function BarreNotes({ label, value, onChange, color }: { label: string, value: string, onChange: (v: string) => void, color: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{label}</label>
        <span style={{ fontSize: "13px", fontWeight: 700, color }}>{value || "—"}{value ? "/10" : ""}</span>
      </div>
      <div style={{ display: "flex", gap: "4px" }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} type="button" onClick={() => onChange(value === String(n) ? "" : String(n))}
            style={{ flex: 1, height: "28px", borderRadius: "4px", border: "none", cursor: "pointer", transition: "background 0.1s", fontFamily: "Poppins, sans-serif", fontSize: "11px", fontWeight: 600,
              background: parseInt(value) >= n ? color : "var(--border)",
              color: parseInt(value) >= n ? "#fff" : "var(--text-muted)"
            }}>
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ModifierPage() {
  const [produit, setProduit] = useState<any>(null)
  const [rev, setRev] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Infos générales
  const [nom, setNom] = useState("")
  const [couleurs, setCouleurs] = useState("")
  const [numeroLarc, setNumeroLarc] = useState("")
  const [typeRev, setTypeRev] = useState("")
  const [epaisseur, setEpaisseur] = useState("")
  const [poids, setPoids] = useState("")

  // Notes TT-Kip (staff interne)
  const [vitesse, setVitesse] = useState("")
  const [effet, setEffet] = useState("")
  const [controle, setControle] = useState("")
  const [ttkDurabilite, setTtkDurabilite] = useState("")
  const [ttkDurete, setTtkDurete] = useState("")
  const [ttkRejet, setTtkRejet] = useState("")
  const [ttkQualitePrix, setTtkQualitePrix] = useState("")
  const [ttkAdherence, setTtkAdherence] = useState("")
  const [ttkGene, setTtkGene] = useState("")
  const [ttkInversion, setTtkInversion] = useState("")

  // Notes marque
  const [marqueVitesse, setMarqueVitesse] = useState("")
  const [marqueSpin, setMarqueSpin] = useState("")
  const [marqueControle, setMarqueControle] = useState("")
  const [marqueDurete, setMarqueDurete] = useState("")
  const [marqueDurabilite, setMarqueDurabilite] = useState("")
  const [marqueRejet, setMarqueRejet] = useState("")
  const [marqueQualitePrix, setMarqueQualitePrix] = useState("")
  const [marqueAdherence, setMarqueAdherence] = useState("")
  const [marqueGene, setMarqueGene] = useState("")
  const [marqueInversion, setMarqueInversion] = useState("")
  const [marqueGlobale, setMarqueGlobale] = useState("")
  const [commentaireMarque, setCommentaireMarque] = useState("")

  // Stats utilisateurs
  const [statsUtilisateurs, setStatsUtilisateurs] = useState<any>(null)

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
  }

  async function selectionnerProduit(p: any) {
    setMessage("")
    const { data } = await supabase
      .from("produits")
      .select("id, nom, marques(nom), revetements(*)")
      .eq("id", p.id)
      .single()
    if (!data) return
    setProduit(data)
    const r = data.revetements as any
    setRev(r)
    setNom(data.nom || "")
    setNumeroLarc(r?.numero_larc || "")
    setTypeRev(r?.type_revetement || "In")
    setCouleurs(r?.couleurs_dispo || "")
    setEpaisseur(r?.epaisseur_max ? String(r.epaisseur_max) : "")
    setPoids(r?.poids || "")

    // Notes TT-Kip
    setVitesse(r?.vitesse_note ? String(r.vitesse_note) : "")
    setEffet(r?.effet_note ? String(r.effet_note) : "")
    setControle(r?.controle_note ? String(r.controle_note) : "")
    setTtkDurabilite(r?.note_ttk_durabilite ? String(r.note_ttk_durabilite) : "")
    setTtkDurete(r?.note_ttk_durete ? String(r.note_ttk_durete) : "")
    setTtkRejet(r?.note_ttk_rejet ? String(r.note_ttk_rejet) : "")
    setTtkQualitePrix(r?.note_ttk_qualite_prix ? String(r.note_ttk_qualite_prix) : "")
    setTtkAdherence(r?.note_ttk_adherence ? String(r.note_ttk_adherence) : "")
    setTtkGene(r?.note_ttk_gene ? String(r.note_ttk_gene) : "")
    setTtkInversion(r?.note_ttk_inversion ? String(r.note_ttk_inversion) : "")

    // Notes marque
    setMarqueVitesse(r?.note_marque_vitesse ? String(r.note_marque_vitesse) : "")
    setMarqueSpin(r?.note_marque_spin ? String(r.note_marque_spin) : "")
    setMarqueControle(r?.note_marque_controle ? String(r.note_marque_controle) : "")
    setMarqueDurete(r?.note_marque_durete ? String(r.note_marque_durete) : "")
    setMarqueDurabilite(r?.note_marque_durabilite ? String(r.note_marque_durabilite) : "")
    setMarqueRejet(r?.note_marque_rejet ? String(r.note_marque_rejet) : "")
    setMarqueQualitePrix(r?.note_marque_qualite_prix ? String(r.note_marque_qualite_prix) : "")
    setMarqueAdherence(r?.note_marque_adherence ? String(r.note_marque_adherence) : "")
    setMarqueGene(r?.note_marque_gene ? String(r.note_marque_gene) : "")
    setMarqueInversion(r?.note_marque_inversion ? String(r.note_marque_inversion) : "")
    setMarqueGlobale(r?.note_marque_globale ? String(r.note_marque_globale) : "")
    setCommentaireMarque(r?.commentaire_marque || "")

    fetchStatsUtilisateurs(data.id)
  }

  async function fetchStatsUtilisateurs(produitId: string) {
    const { data: avisData } = await supabase
      .from("avis")
      .select("note")
      .eq("produit_id", produitId)
      .eq("valide", true)
    if (!avisData || avisData.length === 0) { setStatsUtilisateurs(null); return }
    const total = avisData.length
    const moyenne = avisData.reduce((s, a) => s + a.note, 0) / total
    const distribution = [1,2,3,4,5].map(n => ({
      note: n,
      count: avisData.filter(a => a.note === n).length,
      pct: Math.round(avisData.filter(a => a.note === n).length / total * 100)
    }))
    setStatsUtilisateurs({ total, moyenne: Math.round(moyenne * 10) / 10, distribution })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")
    await supabase.from("produits").update({ nom }).eq("id", produit.id)
    await supabase.from("revetements").update({
      numero_larc: numeroLarc || null,
      type_revetement: typeRev,
      couleurs_dispo: couleurs || null,
      epaisseur_max: epaisseur ? parseFloat(epaisseur) : null,
      poids: poids || null,
      // Notes TT-Kip
      vitesse_note: vitesse ? parseInt(vitesse) : null,
      effet_note: effet ? parseInt(effet) : null,
      controle_note: controle ? parseInt(controle) : null,
      note_ttk_durabilite: ttkDurabilite ? parseFloat(ttkDurabilite) : null,
      note_ttk_durete: ttkDurete ? parseFloat(ttkDurete) : null,
      note_ttk_rejet: ttkRejet ? parseFloat(ttkRejet) : null,
      note_ttk_qualite_prix: ttkQualitePrix ? parseFloat(ttkQualitePrix) : null,
      note_ttk_adherence: ttkAdherence ? parseFloat(ttkAdherence) : null,
      note_ttk_gene: ttkGene ? parseFloat(ttkGene) : null,
      note_ttk_inversion: ttkInversion ? parseFloat(ttkInversion) : null,
      // Notes marque
      note_marque_vitesse: marqueVitesse ? parseFloat(marqueVitesse) : null,
      note_marque_spin: marqueSpin ? parseFloat(marqueSpin) : null,
      note_marque_controle: marqueControle ? parseFloat(marqueControle) : null,
      note_marque_durete: marqueDurete ? parseFloat(marqueDurete) : null,
      note_marque_durabilite: marqueDurabilite ? parseFloat(marqueDurabilite) : null,
      note_marque_rejet: marqueRejet ? parseFloat(marqueRejet) : null,
      note_marque_qualite_prix: marqueQualitePrix ? parseFloat(marqueQualitePrix) : null,
      note_marque_adherence: marqueAdherence ? parseFloat(marqueAdherence) : null,
      note_marque_gene: marqueGene ? parseFloat(marqueGene) : null,
      note_marque_inversion: marqueInversion ? parseFloat(marqueInversion) : null,
      note_marque_globale: marqueGlobale ? parseFloat(marqueGlobale) : null,
      commentaire_marque: commentaireMarque || null,
    }).eq("produit_id", produit.id)
    setMessage("Modifications enregistrées !")
    setLoading(false)
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Poppins, sans-serif", outline: "none", color: "var(--text)", boxSizing: "border-box" as const }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }
  const cardStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }

  // Critères TT-Kip selon le type de revêtement
  const ttkCriteres = {
    In: [
      { label: "Vitesse", value: vitesse, onChange: setVitesse },
      { label: "Effet / Spin", value: effet, onChange: setEffet },
      { label: "Contrôle", value: controle, onChange: setControle },
      { label: "Durabilité", value: ttkDurabilite, onChange: setTtkDurabilite },
      { label: "Dureté mousse", value: ttkDurete, onChange: setTtkDurete },
      { label: "Rejet", value: ttkRejet, onChange: setTtkRejet },
      { label: "Qualité / Prix", value: ttkQualitePrix, onChange: setTtkQualitePrix },
    ],
    Out: [
      { label: "Vitesse", value: vitesse, onChange: setVitesse },
      { label: "Contrôle", value: controle, onChange: setControle },
      { label: "Gêne adverse", value: ttkGene, onChange: setTtkGene },
      { label: "Durabilité", value: ttkDurabilite, onChange: setTtkDurabilite },
      { label: "Qualité / Prix", value: ttkQualitePrix, onChange: setTtkQualitePrix },
    ],
    Long: [
      { label: "Vitesse", value: vitesse, onChange: setVitesse },
      { label: "Gêne adverse", value: ttkGene, onChange: setTtkGene },
      { label: "Inversion", value: ttkInversion, onChange: setTtkInversion },
      { label: "Adhérence", value: ttkAdherence, onChange: setTtkAdherence },
      { label: "Durabilité", value: ttkDurabilite, onChange: setTtkDurabilite },
      { label: "Qualité / Prix", value: ttkQualitePrix, onChange: setTtkQualitePrix },
    ],
    Anti: [
      { label: "Contrôle", value: controle, onChange: setControle },
      { label: "Gêne adverse", value: ttkGene, onChange: setTtkGene },
      { label: "Inversion", value: ttkInversion, onChange: setTtkInversion },
      { label: "Adhérence", value: ttkAdherence, onChange: setTtkAdherence },
      { label: "Durabilité", value: ttkDurabilite, onChange: setTtkDurabilite },
      { label: "Qualité / Prix", value: ttkQualitePrix, onChange: setTtkQualitePrix },
    ],
  } as Record<string, { label: string, value: string, onChange: (v: string) => void }[]>

  // Critères marque selon le type
  const marqueCriteres = {
    In: [
      { label: "Vitesse", value: marqueVitesse, onChange: setMarqueVitesse },
      { label: "Spin", value: marqueSpin, onChange: setMarqueSpin },
      { label: "Contrôle", value: marqueControle, onChange: setMarqueControle },
      { label: "Dureté", value: marqueDurete, onChange: setMarqueDurete },
      { label: "Durabilité", value: marqueDurabilite, onChange: setMarqueDurabilite },
      { label: "Rejet", value: marqueRejet, onChange: setMarqueRejet },
      { label: "Qualité / Prix", value: marqueQualitePrix, onChange: setMarqueQualitePrix },
      { label: "Note globale", value: marqueGlobale, onChange: setMarqueGlobale },
    ],
    Out: [
      { label: "Vitesse", value: marqueVitesse, onChange: setMarqueVitesse },
      { label: "Contrôle", value: marqueControle, onChange: setMarqueControle },
      { label: "Gêne adverse", value: marqueGene, onChange: setMarqueGene },
      { label: "Durabilité", value: marqueDurabilite, onChange: setMarqueDurabilite },
      { label: "Qualité / Prix", value: marqueQualitePrix, onChange: setMarqueQualitePrix },
      { label: "Note globale", value: marqueGlobale, onChange: setMarqueGlobale },
    ],
    Long: [
      { label: "Vitesse", value: marqueVitesse, onChange: setMarqueVitesse },
      { label: "Gêne adverse", value: marqueGene, onChange: setMarqueGene },
      { label: "Inversion", value: marqueInversion, onChange: setMarqueInversion },
      { label: "Adhérence", value: marqueAdherence, onChange: setMarqueAdherence },
      { label: "Durabilité", value: marqueDurabilite, onChange: setMarqueDurabilite },
      { label: "Qualité / Prix", value: marqueQualitePrix, onChange: setMarqueQualitePrix },
      { label: "Note globale", value: marqueGlobale, onChange: setMarqueGlobale },
    ],
    Anti: [
      { label: "Contrôle", value: marqueControle, onChange: setMarqueControle },
      { label: "Gêne adverse", value: marqueGene, onChange: setMarqueGene },
      { label: "Inversion", value: marqueInversion, onChange: setMarqueInversion },
      { label: "Adhérence", value: marqueAdherence, onChange: setMarqueAdherence },
      { label: "Durabilité", value: marqueDurabilite, onChange: setMarqueDurabilite },
      { label: "Qualité / Prix", value: marqueQualitePrix, onChange: setMarqueQualitePrix },
      { label: "Note globale", value: marqueGlobale, onChange: setMarqueGlobale },
    ],
  } as Record<string, { label: string, value: string, onChange: (v: string) => void }[]>

  const currentTtkCriteres = ttkCriteres[typeRev] || ttkCriteres["In"]
  const currentMarqueCriteres = marqueCriteres[typeRev] || marqueCriteres["In"]

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>← Retour à l'administration</a>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>Modifier un revêtement</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>Recherchez un revêtement pour modifier ses caractéristiques et ses notes.</p>

      <AdminSearchBar onSelect={selectionnerProduit} />

      {produit && (
        <form onSubmit={handleSubmit}>
          {message && <div style={{ background: "var(--success-light)", border: "1px solid #A7F3D0", color: "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1rem", fontSize: "14px", fontWeight: 500 }}>{message}</div>}

          {/* Ligne 1 : Infos générales + Notes TT-Kip */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "0" }}>

            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                Informations générales
                <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-muted)", background: "var(--bg)", padding: "2px 8px", borderRadius: "4px" }}>{(produit.marques as any)?.nom}</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div><label style={labelStyle}>Nom</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={inputStyle} /></div>
                <div><label style={labelStyle}>Code LARC</label><input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Type</label>
                  <select value={typeRev} onChange={e => setTypeRev(e.target.value)} style={inputStyle}>
                    <option value="In">Backside</option>
                    <option value="Out">Picots courts</option>
                    <option value="Long">Picots longs</option>
                    <option value="Anti">Anti-spin</option>
                  </select>
                </div>
                <div><label style={labelStyle}>Couleurs</label><input type="text" value={couleurs} onChange={e => setCouleurs(e.target.value)} style={inputStyle} /></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  <div><label style={labelStyle}>Poids</label><input type="text" value={poids} onChange={e => setPoids(e.target.value)} style={inputStyle} placeholder="Ex: 45g" /></div>
                  <div><label style={labelStyle}>Épaisseur max</label><input type="number" step="0.1" value={epaisseur} onChange={e => setEpaisseur(e.target.value)} style={inputStyle} /></div>
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#1A56DB", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                Notes TT-Kip
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#1A56DB", background: "#EFF6FF", padding: "2px 8px", borderRadius: "4px" }}>Évaluation interne</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {currentTtkCriteres.map(c => (
                  <BarreNotes key={c.label} label={c.label} value={c.value} onChange={c.onChange} color="#1A56DB" />
                ))}
              </div>
            </div>
          </div>

          {/* Ligne 2 : Notes marque + Avis utilisateurs */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>

            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#D97757", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                Notes de la marque
                <span style={{ fontSize: "11px", fontWeight: 500, color: "#D97757", background: "#FFF7ED", padding: "2px 8px", borderRadius: "4px" }}>Source officielle</span>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {currentMarqueCriteres.map(c => (
                  <BarreNotes key={c.label} label={c.label} value={c.value} onChange={c.onChange} color="#D97757" />
                ))}
                <div>
                  <label style={labelStyle}>Commentaire officiel de la marque</label>
                  <textarea value={commentaireMarque} onChange={e => setCommentaireMarque(e.target.value)} rows={3}
                    style={{ ...inputStyle, resize: "vertical" as const, lineHeight: 1.5 }}
                    placeholder="Description officielle du revêtement par la marque..." />
                </div>
              </div>
            </div>

            <div style={cardStyle}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#0E7F4F", marginBottom: "16px" }}>
                Avis utilisateurs
                {statsUtilisateurs && <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: "8px" }}>({statsUtilisateurs.total} avis)</span>}
              </p>
              {!statsUtilisateurs ? (
                <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>Aucun avis utilisateur pour ce revêtement.</p>
              ) : (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
                    <div style={{ textAlign: "center" }}>
                      <p style={{ fontSize: "36px", fontWeight: 800, color: "#0E7F4F", lineHeight: 1 }}>{statsUtilisateurs.moyenne}</p>
                      <p style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px" }}>/ 5</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      {[5,4,3,2,1].map((n: number) => {
                        const d = statsUtilisateurs.distribution.find((x: any) => x.note === n)
                        return (
                          <div key={n} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <span style={{ fontSize: "12px", color: "var(--text-muted)", width: "12px" }}>{n}</span>
                            <span style={{ color: "#F59E0B", fontSize: "11px" }}>★</span>
                            <div style={{ flex: 1, background: "var(--border)", borderRadius: "4px", height: "6px" }}>
                              <div style={{ height: "100%", background: "#0E7F4F", borderRadius: "4px", width: (d?.pct || 0) + "%" }} />
                            </div>
                            <span style={{ fontSize: "11px", color: "var(--text-muted)", width: "28px" }}>{d?.count || 0}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}
            style={{ background: "#D97757", color: "#fff", border: "none", borderRadius: "8px", padding: "12px 24px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", opacity: loading ? 0.7 : 1, fontFamily: "Poppins, sans-serif", marginTop: "4px" }}>
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </button>
        </form>
      )}
    </main>
  )
}
