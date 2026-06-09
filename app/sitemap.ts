import type { MetadataRoute } from "next"

import { SITE } from "@/lib/site"
import { CATEGORIES } from "@/lib/data/categories"
import { properties } from "@/lib/data/properties"
import { ARTICLES } from "@/lib/data/articles"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url
  const now = new Date()

  const staticRoutes = [
    "",
    "/vente",
    "/location",
    "/estimations",
    "/classes-d-actifs",
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

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}${c.href}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const propertyRoutes = properties.map((p) => ({
    url: `${base}/opportunites/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  const articleRoutes = ARTICLES.map((a) => ({
    url: `${base}/actualites/${a.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }))

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...propertyRoutes,
    ...articleRoutes,
  ]
}
