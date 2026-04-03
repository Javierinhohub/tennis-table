import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Navbar from './components/Navbar'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'TT Matériel — Tennis de Table',
  description: 'Liste complète du matériel de tennis de table homologué LARC 2026',
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
      </body>
    </html>
  )
}