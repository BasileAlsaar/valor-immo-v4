import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { PropertyListingSection } from "@/components/sections/property-listing-section"
import { parseFiltersFromSearchParams } from "@/lib/filters/opportunities"
import { applyFilters, buildZoneLabel } from "@/lib/opportunities/pipeline"
import { ScrollToResultsOnMount } from "./scroll-on-search"
import { listPubliableProperties } from "@/lib/apimo"
import { toDisplayProperty } from "@/lib/apimo/to-display"

// ISR alignée sur /commerces (Apimo mis à jour 1-2×/jour côté agence).
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Opportunités — Catalogue",
  description:
    "Catalogue des biens commerciaux disponibles à la location, à l'acquisition ou en cession de fonds à Paris.",
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

/**
 * Clés de paramètres URL considérées comme "recherche utilisateur" — pour
 * décider si on doit auto-scroller vers la section résultats à l'arrivée.
 */
const SEARCH_PARAM_KEYS = [
  "transaction",
  "typologie",
  "arrondissement",
  "commune",
  "surfaceMin",
  "loyerMax",
  "q",
  "tags",
] as const

function hasAnySearchParam(sp: {
  [key: string]: string | string[] | undefined
}): boolean {
  return SEARCH_PARAM_KEYS.some((k) => {
    const v = sp[k]
    if (Array.isArray(v)) return v.some((x) => typeof x === "string" && x.length > 0)
    return typeof v === "string" && v.length > 0
  })
}

export default async function OpportunitesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const filters = parseFiltersFromSearchParams(sp)

  const { publishable } = await listPubliableProperties()
  const all = publishable.map(toDisplayProperty)
  const filtered = applyFilters(all, filters)
  const shouldScrollToResults = hasAnySearchParam(sp)

  return (
    <>
      <PageHero
        eyebrow="Opportunités"
        title={
          <>
            Catalogue des biens <span className="text-gold">disponibles.</span>
          </>
        }
        subtitle="Mise à jour hebdomadaire. Chaque opportunité est validée avant publication, avec accès direct à la pièce maîtresse : bail, plan, baux comparables, simulation."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <ScrollToResultsOnMount active={shouldScrollToResults} />

      <PropertyListingSection
        basePath="/opportunites"
        all={all}
        filtered={filtered}
        emptyZoneLabel={buildZoneLabel(filters)}
      />

      <CallbackSection />
    </>
  )
}
