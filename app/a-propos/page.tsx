export default function AProposPage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2rem" }}>À propos de TT-Kip</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem", lineHeight: 1.8, fontSize: "15px", color: "var(--text)" }}>
        <p>
          TT-Kip, c&apos;est l&apos;idée d&apos;un groupe de potes passionnés de ping, qui partagent depuis des années sur des forums et groupes Facebook. Parmi nous, des joueurs de picots longs, backside et picots courts — classés de 8 à 16.
        </p>
        <p style={{ marginTop: "1rem" }}>
          Notre objectif, c&apos;est de partager un maximum d&apos;informations, de manière indépendante, sur la culture du matos de ping : la nôtre, mais surtout la vôtre. Un espace pour échanger librement, pongistiquement et cordialement.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { titre: "Indépendants", desc: "Aucun sponsor, aucune publicité. Que des avis de joueurs." },
          { titre: "Passionnés", desc: "Des joueurs de tous styles, classés de 8 à 16." },
          { titre: "Communauté", desc: "Le partage avant tout, sur le forum et les articles." },
          { titre: "Exhaustif", desc: "1 690 revêtements LARC 2026, des centaines de bois." },
        ].map(c => (
          <div key={c.titre} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.2rem" }}>
            <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text)", marginBottom: "6px" }}>{c.titre}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ borderLeft: "3px solid #D97757", paddingLeft: "1.2rem", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7 }}>
        Une idée, une suggestion, envie de contribuer ?{" "}
        <a href="/contact" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Contactez-nous</a>
        {" "}ou rejoignez la discussion sur le{" "}
        <a href="/forum" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>forum</a>.
      </div>

    </main>
  )
}
