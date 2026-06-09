import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Joueurs professionnels — Classement ITTF | TT-Kip",
  description: "Classement mondial ITTF des meilleurs joueurs de tennis de table. Découvrez leur matériel : revêtements et bois utilisés par les pros.",
  alternates: { canonical: "https://www.tt-kip.com/joueurs" },
}

export default function JoueursLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
