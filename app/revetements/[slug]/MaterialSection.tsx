"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MaterialSection({ produitId, produitNom }: { produitId: string, produitNom: string }) {
  const [user, setUser] = useState<any>(null)
  const [utilise, setUtilise] = useState(false)
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchData() {
    const { data } = await supabase
      .from("utilisateurs_produits")
      .select("user_id, depuis, utilisateurs(pseudo)")
      .eq("produit_id", produitId)
    setUtilisateurs(data || [])
  }

  useEffect(() => {
    if (!user) return
    const dejaDans = utilisateurs.some((u: any) => u.user_id === user.id)
    setUtilise(dejaDans)
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

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>Mon matériel</h2>
        <button
          onClick={toggleMateriel}
          disabled={loading}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s",
            background: utilise ? "var(--success-light)" : "var(--accent)",
            color: utilise ? "var(--success)" : "#fff"
          }}
        >
          {loading ? "..." : utilise ? "Retirer de mon matériel" : "Ajouter à mon matériel"}
        </button>
      </div>

      {utilisateurs.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px" }}>
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
            Utilisé par {utilisateurs.length} membre{utilisateurs.length > 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {utilisateurs.map((u: any) => (
              <div key={u.user_id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--accent)" }}>
                  {u.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500 }}>{u.utilisateurs?.pseudo}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}