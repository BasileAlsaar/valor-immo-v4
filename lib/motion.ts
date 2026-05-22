// Easing curves (haut de gamme, anti-cliché AI-generated)
export const easing = {
  smooth: [0.32, 0.72, 0, 1] as const,       // Apple-like, ample
  brisk: [0.22, 1, 0.36, 1] as const,        // out-expo, rapide net
  inOut: [0.65, 0, 0.35, 1] as const,        // symétrique élégant
}

// Durations cohérentes
export const duration = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
  hero: 1.6,
}

// Variants réutilisables
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: duration.base, ease: easing.smooth } },
}

export const stagger = (delay = 0.08) => ({
  visible: { transition: { staggerChildren: delay } },
})

export const splitTextReveal = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: duration.base, ease: easing.brisk } },
}

/**
 * Transition horizontale entre étapes (formulaire qualifiant sprint 2).
 * `direction` : 1 = avancer (entrée par la droite, sortie vers la gauche),
 *               -1 = reculer (entrée par la gauche, sortie vers la droite).
 */
export const slideStep = {
  enter: (direction: 1 | -1) => ({
    x: direction * 48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: duration.fast, ease: easing.smooth },
  },
  exit: (direction: 1 | -1) => ({
    x: direction * -48,
    opacity: 0,
    transition: { duration: 0.3, ease: easing.smooth },
  }),
}

/** Apparition simple — réutilisable hors scroll (ContactCTA, SuccessScreen). */
export const fadeUpSmall = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easing.smooth },
  },
}
