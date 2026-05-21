import { Hero } from "@/components/home/hero"
import { QuotesCarousel } from "@/components/home/quotes-carousel"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { MethodSection } from "@/components/home/method-section"
import { ReassuranceBar } from "@/components/home/reassurance-bar"
import { ArgusSection } from "@/components/home/argus-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { CtaFooterOutline } from "@/components/home/cta-footer-outline"

/**
 * Home — V4 (refonte Jade Kine form / Valor palette).
 *
 * 1. Hero (vidéo Pexels boutique Paris + H1 solid blanc + barre recherche centrée)
 * 2. QuotesCarousel (6 quotes preuve sociale — fond fir-dark)
 * 3. CategoriesGrid (6 tuiles classes d'actifs — outline XXL fir sur cream)
 * 4. MethodSection (24h/48h/1 — outline XXL gold sur fir-dark)
 * 5. ReassuranceBar (3 colonnes + CTA — fond white)
 * 6. ArgusSection (MapLibre Paris + tableau 20 arrondissements — fond cream-soft)
 * 7. OpportunitiesPreview (4 cards biens — fond white)
 * 8. CtaFooterOutline (H2 XXL outline blanc sur fir-darker)
 *
 * Section 9 = Footer délivré par layout.tsx via <SiteFooter />.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <QuotesCarousel />
      <CategoriesGrid />
      <MethodSection />
      <ReassuranceBar />
      <ArgusSection />
      <OpportunitiesPreview />
      <CtaFooterOutline />
    </>
  )
}
