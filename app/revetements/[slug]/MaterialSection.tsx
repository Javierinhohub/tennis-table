"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MaterialSection({ produitId, produitNom }: { produitId: string, produitNom: string }) {
  const [user, setUser] = useState<any>(null)
  const [utilise, setUtilise] = useState(false)
  const [utilisateurs, setUtilisateurs] = useState<any[]>([])
  const [utilisateursEquip, setUtilisateursEquip] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  async function fetchData() {
    const [{ data: matData }, { data: cdData }, { data: rvData }] = await Promise.all([
      supabase.from("utilisateurs_produits").select("user_id, utilisateurs(pseudo)").eq("produit_id", produitId),
      supabase.from("utilisateurs").select("id, pseudo, classement, club").eq("revetement_cd_id", produitId),
      supabase.from("utilisateurs").select("id, pseudo, classement, club").eq("revetement_rv_id", produitId),
    ])
    setUtilisateurs(matData || [])
    const equip: any[] = []
    ;(cdData || []).forEach((u: any) => equip.push({ ...u, cote: "Coup droit" }))
    ;(rvData || []).forEach((u: any) => {
      if (!equip.find((e: any) => e.id === u.id)) equip.push({ ...u, cote: "Revers" })
      else { const found = equip.find((e: any) => e.id === u.id); if (found) found.cote = "Coup droit & Revers" }
    })
    setUtilisateursEquip(equip)
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

  const totalUtilisateurs = [...new Set([...utilisateurs.map((u: any) => u.user_id), ...utilisateursEquip.map((u: any) => u.id)])]

  return (
    <div>
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1rem" }}>
        <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Mon matériel</h2>
        <button onClick={toggleMateriel} disabled={loading}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s", fontFamily: "Poppins, sans-serif",
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
            {utilisateursEquip.map((u: any) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {u.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{u.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>{u.cote}{u.classement ? " · " + u.classement : ""}{u.club ? " · " + u.club : ""}</p>
                </div>
              </div>
            ))}
            {utilisateurs.filter((u: any) => !utilisateursEquip.find((e: any) => e.id === u.user_id)).map((u: any) => (
              <div key={u.user_id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {u.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{u.utilisateurs?.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>Dans ma liste</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}