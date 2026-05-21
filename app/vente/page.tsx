import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"

export const metadata: Metadata = {
  title: "Vente — Immobilier commercial Paris",
  description:
    "Vente de boutiques, immeubles, bureaux, hôtels et fonds de commerce à Paris. Accompagnement complet du brief à la signature notariée.",
}

export default function VentePage() {
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
      <OpportunitiesPreview />
      <CallbackSection />
    </>
  )
}
