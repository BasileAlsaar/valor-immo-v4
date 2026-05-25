"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

import { duration, easing } from "@/lib/motion"

/**
 * Crest Valor Immo en composition éditoriale verticale, en tête du contenu
 * du hero. Placé dans le flow du Container du hero (et non en position
 * absolue), pour partager la même gouttière gauche que le H1 et le reste de
 * la stack. Masqué <lg ; le SiteHeader prend alors le relais pour le logo.
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
      className="pointer-events-none hidden lg:block"
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
