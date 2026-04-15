import { MetadataRoute } from "next"
import { supabase } from "@/lib/supabase"

const BASE = "https://www.tt-kip.com"

export const revalidate = 3600 // regénéré toutes les heures par Vercel

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // ── Pages statiques ──────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,                     lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/revetements`,    lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/bois`,           lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/tables`,         lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/joueurs`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/articles`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE}/autre-materiel`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.6 },
    { url: `${BASE}/forum`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.7 },
    { url: `${BASE}/a-propos`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/contact`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ]

  // ── Revêtements (toutes les fiches produit) ───────────────────────────────
  const { data: revetements } = await supabase
    .from("produits")
    .select("slug")
    .eq("actif", true)
    .select("slug, revetements!inner(id)")
    .limit(5000)

  const revetementPages: MetadataRoute.Sitemap = (revetements || []).map((p: any) => ({
    url: `${BASE}/revetements/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // ── Bois ─────────────────────────────────────────────────────────────────
  const { data: boisList } = await supabase
    .from("produits")
    .select("slug, bois!inner(id)")
    .eq("actif", true)
    .limit(5000)

  const boisPages: MetadataRoute.Sitemap = (boisList || []).map((p: any) => ({
    url: `${BASE}/bois/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  // ── Articles ─────────────────────────────────────────────────────────────
  const { data: articles } = await supabase
    .from("articles")
    .select("slug, cree_le")
    .eq("publie", true)

  const articlePages: MetadataRoute.Sitemap = (articles || []).map((a: any) => ({
    url: `${BASE}/articles/${a.slug}`,
    lastModified: new Date(a.cree_le),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  // ── Joueurs ──────────────────────────────────────────────────────────────
  const { data: joueurs } = await supabase
    .from("joueurs_pro")
    .select("id")
    .eq("actif", true)

  const joueurPages: MetadataRoute.Sitemap = (joueurs || []).map((j: any) => ({
    url: `${BASE}/joueurs/${j.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [
    ...staticPages,
    ...revetementPages,
    ...boisPages,
    ...articlePages,
    ...joueurPages,
  ]
}
