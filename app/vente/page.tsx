import type { Metadata } from "next"

import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { PropertyListingSection } from "@/components/sections/property-listing-section"
import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { SectionIndex } from "@/components/ui/section-index"
import { SectionTitle } from "@/components/ui/section-title"
import { parseFiltersFromSearchParams } from "@/lib/filters/opportunities"
import { applyFilters, buildZoneLabel } from "@/lib/opportunities/pipeline"
import { listPubliableProperties } from "@/lib/apimo"
import { toDisplayProperty } from "@/lib/apimo/to-display"

// ISR alignée sur /commerces + /opportunites.
export const revalidate = 3600

export const metadata: Metadata = {
  title: "Vente — Immobilier commercial Paris",
  description:
    "Vente de boutiques, immeubles, bureaux, hôtels et fonds de commerce à Paris. Accompagnement complet du brief à la signature notariée.",
}

const CATEGORIES = [
  {
    titre: "Murs commerciaux libres",
    text: "Le local est vendu sans locataire en place. L'acquéreur récupère la pleine jouissance du bien : exploitation directe ou nouvelle mise en location.",
  },
  {
    titre: "Murs commerciaux occupés",
    text: "Le local est vendu avec son bail en cours. L'acquéreur perçoit immédiatement un loyer ; la valeur se lit au rendement et à la qualité du locataire.",
  },
  {
    titre: "Immeubles",
    text: "Monopropriétés, immeubles mixtes commerce/habitation, lots de copropriété. Logique d'investissement patrimonial et de rendement global.",
  },
  {
    titre: "Hôtels",
    text: "Murs et fonds d'hôtels indépendants, boutique-hôtels, résidences urbaines. Transmission, valorisation patrimoniale ou repositionnement.",
  },
  {
    titre: "Bureaux",
    text: "Plateaux, sièges sociaux, surfaces divisibles. Acquisition pour occupation propre ou placement.",
  },
  {
    titre: "Actifs logistiques",
    text: "Entrepôts, locaux d'activité, stockage urbain et dernier kilomètre. Marché tendu, rendements stables.",
  },
] as const

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function VentePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const filters = parseFiltersFromSearchParams(sp)

  const { publishable } = await listPubliableProperties()
  // /vente ne montre que les biens dont statut ∈ {vente, murs-libres}.
  // Le mapper Apimo ne produit jamais "murs-libres" (concept éditorial
  // non dérivable) → en pratique, statut === "vente".
  const all = publishable
    .map(toDisplayProperty)
    .filter((p) => p.statut === "vente" || p.statut === "murs-libres")
  const filtered = applyFilters(all, filters)

  return (
    <>
      <PageHero
        eyebrow="Vente"
        title={
          <>
            Cession et acquisition <span className="text-gold">d'actifs commerciaux.</span>
          </>
        }
        subtitle="Boutiques pied d'immeuble, immeubles mixtes, fonds de commerce CHR, plateaux de bureaux : nous accompagnons cédants et acquéreurs sur tout le cycle, depuis le brief jusqu'à la signature notariée."
        backgroundImage="/images/categories/immeubles.jpg"
      />

      <PropertyListingSection
        basePath="/vente"
        all={all}
        filtered={filtered}
        emptyZoneLabel={buildZoneLabel(filters)}
      />

      <section className="bg-cream py-24 md:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:items-start">
            <div>
              <Eyebrow className="text-gold-deep">Périmètre</Eyebrow>
              <SectionTitle as="h3" size="md" className="mt-4">
                Six catégories, six logiques de valeur.
              </SectionTitle>
              <div aria-hidden className="my-6 h-px w-12 bg-gold" />
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-fir-dark/70 md:text-base">
                Valor Immo intervient sur l'ensemble des actifs commerciaux et
                professionnels, à la vente comme à l'acquisition. Chaque
                catégorie répond à une logique de valeur et de marché distincte
                — voici ce que nous traitons.
              </p>
              <div className="mt-8">
                <CtaPill href="/contact" variant="fir" size="md">
                  Démarrer mon projet
                </CtaPill>
              </div>
            </div>
            <SectionIndex items={CATEGORIES} />
          </div>
        </Container>
      </section>

      <CallbackSection />
    </>
  )
}
