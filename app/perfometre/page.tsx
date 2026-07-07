"use client"

import { useState, useEffect, useCallback } from "react"

// ─── Types ────────────────────────────────────────────────────────
interface FormData {
  prenom: string
  nom: string
  instagram: string
  age: string
  points_debut: string
  points_fin: string
}

interface RankEntry {
  id: string
  prenom: string
  nom_initial: string
  instagram: string | null
  age: number
  points_debut: number
  points_fin: number
  progression: number
  score: number
  is_own: boolean
}

interface TrancheDetail {
  label: string
  points: number
  coeff: number
  score: number
}

// ─── Barème ───────────────────────────────────────────────────────
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

function getCoeff(pts: number) {
  return TRANCHES.find(t => pts >= t.min && pts <= t.max)?.coeff ?? 1.10
}

function calcDetails(start: number, end: number): { score: number; details: TrancheDetail[] } {
  const details: TrancheDetail[] = []
  let score = 0, current = start
  while (current < end) {
    const floor = Math.floor(current / 100) * 100
    const ceil = floor >= 2000 ? Infinity : floor + 100
    const coeff = getCoeff(current)
    const pts = Math.min(ceil, end) - current
    const s = Math.round(pts * coeff * 100) / 100
    details.push({ label: floor >= 2000 ? "2000+" : `${floor} – ${floor + 99}`, points: pts, coeff, score: s })
    score += s
    current = Math.min(ceil, end)
    if (ceil === Infinity) break
  }
  return { score: Math.round(score * 10) / 10, details }
}

function getMention(score: number): { text: string; color: string } {
  if (score >= 600) return { text: "Légendaire",    color: "#7C3AED" }
  if (score >= 400) return { text: "Élite",          color: "#DC2626" }
  if (score >= 250) return { text: "Excellent",      color: "#D97706" }
  if (score >= 150) return { text: "Très bien",      color: "#059669" }
  if (score >= 80)  return { text: "Bien",            color: "#2563EB" }
  return              { text: "En progression",     color: "#6B7280" }
}

const LS_KEY = "ttk_perfometre_token"

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px", border: "1px solid var(--border)",
  borderRadius: "8px", fontSize: "15px", color: "var(--text)",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
}
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "11px", fontWeight: 700,
  color: "var(--text-muted)", textTransform: "uppercase",
  letterSpacing: "0.5px", marginBottom: "5px",
}

// ─── Composant principal ──────────────────────────────────────────
export default function PerfoMetrePage() {
  const [token, setToken]           = useState<string | null>(null)
  const [view, setView]             = useState<"form" | "ranking">("form")
  const [editing, setEditing]       = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState("")
  const [ranking, setRanking]       = useState<RankEntry[]>([])
  const [myScore, setMyScore]       = useState<number | null>(null)
  const [myDetails, setMyDetails]   = useState<TrancheDetail[]>([])
  const [form, setForm]             = useState<FormData>({
    prenom: "", nom: "", instagram: "", age: "", points_debut: "", points_fin: "",
  })

  // Lecture du token localStorage au montage
  useEffect(() => {
    const t = localStorage.getItem(LS_KEY)
    if (t) { setToken(t); fetchRanking(t) }
  }, [])

  const fetchRanking = useCallback(async (t: string) => {
    const res = await fetch(`/api/perfometre/ranking?token=${t}`)
    if (!res.ok) { localStorage.removeItem(LS_KEY); setToken(null); return }
    const { entries } = await res.json()
    setRanking(entries)
    const own = entries.find((e: RankEntry) => e.is_own)
    if (own) {
      const { score, details } = calcDetails(own.points_debut, own.points_fin)
      setMyScore(score)
      setMyDetails(details)
      if (editing) setForm({
        prenom: own.prenom,
        nom: "", // nom complet non retourné par l'API publique
        instagram: own.instagram || "",
        age: String(own.age),
        points_debut: String(own.points_debut),
        points_fin: String(own.points_fin),
      })
    }
    setView("ranking")
  }, [editing])

  function updateForm(field: keyof FormData, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setError("")
  }

  function previewScore(): { score: number; details: TrancheDetail[] } | null {
    const s = parseInt(form.points_debut), e = parseInt(form.points_fin)
    if (isNaN(s) || isNaN(e) || s < 1000 || e <= s) return null
    return calcDetails(s, e)
  }

  const preview = previewScore()
  const mention = preview ? getMention(preview.score) : null

  async function handleSubmit() {
    setError("")
    const age = parseInt(form.age)
    const debut = parseInt(form.points_debut)
    const fin = parseInt(form.points_fin)

    if (!form.prenom.trim()) return setError("Le prénom est requis.")
    if (!form.nom.trim()) return setError("Le nom est requis.")
    if (isNaN(age) || age < 8 || age > 99) return setError("L'âge doit être compris entre 8 et 99 ans.")
    if (isNaN(debut) || debut < 1000) return setError("Les points de début doivent être supérieurs ou égaux à 1000.")
    if (isNaN(fin) || fin <= debut) return setError("Les points de fin doivent être supérieurs aux points de début.")

    setLoading(true)
    try {
      const method = token ? "PUT" : "POST"
      const body = token
        ? { token, ...form, age, points_debut: debut, points_fin: fin }
        : { ...form, age, points_debut: debut, points_fin: fin }

      const res = await fetch("/api/perfometre/submit", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Erreur lors de l'envoi."); return }

      const newToken = token ?? data.token
      localStorage.setItem(LS_KEY, newToken)
      setToken(newToken)
      setEditing(false)
      await fetchRanking(newToken)
    } catch {
      setError("Erreur réseau. Réessaie.")
    } finally {
      setLoading(false)
    }
  }

  function handleEdit() {
    const own = ranking.find(e => e.is_own)
    if (own) setForm(f => ({
      ...f,
      prenom: own.prenom,
      instagram: own.instagram || "",
      age: String(own.age),
      points_debut: String(own.points_debut),
      points_fin: String(own.points_fin),
    }))
    setEditing(true)
    setView("form")
  }

  // ── Vue formulaire ────────────────────────────────────────────
  if (view === "form" || editing) {
    return (
      <main style={{ maxWidth: "620px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "21px", fontWeight: 800, color: "var(--text)", marginBottom: "6px" }}>
            Le Perf-o-mètre TT-Kip
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            Ta progression mesurée à sa juste valeur — chaque point pondéré selon le niveau auquel il a été pris.
            Phase 2 (janvier – juillet) · À partir de 1000 points.
          </p>
        </div>

        {/* Bloc identité */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "14px" }}>
            Ton identité
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={labelStyle}>Prénom *</label>
              <input style={inputStyle} value={form.prenom} onChange={e => updateForm("prenom", e.target.value)} placeholder="Lucas" />
            </div>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input style={inputStyle} value={form.nom} onChange={e => updateForm("nom", e.target.value)} placeholder="Dupont" />
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>
                Seule la 1re lettre sera publiée dans le classement.
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Compte Instagram</label>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                <span style={{ padding: "0 10px", fontSize: "14px", color: "var(--text-muted)", borderRight: "1px solid var(--border)", lineHeight: "42px", background: "#F9F9F9" }}>@</span>
                <input style={{ ...inputStyle, border: "none", borderRadius: 0 }} value={form.instagram} onChange={e => updateForm("instagram", e.target.value.replace(/^@/, ""))} placeholder="ttkip.pro" />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Âge *</label>
              <input style={inputStyle} type="number" min={8} max={99} value={form.age} onChange={e => updateForm("age", e.target.value)} placeholder="22" />
              {form.age && parseInt(form.age) < 18 && (
                <p style={{ fontSize: "10px", color: "#D97757", marginTop: "4px" }}>
                  Mineur — une autorisation parentale sera requise avant publication Instagram.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Bloc points */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "1.4rem", marginBottom: "1rem" }}>
          <p style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: "14px" }}>
            Ta progression phase 2
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={labelStyle}>Points officiels début phase 2 *</label>
              <input style={inputStyle} type="number" min={1000} value={form.points_debut} onChange={e => updateForm("points_debut", e.target.value)} placeholder="1300" />
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>Points dans l'appli FFTT en janvier.</p>
            </div>
            <div>
              <label style={labelStyle}>Points mensuels actuels *</label>
              <input style={inputStyle} type="number" min={1000} value={form.points_fin} onChange={e => updateForm("points_fin", e.target.value)} placeholder="1600" />
              <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "4px" }}>Tes points mensuels dans l'appli FFTT.</p>
            </div>
          </div>
        </div>

        {/* Aperçu score */}
        {preview && mention && (
          <div style={{
            background: "#fff", border: `1px solid ${mention.color}30`,
            borderRadius: "14px", padding: "1.2rem 1.4rem", marginBottom: "1rem",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "2px" }}>
                Aperçu de ton score
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                +{parseInt(form.points_fin) - parseInt(form.points_debut)} points officiels pris
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "36px", fontWeight: 900, color: mention.color, lineHeight: 1 }}>{preview.score}</div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: mention.color }}>{mention.text}</div>
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: "12px", color: "#DC2626", padding: "10px 12px", background: "#FEF2F2", borderRadius: "8px", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        <div style={{ display: "flex", gap: "10px" }}>
          {editing && (
            <button
              onClick={() => { setEditing(false); setView("ranking") }}
              style={{ flex: 1, padding: "13px", borderRadius: "10px", border: "1px solid var(--border)", background: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", color: "var(--text)" }}
            >
              Annuler
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !preview}
            style={{
              flex: 2, padding: "13px", borderRadius: "10px", border: "none",
              background: preview ? "linear-gradient(135deg, #D97757, #c4623d)" : "#E5E7EB",
              color: preview ? "#fff" : "#9CA3AF",
              fontSize: "15px", fontWeight: 700, cursor: preview ? "pointer" : "not-allowed",
            }}
          >
            {loading ? "Publication..." : editing ? "Mettre à jour" : "Publier dans le classement"}
          </button>
        </div>

        {/* Barème */}
        <details style={{ marginTop: "1.5rem" }}>
          <summary style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", cursor: "pointer", userSelect: "none", marginBottom: "8px" }}>
            Voir le barème des coefficients
          </summary>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {TRANCHES.map((t, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 8px", borderRadius: "6px", background: i % 2 === 0 ? "#F9F9F9" : "#fff", fontSize: "12px" }}>
                  <span style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>{t.min >= 2000 ? "2000 +" : `${t.min} – ${t.max}`}</span>
                  <span style={{ fontWeight: 700, color: "#D97757" }}>×{t.coeff.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </details>

        <style>{`input:focus { border-color: #D97757 !important; box-shadow: 0 0 0 3px #D9775720; } input[type=number]::-webkit-inner-spin-button { -webkit-appearance: none; } input[type=number] { -moz-appearance: textfield; }`}</style>
      </main>
    )
  }

  // ── Vue classement ────────────────────────────────────────────
  const own = ranking.find(e => e.is_own)
  const myRank = ranking.findIndex(e => e.is_own) + 1

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "21px", fontWeight: 800, color: "var(--text)", marginBottom: "4px" }}>Classement Perf-o-mètre</h1>
          <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>Phase 2 · {ranking.length} participant{ranking.length > 1 ? "s" : ""}</p>
        </div>
        <button
          onClick={handleEdit}
          style={{ padding: "9px 16px", borderRadius: "8px", border: "1px solid var(--border)", background: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", color: "var(--text)", whiteSpace: "nowrap" }}
        >
          Modifier mes infos
        </button>
      </div>

      {/* Mon score */}
      {own && myScore !== null && (
        <div style={{
          background: "linear-gradient(135deg, #1a1a2e, #2d1b4e)", borderRadius: "14px",
          padding: "1.4rem 1.6rem", marginBottom: "1.5rem", color: "#fff",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem"
        }}>
          <div>
            <p style={{ fontSize: "11px", color: "#a78bfa", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "4px" }}>
              Ton score — #{myRank}
            </p>
            <p style={{ fontSize: "17px", fontWeight: 800, marginBottom: "2px" }}>{own.prenom} {own.nom_initial}</p>
            {own.instagram && <p style={{ fontSize: "12px", color: "#c4b5fd" }}>@{own.instagram}</p>}
            <p style={{ fontSize: "12px", color: "#a78bfa", marginTop: "4px" }}>
              {own.points_debut} → {own.points_fin} (+{own.progression} pts)
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "52px", fontWeight: 900, lineHeight: 1, color: "#fff" }}>{myScore}</div>
            <div style={{ fontSize: "12px", color: getMention(myScore).color === "#7C3AED" ? "#c4b5fd" : "#a78bfa", fontWeight: 700 }}>
              {getMention(myScore).text}
            </div>
          </div>
        </div>
      )}

      {/* Tableau classement */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 90px", padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "#F9F9F9" }}>
          {["#", "Participant", "Début", "Fin", "Score"].map(h => (
            <span key={h} style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</span>
          ))}
        </div>
        {ranking.map((e, i) => {
          const m = getMention(e.score)
          const isMe = e.is_own
          return (
            <div key={e.id} style={{
              display: "grid", gridTemplateColumns: "40px 1fr 80px 80px 90px",
              padding: "12px 16px", borderBottom: i < ranking.length - 1 ? "1px solid var(--border)" : "none",
              background: isMe ? "#FFF8F5" : "transparent",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: i === 0 ? "#D97757" : "var(--text-muted)" }}>
                {i + 1}
              </span>
              <div>
                <p style={{ fontSize: "14px", fontWeight: isMe ? 700 : 500, color: "var(--text)", marginBottom: "1px" }}>
                  {e.prenom} {e.nom_initial} {isMe && <span style={{ fontSize: "10px", color: "#D97757", fontWeight: 700 }}> (toi)</span>}
                </p>
                {e.instagram && <p style={{ fontSize: "11px", color: "var(--text-muted)" }}>@{e.instagram}</p>}
              </div>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{e.points_debut}</span>
              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{e.points_fin}</span>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "16px", fontWeight: 800, color: m.color }}>{e.score}</span>
                <p style={{ fontSize: "10px", fontWeight: 600, color: m.color }}>{m.text}</p>
              </div>
            </div>
          )
        })}
        {ranking.length === 0 && (
          <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            Aucun participant pour l'instant.
          </div>
        )}
      </div>

      <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "1.2rem", lineHeight: 1.6 }}>
        Classement visible uniquement aux participants · Partage ton score sur Instagram @ttkip.pro
      </p>
    </main>
  )
}
