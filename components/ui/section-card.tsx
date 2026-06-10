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
 * Lot 3 : SectionCard en vert sapin (token --fir-dark), cohérent avec les
 * cartes catégories. Titre Cormorant SC ivoire, description cream/85,
 * eyebrow et accents gold. Filet or signature conservé (distinction vs
 * catégories qui ont une image de fond). Pas d'ombre portée — la
 * différenciation visuelle se fait par le lift au hover et le filet.
 */
const CONTAINER_BASE = cn(
  "group relative flex h-full flex-col rounded-2xl border border-cream/10 bg-fir-dark",
  "p-7 md:p-9",
  "transition-[transform,border-color] duration-500 ease-out-expo",
  "motion-safe:hover:-translate-y-1",
)
const CONTAINER_HOVER_INTERACTIVE = "hover:border-gold/50"
const CONTAINER_HOVER_STATIC = "hover:border-cream/15"

/**
 * Filet or signature en tête de carte. Token visuel récurrent du site
 * (même grammaire que /l-agence et /classes-d-actifs). Toujours présent.
 */
const RULE_BASE =
  "block h-px w-10 bg-gold/40 transition-[width,background-color] duration-500 ease-out-expo"
const RULE_HOVER_INTERACTIVE = "group-hover:w-16 group-hover:bg-gold"

// Cormorant volontaire — pattern signature pages services (cartes vert/ivoire).
// NE PAS migrer vers SectionTitle ni supprimer le token --font-accent.
// Décision DA 10/06/2026.
const TITLE_CLASS = cn(
  "font-accent font-bold leading-[1.1] tracking-[0.06em] text-cream",
  "[font-variant-caps:all-small-caps]",
  "text-2xl md:text-3xl",
)
const DESCRIPTION_CLASS = "mt-5 text-[15px] leading-[1.7] text-cream/85"
const EYEBROW_CLASS = "eyebrow text-gold"
const ARROW_CLASS = cn(
  "h-5 w-5 text-cream/40",
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
