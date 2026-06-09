import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact — TT-Kip",
  description: "Contactez l'équipe TT-Kip pour toute question sur les équipements de tennis de table.",
  alternates: { canonical: "https://www.tt-kip.com/contact" },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
