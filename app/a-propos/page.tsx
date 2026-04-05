export default function AProposPage() {
  return (
    <main style={{ maxWidth: "780px", margin: "0 auto", padding: "2.5rem 2rem" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2rem" }}>À propos de TT-Kip</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text)" }}>
          TT-Kip, c&apos;est l&apos;idée d&apos;un groupe de potes passionnés de ping, qui partagent depuis des années sur des forums et groupes Facebook. Parmi nous, des joueurs de picots longs, backside et picots courts — classés de 8 à 16.
        </p>
        <p style={{ fontSize: "15px", lineHeight: 1.8, color: "var(--text)", marginTop: "1rem" }}>
          Notre objectif, c&apos;est de partager un maximum d&apos;informations, de manière indépendante, sur la culture du matos de ping : la nôtre, mais surtout la vôtre. Un espace pour échanger librement, pongistiquement et cordialement.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { icon: "🏓", titre: "Passionnés", desc: "Des joueurs de tous niveaux, classés de 8 à 16" },
          { icon: "🔍", titre: "Indépendants", desc: "Aucun sponsor, aucune publicité, que du vrai" },
          { icon: "💬", titre: "Communauté", desc: "Le partage et l'échange avant tout" },
          { icon: "🎯", titre: "Objectif", desc: "Ne plus se perdre parmi les milliers de références" },
        ].map(c => (
          <div key={c.titre} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.2rem" }}>
            <p style={{ fontSize: "24px", marginBottom: "8px" }}>{c.icon}</p>
            <p style={{ fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{c.titre}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.5 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "#FFF0EB", border: "1px solid #D97757", borderRadius: "10px", padding: "1.2rem 1.5rem" }}>
        <p style={{ fontSize: "14px", color: "#C4694A", lineHeight: 1.7 }}>
          💡 TT-Kip est en constante évolution. Vous avez une idée, une suggestion ou vous voulez contribuer ? Rejoignez-nous sur le <a href="/forum" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none" }}>forum</a> ou via la page <a href="/contact" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none" }}>contact</a>.
        </p>
      </div>
    </main>
  )
}
