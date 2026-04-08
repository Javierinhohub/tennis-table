export default function AProposPage() {
  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "2.5rem 2rem" }}>

      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "2rem" }}>À propos de TT-Kip</h1>

      <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "12px", padding: "2rem", marginBottom: "1.5rem", lineHeight: 1.8, fontSize: "15px", color: "var(--text)" }}>
        <p>
          TT-Kip, c&apos;est l&apos;idée d&apos;un groupe de passionnés de ping, qui partagent depuis des années sur des forums et groupes Facebook. Parmi nous, des joueurs de picots longs, backside et picots courts — classés de 8 à 16.
        </p>
        <p style={{ marginTop: "1rem" }}>
          Notre objectif, c&apos;est de partager un maximum d&apos;informations, de manière indépendante, sur la culture du matos de ping : la nôtre, mais surtout la vôtre. Un espace pour échanger librement, pongistiquement et cordialement.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "2rem" }}>
        {[
          { titre: "Indépendants", desc: "Aucun sponsor, aucune publicité. Que des avis de joueurs amateurs." },
          { titre: "Passionnés", desc: "Des joueurs de tous styles, classés de 8 à 16." },
          { titre: "Communauté", desc: "Le partage avant tout, sur le forum et les articles." },
          { titre: "Exhaustif", desc: "Pls de 1500 revêtements repertoriés, des centaines de bois." },
        ].map(c => (
          <div key={c.titre} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: "10px", padding: "1.2rem" }}>
            <p style={{ fontWeight: 700, fontSize: "14px", color: "var(--text)", marginBottom: "6px" }}>{c.titre}</p>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.6 }}>{c.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ borderLeft: "3px solid #D97757", paddingLeft: "1.2rem", color: "var(--text-muted)", fontSize: "14px", lineHeight: 1.7, marginBottom: "3rem" }}>
        Une idée, une suggestion, envie de contribuer ?{" "}
        <a href="/contact" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>Contactez-nous</a>
        {" "}ou rejoignez la discussion sur le{" "}
        <a href="/forum" style={{ color: "#D97757", textDecoration: "none", fontWeight: 500 }}>forum</a>.
      </div>

      {/* POLITIQUE DE CONFIDENTIALITÉ */}
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "2rem" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem" }}>Politique de confidentialité</h2>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "1.5rem" }}>Dernière mise à jour : avril 2026</p>

        {[
          {
            titre: "1. Responsable du traitement",
            contenu: "TT-Kip (tt-kip.com) est responsable du traitement de vos données personnelles. Pour toute question relative à vos données, contactez-nous via la page Contact."
          },
          {
            titre: "2. Données collectées",
            contenu: "Nous collectons uniquement les données nécessaires au fonctionnement du site : adresse email et pseudo lors de l'inscription, notes et avis que vous publiez volontairement, données de navigation anonymisées via Google Analytics (adresse IP anonymisée, pages visitées, durée de visite)."
          },
          {
            titre: "3. Finalités du traitement",
            contenu: "Vos données sont utilisées pour : créer et gérer votre compte utilisateur, afficher vos avis et notes sur les revêtements et bois, améliorer le contenu et les fonctionnalités du site via des statistiques anonymes."
          },
          {
            titre: "4. Base légale",
            contenu: "Le traitement de vos données repose sur votre consentement (inscription volontaire) et notre intérêt légitime à améliorer le service (analytics anonymisés). Vous pouvez retirer votre consentement à tout moment."
          },
          {
            titre: "5. Durée de conservation",
            contenu: "Vos données de compte sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont effacées sous 30 jours. Les données analytics sont conservées 14 mois maximum."
          },
          {
            titre: "6. Partage des données",
            contenu: "Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales. Elles peuvent être transmises à nos sous-traitants techniques : Supabase (hébergement base de données, Union européenne), Vercel (hébergement web, certifié RGPD), Google Analytics (statistiques, avec anonymisation IP activée)."
          },
          {
            titre: "7. Cookies",
            contenu: "TT-Kip utilise des cookies strictement nécessaires au fonctionnement du site (session utilisateur) et des cookies analytiques anonymisés via Google Analytics. Vous pouvez désactiver les cookies analytiques dans les paramètres de votre navigateur."
          },
          {
            titre: "8. Vos droits",
            contenu: "Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement (droit à l'oubli), droit d'opposition au traitement, droit à la portabilité de vos données. Pour exercer ces droits, contactez-nous via la page Contact. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr)."
          },
          {
            titre: "9. Sécurité",
            contenu: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation : connexion HTTPS, mots de passe chiffrés, accès restreint aux données."
          },
          {
            titre: "10. Modifications",
            contenu: "Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification sera signalée sur cette page avec la date de mise à jour. L'utilisation continue du site vaut acceptation des modifications."
          },
        ].map(section => (
          <div key={section.titre} style={{ marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text)", marginBottom: "6px" }}>{section.titre}</h3>
            <p style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: 1.8 }}>{section.contenu}</p>
          </div>
        ))}

        <div style={{ background: "#FFF0EB", border: "1px solid #D97757", borderRadius: "10px", padding: "1rem 1.2rem", fontSize: "13px", color: "#C4694A", marginTop: "1.5rem" }}>
          Pour toute question relative à vos données personnelles :{" "}
          <a href="/contact" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none" }}>nous contacter</a>
          {" "}— CNIL :{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#D97757", fontWeight: 600, textDecoration: "none" }}>www.cnil.fr</a>
        </div>
      </div>

    </main>
  )
}
