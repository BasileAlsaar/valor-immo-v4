import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"

type Props = {
  title: string
  description: string
  /** Amorce eyebrow optionnelle (ex. "Je cherche", "Je suis"). */
  eyebrow?: string
  /** Si fourni : carte interactive (wrapper Link + flèche + hover gold). */
  href?: string
  /** Surcharge aria-label de la carte interactive si le titre seul est ambigu. */
  ariaLabel?: string
  /** Override externe (grid parent). Ne pas s'en servir pour les tokens internes. */
  className?: string
}

/**
 * Carte unifiée pour les sections de grille (homepage portes d'entrée, /vente
 * catégories, /location cibles, /gestion services).
 *
 * Tokens uniformes : `rounded-2xl border-fir-dark/10 bg-white p-6 md:p-7`.
 * Hover `border-gold` activé uniquement en mode interactif (`href` présent).
 * Titre en Cormorant Garamond petites capitales (le texte est rendu en
 * minuscules pour que `font-variant-caps: all-small-caps` s'applique).
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
    "group relative flex h-full flex-col rounded-2xl border border-fir-dark/10 bg-white p-6 transition-colors duration-300 ease-out-expo md:p-7",
    isInteractive && "hover:border-gold",
    className,
  )

  const content = (
    <>
      {hasTopBlock && (
        <div className="flex items-start justify-between gap-4">
          {eyebrow ? (
            <span className="eyebrow text-ink/55">{eyebrow}</span>
          ) : (
            <span aria-hidden className="mt-1 block h-px w-8 bg-gold/60" />
          )}
          {isInteractive && (
            <ArrowUpRight
              aria-hidden
              className="h-5 w-5 text-fir-dark/40 transition-all duration-300 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
            />
          )}
        </div>
      )}

      <div className={cn(hasTopBlock && "mt-8")}>
        <h4 className="font-accent text-lg font-medium leading-snug tracking-[0.04em] text-fir-dark normal-case [font-variant-caps:all-small-caps]">
          {title.toLowerCase()}
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-ink/75">{description}</p>
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
