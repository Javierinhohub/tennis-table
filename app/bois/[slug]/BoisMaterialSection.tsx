"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function BoisMaterialSection({ produitId, produitNom }: { produitId: string, produitNom: string }) {
  const [user, setUser] = useState<any>(null)
  const [utilise, setUtilise] = useState(false)
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [utilisateursBois, setUtilisateursBois] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchData() {
    const [{ data: matData }, { data: boisData }] = await Promise.all([
      supabase.from("utilisateurs_produits").select("user_id, utilisateurs(pseudo)").eq("produit_id", produitId),
      supabase.from("utilisateurs").select("id, pseudo, classement, club").eq("bois_id", produitId),
    ])
    setUtilisateurs(matData || [])
    setUtilisateursBois(boisData || [])
  }

  useEffect(() => {
    if (!user) return
    setUtilise(utilisateurs.some((u: any) => u.user_id === user.id))
  }, [user, utilisateurs])

  async function toggleMateriel() {
    if (!user) { window.location.href = "/auth/login"; return }
    setLoading(true)
    if (utilise) {
      await supabase.from("utilisateurs_produits").delete().eq("produit_id", produitId).eq("user_id", user.id)
    } else {
      await supabase.from("utilisateurs_produits").insert({ produit_id: produitId, user_id: user.id })
    }
    await fetchData()
    setLoading(false)
  }

  const totalUtilisateurs = [...new Set([...utilisateurs.map((u: any) => u.user_id), ...utilisateursBois.map((u: any) => u.id)])]

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Mon matériel</h2>
        <button onClick={toggleMateriel} disabled={loading}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif",
            background: utilise ? "var(--success-light)" : "#D97757",
            color: utilise ? "var(--success)" : "#fff"
          }}>
          {loading ? "..." : utilise ? "Retirer de mon matériel" : "Ajouter à mon matériel"}
        </button>
      </div>
      {totalUtilisateurs.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
            Utilisé par {totalUtilisateurs.length} membre{totalUtilisateurs.length > 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {utilisateursBois.map((u: any) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {u.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{u.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Bois{u.classement ? " · " + u.classement : ""}{u.club ? " · " + u.club : ""}</p>
                </div>
              </div>
            ))}
            {utilisateurs.filter((u: any) => !utilisateursBois.find((e: any) => e.id === u.user_id)).map((u: any) => (
              <div key={u.user_id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {u.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <p style={{ fontSize: "13px", fontWeight: 600 }}>{u.utilisateurs?.pseudo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}