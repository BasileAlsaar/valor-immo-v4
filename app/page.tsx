import { Hero } from "@/components/home/hero"
import { IntentionBlock } from "@/components/home/intention-block"
import { QuotesCarousel } from "@/components/home/quotes-carousel"
import { CategoriesGrid } from "@/components/home/categories-grid"
import { MethodSection } from "@/components/home/method-section"
import { ArgusSection } from "@/components/home/argus-section"
import { RecherchesActives } from "@/components/home/recherches-actives"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { ContactCTA } from "@/components/sections/contact-cta"

/**
 * Home — V4.
 *
 * 1. Hero (vidéo Paris + SearchBar onglets + 3 champs + sous-puces)
 * 2. IntentionBlock (3 cartes : Louer / Acheter / Vendre → funnels)
 * 3. QuotesCarousel (6 quotes — fond fir-dark)
 * 4. CategoriesGrid (6 tuiles classes d'actifs)
 * 5. MethodSection (24h/48h/1)
 * 6. ArgusSection (carte + tableau valeurs locatives)
 * 7. RecherchesActives (placeholder APERÇU §6)
 * 8. OpportunitiesPreview
 * 9. ContactCTA
 *    Footer délivré par layout.tsx via <SiteFooter />.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <IntentionBlock />
      <QuotesCarousel />
      <CategoriesGrid />
      <MethodSection />
      <ArgusSection />
      <RecherchesActives />
      <OpportunitiesPreview />
      <ContactCTA />
    </>
  )
}
