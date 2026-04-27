"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ArticleEditPage() {
  const params = useParams()
  const slug = params.slug as string
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [article, setArticle] = useState<any>(null)

  const [titre, setTitre] = useState("")
  const [extrait, setExtrait] = useState("")
  const [contenu, setContenu] = useState("")
  const [categorie, setCategorie] = useState("")
  const [publie, setPublie] = useState(true)

  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null
      if (!u) { router.replace("/articles"); return }
      supabase
        .from("utilisateurs")
        .select("role")
        .eq("id", u.id)
        .single()
        .then(({ data: profil }) => {
          if (profil?.role !== "admin") { router.replace("/articles"); return }
          setIsAdmin(true)
          loadArticle()
        })
    })
  }, [])

  async function loadArticle() {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .single()
    if (!data) { router.replace("/articles"); return }
    setArticle(data)
    setTitre(data.titre)
    setExtrait(data.extrait || "")
    setContenu(data.contenu)
    setCategorie(data.categorie)
    setPublie(data.publie)
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    const { error } = await supabase
      .from("articles")
      .update({ titre, extrait, contenu, categorie, publie })
      .eq("id", article.id)
    setSaving(false)
    if (error) {
      setMessage({ type: "err", text: "Erreur : " + error.message })
    } else {
      setMessage({ type: "ok", text: "Article mis à jour avec succès ✓" })
      setTimeout(() => router.push("/articles/" + slug), 1200)
    }
  }

  if (loading) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <p style={{ color: "var(--text-muted)" }}>Chargement…</p>
      </main>
    )
  }

  const CAT = ["test", "conseil", "actualite", "comparatif"]

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <a href={`/articles/${slug}`} style={{ color: "#D97757", fontSize: "13px", textDecoration: "none" }}>← Retour à l'article</a>
          <h1 style={{ fontSize: "20px", fontWeight: 700, marginTop: "6px" }}>Modifier l'article</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            background: saving ? "#aaa" : "#1A56DB",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 24px",
            fontSize: "14px",
            fontWeight: 700,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Enregistrement…" : "💾 Enregistrer"}
        </button>
      </div>

      {message && (
        <div style={{
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "1.2rem",
          background: message.type === "ok" ? "#ECFDF5" : "#FEF2F2",
          color: message.type === "ok" ? "#065F46" : "#991B1B",
          fontSize: "14px",
          fontWeight: 600,
        }}>
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

        {/* Titre */}
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Titre</label>
          <input
            value={titre}
            onChange={e => setTitre(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "8px",
              border: "1px solid var(--border)", fontSize: "15px",
              background: "var(--bg)", color: "var(--text)",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Extrait */}
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Extrait (résumé SEO)</label>
          <textarea
            value={extrait}
            onChange={e => setExtrait(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: "8px",
              border: "1px solid var(--border)", fontSize: "14px",
              background: "var(--bg)", color: "var(--text)",
              resize: "vertical", boxSizing: "border-box", lineHeight: 1.6,
            }}
          />
        </div>

        {/* Catégorie + Publié */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "160px" }}>
            <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>Catégorie</label>
            <select
              value={categorie}
              onChange={e => setCategorie(e.target.value)}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: "8px",
                border: "1px solid var(--border)", fontSize: "14px",
                background: "var(--bg)", color: "var(--text)",
              }}
            >
              {CAT.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "22px" }}>
            <input
              type="checkbox"
              id="publie"
              checked={publie}
              onChange={e => setPublie(e.target.checked)}
              style={{ width: "16px", height: "16px", cursor: "pointer" }}
            />
            <label htmlFor="publie" style={{ fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>Publié</label>
          </div>
        </div>

        {/* Contenu markdown */}
        <div>
          <label style={{ fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Contenu (Markdown)
            <span style={{ fontWeight: 400, color: "var(--text-muted)", marginLeft: "8px" }}>
              **gras**, _italique_, ## titre, - liste, ![alt](url), | tableau |
            </span>
          </label>
          <textarea
            value={contenu}
            onChange={e => setContenu(e.target.value)}
            rows={35}
            spellCheck={false}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "8px",
              border: "1px solid var(--border)", fontSize: "13px",
              background: "var(--bg)", color: "var(--text)",
              resize: "vertical", boxSizing: "border-box",
              fontFamily: "monospace", lineHeight: 1.7,
            }}
          />
        </div>

        {/* Bouton bas */}
        <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "2rem" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving ? "#aaa" : "#1A56DB",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "12px 32px",
              fontSize: "15px",
              fontWeight: 700,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Enregistrement…" : "💾 Enregistrer les modifications"}
          </button>
        </div>
      </div>
    </main>
  )
}
