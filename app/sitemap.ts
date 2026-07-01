import type { MetadataRoute } from "next"

import { SITE } from "@/lib/site"
import { ARTICLES } from "@/lib/data/articles"
import { listPubliableProperties } from "@/lib/apimo"

// Le sitemap est régénéré au même rythme que l'ISR /commerces
// (1h). Suffisant vu la cadence de mise à jour du CRM.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE.url
  const now = new Date()

  const staticRoutes = [
    "",
    "/vente",
    "/location",
    "/estimations",
    "/opportunites",
    "/signatures",
    "/actualites",
    "/l-agence",
    "/contact",
    "/mentions-legales",
    "/politique-de-confidentialite",
    "/gestion-des-cookies",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  // Fiches détail : Apimo → /commerces/{slug} (route détail effective
  // depuis Commit B). En cas d'erreur Apimo, on renvoie le sitemap sans
  // les fiches plutôt que 500 — on ne casse pas le SEO du site pour un
  // souci externe.
  let propertyRoutes: MetadataRoute.Sitemap = []
  try {
    const { publishable } = await listPubliableProperties()
    propertyRoutes = publishable.map((p) => ({
      url: `${base}/commerces/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }))
  } catch (e) {
    console.warn(
      JSON.stringify({
        event: "sitemap.apimo_fetch_failed",
        message: e instanceof Error ? e.message : String(e),
      }),
    )
  }

  const articleRoutes = ARTICLES.map((a) => ({
    url: `${base}/actualites/${a.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }))

  return [...staticRoutes, ...propertyRoutes, ...articleRoutes]
}
