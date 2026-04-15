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
  metadataBase: new URL('https://tt-kip.com'),
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
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", color: "#E1306C", fontFamily: "Poppins, sans-serif", fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
            </svg>
            @ttkip.pro
          </a>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "Poppins, sans-serif" }}>
            Copyright TT-Kip 2026 — Tous droits réservés
          </p>
        </footer>
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
