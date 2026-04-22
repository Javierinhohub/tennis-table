"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&\s]+)/,
    /youtu\.be\/([^?&\s]+)/,
    /youtube\.com\/embed\/([^?&\s]+)/,
    /youtube\.com\/shorts\/([^?&\s]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export default function AdminVideosPage() {
  const router = useRouter()
  const [produit, setProduit] = useState<any>(null)
  const [search, setSearch] = useState("")
  const [resultats, setResultats] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [newUrl, setNewUrl] = useState("")
  const [newTitre, setNewTitre] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => { checkAdmin() }, [])

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/auth/login"); return }
    const { data: profil } = await supabase.from("utilisateurs").select("role").eq("id", user.id).single()
    if (!profil || profil.role !== "admin") { router.push("/"); return }
  }

  // Recherche de produits (revêtements + bois)
  useEffect(() => {
    if (search.length < 2) { setResultats([]); return }
    const t = setTimeout(async () => {
      const { data } = await supabase
        .from("produits")
        .select("id, nom, slug, marques(nom), sous_categories(nom, slug)")
        .ilike("nom", `%${search}%`)
        .eq("actif", true)
        .limit(10)
      setResultats(data || [])
    }, 200)
    return () => clearTimeout(t)
  }, [search])

  // Fermer dropdown au clic extérieur
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setResultats([])
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  async function selectionner(p: any) {
    setProduit(p)
    setResultats([])
    setSearch(p.marques?.nom + " " + p.nom)
    setMessage("")
    fetchVideos(p.id)
  }

  async function fetchVideos(produitId: string) {
    const { data } = await supabase
      .from("produit_videos")
      .select("id, youtube_url, titre, ordre")
      .eq("produit_id", produitId)
      .order("ordre")
      .order("cree_le")
    setVideos(data || [])
  }

  async function ajouterVideo(e: React.FormEvent) {
    e.preventDefault()
    if (!produit || !newUrl.trim()) return
    if (!getYoutubeId(newUrl.trim())) {
      setMessage("❌ URL YouTube invalide. Exemple : https://www.youtube.com/watch?v=...")
      return
    }
    setSaving(true)
    setMessage("")
    const { error } = await supabase.from("produit_videos").insert({
      produit_id: produit.id,
      youtube_url: newUrl.trim(),
      titre: newTitre.trim() || null,
      ordre: videos.length,
    })
    setSaving(false)
    if (error) {
      setMessage("❌ Erreur : " + error.message)
    } else {
      setMessage("✅ Vidéo ajoutée !")
      setNewUrl("")
      setNewTitre("")
      fetchVideos(produit.id)
    }
  }

  async function supprimerVideo(id: string) {
    if (!confirm("Supprimer cette vidéo ?")) return
    await supabase.from("produit_videos").delete().eq("id", id)
    if (produit) fetchVideos(produit.id)
  }

  const inp: React.CSSProperties = {
    background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
    padding: "10px 14px", fontSize: "14px", width: "100%",
    fontFamily: "Poppins, sans-serif", outline: "none",
    color: "var(--text)", boxSizing: "border-box",
  }
  const label: React.CSSProperties = {
    display: "block", fontSize: "12px", fontWeight: 600,
    color: "var(--text-muted)", marginBottom: "4px",
    textTransform: "uppercase", letterSpacing: "0.4px",
  }

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <a href="/admin" style={{ color: "#D97757", textDecoration: "none", fontSize: "13px", fontWeight: 500, marginBottom: "1.5rem", display: "inline-block" }}>
        ← Retour à l'administration
      </a>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Vidéos de jeu</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>
        Associez des vidéos YouTube à un revêtement ou un bois pour illustrer le jeu avec ce matériel.
      </p>

      {/* Sélection du produit */}
      <div ref={searchRef} style={{ position: "relative", marginBottom: "2rem" }}>
        <label style={label}>Rechercher un produit (revêtement ou bois)</label>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setProduit(null) }}
          placeholder="Ex: Tenergy 05, Viscaria, Hurricane..."
          autoComplete="off"
          style={inp}
        />
        {resultats.length > 0 && (
          <div style={{
            position: "absolute", top: "100%", left: 0, right: 0, zIndex: 100,
            background: "#fff", border: "1px solid var(--border)", borderRadius: "8px",
            marginTop: "4px", maxHeight: "260px", overflowY: "auto",
            boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          }}>
            {resultats.map((p, i) => {
              const cat = (p.sous_categories as any)?.slug?.startsWith("bois") ? "Bois" : "Revêtement"
              return (
                <button key={p.id} type="button"
                  onClick={() => selectionner(p)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "10px 14px", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "Poppins, sans-serif",
                    borderBottom: i < resultats.length - 1 ? "1px solid var(--border)" : "none",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <div>
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>{(p.marques as any)?.nom} {p.nom}</span>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)", background: "var(--bg)", padding: "2px 8px", borderRadius: "6px" }}>{cat}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Contenu une fois un produit sélectionné */}
      {produit && (
        <div>
          {/* En-tête produit sélectionné */}
          <div style={{
            background: "linear-gradient(135deg, #D97757 0%, #C4694A 100%)",
            borderRadius: "10px", padding: "14px 20px", marginBottom: "1.5rem",
            color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "17px" }}>{(produit.marques as any)?.nom} {produit.nom}</p>
              <p style={{ fontSize: "13px", opacity: 0.85 }}>
                {(produit.sous_categories as any)?.nom || "Produit"}
              </p>
            </div>
            <span style={{ fontSize: "12px", background: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "12px" }}>
              {videos.length} vidéo{videos.length > 1 ? "s" : ""}
            </span>
          </div>

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

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>

            {/* Formulaire ajout */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
              <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "16px" }}>Ajouter une vidéo</p>
              <form onSubmit={ajouterVideo} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={label}>URL YouTube *</label>
                  <input
                    type="text"
                    value={newUrl}
                    onChange={e => setNewUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    autoComplete="off"
                    required
                    style={inp}
                  />
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>
                    Formats acceptés : youtube.com/watch?v=... ou youtu.be/...
                  </p>
                </div>
                <div>
                  <label style={label}>Titre (optionnel)</label>
                  <input
                    type="text"
                    value={newTitre}
                    onChange={e => setNewTitre(e.target.value)}
                    placeholder="Ex: Fan Zhendong vs Ma Long"
                    autoComplete="off"
                    style={inp}
                  />
                </div>

                {/* Aperçu miniature si URL valide */}
                {newUrl && getYoutubeId(newUrl) && (
                  <div>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: "6px" }}>Aperçu</p>
                    <div style={{ position: "relative", paddingBottom: "56.25%", borderRadius: "8px", overflow: "hidden", background: "#000" }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${getYoutubeId(newUrl)}`}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title="Aperçu"
                      />
                    </div>
                  </div>
                )}

                <button type="submit" disabled={saving}
                  style={{
                    background: "#D97757", color: "#fff", border: "none", borderRadius: "8px",
                    padding: "11px 20px", fontSize: "14px", fontWeight: 600, cursor: saving ? "default" : "pointer",
                    opacity: saving ? 0.7 : 1, fontFamily: "Poppins, sans-serif",
                  }}>
                  {saving ? "Ajout en cours..." : "Ajouter la vidéo"}
                </button>
              </form>
            </div>

            {/* Liste vidéos existantes */}
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, marginBottom: "12px" }}>
                Vidéos associées ({videos.length})
              </p>

              {videos.length === 0 ? (
                <div style={{
                  background: "#fff", border: "1px dashed var(--border)", borderRadius: "10px",
                  padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px",
                }}>
                  Aucune vidéo pour ce produit.<br />Ajoutez-en une ci-contre.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {videos.map(v => {
                    const videoId = getYoutubeId(v.youtube_url)
                    return (
                      <div key={v.id} style={{
                        background: "#fff", border: "1px solid var(--border)", borderRadius: "10px",
                        overflow: "hidden",
                      }}>
                        {videoId && (
                          <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              title={v.titre || "Vidéo"}
                            />
                          </div>
                        )}
                        <div style={{ padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                          <div style={{ minWidth: 0 }}>
                            {v.titre && (
                              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {v.titre}
                              </p>
                            )}
                            <p style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {v.youtube_url}
                            </p>
                          </div>
                          <button
                            onClick={() => supprimerVideo(v.id)}
                            style={{
                              background: "#FEF2F2", color: "#DC2626", border: "none",
                              borderRadius: "6px", padding: "5px 10px", fontSize: "12px",
                              fontWeight: 600, cursor: "pointer", flexShrink: 0,
                              fontFamily: "Poppins, sans-serif",
                            }}>
                            Supprimer
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
