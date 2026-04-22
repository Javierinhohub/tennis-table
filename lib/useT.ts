"use client"

import fr from "@/locales/fr.json"
import en from "@/locales/en.json"
import { useLocale } from "./useLocale"

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

const messages: Record<string, any> = { fr, en }

export function useT() {
  const locale = useLocale()
  const t = messages[locale] ?? messages["fr"]

  function get(section: string, key: string): string {
    return t[section]?.[key] ?? messages["fr"][section]?.[key] ?? `${section}.${key}`
  }

  return get
}
