import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'
import Script from 'next/script'

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
  },
  metadataBase: new URL('https://tt-kip.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <div style={{ paddingTop: "0" }}>{children}</div>
        <footer style={{ borderTop: "1px solid var(--border)", background: "#fff", padding: "1.5rem 2rem", textAlign: "center", marginTop: "auto" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "Poppins, sans-serif" }}>
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
