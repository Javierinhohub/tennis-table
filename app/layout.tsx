import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Script from 'next/script'
import SessionProvider from './components/SessionProvider'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: {
    default: 'TT-Kip — La référence des équipements de tennis de table',
    template: '%s | TT-Kip',
  },
  description: 'TT-Kip : base de données de revêtements, bois et équipements de tennis de table. Tests, avis et conseils par des passionnés de ping.',
  keywords: ['tennis de table', 'ping pong', 'revêtements', 'bois', 'raquette', 'LARC 2026'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tt-kip.com',
    siteName: 'TT-Kip',
    title: 'TT-Kip — La référence des équipements de tennis de table',
    description: 'Base de données de revêtements, bois et équipements de tennis de table.',
    // Ajoute ceci pour qu'une image apparaisse lors des partages :
    images: [
      {
        url: '/og-image.jpg', // Place une image (1200x630px) dans ton dossier public/
        width: 1200,
        height: 630,
        alt: 'Aperçu du site TT-Kip',
      },
    ],
  },
  // Ajoute ceci pour les partages sur X (Twitter)
  twitter: {
    card: 'summary_large_image',
    title: 'TT-Kip — La référence des équipements de ping',
    description: 'Tests, avis et base de données de revêtements et bois de tennis de table.',
    images: ['/og-image.jpg'],
  },
  metadataBase: new URL('https://www.tt-kip.com'),
  other: {
    'x-fb-no-webview': '1',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-full flex flex-col">
        <SessionProvider>
        <Navbar />
        <div style={{ paddingTop: "0" }}>{children}</div>
        </SessionProvider>
        <footer style={{ borderTop: "1px solid var(--border)", background: "#fff", padding: "1.5rem 2rem", textAlign: "center", marginTop: "auto" }}>
          <a href="https://www.instagram.com/ttkip.pro" target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none", fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, marginBottom: "8px",
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              width: "28px", height: "28px", borderRadius: "8px",
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
              flexShrink: 0,
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none"/>
              </svg>
            </span>
            @ttkip.pro
          </a>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "Poppins, sans-serif" }}>
            Copyright TT-Kip 2026 — Tous droits réservés
          </p>
        </footer>
        {/* Redirection hors WebView Facebook/Instagram → ouvre dans le vrai navigateur */}
        <Script id="fb-webview-fix" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: `
          (function() {
            var ua = navigator.userAgent || '';
            var isFBWebView = ua.indexOf('FBAN') > -1 || ua.indexOf('FBAV') > -1
              || ua.indexOf('Instagram') > -1 || ua.indexOf('FB_IAB') > -1;
            if (isFBWebView) {
              // Neutralise document.write pour bloquer les textes injectés
              document.write = function() {};
              // Redirige vers le vrai navigateur sur iOS
              if (/iPhone|iPad|iPod/.test(ua)) {
                window.location.href = 'x-safari-' + window.location.href;
              }
            }
          })();
        `}} />
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-XGYJKVTVY5" strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XGYJKVTVY5');
        `}} />
      </body>
    </html>
  )
}
