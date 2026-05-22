"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "framer-motion"

import { duration, easing } from "@/lib/motion"

/**
 * Logo XL Valor Immo en surimpression sur le hero home (pattern agence premium).
 * 200 px hauteur desktop, 120 px mobile (breakpoint md). Le SiteHeader sticky de la
 * home a son logo masqué via `usePathname` pour éviter le double affichage.
 *
 * `brightness-0 invert` rend le logo blanc sur la vidéo Paris (cohérent avec le
 * traitement SiteHeader transparent au-dessus du hero).
 */
export function HeroLogo() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      data-testid="hero-logo"
      initial={reduce ? false : { opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.base, ease: easing.smooth }}
      className="pointer-events-none absolute left-6 top-6 z-20 md:left-12 md:top-12"
      aria-hidden
    >
      <Image
        src="/logo-valor-immo.png"
        alt=""
        width={400}
        height={400}
        priority
        className="h-[120px] w-auto object-contain brightness-0 invert md:h-[200px]"
      />
    </motion.div>
  )
}
