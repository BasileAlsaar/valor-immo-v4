import type { Metadata } from "next"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Funnel } from "@/components/funnels/Funnel"
import { investisseurFunnel } from "@/lib/data/funnels"

export const metadata: Metadata = {
  title: "Investisseur — Définissez votre recherche",
  description:
    "Investissez à Paris et en Île-de-France : murs occupés, immeubles de rendement, hôtels, bureaux, logistique. Décrivez vos critères, réponse sous 24h ouvrées.",
  alternates: { canonical: "/investisseur" },
}

export default function InvestisseurPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[40vh] items-end overflow-hidden bg-fir-dark pt-32 pb-12 text-cream">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/images/categories/bureaux.jpg)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/85 via-fir-dark/85 to-fir-darker"
          aria-hidden
        />
        <Container>
          <Eyebrow className="text-gold">{investisseurFunnel.eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[1] tracking-tight">
            {investisseurFunnel.pageTitle}
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-85">
            {investisseurFunnel.subtitle}
          </p>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,61,46,0.18)] md:p-10 lg:p-12">
            <Funnel config={investisseurFunnel} />
          </div>
        </Container>
      </section>
    </>
  )
}
