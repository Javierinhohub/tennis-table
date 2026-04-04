import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

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
  title: 'TT-Kip',
  description: 'Liste complète du matériel de TT-Kip homologué LARC 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <footer style={{ borderTop: "1px solid var(--border)", background: "#fff", padding: "1.5rem 2rem", textAlign: "center", marginTop: "auto" }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", fontFamily: "Poppins, sans-serif" }}>
            Copyright TT-Kip 2026 — Tous droits réservés
          </p>
        </footer>
      </body>
    </html>
  )
}