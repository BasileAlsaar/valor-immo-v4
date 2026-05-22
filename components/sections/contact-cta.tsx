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
      className="relative flex min-h-[50vh] items-center overflow-hidden bg-fir-darker py-20 text-cream md:py-24"
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
          className="mx-auto mt-5 max-w-xl text-base opacity-85"
        >
          Brief précis sous 24h ouvrées. Un interlocuteur. Pas de relais.
        </motion.p>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: duration.base,
            ease: easing.smooth,
            delay: 0.36,
          }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6"
        >
          <CtaPill href="/contact" variant="gold" size="lg">
            Démarrer mon projet
          </CtaPill>
          <a
            href={`tel:${SITE.telephoneTel}`}
            className="inline-flex items-center gap-2 text-base uppercase tracking-wider opacity-80 hover:text-gold hover:opacity-100"
          >
            <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
          </a>
        </motion.div>
      </Container>
    </section>
  )
}
