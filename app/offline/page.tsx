import type { Metadata } from "next"

import { Container } from "@/components/ui/container"

export const metadata: Metadata = {
  title: "Hors ligne",
  robots: { index: false, follow: false },
}

export default function OfflinePage() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-gold-deep">Connexion interrompue</p>
          <h1 className="font-sans mt-4 text-2xl font-semibold uppercase leading-[1.15] tracking-wide text-fir-dark md:text-3xl">
            Vous êtes hors ligne
          </h1>
          <div aria-hidden className="mx-auto my-6 h-px w-12 bg-gold/60" />
          <p className="text-base leading-relaxed text-ink/80">
            La page demandée n&apos;est pas disponible sans connexion. Reconnectez-vous puis réessayez.
          </p>
        </div>
      </Container>
    </section>
  )
}
