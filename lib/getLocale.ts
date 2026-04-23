import { headers } from "next/headers"
import fr from "@/locales/fr.json"
import en from "@/locales/en.json"

export type Locale = "fr" | "en"

const messages: Record<string, any> = { fr, en }

/** Récupère la locale depuis le header x-locale posé par le middleware */
export async function getLocale(): Promise<Locale> {
  const h = await headers()
  return h.get("x-locale") === "en" ? "en" : "fr"
}

/** Fonction de traduction côté serveur */
export function makeT(locale: Locale) {
  const t = messages[locale] ?? messages["fr"]
  return function get(section: string, key: string): string {
    return t[section]?.[key] ?? messages["fr"][section]?.[key] ?? `${section}.${key}`
  }
}
