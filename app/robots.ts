import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth", "/en/", "/profil", "/messages"],
      },
      // Bloquer les crawlers SEO agressifs
      {
        userAgent: ["AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "Bytespider", "PetalBot", "Amazonbot"],
        disallow: ["/"],
      },
      // Bloquer les crawlers IA (entraînement de modèles)
      {
        userAgent: [
          "GPTBot",           // OpenAI
          "ChatGPT-User",     // OpenAI browsing
          "ClaudeBot",        // Anthropic
          "anthropic-ai",     // Anthropic
          "Claude-Web",       // Anthropic
          "CCBot",            // Common Crawl (données d'entraînement)
          "Google-Extended",  // Google AI / Bard
          "PerplexityBot",    // Perplexity AI
          "cohere-ai",        // Cohere
          "meta-externalagent", // Meta AI
          "Diffbot",          // Diffbot / LLM data
          "FacebookBot",      // Meta scraping
          "Omgilibot",        // AI data aggregator
          "Applebot-Extended", // Apple AI
        ],
        disallow: ["/"],
      },
    ],
    sitemap: "https://www.tt-kip.com/sitemap.xml",
  }
}
