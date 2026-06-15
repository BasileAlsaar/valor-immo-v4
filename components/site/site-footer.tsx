import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Clock } from "lucide-react"

import { Container } from "@/components/ui/container"
import { HoursBlock } from "@/components/ui/hours-block"
import { SITE } from "@/lib/site"

const PLAN_SITE = [
  { label: "Vente", href: "/vente" },
  { label: "Location", href: "/location" },
  { label: "Estimations", href: "/estimations" },
  { label: "Opportunités", href: "/opportunites" },
  { label: "Signatures", href: "/signatures" },
  { label: "Actualités", href: "/actualites" },
  { label: "L'agence", href: "/l-agence" },
  { label: "Contact", href: "/contact" },
]

const LEGAL = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
  { label: "Gestion des cookies", href: "/gestion-des-cookies" },
]

export function SiteFooter() {
  return (
    <footer className="bg-fir-dark text-cream">
      <Container className="pt-8 pb-3 lg:pt-10 lg:pb-3">
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-valor-immo.png"
                alt={SITE.name}
                width={56}
                height={56}
                className="h-14 w-14 object-contain brightness-0 invert"
              />
              <span className="font-display text-2xl uppercase tracking-tight">{SITE.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed opacity-80">{SITE.baseline}</p>
            <ul className="mt-5 space-y-2.5 text-sm leading-[1.5]">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <span>
                  {SITE.address.line1}
                  <br />
                  {SITE.address.line2}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href={`tel:${SITE.telephoneTel}`} className="hover:text-gold">
                  {SITE.telephoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden />
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                  {SITE.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                <HoursBlock valueClassName="opacity-90" />
              </li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold">Plan du site</p>
            <ul className="mt-2.5 space-y-1.5 text-sm leading-[1.5]">
              {PLAN_SITE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-80 transition hover:text-gold hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-gold">Légal</p>
            <ul className="mt-2.5 space-y-1.5 text-sm leading-[1.5]">
              {LEGAL.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="opacity-80 transition hover:text-gold hover:opacity-100">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed opacity-60">
              Carte T en cours d'obtention — délivrée par la CCI Paris Île-de-France
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-cream/15 pt-4 text-xs opacity-60 md:flex-row md:items-center">
          <p>© 2026 {SITE.name} · Tous droits réservés</p>
        </div>
        <p className="mt-3 text-[11px] opacity-40">
          Vidéo hero :{" "}
          <a
            href="https://www.pexels.com/video/traffic-passing-by-the-boulevard-saint-germain-13648261/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            Judas Isariot
          </a>{" "}
          via Pexels
        </p>
      </Container>
    </footer>
  )
}
