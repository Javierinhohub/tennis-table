import type { Metadata } from "next"
import MessagesClient from "./MessagesClient"

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

// Page liste des conversations — rendu côté client uniquement (auth requise)
export default function MessagesPage() {
  return <MessagesClient />
}
