import { Container } from "@/components/ui/container"
import { OutlineText } from "@/components/ui/outline-text"
import { CtaPill } from "@/components/ui/cta-pill"
import { SITE } from "@/lib/site"
import { Reveal } from "@/components/motion/reveal"

export function CtaFooterOutline() {
  return (
    <section className="relative overflow-hidden bg-fir-darker py-36 text-white md:py-52 lg:py-64">
      <Container className="text-center">
        <Reveal>
          <p className="eyebrow text-gold">Démarrons la conversation</p>
          <OutlineText
            color="white"
            className="mx-auto mt-6 max-w-6xl text-[clamp(3rem,12vw,13rem)] leading-[0.88]"
          >
            Parlons<br />de votre projet.
          </OutlineText>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
            <CtaPill href="/contact" variant="gold" size="lg">
              Nous contacter
            </CtaPill>
            <a
              href={`tel:${SITE.telephoneTel}`}
              className="text-base uppercase tracking-wider opacity-80 hover:text-gold hover:opacity-100"
            >
              Ou {SITE.telephoneDisplay}
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
