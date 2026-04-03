"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ModifierPage() {
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<any[]>([])
  const [produit, setProduit] = useState<any>(null)
  const [rev, setRev] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  // Champs modifiables
  const [nom, setNom] = useState("")
  const [vitesse, setVitesse] = useState("")
  const [effet, setEffet] = useState("")
  const [controle, setControle] = useState("")
  const [poids, setPoids] = useState("")
  const [couleurs, setCouleurs] = useState("")
  const [numeroLarc, setNumeroLarc] = useState("")
  const [typeRev, setTypeRev] = useState("")
  const [epaisseur, setEpaisseur] = useState("")

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
  }

  useEffect(() => {
    if (search.length < 2) { setResultats([]); return }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("produits")
        .select("id, nom, slug, marques(nom), revetements(id, numero_larc, type_revetement, couleurs_dispo, vitesse_note, effet_note, controle_note, poids, epaisseur_max)")
        .ilike("nom", "%" + search + "%")
        .limit(8)
      setResultats(data || [])
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  function selectionnerProduit(p: any) {
    setProduit(p)
    const r = p.revetements
    setRev(r)
    setNom(p.nom)
    setNumeroLarc(r?.numero_larc || "")
    setTypeRev(r?.type_revetement || "In")
    setCouleurs(r?.couleurs_dispo || "")
    setVitesse(r?.vitesse_note ? String(r.vitesse_note) : "")
    setEffet(r?.effet_note ? String(r.effet_note) : "")
    setControle(r?.controle_note ? String(r.controle_note) : "")
    setPoids(r?.poids || "")
    setEpaisseur(r?.epaisseur_max ? String(r.epaisseur_max) : "")
    setResultats([])
    setSearch("")
    setMessage("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const { error: prodErr } = await supabase
      .from("produits")
      .update({ nom })
      .eq("id", produit.id)

    const { error: revErr } = await supabase
      .from("revetements")
      .update({
        numero_larc: numeroLarc || null,
        type_revetement: typeRev,
        couleurs_dispo: couleurs || null,
        vitesse_note: vitesse ? parseInt(vitesse) : null,
        effet_note: effet ? parseInt(effet) : null,
        controle_note: controle ? parseInt(controle) : null,
        poids: poids || null,
        epaisseur_max: epaisseur ? parseFloat(epaisseur) : null,
      })
      .eq("produit_id", produit.id)

    if (prodErr || revErr) {
      setMessage("Erreur : " + (prodErr?.message || revErr?.message))
    } else {
      setMessage("Revêtement mis à jour avec succès !")
    }
    setLoading(false)
  }

  const inputStyle = { background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px", fontSize: "14px", width: "100%", fontFamily: "Inter, sans-serif", outline: "none", color: "var(--text)" }
  const labelStyle = { display: "block" as const, fontSize: "12px", fontWeight: 600 as const, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase" as const, letterSpacing: "0.4px" }

  return (
    <main style={{ maxWidth: "700px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "var(--accent)", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        Retour à l'administration
      </a>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "0.5rem" }}>Modifier un revêtement</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>Recherchez un revêtement pour modifier ses informations.</p>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
        <label style={labelStyle}>Rechercher un revêtement</label>
        <div style={{ position: "relative" }}>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} style={inputStyle} placeholder="Tapez le nom du revêtement..." />
          {resultats.length > 0 && (
            <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: "#fff", border: "1px solid var(--border)", borderRadius: "8px", marginTop: "4px", zIndex: 10, overflow: "hidden" }}>
              {resultats.map((p, i) => (
                <div key={p.id}
                  onClick={() => selectionnerProduit(p)}
                  style={{ padding: "10px 14px", cursor: "pointer", borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none", fontSize: "13px" }}
                  onMouseEnter={e => e.currentTarget.style.background = "var(--bg)"}
                  onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                >
                  <span style={{ fontWeight: 500 }}>{p.nom}</span>
                  <span style={{ color: "var(--text-muted)", marginLeft: "8px" }}>{p.marques?.nom}</span>
                  {p.revetements?.numero_larc && <span style={{ color: "var(--text-light)", marginLeft: "8px", fontFamily: "monospace", fontSize: "12px" }}>#{p.revetements.numero_larc}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {produit && (
        <form onSubmit={handleSubmit}>
          {message && (
            <div style={{ background: message.startsWith("Erreur") ? "#FEF2F2" : "var(--success-light)", border: "1px solid " + (message.startsWith("Erreur") ? "#FECACA" : "#A7F3D0"), color: message.startsWith("Erreur") ? "#DC2626" : "var(--success)", borderRadius: "8px", padding: "12px 16px", marginBottom: "1.5rem", fontSize: "14px", fontWeight: 500 }}>
            {message}
          </div>
          )}

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Informations générales</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div><label style={labelStyle}>Nom du revêtement</label><input type="text" value={nom} onChange={e => setNom(e.target.value)} required style={inputStyle} /></div>
              <div><label style={labelStyle}>Numéro LARC</label><input type="text" value={numeroLarc} onChange={e => setNumeroLarc(e.target.value)} style={inputStyle} placeholder="Ex: 012-345" /></div>
              <div><label style={labelStyle}>Type</label>
                <select value={typeRev} onChange={e => setTypeRev(e.target.value)} style={inputStyle}>
                  <option value="In">Backside</option>
                  <option value="Out">Picots courts</option>
                  <option value="Long">Picots longs</option>
                  <option value="Anti">Anti-spin</option>
                </select>
              </div>
              <div><label style={labelStyle}>Couleurs disponibles</label><input type="text" value={couleurs} onChange={e => setCouleurs(e.target.value)} style={inputStyle} placeholder="Ex: Black, Red" /></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div><label style={labelStyle}>Poids</label><input type="text" value={poids} onChange={e => setPoids(e.target.value)} style={inputStyle} placeholder="Ex: 45g" /></div>
                <div><label style={labelStyle}>Epaisseur max (mm)</label><input type="number" step="0.1" value={epaisseur} onChange={e => setEpaisseur(e.target.value)} style={inputStyle} placeholder="Ex: 2.1" /></div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "12px" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Performances</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div>
                <label style={labelStyle}>Vitesse /10</label>
                <input type="number" min="1" max="10" value={vitesse} onChange={e => setVitesse(e.target.value)} style={inputStyle} placeholder="1-10" />
                {vitesse && <div style={{ marginTop: "6px", height: "4px", background: "var(--border)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#1A56DB", borderRadius: "2px", width: (parseInt(vitesse) / 10 * 100) + "%" }} /></div>}
              </div>
              <div>
                <label style={labelStyle}>Effet /10</label>
                <input type="number" min="1" max="10" value={effet} onChange={e => setEffet(e.target.value)} style={inputStyle} placeholder="1-10" />
                {effet && <div style={{ marginTop: "6px", height: "4px", background: "var(--border)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#0E7F4F", borderRadius: "2px", width: (parseInt(effet) / 10 * 100) + "%" }} /></div>}
              </div>
              <div>
                <label style={labelStyle}>Contrôle /10</label>
                <input type="number" min="1" max="10" value={controle} onChange={e => setControle(e.target.value)} style={inputStyle} placeholder="1-10" />
                {controle && <div style={{ marginTop: "6px", height: "4px", background: "var(--border)", borderRadius: "2px" }}><div style={{ height: "100%", background: "#B45309", borderRadius: "2px", width: (parseInt(controle) / 10 * 100) + "%" }} /></div>}
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "8px", padding: "12px", fontSize: "14px", fontWeight: 600, cursor: "pointer", width: "100%", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Mise à jour..." : "Enregistrer les modifications"}
          </button>
        </form>
      )}
    </main>
  )
}