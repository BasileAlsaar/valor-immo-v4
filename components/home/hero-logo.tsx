"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

import { duration, easing } from "@/lib/motion"

/**
 * Crest XL Valor Immo en surimpression sur le hero home.
 * Positionné en absolute par le wrapper du hero pour s'aligner top-left
 * avec le logo et les liens nav du SiteHeader (la nav reste au-dessus en
 * z-index). Le composant lui-même n'embarque que l'image + l'anim
 * d'entrée — le placement est délégué à son conteneur.
 *
 * Masqué <lg ; le SiteHeader prend alors le relais pour le logo.
 *
 * `brightness-0 invert` rend le logo blanc sur la vidéo Paris.
 */
export function HeroLogo() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      data-testid="hero-logo"
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: easing.smooth }}
      className="pointer-events-none"
      aria-hidden
    >
      <Image
        src="/logo-valor-immo.png"
        alt=""
        width={400}
        height={400}
        priority
        className="h-[140px] w-auto object-contain brightness-0 invert xl:h-[160px]"
      />
    </motion.div>
  )
}
