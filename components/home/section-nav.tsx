"use client"

import { useEffect, useRef, useState } from "react"

import { Container } from "@/components/ui/container"
import { cn } from "@/lib/utils"

/**
 * Barre de navigation de sections — sticky sous le SiteHeader, home only.
 *
 * - Liens = ancres natives (<a href="#id">). Le défilement est délégué à la
 *   règle globale `html { scroll-behavior: smooth }` (cf. globals.css). Aucun
 *   écouteur de scroll : tout le surlignage passe par IntersectionObserver.
 * - Surlignage de l'item actif via IntersectionObserver. Le rootMargin est
 *   recalculé depuis `--header-offset` (getComputedStyle), pas en valeur en
 *   dur, pour rester cohérent avec le scroll-margin des sections ancrées.
 * - Re-création de l'observer au franchissement du breakpoint 768 px
 *   (`--header-offset` passe de 96 à 160 px) via `matchMedia('change')`.
 * - Mobile : rangée de pills défilable horizontalement (overflow-x-auto +
 *   scroll-snap). L'item actif se recentre via `scrollIntoView` interne au
 *   <ul> (block:"nearest" évite tout impact sur le scroll vertical de page).
 */

const ITEMS = [
  { id: "opportunites", label: "Opportunités" },
  { id: "expertise", label: "Expertise" },
  { id: "methode", label: "Méthode" },
  { id: "contact", label: "Contact" },
] as const

type ItemId = (typeof ITEMS)[number]["id"]

function readHeaderOffset(): number {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue("--header-offset")
    .trim()
  const parsed = parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 96
}

export function SectionNav() {
  const [activeId, setActiveId] = useState<ItemId | null>(null)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    // Stocke pour chaque section observée son `boundingClientRect.top` au
    // dernier event d'intersection (utilisé pour départager les overlaps).
    const tops = new Map<ItemId, number>()
    let currentOffset = readHeaderOffset()
    let observer: IntersectionObserver | null = null

    function pickActive() {
      // Parmi les sections dont le top a déjà passé l'offset header (band),
      // on retient celle dont le top est le plus proche (le plus grand sans
      // dépasser le seuil) — c'est la section "courante" sous la barre.
      const threshold = currentOffset + 24
      let bestId: ItemId | null = null
      let bestTop = -Infinity
      for (const item of ITEMS) {
        const top = tops.get(item.id)
        if (top === undefined) continue
        if (top <= threshold && top > bestTop) {
          bestTop = top
          bestId = item.id
        }
      }
      setActiveId(bestId)
    }

    function setupObserver() {
      currentOffset = readHeaderOffset()
      const topMargin = currentOffset + 24

      observer?.disconnect()
      tops.clear()

      const sections = ITEMS
        .map((i) => document.getElementById(i.id))
        .filter((el): el is HTMLElement => Boolean(el))

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const id = entry.target.id as ItemId
            if (entry.isIntersecting) {
              tops.set(id, entry.boundingClientRect.top)
            } else {
              tops.delete(id)
            }
          }
          pickActive()
        },
        {
          rootMargin: `-${topMargin}px 0px -50% 0px`,
          threshold: 0,
        },
      )

      sections.forEach((s) => observer!.observe(s))
    }

    setupObserver()

    // Le token `--header-offset` change au franchissement de 768 px ; on
    // recrée l'observer pour que le rootMargin reste juste. Pas un listener
    // de scroll : un MediaQueryList qui ne tire qu'au changement de breakpoint.
    const mql = window.matchMedia("(min-width: 768px)")
    const onBreakpoint = () => setupObserver()
    mql.addEventListener("change", onBreakpoint)

    return () => {
      observer?.disconnect()
      mql.removeEventListener("change", onBreakpoint)
    }
  }, [])

  // Recentre la pill active sur mobile (scroll horizontal du <ul> uniquement,
  // block:"nearest" évite tout impact sur le scroll vertical de la page).
  useEffect(() => {
    if (!activeId || !listRef.current) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-nav-id="${activeId}"]`,
    )
    if (!el) return
    el.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [activeId])

  return (
    <nav
      aria-label="Sections de la page"
      className="sticky top-[var(--header-offset)] z-40 border-y border-fir-dark/10 bg-cream/95 backdrop-blur-md"
    >
      <Container className="py-3 md:py-4">
        <ul
          ref={listRef}
          className="flex snap-x gap-2 overflow-x-auto scroll-smooth md:justify-center md:gap-3 md:overflow-visible"
        >
          {ITEMS.map((item) => {
            const isActive = activeId === item.id
            return (
              <li
                key={item.id}
                data-nav-id={item.id}
                className="shrink-0 snap-center"
              >
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "inline-flex items-center whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-colors duration-300 ease-out-expo",
                    isActive
                      ? "border-fir-dark bg-fir-dark text-cream"
                      : "border-fir-dark/15 bg-transparent text-fir-dark/70 hover:border-gold hover:text-fir-dark",
                  )}
                >
                  {item.label}
                </a>
              </li>
            )
          })}
        </ul>
      </Container>
    </nav>
  )
}
