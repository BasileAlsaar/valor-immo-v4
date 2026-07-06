import { Hero } from "@/components/home/hero"
import { IntentionBlock } from "@/components/home/intention-block"
import { QuotesCarousel } from "@/components/home/quotes-carousel"
import { MethodSection } from "@/components/home/method-section"
import { ArgusSection } from "@/components/home/argus-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"
import { ContactCTA } from "@/components/sections/contact-cta"

/**
 * Home — V4.
 *
 * 1. Hero (vidéo Paris + SearchBar onglets + 3 champs + sous-puces)
 * 2. OpportunitiesPreview (carousel marquee — biens à la une)
 * 3. IntentionBlock (3 cartes : Louer / Acheter / Vendre → funnels)
 * 4. QuotesCarousel (6 quotes — fond fir-dark)
 * 5. MethodSection (24h/48h/1)
 * 6. ArgusSection (carte + tableau valeurs locatives)
 * 7. ContactCTA
 *    Footer délivré par layout.tsx via <SiteFooter />.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <OpportunitiesPreview />
      <IntentionBlock />
      <QuotesCarousel />
      <MethodSection />
      <ArgusSection />
      <ContactCTA />
    </>
  )
}
