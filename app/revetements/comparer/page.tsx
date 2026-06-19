import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import BackButton from "@/app/components/BackButton"

export const revalidate = 0 // pas de cache — paramètres dynamiques

export const metadata: Metadata = {
  title: "Comparateur de revêtements | TT-Kip",
  description: "Comparez deux revêtements de tennis de table côte à côte : vitesse, effet, contrôle, prix et caractéristiques techniques.",
}

const TYPE_LABELS: Record<string, string> = {
  In: "Backside", Out: "Picots courts", Mid: "Picots mi-longs", Long: "Picots longs", Anti: "Anti-spin",
}
const TYPE_COLORS: Record<string, string> = {
  In: "#1A56DB", Out: "#7C3AED", Mid: "#D97757", Long: "#059669", Anti: "#9CA3AF",
}

async function fetchProduit(slug: string) {
  const { data } = await supabase
    .from("produits")
    .select(`
      id, nom, slug, image_url, description, actif,
      marques(nom, site_web),
      revetements(
        type_revetement, vitesse_note, effet_note, controle_note,
        prix, poids, epaisseur_max,
        note_marque_vitesse, note_marque_spin, note_marque_controle, note_marque_durete
      )
    `)
    .eq("slug", slug)
    .maybeSingle()
  return data
}

// ── Barre de comparaison ───────────────────────────────────────────
function StatBar({
  valA, valB, max = 10, label, color,
}: { valA: number | null; valB: number | null; max?: number; label: string; color: string }) {
  if (!valA && !valB) return null
  const pctA = valA ? (valA / max) * 100 : 0
  const pctB = valB ? (valB / max) * 100 : 0
  const aWins = valA && valB ? valA > valB : valA ? true : false
  const bWins = valA && valB ? valB > valA : valB ? true : false

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", gap: "10px", padding: "10px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      {/* Bar A */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexDirection: "row-reverse" as const }}>
        <span style={{
          fontSize: "14px", fontWeight: 700,
          color: aWins ? color : "var(--text-muted)",
          minWidth: "20px", textAlign: "right" as const,
        }}>{valA ?? "—"}</span>
        <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "3px",
            background: aWins ? color : "#CBD5E1",
            width: pctA + "%",
            marginLeft: "auto",
          }} />
        </div>
        {aWins && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )}
      </div>

      {/* Label centre */}
      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
        {label}
      </span>

      {/* Bar B */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {bWins && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        )}
        <div style={{ flex: 1, height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{ height: "100%", borderRadius: "3px", background: bWins ? color : "#CBD5E1", width: pctB + "%" }} />
        </div>
        <span style={{
          fontSize: "14px", fontWeight: 700,
          color: bWins ? color : "var(--text-muted)",
          minWidth: "20px",
        }}>{valB ?? "—"}</span>
      </div>
    </div>
  )
}

// ── Ligne texte/prix ───────────────────────────────────────────────
function CompareRow({ label, a, b, higherIsBetter = true }: { label: string; a: string | null; b: string | null; higherIsBetter?: boolean }) {
  const numA = a ? parseFloat(a) : null
  const numB = b ? parseFloat(b) : null
  const aIsNum = numA !== null && !isNaN(numA) && numB !== null && !isNaN(numB)
  const aWins = aIsNum ? (higherIsBetter ? numA! > numB! : numA! < numB!) : false
  const bWins = aIsNum ? (higherIsBetter ? numB! > numA! : numB! < numA!) : false

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "1fr auto 1fr",
      alignItems: "center", gap: "10px", padding: "10px 0",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ textAlign: "right" as const }}>
        <span style={{
          fontSize: "14px", fontWeight: aWins ? 700 : 400,
          color: aWins ? "var(--text)" : "var(--text-muted)",
          padding: aWins ? "2px 8px" : "0",
          background: aWins ? "#FFF0EB" : "transparent",
          borderRadius: "4px",
        }}>{a ?? "—"}</span>
      </div>
      <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.4px", textAlign: "center" as const, whiteSpace: "nowrap" as const }}>
        {label}
      </span>
      <div>
        <span style={{
          fontSize: "14px", fontWeight: bWins ? 700 : 400,
          color: bWins ? "var(--text)" : "var(--text-muted)",
          padding: bWins ? "2px 8px" : "0",
          background: bWins ? "#FFF0EB" : "transparent",
          borderRadius: "4px",
        }}>{b ?? "—"}</span>
      </div>
    </div>
  )
}

// ── Card produit en-tête ───────────────────────────────────────────
function ProductCard({ p, side }: { p: any; side: "left" | "right" }) {
  const rev = p.revetements as any
  const marque = p.marques as any
  const typeColor = TYPE_COLORS[rev?.type_revetement] || "#9CA3AF"

  return (
    <div style={{ textAlign: side === "left" ? "right" as const : "left" as const, display: "flex", flexDirection: "column" as const, alignItems: side === "left" ? "flex-end" as const : "flex-start" as const, gap: "8px" }}>
      {p.image_url
        ? /* eslint-disable-next-line @next/next/no-img-element */
          <img src={p.image_url} alt={p.nom} style={{ width: "80px", height: "80px", objectFit: "contain" }} />
        : <div style={{ width: "80px", height: "80px", borderRadius: "12px", background: "#FFF0EB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D97757" strokeWidth="1.5"><circle cx="12" cy="12" r="9"/></svg>
          </div>
      }
      {rev?.type_revetement && (
        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "4px", background: typeColor + "15", color: typeColor, letterSpacing: "0.3px" }}>
          {TYPE_LABELS[rev.type_revetement] || rev.type_revetement}
        </span>
      )}
      <div>
        <p style={{ fontSize: "16px", fontWeight: 800, color: "var(--text)", margin: 0, lineHeight: 1.2 }}>{p.nom}</p>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "3px 0 0" }}>{marque?.nom}</p>
      </div>
      {rev?.prix && (
        <p style={{ fontSize: "18px", fontWeight: 800, color: "#D97757", margin: 0 }}>{rev.prix} €</p>
      )}
      <a href={`/revetements/${p.slug}`} style={{
        fontSize: "12px", fontWeight: 600, color: "#D97757",
        textDecoration: "none", display: "flex", alignItems: "center", gap: "4px",
        flexDirection: side === "left" ? "row-reverse" as const : "row" as const,
      }}>
        Voir la fiche
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </a>
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string }>
}) {
  const { a: slugA, b: slugB } = await searchParams

  // Sans slug A, on redirige
  if (!slugA) {
    return (
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 2rem", textAlign: "center" as const }}>
        <p style={{ color: "var(--text-muted)", fontSize: "15px", marginBottom: "1.5rem" }}>
          Sélectionnez un revêtement à comparer en cliquant sur &quot;Comparer&quot; depuis une fiche produit.
        </p>
        <a href="/revetements" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none" }}>
          Parcourir les revêtements →
        </a>
      </main>
    )
  }

  const prodA = await fetchProduit(slugA)
  if (!prodA) notFound()

  const revA = prodA.revetements as any

  // Un seul produit sélectionné — afficher son info + demander le second
  if (!slugB) {
    return (
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
        <BackButton fallback="/revetements" label="Retour" />
        <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "1.5rem" }}>Comparateur de revêtements</h1>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", display: "flex", alignItems: "center", gap: "20px", marginBottom: "2rem" }}>
          {prodA.image_url
            ? /* eslint-disable-next-line @next/next/no-img-element */
              <img src={prodA.image_url} alt={prodA.nom} style={{ width: "60px", height: "60px", objectFit: "contain", flexShrink: 0 }} />
            : <div style={{ width: "60px", height: "60px", borderRadius: "10px", background: "#FFF0EB", flexShrink: 0 }} />
          }
          <div>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.4px", margin: "0 0 4px" }}>Sélectionné</p>
            <p style={{ fontSize: "17px", fontWeight: 800, color: "var(--text)", margin: 0 }}>{prodA.nom}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: "2px 0 0" }}>{(prodA.marques as any)?.nom}</p>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "12px" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/>
            </svg>
            <div style={{ background: "#F8FAFC", border: "2px dashed #CBD5E1", borderRadius: "10px", padding: "16px 24px", color: "var(--text-muted)", fontSize: "13px", fontWeight: 500 }}>
              Choisissez un deuxième revêtement
            </div>
          </div>
        </div>

        <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center" as const }}>
          Naviguez vers une fiche revêtement et cliquez sur <strong>&quot;Comparer avec {prodA.nom}&quot;</strong>.
        </p>
        <div style={{ textAlign: "center" as const, marginTop: "1rem" }}>
          <a href="/revetements" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none", fontSize: "14px" }}>
            Parcourir tous les revêtements →
          </a>
        </div>
      </main>
    )
  }

  const prodB = await fetchProduit(slugB)
  if (!prodB) notFound()

  const revB = prodB.revetements as any

  // ── Comparaison complète ───────────────────────────────────────────
  const hasMarqueNotes =
    (revA?.note_marque_vitesse || revA?.note_marque_spin || revA?.note_marque_controle || revA?.note_marque_durete) ||
    (revB?.note_marque_vitesse || revB?.note_marque_spin || revB?.note_marque_controle || revB?.note_marque_durete)

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <BackButton fallback="/revetements" label="Retour aux revêtements" />

      <h1 style={{ fontSize: "22px", fontWeight: 800, marginBottom: "0.25rem" }}>Comparateur de revêtements</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "2rem" }}>
        Analysez les différences clés entre deux revêtements
      </p>

      {/* ── En-têtes produits ─────────────────────────────────────── */}
      <div style={{
        background: "#fff", border: "1px solid var(--border)", borderRadius: "14px",
        padding: "24px", marginBottom: "1.5rem",
        display: "grid", gridTemplateColumns: "1fr 40px 1fr", gap: "16px", alignItems: "start",
      }}>
        <ProductCard p={prodA} side="left" />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "24px" }}>
          <span style={{ fontSize: "15px", fontWeight: 800, color: "var(--text-muted)" }}>VS</span>
        </div>
        <ProductCard p={prodB} side="right" />
      </div>

      {/* ── Performances ──────────────────────────────────────────── */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: "0 0 4px" }}>
          Notes TT-Kip
        </p>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 16px" }}>Sur 10 — établies par notre équipe de tests</p>

        <StatBar valA={revA?.vitesse_note} valB={revB?.vitesse_note} label="Vitesse" color="#1A56DB" />
        <StatBar valA={revA?.effet_note}   valB={revB?.effet_note}   label="Effet"   color="#0E7F4F" />
        <StatBar valA={revA?.controle_note} valB={revB?.controle_note} label="Contrôle" color="#B45309" />
      </div>

      {/* ── Caractéristiques techniques ───────────────────────────── */}
      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: "0 0 12px" }}>
          Caractéristiques
        </p>

        <CompareRow
          label="Prix"
          a={revA?.prix ? revA.prix + " €" : null}
          b={revB?.prix ? revB.prix + " €" : null}
          higherIsBetter={false}
        />
        <CompareRow
          label="Type"
          a={revA?.type_revetement ? (TYPE_LABELS[revA.type_revetement] || revA.type_revetement) : null}
          b={revB?.type_revetement ? (TYPE_LABELS[revB.type_revetement] || revB.type_revetement) : null}
        />
        <CompareRow
          label="Épaisseur max"
          a={revA?.epaisseur_max ? revA.epaisseur_max + " mm" : null}
          b={revB?.epaisseur_max ? revB.epaisseur_max + " mm" : null}
          higherIsBetter={false}
        />
        <CompareRow
          label="Poids"
          a={revA?.poids ? revA.poids + " g" : null}
          b={revB?.poids ? revB.poids + " g" : null}
          higherIsBetter={false}
        />
      </div>

      {/* ── Notes fabricant ───────────────────────────────────────── */}
      {hasMarqueNotes && (
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "14px", padding: "24px", marginBottom: "1.5rem" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase" as const, letterSpacing: "0.5px", margin: "0 0 4px" }}>
            Notes fabricant
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "0 0 16px" }}>Selon les données officielles des marques</p>

          <StatBar valA={revA?.note_marque_vitesse} valB={revB?.note_marque_vitesse} label="Vitesse" color="#7C3AED" />
          <StatBar valA={revA?.note_marque_spin}    valB={revB?.note_marque_spin}    label="Spin"    color="#7C3AED" />
          <StatBar valA={revA?.note_marque_controle} valB={revB?.note_marque_controle} label="Contrôle" color="#7C3AED" />
          <StatBar valA={revA?.note_marque_durete}  valB={revB?.note_marque_durete}  label="Dureté"  color="#7C3AED" />
        </div>
      )}

      {/* ── CTA reset ─────────────────────────────────────────────── */}
      <div style={{ textAlign: "center" as const, paddingTop: "1rem" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
          Comparer d&apos;autres revêtements ?
        </p>
        <a href="/revetements" style={{
          display: "inline-block", padding: "10px 24px", borderRadius: "8px",
          background: "#D97757", color: "#fff", textDecoration: "none",
          fontSize: "13px", fontWeight: 700,
        }}>
          Parcourir tous les revêtements
        </a>
      </div>
    </main>
  )
}
