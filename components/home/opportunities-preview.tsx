import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"

import { Container } from "@/components/ui/container"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Badge } from "@/components/ui/badge"
import { RevealStagger, RevealItem } from "@/components/motion/reveal"
import { PropertyCarousel } from "@/components/ui/property-carousel"
import { properties, STATUT_LABEL, TYPE_LABEL } from "@/lib/data/properties"

const SELECTION = ["MZ1-2026", "MZ2-2026", "MZ3-2026", "MZ5-2026"]

function formatPrice(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value)
}

export function OpportunitiesPreview() {
  const featured = SELECTION.map((ref) => properties.find((p) => p.ref === ref)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  )

  return (
    <section
      id="opportunites"
      className="scroll-mt-[calc(var(--header-offset)+1.5rem)] bg-white pt-8 pb-24 md:pt-10 md:pb-32 lg:pt-10 lg:pb-40"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <Eyebrow className="text-gold-deep">Opportunités</Eyebrow>
            <h2 className="font-display mt-6 text-[clamp(2.25rem,6.5vw,6rem)] uppercase leading-[0.92] tracking-tight text-fir-dark">
              Nos dernières<br />
              <span className="text-gold-deep">opportunités.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/70 md:text-lg">
              Sélection de biens disponibles à la location, à l'acquisition,
              ou en cession de fonds. Mise à jour hebdomadaire.
            </p>
          </div>
          <Link
            href="/opportunites"
            className="group inline-flex items-center gap-2 text-sm uppercase tracking-wider text-gold-deep hover:text-fir-dark"
          >
            Voir tout le catalogue
            <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <RevealStagger className="mt-16">
          <RevealItem>
            <PropertyCarousel
              ariaLabel="Sélection d'opportunités à la une"
              itemClassName="w-[280px] md:w-[320px]"
            >
              {featured.map((p) => (
                <Link
                  key={p.ref}
                  href={`/opportunites/${p.slug}`}
                  className="group flex flex-col h-full overflow-hidden rounded-2xl bg-cream transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(15,61,46,0.25)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-fir-dark">
                    <Image
                      src={`/images/properties/${p.slug}.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 320px, 280px"
                      className="object-cover transition duration-700 ease-out-expo group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-fir-dark/40 to-transparent" />
                    <Badge
                      variant="status"
                      tone={p.statut === "vente" ? "gold" : p.statut === "murs-libres" ? "green" : "neutral"}
                      className="absolute left-4 top-4"
                    >
                      {STATUT_LABEL[p.statut]}
                    </Badge>
                    <Badge variant="ref" tone="dark" className="absolute right-4 top-4">
                      {p.ref}
                    </Badge>
                  </div>
                  <div className="p-6 flex flex-1 flex-col">
                    <p className="eyebrow text-gold-deep">{TYPE_LABEL[p.type]}</p>
                    <h3 className="mt-3 text-lg font-medium leading-tight text-fir-dark">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm text-ink/60">
                      {p.quartier} · {p.surface} m²
                    </p>
                    <p className="mt-auto pt-5 font-display text-3xl uppercase tracking-tight text-fir-dark">
                      {p.loyerMensuel
                        ? `${formatPrice(p.loyerMensuel)} €/mois`
                        : p.prix
                          ? `${formatPrice(p.prix)} €`
                          : "Sur demande"}
                    </p>
                  </div>
                </Link>
              ))}
            </PropertyCarousel>
          </RevealItem>
        </RevealStagger>
      </Container>
    </section>
  )
}
