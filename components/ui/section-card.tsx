import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  title: string
  description: string
  /** Amorce eyebrow optionnelle (ex. "Je cherche", "Je suis"). */
  eyebrow?: string
  /** Si fourni : carte interactive (wrapper Link + flèche + hover or). */
  href?: string
  /** Surcharge aria-label de la carte interactive si le titre seul est ambigu. */
  ariaLabel?: string
  /** Override externe (grid parent). Ne pas s'en servir pour les tokens internes. */
  className?: string
}

/* -------------------------------------------------------------------------- */
/*                          Tokens — source unique                            */
/* -------------------------------------------------------------------------- */

/**
 * Ombre portée 2 couches — feel "papier sur table".
 *   - couche 1 (contact) : 0 1px 2px, opacité 0.04
 *   - couche 2 (ambiance) : 0 12px 28px -16px, opacité 0.15
 * Couleur de l'ombre = fir-darker (#0A2D22) en rgba pour rester dans la palette.
 */
const SHADOW_REST =
  "shadow-[0_1px_2px_rgba(10,45,34,0.04),0_12px_28px_-16px_rgba(10,45,34,0.15)]"
const SHADOW_HOVER =
  "hover:shadow-[0_2px_4px_rgba(10,45,34,0.06),0_28px_60px_-24px_rgba(10,45,34,0.25)]"

const CONTAINER_BASE = cn(
  "group relative flex h-full flex-col rounded-2xl border border-fir-dark/10 bg-white",
  "p-7 md:p-9",
  "transition-[transform,box-shadow,border-color] duration-500 ease-out-expo",
  SHADOW_REST,
  SHADOW_HOVER,
  "motion-safe:hover:-translate-y-1",
)
const CONTAINER_HOVER_INTERACTIVE = "hover:border-gold/50"
const CONTAINER_HOVER_STATIC = "hover:border-fir-dark/20"

/**
 * Filet or signature en tête de carte. Token visuel récurrent du site
 * (même grammaire que /l-agence et /classes-d-actifs). Toujours présent.
 */
const RULE_BASE =
  "block h-px w-10 bg-gold/40 transition-[width,background-color] duration-500 ease-out-expo"
const RULE_HOVER_INTERACTIVE = "group-hover:w-16 group-hover:bg-gold"

const TITLE_CLASS = cn(
  "font-accent font-bold leading-[1.1] tracking-[0.06em] text-fir-dark",
  "[font-variant-caps:all-small-caps]",
  "text-2xl md:text-3xl",
)
const DESCRIPTION_CLASS = "mt-5 text-[15px] leading-[1.7] text-ink/70"
const EYEBROW_CLASS = "eyebrow text-gold-deep"
const ARROW_CLASS = cn(
  "h-5 w-5 text-fir-dark/30",
  "transition-[transform,color] duration-500 ease-out-expo",
  "motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5",
  "group-hover:text-gold",
)

/* -------------------------------------------------------------------------- */
/*                                Composant                                   */
/* -------------------------------------------------------------------------- */

/**
 * Carte unifiée pour les sections de grille (homepage portes d'entrée,
 * /vente, /location, /gestion). Tokens uniformes, propagation auto.
 *
 * Anatomie verticale (top → bottom) :
 *   1. Filet or signature (toujours)
 *   2. Bloc haut (eyebrow ↔ flèche) — uniquement si eyebrow OU mode interactif
 *   3. Bloc contenu — titre Cormorant petites capitales + description Inter
 */
export function SectionCard({
  title,
  description,
  eyebrow,
  href,
  ariaLabel,
  className,
}: Props) {
  const isInteractive = Boolean(href)
  const hasTopBlock = isInteractive || Boolean(eyebrow)

  const container = cn(
    CONTAINER_BASE,
    isInteractive ? CONTAINER_HOVER_INTERACTIVE : CONTAINER_HOVER_STATIC,
    className,
  )

  const rule = cn(RULE_BASE, isInteractive && RULE_HOVER_INTERACTIVE)

  const content = (
    <>
      <span aria-hidden className={rule} />

      {hasTopBlock && (
        <div
          className={cn(
            "mt-7 flex items-center gap-4",
            eyebrow ? "justify-between" : "justify-end",
          )}
        >
          {eyebrow && <span className={EYEBROW_CLASS}>{eyebrow}</span>}
          {isInteractive && (
            <ArrowUpRight aria-hidden className={ARROW_CLASS} />
          )}
        </div>
      )}

      <div className={cn(hasTopBlock ? "mt-8" : "mt-7 md:mt-9")}>
        <h4 className={TITLE_CLASS}>{title.toLowerCase()}</h4>
        <p className={DESCRIPTION_CLASS}>{description}</p>
      </div>
    </>
  )

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel ?? title} className={container}>
        {content}
      </Link>
    )
  }

  return <article className={container}>{content}</article>
}
