"use client"

import { useState } from "react"

const DRAPEAUX: Record<string, string> = {
  "Chine":"🇨🇳","France":"🇫🇷","Allemagne":"🇩🇪","Suède":"🇸🇪","Japon":"🇯🇵",
  "Corée du Sud":"🇰🇷","Brésil":"🇧🇷","Portugal":"🇵🇹","Autriche":"🇦🇹",
  "Roumanie":"🇷🇴","Croatie":"🇭🇷","Belgique":"🇧🇪","Danemark":"🇩🇰",
  "Slovénie":"🇸🇮","Égypte":"🇪🇬","Australie":"🇦🇺","Russie":"🇷🇺",
  "Inde":"🇮🇳","États-Unis":"🇺🇸","Taipei":"🇹🇼","Hong Kong":"🇭🇰",
}

const LIMITE = 5

export default function JoueursProSection({ joueurs, produitNom }: { joueurs: any[], produitNom: string }) {
  const [ouvert, setOuvert] = useState(false)

  if (!joueurs || joueurs.length === 0) return null

  const visibles = ouvert ? joueurs : joueurs.slice(0, LIMITE)
  const surplus  = joueurs.length - LIMITE

  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "20px", marginBottom: "1.5rem" }}>
      <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "16px" }}>
        Joueurs professionnels — matériel actuel
        <span style={{ marginLeft: "8px", background: "#FFF0EB", color: "#D97757", borderRadius: "20px", padding: "2px 8px", fontSize: "11px", fontWeight: 700 }}>
          {joueurs.length}
        </span>
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {visibles.map((jp: any) => (
          <a key={jp.id} href={"/joueurs/" + jp.id}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "var(--bg)", borderRadius: "8px", textDecoration: "none" }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: "14px", color: "var(--text)" }}>
                {DRAPEAUX[jp.pays] || ""} {jp.nom}
              </p>
              <p style={{ color: "var(--text-muted)", fontSize: "12px" }}>
                {jp.pays}
                {jp.revetement_cd?.toLowerCase().includes(produitNom.toLowerCase()) && " · Coup droit"}
                {jp.revetement_rv?.toLowerCase().includes(produitNom.toLowerCase()) && " · Revers"}
              </p>
            </div>
            <div style={{ textAlign: "right" as const }}>
              <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Classement mondial</p>
              <p style={{ fontWeight: 700, fontSize: "16px", color: "#D97757" }}>#{jp.classement_mondial}</p>
            </div>
          </a>
        ))}
      </div>

      {joueurs.length > LIMITE && (
        <button onClick={() => setOuvert(!ouvert)}
          style={{ marginTop: "12px", width: "100%", background: "none", border: "1px solid var(--border)", borderRadius: "8px", padding: "9px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "Poppins, sans-serif", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
          {ouvert ? (
            <>Voir moins ↑</>
          ) : (
            <>Voir {surplus} joueur{surplus > 1 ? "s" : ""} de plus ↓</>
          )}
        </button>
      )}
    </div>
  )
}
