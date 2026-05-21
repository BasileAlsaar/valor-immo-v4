"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Menu, X, Phone } from "lucide-react"

import { cn } from "@/lib/utils"
import { SITE, NAV } from "@/lib/site"

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
        scrolled
          ? "bg-cream/95 backdrop-blur-md text-ink shadow-[0_2px_24px_rgba(15,61,46,0.08)]"
          : "bg-transparent text-white",
      )}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 lg:px-24">
        <Link href="/" aria-label={`Retour à l'accueil — ${SITE.name}`} className="flex items-center gap-3">
          <Image
            src="/logo-valor-immo.png"
            alt=""
            width={56}
            height={56}
            className={cn(
              "h-12 w-12 object-contain transition",
              !scrolled && "brightness-0 invert",
            )}
            priority
          />
          <span className="hidden font-display text-2xl uppercase tracking-tight md:inline">
            {SITE.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider opacity-90 transition hover:opacity-100 hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={`tel:${SITE.telephoneTel}`}
            className="hidden items-center gap-2 text-sm font-medium tracking-wider md:inline-flex"
            aria-label={`Appeler ${SITE.name}`}
          >
            <Phone className="h-4 w-4" />
            {SITE.telephoneDisplay}
          </a>
          <Link
            href="/contact"
            className={cn(
              "hidden rounded-full px-6 py-2.5 text-sm font-medium uppercase tracking-wider transition lg:inline-flex",
              scrolled
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

      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-fir-dark text-white">
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
    </header>
  )
}
