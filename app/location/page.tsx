import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { CallbackSection } from "@/components/sections/callback-section"
import { OpportunitiesPreview } from "@/components/home/opportunities-preview"

export const metadata: Metadata = {
  title: "Location — Immobilier commercial Paris",
  description:
    "Location de locaux commerciaux, plateaux de bureaux, entrepôts et murs d'exploitation. Baux 3/6/9 tertiaires et commerciaux à Paris.",
}

export default function LocationPage() {
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
      <OpportunitiesPreview />
      <CallbackSection />
    </>
  )
}
