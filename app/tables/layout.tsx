import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tables de ping-pong — TT-Kip",
  description: "Découvrez les meilleures tables de tennis de table. Avis et comparatif sur TT-Kip.",
  alternates: { canonical: "https://www.tt-kip.com/tables" },
}

export default function TablesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
