"use client"

import { Accordion } from "@base-ui-components/react/accordion"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

type Item = {
  titre: string
  text: string
}

type Props = {
  items: ReadonlyArray<Item>
  className?: string
}

/* -------------------------------------------------------------------------- */
/*                          Tokens — source unique                            */
/* -------------------------------------------------------------------------- */

/**
 * Lot redesign-sections (pilote vente) : refonte des grilles de cards en index
 * éditorial numéroté pleine largeur. Accordéon strict (Base UI), une seule
 * ligne ouverte. Tokens DA préservés (verrou code 10/06/2026) — Cormorant
 * small-caps lowercase, filet or, palette fir-dark/cream/gold.
 */

const FOLIO_CLASS = cn(
  "font-accent text-gold",
  "text-[clamp(2.25rem,4vw,3.25rem)] leading-[0.85]",
  "tabular-nums",
)

const TITLE_CLASS = cn(
  "font-accent font-bold leading-[1.1] tracking-[0.06em]",
  "[font-variant-caps:all-small-caps]",
  "text-xl md:text-2xl",
  "text-fir-dark transition-colors duration-500",
  "[[data-panel-open]_&]:text-fir-darker",
)

const DESCRIPTION_CLASS = "text-[15px] leading-[1.7] text-fir-dark/75"

const CHEVRON_CLASS = cn(
  "h-5 w-5 shrink-0 text-fir-dark/40",
  "transition-transform duration-500 ease-out-expo",
  "group-data-[panel-open]:rotate-180 group-data-[panel-open]:text-gold",
)

const RULE_CLASS = "block h-px w-10 bg-gold/40"

export function SectionIndex({ items, className }: Props) {
  return (
    <Accordion.Root
      multiple={false}
      defaultValue={[0]}
      keepMounted
      className={cn(
        "w-full",
        "border-t border-fir-dark/10",
        className,
      )}
      render={<ol />}
    >
      {items.map((item, i) => {
        const folio = String(i + 1).padStart(2, "0")
        return (
          <Accordion.Item
            key={item.titre}
            value={i}
            className={cn(
              "group relative",
              "border-b border-fir-dark/10",
              "transition-colors duration-500",
              "data-[open]:bg-cream-soft",
              "before:absolute before:left-0 before:top-0 before:h-full before:w-[2px]",
              "before:bg-gold before:opacity-0 before:transition-opacity before:duration-500",
              "data-[open]:before:opacity-100",
            )}
            render={<li />}
          >
            <Accordion.Header render={<h4 />} className="m-0">
              <Accordion.Trigger
                className={cn(
                  "group/trigger flex w-full items-start gap-6 md:gap-10",
                  "py-6 md:py-8 pr-2 md:pr-4 pl-5 md:pl-8",
                  "text-left",
                  "transition-colors duration-500",
                  "hover:[&_[data-rule]]:w-16 hover:[&_[data-rule]]:bg-gold",
                )}
              >
                <span className={FOLIO_CLASS} aria-hidden>
                  {folio}
                </span>
                <span className="flex-1 min-w-0">
                  <span
                    aria-hidden
                    data-rule
                    className={cn(
                      RULE_CLASS,
                      "transition-[width,background-color] duration-500 ease-out-expo",
                      "group-data-[open]:w-16 group-data-[open]:bg-gold",
                    )}
                  />
                  <span className={cn("mt-4 block", TITLE_CLASS)}>
                    {item.titre.toLowerCase()}
                  </span>
                </span>
                <ChevronDown aria-hidden className={CHEVRON_CLASS} />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel
              className={cn(
                "overflow-hidden",
                "h-0 data-[open]:h-[var(--accordion-panel-height)]",
                "motion-safe:transition-[height] motion-safe:duration-500",
                "motion-safe:[transition-timing-function:var(--ease-out-expo)]",
              )}
            >
              <div className="pl-5 md:pl-8 pr-2 md:pr-4 pb-7 md:pb-9">
                <div className="grid gap-6 md:grid-cols-[auto_1fr] md:gap-10">
                  <span aria-hidden className="hidden md:block w-[clamp(2.25rem,4vw,3.25rem)]" />
                  <p className={cn("max-w-2xl", DESCRIPTION_CLASS)}>{item.text}</p>
                </div>
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        )
      })}
    </Accordion.Root>
  )
}
