"use client"

import { useRef } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { Phone } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { CtaPill } from "@/components/ui/cta-pill"
import { duration, easing } from "@/lib/motion"
import { SITE } from "@/lib/site"

/**
 * Section appel d'air en pied de page. NE PAS dupliquer le formulaire ici —
 * le formulaire 3 étapes vit uniquement sur `/contact`. Cette section pousse
 * vers la page contact ou vers le tel direct.
 */
export function ContactCTA() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.3 })

  return (
    <section
      ref={ref}
      className="relative flex items-center overflow-hidden bg-fir-darker py-12 text-cream md:min-h-[50vh] md:py-24"
    >
      <Container className="text-center">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: duration.base, ease: easing.smooth }}
        >
          <Eyebrow className="text-gold">Prochaine étape</Eyebrow>
        </motion.div>
        <motion.h2
          initial={reduce ? false : { opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: duration.base,
            ease: easing.smooth,
            delay: 0.12,
          }}
          className="font-display mx-auto mt-6 max-w-4xl text-[clamp(2.25rem,6vw,6rem)] uppercase leading-[0.95] tracking-tight"
        >
          Parlons de votre projet.
        </motion.h2>
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: duration.base,
            ease: easing.smooth,
            delay: 0.24,
          }}
          className="font-accent mx-auto mt-5 max-w-xl text-lg italic leading-snug opacity-85 md:text-xl"
        >
          Réponse sous 24h ouvrées, sans relais.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: duration.base,
            ease: easing.smooth,
            delay: 0.36,
          }}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <CtaPill href="/contact" variant="gold" size="lg">
            Démarrer mon projet
          </CtaPill>
          <a
            href={`tel:${SITE.telephoneTel}`}
            className="inline-flex items-center gap-2 text-sm text-cream/75 transition-colors hover:text-gold"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden /> {SITE.telephoneDisplay}
          </a>
        </motion.div>
      </Container>
    </section>
  )
}
