import Link from "next/link"
import { Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { OutlineText } from "@/components/ui/outline-text"
import { CtaPill } from "@/components/ui/cta-pill"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { SITE } from "@/lib/site"

type Step = { chiffre: string; titre: string; text: string }

const STEPS_DEFAULT: ReadonlyArray<Step> = [
  {
    chiffre: "24h",
    titre: "Brief précis",
    text: "Surface, emplacement, activité, budget. Pas de visite hors cible.",
  },
  {
    chiffre: "48h",
    titre: "Première visite",
    text: "Sur les biens identifiés et validés ensemble.",
  },
  {
    chiffre: "1",
    titre: "Interlocuteur confirmé",
    text: "Du premier appel à la signature notariée. Pas de relais, pas de sous-traitance.",
  },
] as const

export function MethodSection({ steps }: { steps?: ReadonlyArray<Step> } = {}) {
  const items = steps ?? STEPS_DEFAULT
  const gridCols = items.length === 2 ? "md:grid-cols-2 md:max-w-3xl md:mx-auto" : "md:grid-cols-3"
  return (
    <section className="relative overflow-hidden bg-fir-dark py-16 text-white md:py-18 lg:py-20">
      <Container>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Eyebrow className="text-gold">Méthode</Eyebrow>
            <OutlineText
              color="gold"
              className="mt-3 text-[clamp(1.5rem,4vw,3.75rem)] leading-[1]"
            >
              Du brief à la signature, sans relais.
            </OutlineText>
          </div>
          <a
            href={`tel:${SITE.telephoneTel}`}
            className="font-display hidden text-2xl uppercase tracking-tight text-gold hover:text-white md:inline-flex md:items-center md:gap-3"
          >
            <Phone className="h-5 w-5" /> {SITE.telephoneDisplay}
          </a>
        </div>

        <RevealStagger className={`mt-10 grid gap-10 ${gridCols}`}>
          {items.map((step) => (
            <RevealItem key={step.chiffre}>
              <div className="border-t-2 border-gold/30 pt-5">
                <p className="font-display text-[clamp(2.75rem,6vw,5rem)] leading-[0.85] text-gold">
                  {step.chiffre}
                </p>
                <h3 className="mt-3 text-lg font-medium uppercase tracking-tight md:text-xl">
                  {step.titre}
                </h3>
                <p className="mt-2 text-sm leading-relaxed opacity-80">
                  {step.text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>

        <div className="mt-10 flex flex-wrap items-center gap-6">
          <CtaPill href="/contact" variant="gold" size="lg">
            Démarrer mon projet
          </CtaPill>
          <Link href="/l-agence" className="text-sm uppercase tracking-wider opacity-80 hover:text-gold hover:opacity-100">
            En savoir plus sur l'agence ↗
          </Link>
        </div>
      </Container>
    </section>
  )
}
