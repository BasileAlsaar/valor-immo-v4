"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X, Phone } from "lucide-react"

import { cn } from "@/lib/utils"
import { SITE, NAV } from "@/lib/site"
import { useHeaderMode } from "@/lib/header-mode"

export function SiteHeader() {
  const mode = useHeaderMode()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [panelVisible, setPanelVisible] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 60)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  // Fondu d'apparition du panneau mobile — render dès `open`, classe opacité
  // appliquée au frame suivant pour déclencher la transition CSS.
  useEffect(() => {
    if (!open) {
      setPanelVisible(false)
      return
    }
    const id = requestAnimationFrame(() => setPanelVisible(true))
    return () => cancelAnimationFrame(id)
  }, [open])

  if (mode === "minimal") {
    return (
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 text-cream">
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-center px-6 md:h-32 md:px-12">
          <Link
            href="/"
            aria-label={`Retour à l'accueil — ${SITE.name}`}
            className="pointer-events-auto flex items-center"
          >
            <Image
              src="/logo-valor-immo.png"
              alt={SITE.name}
              width={400}
              height={400}
              className="h-14 w-auto object-contain brightness-0 invert md:h-20"
              priority
            />
          </Link>
        </div>
      </header>
    )
  }

  // Mode "light" : la variante claire (cream + logo vert + ink) est
  // forcée indépendamment du scroll. Utile sur les pages qui n'ont pas
  // de hero sombre (ex. /commerces/[slug]) — le rendu blanc-inversé y
  // serait invisible sur cream.
  const showLight = mode === "light" || scrolled

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          showLight
            ? "bg-cream/95 backdrop-blur-md text-ink shadow-[0_2px_24px_rgba(15,61,46,0.08)]"
            : "bg-transparent text-white",
        )}
      >
        <div className="mx-auto flex h-24 max-w-[1440px] items-center justify-between gap-6 px-6 md:h-40 md:px-12 lg:px-12 2xl:px-24">
          <Link
            href="/"
            aria-label={`Retour à l'accueil — ${SITE.name}`}
            className="flex items-center"
          >
            <Image
              src="/logo-valor-immo.png"
              alt={SITE.name}
              width={400}
              height={400}
              className={cn(
                "h-[64px] w-auto object-contain transition md:h-[140px]",
                !showLight && "brightness-0 invert",
              )}
              priority
            />
          </Link>

          <nav className="hidden items-center gap-3 lg:flex 2xl:gap-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-xs uppercase tracking-wider opacity-90 transition hover:opacity-100 2xl:text-sm",
                  showLight ? "hover:text-gold-deep" : "hover:text-gold",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${SITE.telephoneTel}`}
              className="hidden items-center gap-2 whitespace-nowrap text-sm font-medium tracking-wider 2xl:inline-flex"
              aria-label={`Appeler ${SITE.name}`}
            >
              <Phone className="h-4 w-4" />
              {SITE.telephoneDisplay}
            </a>
            <Link
              href="/contact"
              className={cn(
                "hidden whitespace-nowrap rounded-full px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition lg:inline-flex",
                showLight
                  ? "bg-fir-dark text-white hover:bg-ink"
                  : "bg-gold text-ink hover:bg-gold-warm",
              )}
            >
              Nous contacter
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="rounded-full border border-current p-2 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          className={cn(
            "fixed inset-0 z-[60] flex flex-col bg-fir-dark text-white",
            "transition-opacity duration-300 ease-out-expo",
            panelVisible ? "opacity-100" : "opacity-0",
          )}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
              <Image
                src="/logo-valor-immo.png"
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <span className="font-display text-2xl uppercase tracking-tight">{SITE.name}</span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="rounded-full border border-white/30 p-2"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start gap-6 px-6 pb-12 pt-12">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl uppercase leading-none tracking-tight hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex rounded-full bg-gold px-8 py-3 text-sm font-medium uppercase tracking-wider text-ink"
            >
              Nous contacter
            </Link>
            <a
              href={`tel:${SITE.telephoneTel}`}
              className="mt-2 inline-flex items-center gap-2 text-sm tracking-wider opacity-80"
            >
              <Phone className="h-4 w-4" /> {SITE.telephoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </>
  )
}
