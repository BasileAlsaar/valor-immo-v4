import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { PropertyListingSection } from "@/components/sections/property-listing-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { SectionIndex } from "@/components/ui/section-index"
import { SectionTitle } from "@/components/ui/section-title"
import { parseFiltersFromSearchParams } from "@/lib/filters/opportunities"
import { applyFilters, buildZoneLabel } from "@/lib/opportunities/pipeline"
import { listPubliableProperties } from "@/lib/apimo"
import { toDisplayProperty } from "@/lib/apimo/to-display"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Location — Immobilier commercial Paris",
  description:
    "Location de locaux commerciaux, plateaux de bureaux, entrepôts et murs d'exploitation. Baux 3/6/9 tertiaires et commerciaux à Paris.",
}

const CIBLES = [
  {
    titre: "Une boutique",
    text: "Emplacement n°1 à 2, avec ou sans extraction, façade d'angle.",
  },
  {
    titre: "Un restaurant",
    text: "Locaux avec extraction, conformité, terrasse le cas échéant.",
  },
  {
    titre: "Des bureaux",
    text: "Du poste isolé au plateau, haussmannien ou récent.",
  },
  {
    titre: "Un local d'activité",
    text: "Artisanat, atelier, petite production.",
  },
  {
    titre: "Un actif logistique",
    text: "Stockage, dernier kilomètre, Île-de-France.",
  },
] as const

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function LocationPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const filters = parseFiltersFromSearchParams(sp)

  const { publishable } = await listPubliableProperties()
  const all = publishable
    .map(toDisplayProperty)
    .filter((p) => p.statut === "location")
  const filtered = applyFilters(all, filters)

  return (
    <>
      <PageHero
        eyebrow="Location"
        title={
          <>
            Trouver l'emplacement <span className="text-gold">qui fait la signature.</span>
          </>
        }
        subtitle="Baux commerciaux 3/6/9, baux tertiaires, prises à bail flagship. Nous négocions chaque clause — franchise, paliers, déspécialisation, autorisations — pour ancrer durablement votre activité."
        backgroundImage="/images/categories/locaux-commerciaux.jpg"
      />

      <PropertyListingSection
        basePath="/location"
        all={all}
        filtered={filtered}
        emptyZoneLabel={buildZoneLabel(filters)}
      />

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
            <div>
              <Eyebrow className="text-gold-deep">Cibles</Eyebrow>
              <SectionTitle as="h3" size="md" className="mt-4">
                Ce que nous vous aidons à trouver.
              </SectionTitle>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                Vous cherchez un emplacement. Nous le cadrons avec vous, puis
                nous ne vous montrons que des biens en cible — pas de visite
                hors sujet.
              </p>
            </div>
            <SectionIndex items={CIBLES} />
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
