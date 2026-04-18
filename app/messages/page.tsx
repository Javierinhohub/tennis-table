import { redirect } from "next/navigation"
import MessagesClient from "./MessagesClient"

// Page liste des conversations — rendu côté client uniquement (auth requise)
export default function MessagesPage() {
  return <MessagesClient />
}
