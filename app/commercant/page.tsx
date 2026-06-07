import type { Metadata } from "next"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Funnel } from "@/components/funnels/Funnel"
import { commercantFunnel } from "@/lib/data/funnels"

export const metadata: Metadata = {
  title: "Commerçant — Déposez votre recherche",
  description:
    "Restauration, commerce, santé, service, sport, bureau : décrivez votre projet. Nous ne vous montrons que des biens en cible. Réponse sous 24h ouvrées.",
  alternates: { canonical: "/commercant" },
}

export default function CommercantPage() {
  return (
    <>
      <section className="relative isolate flex min-h-[40vh] items-end overflow-hidden bg-fir-dark pt-32 pb-12 text-cream">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(/images/categories/locaux-commerciaux.jpg)" }}
          aria-hidden
        />
        <div
          className="absolute inset-0 -z-10 bg-gradient-to-b from-fir-dark/85 via-fir-dark/85 to-fir-darker"
          aria-hidden
        />
        <Container>
          <Eyebrow className="text-gold">{commercantFunnel.eyebrow}</Eyebrow>
          <h1 className="font-display mt-3 text-[clamp(2rem,5vw,4.5rem)] uppercase leading-[1] tracking-tight">
            {commercantFunnel.pageTitle}
          </h1>
          <p className="mt-4 max-w-xl text-base opacity-85">
            {commercantFunnel.subtitle}
          </p>
        </Container>
      </section>

      <section className="bg-cream py-16 md:py-24">
        <Container>
          <div className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,61,46,0.18)] md:p-10 lg:p-12">
            <Funnel config={commercantFunnel} />
          </div>
        </Container>
      </section>
    </>
  )
}
