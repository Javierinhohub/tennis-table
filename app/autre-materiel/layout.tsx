import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Autre matériel de ping — TT-Kip",
  description: "Balles, chaussures, colles et boosters de tennis de table. Avis et comparatif sur TT-Kip.",
  alternates: { canonical: "https://www.tt-kip.com/autre-materiel" },
}

export default function AutreMatérielLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
