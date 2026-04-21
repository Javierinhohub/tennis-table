"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function MaterialSection({ produitId, produitNom }: { produitId: string, produitNom: string }) {
  const [user, setUser]                       = useState<any>(null)
  const [dansHistorique, setDansHistorique]   = useState(false)
  const [membresCourants, setMembresCourants] = useState<any[]>([])  // utilisateurs.cd/rv_id
  const [membresHisto, setMembresHisto]       = useState<any[]>([])  // utilisateurs_produits
  const [loading, setLoading]                 = useState(false)

  useEffect(() => {
    fetchData()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function fetchData() {
    const [{ data: histoData }, { data: cdData }, { data: rvData }] = await Promise.all([
      supabase.from("utilisateurs_produits").select("user_id, depuis, utilisateurs(id, pseudo, classement, club)").eq("produit_id", produitId),
      supabase.from("utilisateurs").select("id, pseudo, classement, club").eq("revetement_cd_id", produitId),
      supabase.from("utilisateurs").select("id, pseudo, classement, club").eq("revetement_rv_id", produitId),
    ])
    setMembresHisto(histoData || [])

    // Fusionner CD + RV en évitant les doublons
    const courants: any[] = []
    ;(cdData || []).forEach((u: any) => courants.push({ ...u, cote: "Coup droit" }))
    ;(rvData || []).forEach((u: any) => {
      const existing = courants.find((e: any) => e.id === u.id)
      if (existing) existing.cote = "Coup droit & Revers"
      else courants.push({ ...u, cote: "Revers" })
    })
    setMembresCourants(courants)
  }

  useEffect(() => {
    if (!user) return
    setDansHistorique(membresHisto.some((u: any) => u.user_id === user.id))
  }, [user, membresHisto])

  async function toggleHistorique() {
    if (!user) { window.location.href = "/auth/login"; return }
    setLoading(true)
    if (dansHistorique) {
      await supabase.from("utilisateurs_produits").delete().eq("produit_id", produitId).eq("user_id", user.id)
    } else {
      await supabase.from("utilisateurs_produits").insert({ produit_id: produitId, user_id: user.id })
    }
    await fetchData()
    setLoading(false)
  }

  // Membres dans l'historique mais pas dans le courant (évite les doublons)
  const histoUniquement = membresHisto.filter(
    (h: any) => !membresCourants.find((c: any) => c.id === h.user_id)
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Bouton historique */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "10px" }}>
          Mon historique matériel
        </p>
        <button onClick={toggleHistorique} disabled={loading}
          style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 0.15s", fontFamily: "Poppins, sans-serif",
            background: dansHistorique ? "#F0FAF4" : "#D97757",
            color: dansHistorique ? "#2D7A4F" : "#fff"
          }}>
          {loading ? "…" : dansHistorique ? "✓ Dans mon historique" : "J'ai utilisé ce revêtement"}
        </button>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "8px", textAlign: "center" as const }}>
          Différent du matériel actuel — à régler dans ton profil
        </p>
      </div>

      {/* Matériel actuel des membres */}
      {membresCourants.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", background: "#22C55E", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
            Matériel actuel — {membresCourants.length} membre{membresCourants.length > 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            {membresCourants.map((u: any) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#D97757", flexShrink: 0 }}>
                  {u.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600 }}>{u.pseudo}</p>
                  <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {u.cote}{u.classement ? " · " + u.classement + " pts" : ""}{u.club ? " · " + u.club : ""}
                  </p>
                </div>
                <span style={{ fontSize: "10px", background: "#F0FAF4", color: "#2D7A4F", padding: "2px 8px", borderRadius: "20px", fontWeight: 600 }}>Actuel</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matériel passé / historique des membres */}
      {histoUniquement.length > 0 && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "16px" }}>
          <h2 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text)", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", background: "#94A3B8", borderRadius: "50%", display: "inline-block", flexShrink: 0 }} />
            Déjà utilisé — {histoUniquement.length} membre{histoUniquement.length > 1 ? "s" : ""}
          </h2>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
            {histoUniquement.map((h: any) => (
              <div key={h.user_id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 10px", background: "var(--bg)", borderRadius: "6px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#64748B", flexShrink: 0 }}>
                  {h.utilisateurs?.pseudo?.[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text)" }}>{h.utilisateurs?.pseudo}</p>
                  {h.depuis && (
                    <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Utilisé depuis {new Date(h.depuis).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                    </p>
                  )}
                </div>
                <span style={{ fontSize: "10px", background: "#F1F5F9", color: "#64748B", padding: "2px 8px", borderRadius: "20px", fontWeight: 600 }}>Passé</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
