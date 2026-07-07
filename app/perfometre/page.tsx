"use client"

import type { Metadata } from "next"
import { useState } from "react"

// ─── Barème des coefficients par tranche ──────────────────────────
const TRANCHES = [
  { min: 1000, max: 1099, coeff: 1.10 },
  { min: 1100, max: 1199, coeff: 1.20 },
  { min: 1200, max: 1299, coeff: 1.35 },
  { min: 1300, max: 1399, coeff: 1.50 },
  { min: 1400, max: 1499, coeff: 1.70 },
  { min: 1500, max: 1599, coeff: 1.95 },
  { min: 1600, max: 1699, coeff: 2.25 },
  { min: 1700, max: 1799, coeff: 2.60 },
  { min: 1800, max: 1899, coeff: 3.00 },
  { min: 1900, max: 1999, coeff: 3.50 },
  { min: 2000, max: Infinity, coeff: 4.20 },
]

interface Tranche {
  label: string
  points: number
  coeff: number
  score: number
}

interface Result {
  score: number
  details: Tranche[]
  progression: number
  mention: string
  color: string
}

function getCoeff(pts: number): number {
  const t = TRANCHES.find(t => pts >= t.min && pts <= t.max)
  return t ? t.coeff : 1.10
}

function getTranchLabel(min: number): string {
  if (min >= 2000) return "2000+"
  return `${min} – ${min + 99}`
}

function calcPerfometre(start: number, end: number): Result {
  const details: Tranche[] = []
  let score = 0
  let current = start

  while (current < end) {
    const bracketFloor = Math.floor(current / 100) * 100
    const bracketCeil = bracketFloor >= 2000 ? Infinity : bracketFloor + 100
    const coeff = getCoeff(current)
    const pointsInBracket = Math.min(bracketCeil, end) - current

    const bracketScore = Math.round(pointsInBracket * coeff * 100) / 100
    details.push({
      label: getTranchLabel(bracketFloor),
      points: pointsInBracket,
      coeff,
      score: bracketScore,
    })
    score += bracketScore
    current = Math.min(bracketCeil, end)
    if (bracketCeil === Infinity) break
  }

  score = Math.round(score * 10) / 10

  let mention = ""
  let color = ""
  if (score >= 600) { mention = "🔥 Légendaire"; color = "#9B59B6" }
  else if (score >= 400) { mention = "⚡ Élite"; color = "#E74C3C" }
  else if (score >= 250) { mention = "🏆 Excellent"; color = "#E67E22" }
  else if (score >= 150) { mention = "💪 Très bien"; color = "#27AE60" }
  else if (score >= 80) { mention = "👍 Bien"; color = "#2980B9" }
  else if (score > 0) { mention = "📈 En progression"; color = "#7F8C8D" }
  else { mention = "—"; color = "#7F8C8D" }

  return { score, details, progression: end - start, mention, color }
}

export default function PerfoMetrePage() {
  const [debut, setDebut] = useState("")
  const [fin, setFin] = useState("")
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState("")

  function handleCalculer() {
    const s = parseInt(debut)
    const e = parseInt(fin)
    setError("")
    setResult(null)

    if (isNaN(s) || isNaN(e)) { setError("Saisis tes deux valeurs de points."); return }
    if (s < 1000) { setError("Le Perf-o-mètre commence à partir de 1000 points."); return }
    if (e < s) { setError("Tes points de fin doivent être supérieurs à tes points de début."); return }
    if (e === s) { setError("Aucune progression détectée."); return }
    if (s > 3000 || e > 3500) { setError("Ces valeurs semblent incorrectes."); return }

    setResult(calcPerfometre(s, e))
  }

  return (
    <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>

      {/* ── En-tête ───────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "40px", marginBottom: "8px" }}>🏓</div>
        <h1 style={{ fontSize: "22px", fontWeight: 800, color: "var(--text)", marginBottom: "6px", letterSpacing: "-0.3px" }}>
          Le Perf-o-mètre TT-Kip
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "480px", margin: "0 auto" }}>
          Ta progression mesurée à sa juste valeur. Plus tu montes haut dans le classement,
          plus chaque point est difficile à gagner — donc plus il rapporte. 📈
        </p>
      </div>

      {/* ── Formulaire ────────────────────────────────────────────── */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              Points début phase 2
            </label>
            <input
              type="number"
              value={debut}
              onChange={e => setDebut(e.target.value)}
              placeholder="ex. 1300"
              min={1000}
              max={3000}
              style={{
                width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                borderRadius: "8px", fontSize: "16px", fontWeight: 600,
                color: "var(--text)", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>
              Points mensuels actuels
            </label>
            <input
              type="number"
              value={fin}
              onChange={e => setFin(e.target.value)}
              placeholder="ex. 1600"
              min={1000}
              max={3500}
              style={{
                width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
                borderRadius: "8px", fontSize: "16px", fontWeight: 600,
                color: "var(--text)", outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: "12px", color: "#E74C3C", marginBottom: "10px", padding: "8px 12px", background: "#FFF5F5", borderRadius: "6px" }}>
            ⚠️ {error}
          </p>
        )}

        <button
          onClick={handleCalculer}
          style={{
            width: "100%", padding: "13px", borderRadius: "10px", border: "none",
            background: "linear-gradient(135deg, #D97757, #c4623d)",
            color: "#fff", fontSize: "15px", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.2px",
          }}
        >
          Calculer mon Perf-o-mètre 🏓
        </button>
      </div>

      {/* ── Résultat ──────────────────────────────────────────────── */}
      {result && (
        <div style={{ animation: "fadeIn 0.3s ease" }}>

          {/* Score principal */}
          <div style={{
            background: "#fff", border: `2px solid ${result.color}`,
            borderRadius: "14px", padding: "1.8rem 1.5rem", textAlign: "center",
            marginBottom: "1rem",
          }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "8px" }}>
              Ton Perf-o-mètre
            </p>
            <div style={{ fontSize: "64px", fontWeight: 900, color: result.color, lineHeight: 1, marginBottom: "10px" }}>
              {result.score}
            </div>
            <div style={{
              display: "inline-block", padding: "5px 16px", borderRadius: "20px",
              background: result.color + "18", color: result.color,
              fontSize: "14px", fontWeight: 700, marginBottom: "10px"
            }}>
              {result.mention}
            </div>
            <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              +{result.progression} points officiels pris en phase 2
            </p>
          </div>

          {/* Détail des tranches */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.2rem 1.5rem" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
              Détail par tranche
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {result.details.map((d, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "8px 10px", borderRadius: "8px",
                  background: i % 2 === 0 ? "#F9F9F9" : "#fff",
                  fontSize: "13px",
                }}>
                  <span style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{d.label}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    {d.points} pts × <strong style={{ color: "var(--text)" }}>×{d.coeff.toFixed(2)}</strong>
                  </span>
                  <span style={{ fontWeight: 700, color: result.color, minWidth: "50px", textAlign: "right" }}>
                    = {d.score}
                  </span>
                </div>
              ))}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 10px", borderRadius: "8px", background: result.color + "10",
                marginTop: "4px", fontSize: "14px", fontWeight: 700,
              }}>
                <span style={{ color: "var(--text)" }}>Total</span>
                <span style={{ color: result.color, fontSize: "18px" }}>{result.score}</span>
              </div>
            </div>

            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "14px", textAlign: "center", lineHeight: 1.6 }}>
              Partage ton score sur Instagram <strong>@ttkip.pro</strong> 🏓
            </p>
          </div>
        </div>
      )}

      {/* ── Barème ────────────────────────────────────────────────── */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.2rem 1.5rem", marginTop: "1.5rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>
          Barème des coefficients
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
          {TRANCHES.map((t, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between",
              padding: "6px 10px", borderRadius: "6px",
              background: i % 2 === 0 ? "#F9F9F9" : "#fff",
              fontSize: "12px",
            }}>
              <span style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>
                {t.min >= 2000 ? "2000 +" : `${t.min} – ${t.max}`}
              </span>
              <span style={{ fontWeight: 700, color: "#D97757" }}>×{t.coeff.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "12px", lineHeight: 1.6 }}>
          📅 Mesuré de janvier à juillet (phase 2) · À partir de 1000 points · Seules les progressions positives comptent
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        input:focus { border-color: #D97757 !important; box-shadow: 0 0 0 3px #D9775720; }
      `}</style>
    </main>
  )
}
