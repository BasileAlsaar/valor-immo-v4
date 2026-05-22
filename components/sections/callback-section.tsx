import { Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { SITE } from "@/lib/site"

export function CallbackSection() {
  return (
    <section className="bg-cream py-24 md:py-32">
      <Container>
        <div className="grid items-end gap-10 rounded-3xl bg-white p-10 shadow-[0_20px_60px_-20px_rgba(15,61,46,0.18)] md:grid-cols-[1.4fr_1fr] md:p-16">
          <div>
            <Eyebrow className="text-gold-deep">Vous avez un projet</Eyebrow>
            <h2 className="font-display mt-6 text-[clamp(2rem,5.5vw,4.5rem)] uppercase leading-[0.95] tracking-tight text-fir-dark">
              Discutons-en<br />
              <span className="text-gold-deep">en 24 heures.</span>
            </h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
              Un brief précis, une réponse sous 24h ouvrées, un interlocuteur
              unique du premier appel à la signature.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <CtaPill href="/contact" variant="fir" size="lg">
              Demander à être rappelé
            </CtaPill>
            <a
              href={`tel:${SITE.telephoneTel}`}
              className="inline-flex items-center gap-3 text-base font-medium text-fir-dark hover:text-gold-deep"
            >
              <Phone className="h-5 w-5" /> {SITE.telephoneDisplay}
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
