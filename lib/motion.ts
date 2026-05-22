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
