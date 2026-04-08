"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ForumPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchData() }, [])

async function fetchData() {
  try {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("forum_categories")
      .select("*, forum_sujets(id, titre, cree_le, user_id, utilisateurs:user_id(pseudo))")
      .order("ordre");

    // Si Supabase renvoie une erreur (ex: table introuvable ou problème de droits RLS)
    if (error) {
      console.error("Erreur Supabase :", error.message);
      setCategories([]);
      return; 
    }

    setCategories(data || []);
  } catch (err) {
    // Si le code JavaScript plante complètement
    console.error("Erreur critique d'exécution :", err);
    setCategories([]);
  } finally {
    // Le bloc 'finally' s'exécute TOUJOURS, qu'il y ait eu une erreur ou non.
    // Ça garantit que le "Chargement..." va disparaître.
    setLoading(false);
  }
}

  if (loading) return <div style={{ textAlign: "center", padding: "5rem", color: "var(--text-muted)" }}>Chargement...</div>

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "4px" }}>Forum</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Discussions sur le tennis de table</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {categories.map(cat => {
          const sujets = cat.forum_sujets || []
          const dernierSujet = sujets.sort((a: any, b: any) => new Date(b.cree_le).getTime() - new Date(a.cree_le).getTime())[0]
          return (
            <a href={"/forum/" + cat.slug} key={cat.id} style={{ display: "block", textDecoration: "none", background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px 20px", transition: "border-color 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--text)", marginBottom: "4px" }}>{cat.nom}</h2>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{cat.description}</p>
                  {dernierSujet && (
                    <p style={{ fontSize: "12px", color: "var(--text-light)", marginTop: "6px" }}>
                      Dernier sujet : <span style={{ color: "var(--accent)", fontWeight: 500 }}>{dernierSujet.titre}</span>
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "center", minWidth: "60px" }}>
                  <p style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent)" }}>{sujets.length}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.4px" }}>sujet{sujets.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </main>
  )
}