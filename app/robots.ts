import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/en/", "/profil", "/messages"],
      },
      // Bloquer les crawlers agressifs connus
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "Bytespider", "PetalBot", "Amazonbot"],
        disallow: ["/"],
      },
    ],
    sitemap: "https://www.tt-kip.com/sitemap.xml",
  }
}
