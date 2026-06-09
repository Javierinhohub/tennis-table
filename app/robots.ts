import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/joueurs/"],
        disallow: ["/admin", "/api", "/auth", "/en/", "/joueurs"],
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
