import { Hero } from "@/components/home/hero"
import { PortesEntrees } from "@/components/home/portes-entrees"
import { QuotesCarousel } from "@/components/home/quotes-carousel"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { MethodSection } from "@/components/home/method-section"
import { ArgusSection } from "@/components/home/argus-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { FunnelsCTA } from "@/components/sections/funnels-cta"
import { ContactCTA } from "@/components/sections/contact-cta"

/**
 * Home — V4.
 *
 * 1. Hero (vidéo Paris + barre recherche + CTAs)
 * 2. QuotesCarousel (6 quotes — fond fir-dark)
 * 3. CategoriesGrid (6 tuiles classes d'actifs)
 * 4. MethodSection (24h/48h/1)
 * 5. ArgusSection
 * 6. OpportunitiesPreview
 * 7. ContactCTA (sprint 2 — remplace CtaFooterOutline du sprint 1)
 *    Footer délivré par layout.tsx via <SiteFooter />.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <PortesEntrees />
      <QuotesCarousel />
      <CategoriesGrid />
      <MethodSection />
      <ArgusSection />
      <OpportunitiesPreview />
      <FunnelsCTA />
      <ContactCTA />
    </>
  )
}
