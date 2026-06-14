"use client"

import { Children, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

type Props = {
  children: ReactNode
  ariaLabel: string
  /** Durée d'un cycle complet, en s, proportionnelle au nombre d'items. */
  secondsPerItem?: number
  /** Classes appliquées au conteneur extérieur. */
  className?: string
  /** Classes appliquées à chaque slot (largeur fixe attendue). */
  itemClassName?: string
}

export function PropertyCarousel({
  children,
  ariaLabel,
  secondsPerItem = 6,
  className,
  itemClassName,
}: Props) {
  const reduce = useReducedMotion()
  const items = Children.toArray(children)
  const duration = Math.max(items.length, 1) * secondsPerItem

  if (reduce) {
    return (
      <div
        role="region"
        aria-label={ariaLabel}
        className={cn("overflow-x-auto", className)}
      >
        <ul className="flex w-max gap-6 pr-6">
          {items.map((node, i) => (
            <li key={`item-${i}`} className={cn("shrink-0", itemClassName)}>
              {node}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div
      role="region"
      aria-label={ariaLabel}
      className={cn("group overflow-hidden", className)}
    >
      <ul
        className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((node, i) => (
          <li key={`item-${i}`} className={cn("shrink-0", itemClassName)}>
            {node}
          </li>
        ))}
        {items.map((node, i) => (
          <li
            key={`dup-${i}`}
            aria-hidden
            className={cn("shrink-0", itemClassName)}
          >
            {node}
          </li>
        ))}
      </ul>
    </div>
  )
}
