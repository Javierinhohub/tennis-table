import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité — TT-Kip",
  description: "Politique de confidentialité et protection des données personnelles de TT-Kip.",
  alternates: { canonical: "https://www.tt-kip.com/confidentialite" },
  robots: { index: true, follow: false },
}

export default function ConfidentialitePage() {
  return (
    <main style={{ maxWidth: "760px", margin: "0 auto", padding: "2.5rem 1.5rem", fontFamily: "Poppins, sans-serif" }}>
      <h1 style={{ fontSize: "22px", fontWeight: 700, marginBottom: "6px" }}>Politique de confidentialité</h1>
      <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "2.5rem" }}>Dernière mise à jour : avril 2026</p>

      {[
        {
          titre: "1. Responsable du traitement",
          contenu: "TT-Kip (tt-kip.com) est responsable du traitement de vos données personnelles. Pour toute question relative à vos données, contactez-nous via la page Contact.",
        },
        {
          titre: "2. Données collectées",
          contenu: "Nous collectons uniquement les données nécessaires au fonctionnement du site : adresse email et pseudo lors de l'inscription, notes et avis que vous publiez volontairement, données de navigation anonymisées via Google Analytics (adresse IP anonymisée, pages visitées, durée de visite).",
        },
        {
          titre: "3. Finalités du traitement",
          contenu: "Vos données sont utilisées pour : créer et gérer votre compte utilisateur, afficher vos avis et notes sur les revêtements et bois, améliorer le contenu et les fonctionnalités du site via des statistiques anonymes, afficher des annonces publicitaires pertinentes via Google AdSense.",
        },
        {
          titre: "4. Base légale",
          contenu: "Le traitement de vos données repose sur votre consentement (inscription volontaire, acceptation des cookies publicitaires) et notre intérêt légitime à améliorer le service (analytics anonymisés). Vous pouvez retirer votre consentement à tout moment.",
        },
        {
          titre: "5. Durée de conservation",
          contenu: "Vos données de compte sont conservées tant que votre compte est actif. En cas de suppression de compte, vos données sont effacées sous 30 jours. Les données analytics sont conservées 14 mois maximum.",
        },
        {
          titre: "6. Partage des données",
          contenu: "Vos données ne sont jamais vendues ni cédées à des tiers à des fins commerciales. Elles peuvent être transmises à nos sous-traitants techniques : Supabase (hébergement base de données, Union européenne), Vercel (hébergement web, certifié RGPD), Google Analytics (statistiques, avec anonymisation IP activée), Google AdSense (publicité personnalisée, soumis au consentement RGPD).",
        },
        {
          titre: "7. Cookies",
          contenu: "TT-Kip utilise des cookies strictement nécessaires au fonctionnement du site (session utilisateur), des cookies analytiques anonymisés via Google Analytics, et des cookies publicitaires via Google AdSense (uniquement avec votre consentement). Vous pouvez gérer vos préférences via le bandeau de consentement affiché lors de votre première visite, ou désactiver les cookies dans les paramètres de votre navigateur.",
        },
        {
          titre: "8. Vos droits",
          contenu: "Conformément au RGPD (Règlement UE 2016/679) et à la loi Informatique et Libertés, vous disposez des droits suivants : droit d'accès à vos données, droit de rectification, droit à l'effacement (droit à l'oubli), droit d'opposition au traitement, droit à la portabilité de vos données. Pour exercer ces droits, contactez-nous via la page Contact. Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).",
        },
        {
          titre: "9. Sécurité",
          contenu: "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation : connexion HTTPS, mots de passe chiffrés, accès restreint aux données.",
        },
        {
          titre: "10. Modifications",
          contenu: "Nous nous réservons le droit de modifier cette politique à tout moment. Toute modification sera signalée sur cette page avec la date de mise à jour. L'utilisation continue du site vaut acceptation des modifications.",
        },
      ].map(({ titre, contenu }) => (
        <section key={titre} style={{ marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, marginBottom: "8px", color: "var(--text)" }}>{titre}</h2>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", lineHeight: 1.8 }}>{contenu}</p>
        </section>
      ))}

      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>
          Pour toute question : <a href="/contact" style={{ color: "#D97757", textDecoration: "none", fontWeight: 600 }}>page Contact</a> — CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" style={{ color: "#D97757", textDecoration: "none", fontWeight: 600 }}>www.cnil.fr</a>
        </p>
      </div>
    </main>
  )
}
