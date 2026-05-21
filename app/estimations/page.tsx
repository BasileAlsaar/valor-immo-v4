import type { Metadata } from "next"
import { PageHero } from "@/components/sections/page-hero"
import { ArgusSection } from "@/components/home/argus-section"
import { CallbackSection } from "@/components/sections/callback-section"

export const metadata: Metadata = {
  title: "Estimations — Valeur locative commerciale Paris",
  description:
    "Estimation locative et vénale des actifs commerciaux parisiens. Plus de 40 000 références analysées pour fournir une fourchette précise par arrondissement.",
}

export default function EstimationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Estimations"
        title={
          <>
            Une valeur juste, <span className="text-gold">documentée, opposable.</span>
          </>
        }
        subtitle="Locale ou patrimoniale, l'estimation s'appuie sur plus de 40 000 références de transactions et baux commerciaux parisiens. Méthode argumentée, livrable formel, opposable bailleur ou notaire."
        backgroundImage="/images/categories/bureaux.jpg"
      />
      <ArgusSection />
      <CallbackSection />
    </>
  )
}
