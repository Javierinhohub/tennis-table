import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://tt-kip.com", lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: "https://tt-kip.com/revetements", lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: "https://tt-kip.com/bois", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://tt-kip.com/articles", lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: "https://tt-kip.com/joueurs", lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: "https://tt-kip.com/autre-materiel", lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: "https://tt-kip.com/forum", lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: "https://tt-kip.com/a-propos", lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: "https://tt-kip.com/contact", lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: "https://tt-kip.com/articles/conseil-achat-premiere-raquette", lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ]
}
