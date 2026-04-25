import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block non-canonical paths from indexing
        disallow: ["/admin", "/api", "/auth", "/en/"],
      },
    ],
    sitemap: "https://www.tt-kip.com/sitemap.xml",
  }
}
